import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { mainQuestionText, subQuestions, answer, marks, studentAnswer } = body;

    const systemInstruction = `You are a strict, highly accurate, and helpful G.C.E. Advanced Level Physics examiner.
Evaluate the student's answer(s) against the official marking scheme answer(s) for the given physics practical question.

Ensure you:
1. Carefully check formulas, calculation steps, final values, and SI units (e.g., m, s, kg, N, J, W, etc.).
2. Award scores as numbers between 0 and the maximum marks allocated.
3. Be constructive. Provide brief, concise feedback explaining why marks were awarded or deducted (e.g., "Missing units", "Incorrect calculation step", "Excellent, correct formula and calculations").
4. Classify status as:
   - "correct" (for answers receiving full marks or near full marks)
   - "partially_correct" (for answers showing correct physics concepts/equations but having mathematical/unit errors, receiving >0 but less than maximum marks)
   - "incorrect" (for completely wrong, unrelated, or empty answers receiving 0 marks)
5. Return the evaluations strictly matching the JSON schema requested.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash for fast and accurate JSON-based evaluations
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    if (subQuestions && subQuestions.length > 0) {
      // Prompt for multiple subquestions
      let prompt = `
Main Question Context:
"""
${mainQuestionText}
"""

Evaluate the following subquestions:
`;

      subQuestions.forEach((sq: any) => {
        prompt += `
---
Subquestion ID: ${sq.id}
Part: ${sq.part}
Text: ${sq.text}
Official Marking Scheme Answer: ${sq.answer || 'Not specified'}
Max Marks: ${sq.marks || 0}
Student's Answer: ${sq.studentAnswer || '(No answer provided)'}
`;
      });

      const responseSchema = {
        type: 'OBJECT',
        properties: {
          evaluations: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                subQuestionId: { type: 'STRING' },
                part: { type: 'STRING' },
                score: { type: 'NUMBER' },
                status: { type: 'STRING', enum: ['correct', 'partially_correct', 'incorrect'] },
                feedback: { type: 'STRING' }
              },
              required: ['subQuestionId', 'part', 'score', 'status', 'feedback']
            }
          }
        },
        required: ['evaluations']
      };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema as any,
        }
      });

      const responseText = result.response.text();
      return NextResponse.json(JSON.parse(responseText));
    } else {
      // Prompt for single question without subparts
      const prompt = `
Main Question Context/Text:
"""
${mainQuestionText}
"""
Official Answer: ${answer || 'Not specified'}
Max Marks: ${marks || 0}
Student's Answer: ${studentAnswer || '(No answer provided)'}
`;

      const responseSchema = {
        type: 'OBJECT',
        properties: {
          score: { type: 'NUMBER' },
          status: { type: 'STRING', enum: ['correct', 'partially_correct', 'incorrect'] },
          feedback: { type: 'STRING' }
        },
        required: ['score', 'status', 'feedback']
      };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema as any,
        }
      });

      const responseText = result.response.text();
      return NextResponse.json(JSON.parse(responseText));
    }
  } catch (error: any) {
    console.error('Error during AI answer check:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while communicating with Gemini.' },
      { status: 500 }
    );
  }
}
