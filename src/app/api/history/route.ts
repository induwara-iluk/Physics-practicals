import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuestionHistory from '@/models/QuestionHistory';
import Practical from '@/models/Practical';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch both history and practicals
    const [history, practicals] = await Promise.all([
      QuestionHistory.find({}).sort({ year: -1 }).lean(),
      Practical.find({}, { title: 1, practicalNumber: 1, diagrams: 1, slug: 1 }).lean()
    ]);

    // Create a lookup map for practicals by their number
    const practicalMap = new Map();
    practicals.forEach((p: any) => {
      if (p.practicalNumber) {
        practicalMap.set(p.practicalNumber.toString(), p);
      }
    });

    // Map history rows to include practical details
    const richHistory = history.map((row: any) => ({
      ...row,
      details: {
        q1: practicalMap.get(row.q1),
        q2: practicalMap.get(row.q2),
        q3: practicalMap.get(row.q3),
        q4: practicalMap.get(row.q4),
      }
    }));

    return NextResponse.json(richHistory);
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
