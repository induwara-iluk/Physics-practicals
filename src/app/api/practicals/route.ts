import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Practical from '@/models/Practical';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
  try {
    await dbConnect();
    // Fetch all practicals, selecting necessary fields for the list view including diagrams
    const practicals = await Practical.find({}).select('title slug category shortText diagrams').lean();
    return NextResponse.json(practicals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
