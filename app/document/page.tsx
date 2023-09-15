'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

// =====================================================================
// ==== サイトデータ ====
const siteData = [
    {
        short: 'ta',
        name: 'Tailwindcss',
        url: 'https://tailwindcss.com/docs/installation',
    },
    {
        short: 're',
        name: 'React',
        url: 'https://ja.react.dev/learn',
    },
    {
        short: 'ne',
        name: 'Nextjs',
        url: 'https://nextjs.org/docs',
    },
    {
        short: 'ty',
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/docs/',
    },
];

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [searchInput, setSearchInput] = useState({ hide: false, value: '' });
    const [siteUrl, setSiteUrl] = useState('');

    //====================================================================
    // 検索ボックスの入力があった時の処理
    const seachInputFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (searchInput.value === '') {
            setSiteUrl('');
        }
        setSearchInput({ hide: false, value: e.target.value });
        // 入力された値がtailwindcssだった場合は、iframeにフォーカスを当てる
        for (let i = 0; i < siteData.length; i++) {
            if (!e.target.value.indexOf(siteData[i].short)) {
                setSiteUrl(siteData[i].url);
                setSearchInput({ hide: true, value: '' });
                const iframe = document.getElementById('iframe') as HTMLIFrameElement;
                if (iframe) {
                    iframe.onload = () => {
                        iframe.focus();
                    };
                }
            }
        }
    };

    //====================================================================
    // ==== マウント時の処理 ====
    // 検索ボックスにフォーカスを当てる
    useEffect(() => {
        const inputHeadline = document.getElementById('inputHeadline');
        inputHeadline?.focus();
    });

    //====================================================================
    // ==== サイトデータパーツの生成 ====
    const items = siteData.map((item, i) => (
        <span key={i}>
            "{item.short}" -&gt; {item.name},{' '}
        </span>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        // ifremeを使ってbbcのサイトを表示する
        <main className="">
            <div
                className={
                    searchInput.hide
                        ? 'flex gap-2 items-center justify-center w-full absolute bottom-0 left-0 opacity-5 hover:opacity-100'
                        : 'flex gap-2 items-center justify-center mt-96 mx-auto flex-wrap'
                }
            >
                <div className={searchInput.hide ? 'hidden' : 'block pb-2 w-full text-center'}>{items}</div>
                <Link
                    href="/"
                    className="block w-fit m-0 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:before:hidden hover:bg-blue-600"
                >
                    /
                </Link>
                <Link
                    href="/cording"
                    className="block w-fit m-0 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:before:hidden hover:bg-blue-600"
                >
                    /cording
                </Link>
                <input
                    type="text"
                    name="inputHeadline"
                    id="inputHeadline"
                    value={searchInput.value}
                    onChange={seachInputFunc}
                    placeholder="上記の短縮表記でドキュメント、それ以外はAIに質問になります"
                    required
                    className={
                        searchInput.hide
                            ? 'block m-0 p-2 border border-gray-300 rounded-md dark:text-gray-900 w-full flex-1'
                            : 'block m-0 p-2 border border-gray-300 rounded-md dark:text-gray-900 w-2/3'
                    }
                />
            </div>
            {/* <Headline2>テスト</Headline2> */}
            <iframe
                id="iframe"
                src={siteUrl}
                width="100%"
                className={siteUrl == '' ? '' : 'focus:border-2 focus:border-yellow-300 h-screen'}
            ></iframe>

            {/* ヘッダーとフッターを非表示にする */}
            <style jsx global>{`
                header {
                    display: none;
                }
                footer {
                    display: none;
                }
            `}</style>
        </main>
    );
}
