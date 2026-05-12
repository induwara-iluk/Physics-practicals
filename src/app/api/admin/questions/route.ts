import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Practical from '@/models/Practical';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const questions = await Question.find({}).populate('practicalId', 'title slug').sort({ year: -1 }).lean();
    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Ensure practicalId is valid
    const practical = await Practical.findById(body.practicalId);
    if (!practical) {
      return NextResponse.json({ error: 'Invalid practical selected.' }, { status: 400 });
    }

    const question = new Question(body);
    await question.save();
    
    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
