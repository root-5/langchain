'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

const pageArr = [
    { link: 'summary', name: '文章要約', discription: '文章を要約します。' },
    { link: 'document', name: '文章生成', discription: '文章を生成します。' },
];

export default function Page() {
    const listItems = pageArr.map((page) => (
        <li className="block border rounded-lg ">
            {/* 各ページのリンク */}
            <a href={'./' + page.link} className="block p-6 hover:opacity-80">
                <h3 className="text-2xl font-bold">{page.name}</h3>
                <p className="mt-4 text-lg">{page.discription}</p>
            </a>
        </li>
    ));

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>インデックス</Headline2>
            <Image
                src="/img/leaf.png"
                width={500}
                height={500}
                alt={'AIが踊る'}
                className="block animate-bounce mx-auto mt-32"
            />
            <ul className="flex flex-wrap gap-6 justify-center">{listItems}</ul>
        </main>
    );
}
