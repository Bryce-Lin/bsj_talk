import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    console.error('Error adding contestant:', error);
    return NextResponse.json({ error: 'Failed to add contestant' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
