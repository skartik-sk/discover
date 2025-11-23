import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { support } = await request.json();

    if (typeof support !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid vote value' },
        { status: 400 }
      );
    }

    // Update proposal vote count
    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        votesFor: support ? { increment: 1 } : undefined,
        votesAgainst: !support ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
