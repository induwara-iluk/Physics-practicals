import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Practical from '@/models/Practical';
import { practicalsList, slugify } from '@/data/practicals';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const staticPractical = practicalsList.find(p => slugify(p.title) === slug);

  try {
    await dbConnect();
    let practical = await Practical.findOne({ slug });
    
    if (!practical) {
      if (!staticPractical) {
        return NextResponse.json({ error: 'Practical not found' }, { status: 404 });
      }
      return NextResponse.json({
        title: staticPractical.title,
        slug,
        theory: '',
        method: '',
        apparatus: [],
        importantPoints: [],
        diagrams: []
      });
    }
    
    return NextResponse.json(practical);
  } catch (error: any) {
    // Fallback to static data if DB connection fails
    if (staticPractical) {
      return NextResponse.json({
        title: staticPractical.title,
        slug,
        theory: '',
        method: '',
        apparatus: [],
        importantPoints: [],
        diagrams: [],
        warning: 'MongoDB is not connected. Data shown is a placeholder. ' + error.message
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    
    // Upsert the practical
    const practical = await Practical.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(practical);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
