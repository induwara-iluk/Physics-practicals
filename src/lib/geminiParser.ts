import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const questionSchema = z.object({
  questionNumber: z.string().optional(),
  title: z.string().optional(),
  source: z.object({
    type: z.string().optional(),
    exam: z.string().optional(),
    subject: z.string().optional(),
    year: z.number().optional(),
    paper: z.number().optional(),
    variant: z.string().optional(),
    questionNumber: z.number().optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
  mainQuestionText: z.string(),
  answer: z.string().optional(),
  figures: z.array(z.object({
    label: z.string().optional(),
    imageUrl: z.string().optional()
  })).optional(),
  subQuestions: z.array(z.object({
    id: z.string(),
    part: z.string(),
    text: z.string(),
    imageUrl: z.string().optional(),
    marks: z.number().optional(),
    answer: z.string().optional()
  })).optional(),
  markingScheme: z.array(z.object({
    subQuestionId: z.string(),
    answer: z.string()
  })).optional(),
  answers: z.array(z.object({
    subQuestionId: z.string(),
    latex: z.string()
  })).optional()
});

export async function parseQuestionImageToJson(
  fileBuffer: Buffer,
  mimeType: string,
  metadata: {
    sourceType: "past_paper" | "model_paper";
    year: number;
    subject: string;
    paper?: number;
    questionNumber?: string;
  }
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }

  // We use gemini-1.5-flash as it's the fastest multimodal model that supports this well.
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // 3. Convert the image buffer to base64
  const base64String = fileBuffer.toString('base64');
  
  // 5. Prompt Gemini
  const prompt = `
You are a highly accurate OCR and structured data extraction system for Physics examination papers.
Read the attached image of a question paper and extract its contents into the following JSON structure.

Ensure you:
- Extract all text exactly.
- Preserve equations and math symbols in LaTeX format (e.g. $E=mc^2$ or $$E=mc^2$$).
- Detect the title (if any).
- Detect all subquestions (e.g. (a), (b), (i), (ii)) and extract their text. Use logical IDs for them like "a_i" or "b".
- If you see marks associated with subparts, include them in the 'marks' field.
- If you see answers or marking schemes in the image, include them in the 'answer' field.
- If there are figures/diagrams, note their labels in the 'figures' array, but leave 'imageUrl' empty as you cannot extract images.
- Populate source.type as "${metadata.sourceType}" and source.year as ${metadata.year}.
- Set source.subject as "${metadata.subject}".
- Only return a valid JSON object matching the requested schema. No markdown formatting, no code fences.

Expected JSON format:
{
  "questionNumber": "${metadata.questionNumber || "1"}",
  "title": "Question Title (infer if not explicit)",
  "source": { "type": "${metadata.sourceType}", "year": ${metadata.year}, "subject": "${metadata.subject}", "paper": ${metadata.paper || 1} },
  "mainQuestionText": "Main body of the question before subparts...",
  "subQuestions": [
    { "id": "a", "part": "(a)", "text": "Subquestion text...", "marks": 2, "answer": "Optional extracted answer" }
  ],
  "figures": [
    { "label": "Figure 1" }
  ]
}
`;

  try {
    // 4. Send the image to Gemini using inlineData
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64String
        }
      }
    ]);

    const response = await result.response;
    let text = response.text();

    // 6. Remove markdown code fences if present
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\s*/, '');
      text = text.replace(/\s*\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\s*/, '');
      text = text.replace(/\s*\`\`\`$/, '');
    }

    // 7. Parse the response as JSON
    const parsedJson = JSON.parse(text.trim());

    // 8. Validate using questionSchema
    const validatedData = questionSchema.parse(parsedJson);

    // 9. Return the parsed object
    return validatedData;

  } catch (error: any) {
    // 10. Throw descriptive errors if parsing fails
    if (error.name === 'ZodError') {
      throw new Error(`Failed to validate parsed JSON schema from Gemini: ${error.message}`);
    } else if (error instanceof SyntaxError) {
      throw new Error(`Gemini API did not return valid JSON. Failed to parse response. Output was: ${error.message}`);
    }
    throw new Error(`Gemini extraction failed: ${error.message}`);
  }
}
