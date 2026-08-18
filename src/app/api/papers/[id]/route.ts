import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing paper ID parameter.' }, { status: 400 });
    }

    await dbConnect();

    // Parse paper ID parameters (format: type-year-medium)
    const parts = id.split('-');
    if (parts.length < 3) {
      return NextResponse.json({ error: 'Invalid paper ID format. Expected type-year-medium.' }, { status: 400 });
    }

    const paperType = parts[0];
    const year = parseInt(parts[1]);
    const medium = parts[2];

    if (isNaN(year)) {
      return NextResponse.json({ error: 'Invalid year in paper ID.' }, { status: 400 });
    }

    // Build classification query matching the dashboard filters
    const query: any = {
      'source.year': year,
      medium: medium
    };

    if (paperType === 'model') {
      // Questions classified as model
      query.$or = [
        { type: 'model' },
        { 'source.type': 'model_paper' }
      ];
    } else {
      // Questions classified as past papers
      query.type = { $ne: 'model' };
      query['source.type'] = { $ne: 'model_paper' };
    }

    const questions = await Question.find(query).sort({ questionNumber: 1 }).lean();

    // Ensure MongoDB ObjectIds are converted to string safely for JSON response
    const serializedQuestions = JSON.parse(JSON.stringify(questions));

    return NextResponse.json(serializedQuestions);
  } catch (error: any) {
    console.error('Paper Questions API GET Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch paper questions.' }, { status: 500 });
  }
}
