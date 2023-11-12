import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const memos = await prisma.memo.findMany();
    return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
    const reqObj = await request.json();
    let discription = reqObj.description;

    // discriptionをサニタイズ
    discription = discription.replace(/</g, '&lt;');
    discription = discription.replace(/>/g, '&gt;');
    discription = discription.replace(/&/g, '&amp;');
    discription = discription.replace(/"/g, '&quot;');
    discription = discription.replace(/'/g, '&#39;');
    discription = discription.replace(/`/g, '&#x60;');
    discription = discription.replace(/=/g, '&#x3D;');

    const memo = await prisma.memo.update({
        where: {
            id: 1,
        },
        data: {
            description: reqObj.description,
        },
    });

    return NextResponse.json(memo);
}
