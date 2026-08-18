import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import PaperAttempt from '@/models/PaperAttempt';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Fetch lightweight question info
    const questions = await Question.find(
      {},
      { _id: 1, questionNumber: 1, type: 1, medium: 1, marks: 1, source: 1 }
    ).lean();

    const papersMap: Record<string, any> = {};

    questions.forEach((q: any) => {
      // Handle fallback type classification matching the site's classification
      const isModel = q.type === 'model' || q.source?.type === 'model_paper';
      const type = isModel ? 'model' : 'past';
      const year = q.source?.year;
      const medium = q.medium || 'English';

      if (!year) return; // Skip questions without a year

      const paperId = `${type}-${year}-${medium}`;

      if (!papersMap[paperId]) {
        papersMap[paperId] = {
          paperId,
          name: type === 'model' ? `Model Paper ${year}` : `${year} Past Paper`,
          type,
          year,
          medium,
          questionCount: 0,
          totalMarks: 0,
          questionIds: []
        };
      }

      papersMap[paperId].questionCount++;
      papersMap[paperId].totalMarks += (q.marks || 0);
      papersMap[paperId].questionIds.push(q._id.toString());
    });

    const papersList = Object.values(papersMap);

    // Get current user if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let attempts: any[] = [];
    if (user) {
      attempts = await PaperAttempt.find({ userId: user.id }).lean();
    }

    // Map the best attempt score for each paper
    const bestAttemptsMap: Record<string, any> = {};
    attempts.forEach((att: any) => {
      const pId = att.paperId;
      if (!bestAttemptsMap[pId] || att.score > bestAttemptsMap[pId].score) {
        bestAttemptsMap[pId] = att;
      }
    });

    const richPapersList = papersList.map((paper: any) => {
      const bestAttempt = bestAttemptsMap[paper.paperId];
      return {
        ...paper,
        status: bestAttempt ? 'Completed' : 'Untouched',
        bestScore: bestAttempt ? bestAttempt.score : null,
        submittedAt: bestAttempt ? bestAttempt.createdAt : null,
      };
    });

    // Sort: Past papers first (descending by year), then Model papers (descending by year)
    richPapersList.sort((a: any, b: any) => {
      if (a.type !== b.type) {
        return a.type === 'past' ? -1 : 1;
      }
      return b.year - a.year;
    });

    return NextResponse.json(richPapersList);
  } catch (error: any) {
    console.error('Papers API GET Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch papers list.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to save your exam scores.' }, { status: 401 });
    }

    const body = await request.json();
    const { paperId, score, maxScore, answers } = body;

    if (!paperId || score === undefined || maxScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields: paperId, score, maxScore.' }, { status: 400 });
    }

    await dbConnect();

    // Parse details from paperId (format: type-year-medium)
    const parts = paperId.split('-');
    if (parts.length < 3) {
      return NextResponse.json({ error: 'Invalid paperId format. Expected type-year-medium.' }, { status: 400 });
    }
    const paperType = parts[0] as 'past' | 'model';
    const year = parseInt(parts[1]);
    const medium = parts[2] as 'English' | 'Sinhala';

    const newAttempt = new PaperAttempt({
      userId: user.id,
      paperId,
      paperType,
      year,
      medium,
      score,
      maxScore,
      answers
    });

    await newAttempt.save();

    return NextResponse.json({ success: true, attempt: newAttempt });
  } catch (error: any) {
    console.error('Papers API POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit paper attempt.' }, { status: 500 });
  }
}
