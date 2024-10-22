import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedContestant = await prisma.contestants.update({
      where: { id },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedContestant);
  } catch (error) {
    console.error('投票失败:', error);
    return NextResponse.json({ error: '投票失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
