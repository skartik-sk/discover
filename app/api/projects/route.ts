import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const blockchain = searchParams.get('blockchain');
    const status = searchParams.get('status') || 'approved';
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const where: any = {
      status: status,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (blockchain) {
      where.blockchains = {
        contains: blockchain,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              likes: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { upvotes: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: skip,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // For now, using demo user. In production, get from session
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        slug: slug,
        tagline: body.tagline,
        description: body.description,
        logoUrl: body.logoUrl,
        coverUrl: body.coverUrl,
        videoUrl: body.videoUrl || null,
        websiteUrl: body.websiteUrl,
        category: body.category,
        tags: Array.isArray(body.tags) ? body.tags.join(',') : body.tags,
        blockchains: Array.isArray(body.blockchains) ? body.blockchains.join(',') : body.blockchains,
        twitter: body.twitter || null,
        discord: body.discord || null,
        github: body.github || null,
        telegram: body.telegram || null,
        status: 'pending',
        userId: user.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
