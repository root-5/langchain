'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

//====================================================================
// ==== データ ====
// 各ページのリンクと説明
const pageArr = [
    { key: 1, link: 'summary', name: '文章要約', discription: '文章を要約します。日本語以外にも対応しています。' },
    { key: 2, link: 'document', name: '文章生成', discription: '見出しを調整し、文章構成に手を加えることができます。' },
];

export default function Page() {
    // let memoDataArr = getMemoData();

    //====================================================================
    // ==== ステートの宣言 ====
    const [memo, setMemo] = useState({ title: '', discription: '' }); //レスポンスの文字数と内容を管理

    //====================================================================
    // ==== データベースAPI ====
    // データベースにmemoテーブルのデータを送信する
    async function setMemoData() {
        const response = await fetch('/api/memo', {
            method: 'POST',
            body: JSON.stringify({
                title: memo.title,
                description: memo.discription,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data);
        return data;
    }
    // データベースからmemoテーブルのデータを取得する
    async function getMemoData() {
        const response = await fetch('/api/memo');
        const data = await response.json();
        console.log(data);
        return data;
    }

    //====================================================================
    // ==== ページリンクパーツを生成 ====
    const listItems = pageArr.map((page) => (
        <li key={page.key} className="block border rounded-lg">
            {/* 各ページのリンク */}
            <Link href={'./' + page.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{page.name}</h3>
                <p className="mt-4 text-lg">{page.discription}</p>
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
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
            <Headline2>メモ</Headline2>
            <form onSubmit={setMemoData} className="flex flex-col">
                <div className="flex w-full mt-2 gap-3 items-center">
                    <input
                        type="text"
                        name="inputHeadline"
                        id="inputHeadline"
                        value={memo.title}
                        onChange={(e) => setMemo({ title: e.target.value, discription: memo.discription })}
                        placeholder="タイトルを入力"
                        required
                        className="flex-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex w-full mt-2 gap-3 items-center">
                    <input
                        type="text"
                        name="inputHeadline"
                        id="inputHeadline"
                        value={memo.discription}
                        onChange={(e) => setMemo({ title: memo.title, discription: e.target.value })}
                        placeholder="本文を入力"
                        required
                        className="flex-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="relative mt-4 py-2 px-4 w-28 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    setMemo
                </button>
            </form>

            <button
                onClick={getMemoData}
                className="relative py-2 px-4 w-28 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
            >
                getMemo
            </button>
        </main>
    );
}
