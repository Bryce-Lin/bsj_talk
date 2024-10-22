import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const contestant = await prisma.contestants.findUnique({
      where: { id },
    });

    if (!contestant) {
      return NextResponse.json({ error: '选手未找到' }, { status: 404 });
    }

    return NextResponse.json(contestant);
  } catch (error) {
    console.error('获取选手信息失败:', error);
    return NextResponse.json({ error: '获取选手信息失败' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
