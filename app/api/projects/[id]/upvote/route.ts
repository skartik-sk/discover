import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Increment upvotes directly (in production, would check auth and prevent duplicate votes)
    const project = await prisma.project.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error upvoting project:', error);
    return NextResponse.json(
      { error: 'Failed to upvote project' },
      { status: 500 }
    );
  }
}
