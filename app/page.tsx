// 'use client';

// import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

const pageArr = [
    { key: 1, link: 'summary', name: '文章要約', discription: '文章を要約します。日本語以外にも対応しています。' },
    { key: 2, link: 'document', name: '文章生成', discription: '見出しを調整し、文章構成に手を加えることができます。' },
];

export default function Page() {
    const listItems = pageArr.map((page) => (
        <li key={page.key} className="block border rounded-lg">
            {/* 各ページのリンク */}
            <Link href={'./' + page.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{page.name}</h3>
                <p className="mt-4 text-lg">{page.discription}</p>
            </Link>
        </li>
    ));

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Image
                src="/img/guruguru.png"
                width={500}
                height={500}
                alt={'AIが踊る'}
                className="block animate-pulse mx-auto my-8"
            />
            <Headline2>機能一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{listItems}</ul>
        </main>
    );
}
