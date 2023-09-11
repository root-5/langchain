import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const memos = await prisma.memo.findMany();
    return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
    const { title, description } = await request.json();

    const memo = await prisma.memo.create({
        data: {
            title,
            description,
        },
    });

    return NextResponse.json(memo);
}
