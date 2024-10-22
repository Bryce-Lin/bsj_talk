import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contestants = await prisma.contestants.findMany();
    return NextResponse.json(contestants);
  } catch (error) {
    console.error('获取选手列表失败:', error);
    return NextResponse.json({ error: '获取选手列表失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { name, avatar } = await request.json();
    const newContestant = await prisma.contestants.create({
      data: {
        name,
        avatar,
        votes: 0,
      },
    });
    return NextResponse.json(newContestant);
  } catch (error) {
    console.error('添加选手失败:', error);
    return NextResponse.json({ error: '添加选手失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
