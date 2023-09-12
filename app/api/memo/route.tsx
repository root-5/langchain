import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const memos = await prisma.memo.findMany();
    return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
    const reqObj = await request.json();

    const memo = await prisma.memo.update({
        where: {
            id: reqObj.id,
        },
        data: {
            description: reqObj.description,
        },
    });

    return NextResponse.json(memo);
}
