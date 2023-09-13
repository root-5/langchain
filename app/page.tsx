'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { Headline2 } from '../components/Headline2';

//====================================================================
// ==== データ ====
// 各ページのリンクと説明
const pageArr = [
    { key: 1, link: 'summary', name: '文章要約', description: '文章を要約します。日本語以外にも対応しています。' },
    { key: 2, link: 'document', name: '文章生成', description: '見出しを調整し、文章構成に手を加えることができます。' },
];

//====================================================================
// ==== three.js ====
function Scene() {
    // const obj = useLoader(OBJLoader, 'img/Lowpoly_tree_sample.obj');
    // const loader = new OBJLoader();
    // const obj = loader.load('img/Lowpoly_tree_sample.obj');
    // return <primitive object={obj} />;
}

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
        const response = await fetch('/api/memo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1, description: memo }),
        });
        const data = await response.json();
        return;
    }
    useEffect(() => {
        getMemoData();
    }, []);

    //====================================================================
    // ==== ページリンクパーツを生成 ====
    const linkItems = pageArr.map((page) => (
        <li key={page.key} className="block border rounded-lg">
            {/* 各ページのリンク */}
            <Link href={'./' + page.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{page.name}</h3>
                <p className="mt-4 text-lg">{page.description}</p>
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <div className="w-full h-96" id="root">
                <Scene />
            </div>
            {/* <Image
                src="/img/guruguru.png"
                width={300}
                height={300}
                alt={'AIが踊る'}
                className="block animate-spin mx-auto my-8"
            /> */}
            <Headline2>機能一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{linkItems}</ul>
            {/* <Headline2>ホワイトボード</Headline2> */}
            <div className="relative mt-16 border-b-8 border-slate-600">
                <div className="absolute top-0 left-32 w-4 h-3 bg-gray-200 border-slate-400"></div>
                <div className="absolute top-0 right-32 w-4 h-3 bg-gray-200 border-slate-400"></div>
                <div className="absolute bottom-0 right-32 w-12 h-4 bg-sky-600"></div>
                <div className="absolute bottom-2 right-8 w-6 h-6 bg-yellow-300 rounded-full"></div>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    onBlur={setMemoData}
                    className={
                        memo === ''
                            ? 'block mt-2 w-full border  p-4 h-96  focus:outline-none bg-gray-100 animate-pulse'
                            : 'block mt-2 w-full border  p-4 h-96  focus:outline-none'
                    }
                ></textarea>
            </div>
        </main>
    );
}
