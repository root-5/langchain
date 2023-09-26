'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Headline2 } from '../../../components/Headline2';
import { Strong } from '../../../components/Strong';
import { translateData } from '../../../components/data/translateData';

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isZenn, setIsZenn] = useState(false); // zennモードを管理
    const [language, setLanguage] = useState('ja'); // モードを管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [chatgptResult, setChatgptResult] = useState(''); // ChatGPT出力の内容を管理
    const [deeplResult, setDeeplResult] = useState(''); // DeepL出力の内容を管理
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // フォームの内容を取得
        const formData = new FormData(event.currentTarget);

        // DeepLのAPIに送信
        try {
            const serverResponse = await fetch('../api/translate/toDeepl', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
                    language: formData.get('language'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            setDeeplResult(text);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }

        // chatgptのAPIに送信
        try {
            const serverResponse = await fetch('../api/translate/toChatgpt', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
                    language: formData.get('language'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            setChatgptResult(text);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    //====================================================================
    // ==== Zennモードの処理 ====
    // #zennBtnのdata-isZennStatus属性が変更されたら、isZennのステートを更新
    useEffect(() => {
        const zennBtnEle = document.getElementById('zennBtn');
        if (!zennBtnEle) return;
        const observer = new MutationObserver(() => {
            const isZennStatus = zennBtnEle.getAttribute('data-zenn-status');
            if (isZennStatus === 'true') {
                () => setIsZenn(true);
            } else {
                () => setIsZenn(false);
            }
        });
        observer.observe(zennBtnEle, {
            attributes: true,
            attributeFilter: ['data-zenn-status'],
        });
    }, []);

    //====================================================================
    // ==== パーツを生成 ====
    // 言語の選択肢を生成
    const languageOptions = translateData.map((data, i) => {
        return (
            <option key={i} value={data.lang}>
                {data.name}
            </option>
        );
    });

    //====================================================================
    // ==== レンダリング ====
    return (
        <main>
            <Headline2 hidden={isZenn}>多言語間翻訳</Headline2>
            {/* 入力フォーム */}
            <form className={isZenn ? 'relative mt-0' : 'relative mt-8'} onSubmit={submitClick}>
                <Strong hidden={isZenn}>入力</Strong>
                <div className="flex flex-col">
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={
                            'ここに翻訳したい文章を入力してください\n※ダブルクリックでクリップボードから貼り付けられます'
                        }
                        required
                        onDoubleClick={async () => {
                            setFormText(await navigator.clipboard.readText());
                        }}
                        onChange={(e) => setFormText(e.target.value)}
                        className="mt-4 p-2 h-72 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div className="flex mt-4 gap-5 items-center">
                        <label htmlFor="language" className="font-bold">
                            翻訳先の言語
                        </label>
                        <select
                            name="language"
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 w-36 border border-gray-300 rounded-md dark:text-gray-900"
                        >
                            {languageOptions}
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading === true}
                    className="relative mt-4 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    翻訳
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>

            {/* 出力の表示 */}
            <div className="mt-10">
                <Strong hidden={isZenn}>出力</Strong>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="flex gap-3 w-full flex-col md:flex-row">
                    <div className="relative w-full">
                        <p className="mb-2">by DeepL</p>
                        <textarea
                            value={deeplResult}
                            onChange={(e) => setDeeplResult(e.target.value)}
                            placeholder={'DeepLの翻訳結果が表示されます\nこのエリアでそのまま編集もできます'}
                            className="p-2 h-96 w-full border border-gray-300 rounded-md dark:text-gray-900"
                        ></textarea>
                        <p
                            className="absolute z-2 bottom-1.5 right-0 flex items-center justify-center w-16 h-8 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200"
                            onClick={(e) => {
                                navigator.clipboard.writeText(deeplResult);
                                e.currentTarget.innerText = 'Copied!';
                            }}
                        >
                            Copy
                        </p>
                    </div>
                    <div className="relative w-full">
                        <p className="mb-2">by ChatGPT</p>
                        <textarea
                            value={chatgptResult}
                            onChange={(e) => setChatgptResult(e.target.value)}
                            placeholder={'ChatGPTの翻訳結果が表示されます\nこのエリアでそのまま編集もできます'}
                            className="p-2 h-96 w-full border border-gray-300 rounded-md dark:text-gray-900"
                        ></textarea>
                        <p
                            className="absolute z-2 bottom-1.5 right-0 flex items-center justify-center w-16 h-8 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200"
                            onClick={(e) => {
                                navigator.clipboard.writeText(chatgptResult);
                                e.currentTarget.innerText = 'Copied!';
                            }}
                        >
                            Copy
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
