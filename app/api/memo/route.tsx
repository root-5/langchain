import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const memos = await prisma.memo.findMany();
    return NextResponse.json(memos);
}

export async function POST(request: NextRequest) {
    const reqObj = await request.json();
    let description = reqObj.description;

    // discriptionをサニタイズ
    description = description.replace(/</g, '&lt;');
    description = description.replace(/>/g, '&gt;');
    description = description.replace(/&/g, '&amp;');
    description = description.replace(/"/g, '&quot;');
    description = description.replace(/'/g, '&#39;');
    description = description.replace(/`/g, '&#x60;');
    description = description.replace(/=/g, '&#x3D;');

    const memo = await prisma.memo.update({
        where: {
            id: 1,
        },
        data: {
            description: description,
        },
    });

    return NextResponse.json(memo);
}
