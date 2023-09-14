'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Headline2 } from '../../components/Headline2';

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
            const serverResponse = await fetch('../api/document/getHeadline', {
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
                const serverResponse = await fetch('../api/document/getBody', {
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
            <p className="text-lg">{num}. </p>
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
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>文章作成</Headline2>

            {/* 入力エリア */}
            <div className="mt-8">
                <p className="text-2xl font-black">入力</p>
                <form onSubmit={generateHeadline} className="flex flex-col">
                    <label className="mt-4 font-bold">文章のタイトル</label>
                    <div className="flex w-full mt-2 gap-3 items-center">
                        <input
                            type="text"
                            name="inputHeadline"
                            id="inputHeadline"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="タイトルを入力"
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
                    <button
                        type="submit"
                        disabled={isLoading === true}
                        className="relative mt-4 py-2 px-4 w-28 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                    >
                        見出し生成
                    </button>
                </form>
                <form onSubmit={generateBody} className="mt-10">
                    <label className="font-bold">見出し構成</label>
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
                    <div className="flex mt-4 gap-5 items-center">
                        <button
                            disabled={isLoading === true}
                            className="relative py-2 px-4 w-28 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                        >
                            本文生成
                        </button>
                        <p className="text-red-800 dark:text-white">
                            生成文の長さ次第ですが、
                            <br className="sm:hidden" />
                            かなり時間がかかります！！
                        </p>
                    </div>
                </form>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </div>

            {/* 出力エリア */}
            <div className="mt-14">
                <p className="text-2xl font-black">出力</p>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="relative mt-2">
                    <textarea
                        className="p-2 h-64 w-full border border-gray-300 rounded-md overflow-y-scroll whitespace-pre-wrap dark:text-gray-900"
                        placeholder="ここに生成した文章が表示されます"
                        value={result.resultText}
                        onChange={(e) => setResult({ resultText: e.target.value, resultLength: result.resultLength })}
                    ></textarea>
                    <Image
                        src="/img/copy.png"
                        width={24}
                        height={24}
                        alt={'コピー'}
                        className="absolute z-10 bottom-2 right-1 p-2 w-10 h-10 opacity-30 duration-300 rounded-2xl hover:opacity-100 cursor-pointer active:bg-blue-500"
                        onClick={copyText}
                    />
                </div>
                <p className="text-gray-700 text-right dark:text-white">{result.resultLength}文字</p>
            </div>
        </main>
    );
}
