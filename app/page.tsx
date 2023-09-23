'use client';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { Headline2 } from '../components/Headline2';
import { pagesData } from '../components/data/pagesData';

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [memo, setMemo] = useState(''); //レスポンスの文字数と内容を管理

    //====================================================================
    // ==== データベースAPI ====
    // データベースからmemoテーブルのデータを取得する
    async function getMemoData() {
        const response = await fetch('/api/memo');
        const data = await response.json();
        const description = data[0].description;
        setMemo(description);
        return;
    }

    // データベースにテキストエリアのデータを保存する
    async function setMemoData() {
        try {
            const response = await fetch('/api/memo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1, description: memo }),
            });
            const data = await response.json();
            return;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // urlがlocalhostでない時のみgetMemoDataを実行
        if (location.hostname !== 'localhost') {
            getMemoData();
        } else {
            setMemo('データベースアクセスは本番環境のみ');
        }
    }, []);

    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page, i) => (
        <li key={i} className="block border rounded-lg h-30">
            <Link href={'./' + page.link} className="block p-3 md:p-6 w-64 h-full hover:opacity-40">
                <h3 className="text-lg md:text-xl md:font-bold">{page.name}</h3>
                <p className="mt-1 md:mt-3">{page.description}</p>
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className="max-w-4xl w-11/12 mx-auto pt-8 md:pt-14">
            <Headline2>機能一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{linkItems}</ul>
            <Headline2>ホワイトボード</Headline2>
            <div className="relative border-b-8 border-slate-600">
                <div className="absolute bottom-0 right-32 w-12 h-4 bg-sky-600"></div>
                <div className="absolute bottom-2 right-8 w-6 h-6 bg-yellow-300 rounded-full"></div>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    onBlur={setMemoData}
                    className={
                        memo === ''
                            ? 'block mt-2 w-full border p-4 h-96 focus:outline-none dark:text-gray-900 bg-gray-100 animate-pulse'
                            : 'block mt-2 w-full border p-4 h-96 focus:outline-none dark:text-gray-900'
                    }
                ></textarea>
            </div>
        </main>
    );
}
