'use client';

import React from 'react';
import { useState } from 'react';
import { Headline2 } from '../../components/Headline2';
import { Strong } from '../../components/Strong';
import { BasicLayout } from '../../components/BasicLayout';

// 見出しの最大数
const maxHeadlineNumber = 10;

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [title, setTitle] = useState(''); // タイトルを管理
    const [headlineState, setHeadlineState] = useState({ toggle: true, number: 3 }); // 見出しの有無と見出しの数を管理
    const [textLength, setTextLength] = useState(100); // 本文文字数を管理
    const [inputHeadlineText, setInputHeadlineText] = useState(['', '', '', '', '', '', '', '', '', '']); // テキストエリアの内容を管理
    const [result, setResult] = useState({ resultText: '', resultLength: 0 }); //レスポンスの文字数と内容を管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理

    //====================================================================
    // ==== ボタンの処理 ====
    // 章作成ボタンが押されたときの処理
    async function generateHeadline(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        // フォームの内容を取得し、サーバーに送信
        try {
            const serverResponse = await fetch('../api/writting/getHeadline', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    number: headlineState.number,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // 回答部分のみを抽出
            const resText = serverResponseObj.result;

            // 回答部分を改行で分割し、半角スペースが含まれる場合は半角スペース以降の文字だけを抽出
            const resTextArray = resText.split('\n');
            const headlines = resTextArray.map((text: string) => {
                if (text.includes(' ')) {
                    const textArray = text.split(' ');
                    return textArray[1];
                } else {
                    return text;
                }
            });
            // headlines配列の長さがmaxHeadlineNumberより小さい場合は、空文字を追加
            if (headlines.length < maxHeadlineNumber) {
                for (let i = headlines.length; i < maxHeadlineNumber; i++) {
                    headlines.push('');
                }
            }
            setInputHeadlineText(headlines);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    // 本文生成ボタンが押されたときの処理
    async function generateBody(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        // レスポンスのテキストと長さを仮保存する変数を宣言
        let resText = '';
        let resLength = 0;

        // 見出しの数だけループし、見出しの内容を取得
        for (let i = 0; i < headlineState.number; i++) {
            // フォームの内容を取得し、サーバーに送信
            try {
                const serverResponse = await fetch('../api/writting/getBody', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: title, // タイトル
                        headline: inputHeadlineText[i], // 見出しの内容
                        length: textLength, // 本文の文字数
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // レスポンスをJSONとしてパース
                const serverResponseJson = await serverResponse.json();

                // レスポンスのテキストと長さをステートに保存
                const text = serverResponseJson.result;
                const length = text.length;

                resText += text;
                resLength += length;
            } catch (error) {
                const messageText = (error as Error).toString();
                setIsError({ statusBoolean: true, messageText: messageText });
            }
            setResult({ resultText: resText, resultLength: resLength });
        }
        setIsLoading(false);
    }

    //====================================================================
    // ==== その他の処理 ====
    // 結果のテキストをコピーする関数
    function copyText() {
        const text = result.resultText;
        navigator.clipboard.writeText(text);
    }

    //====================================================================
    // ==== 見出しリストのパーツを生成 ====
    // numberを上限として、1,2,3...を格納した配列を作成
    let headlineNumberArr: number[] = [];
    for (let i = 0; i < headlineState.number; i++) {
        headlineNumberArr.push(i + 1);
    }
    // 見出しリストを作成
    const listItems = headlineNumberArr.map((num) => (
        <div key={num} className="flex w-full mt-4 gap-3 items-center">
            <p className="">{num}. </p>
            <input
                type="text"
                name="inputHeadline"
                placeholder={'見出し' + num}
                value={inputHeadlineText[num - 1]}
                required
                onChange={(e) =>
                    setInputHeadlineText(
                        inputHeadlineText.map((text, index) => (index !== num - 1 ? text : e.target.value))
                    )
                }
                className="flex-1 p-2 w-full border border-gray-300 rounded-md dark:text-gray-900"
            />
        </div>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <BasicLayout>
            <main className="max-w-4xl w-11/12 mx-auto">
                <Headline2>文章作成</Headline2>

                {/* 入力エリア */}
                <div className="mt-8">
                    <Strong>入力</Strong>
                    <form onSubmit={generateHeadline} className="flex flex-col">
                        <label className="mt-4 font-bold">タイトル</label>
                        <div className="flex w-full mt-2 gap-3 items-center">
                            <input
                                type="text"
                                name="inputHeadline"
                                id="inputHeadline"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例：AIと人間の共存について"
                                required
                                className="flex-1 p-2 w-full border border-gray-300 rounded-md dark:text-gray-900"
                            />
                        </div>
                        <div className="flex mt-4 gap-5 items-center">
                            <label className="font-bold">作成したい章数</label>
                            <select
                                name="textLength"
                                id="textLength"
                                className="p-2 w-20 border border-gray-300 rounded-md font-normal dark:text-gray-900"
                                onChange={(e) =>
                                    setHeadlineState({ toggle: headlineState.toggle, number: parseInt(e.target.value) })
                                }
                            >
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                        </div>
                    </form>
                    <form onSubmit={generateBody} className="mt-10">
                        <label className="block font-bold w-full">章の構成</label>
                        <button
                            type="submit"
                            disabled={isLoading === true}
                            className="relative mt-4 py-2 px-4 w-fit bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                        >
                            タイトルから自動生成
                        </button>
                        <ol className="">
                            <ul>{listItems}</ul>
                        </ol>
                        <div className="flex mt-4 gap-5 items-center">
                            <label className="font-bold">見出し毎の文字数</label>
                            <select
                                name="textLength"
                                id="textLength"
                                className="p-2 w-20 border border-gray-300 rounded-md dark:text-gray-900"
                                onChange={(e) => setTextLength(parseInt(e.target.value))}
                            >
                                <option value="100">100</option>
                                <option value="250">250</option>
                                <option value="500">500</option>
                                <option value="750">750</option>
                                <option value="1000">1000</option>
                            </select>
                        </div>
                        <button
                            disabled={isLoading === true}
                            className="relative mt-4 py-2 px-4 w-28 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                        >
                            本文生成
                        </button>
                    </form>
                    <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
                </div>

                {/* 出力エリア */}
                <div className="mt-14">
                    <Strong>出力</Strong>
                    <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                        {isError.statusBoolean ? isError.messageText : ''}
                    </p>
                    <div className="relative mt-2">
                        <p>生成は章ごとに行われ、 全文を生成するまでにはかなり時間がかかります。</p>
                        <textarea
                            className="mt-2 p-2 h-64 w-full border border-gray-300 rounded-md overflow-y-scroll whitespace-pre-wrap dark:text-gray-900"
                            placeholder="ここに生成した文章が表示されます"
                            value={result.resultText}
                            onChange={(e) =>
                                setResult({ resultText: e.target.value, resultLength: result.resultLength })
                            }
                        ></textarea>
                        <p
                            className="absolute z-2 bottom-1.5 right-0 flex items-center justify-center w-16 h-8 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200"
                            onClick={(e) => {
                                copyText();
                                e.currentTarget.innerText = 'Copied!';
                            }}
                        >
                            Copy
                        </p>
                    </div>
                    <p className="text-gray-700 text-right dark:text-white">{result.resultLength}文字</p>
                </div>
            </main>
        </BasicLayout>
    );
}
