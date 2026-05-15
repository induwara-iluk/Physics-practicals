import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuestionHistory from '@/models/QuestionHistory';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Check if year already exists for update or just use upsert logic
    const history = await QuestionHistory.findOneAndUpdate(
      { year: body.year },
      body,
      { new: true, upsert: true }
    );
    
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const history = await QuestionHistory.find({}).sort({ year: -1 });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
