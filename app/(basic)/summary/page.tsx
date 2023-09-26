'use client';

import React from 'react';
import { useState } from 'react';
import { Headline2 } from '../../../components/Headline2';
import { Strong } from '../../../components/Strong';

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [formTextLength, setFormTextLength] = useState(0); // フォームの文字数を管理
    const [result, setResult] = useState({ text: '', length: 0 }); //レスポンスの文字数と内容を管理
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('../api/summary/getSummary', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
                    length: formData.get('textLength'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            const length = text.length;
            setResult({ text: text, length: length });
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    //====================================================================
    // ==== その他の処理 ====
    // 入力トリガーでテキストエリア（入力部分）の文字数を表示する
    function showFormTextLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setFormTextLength(length);
    }

    // 結果のテキストをコピーする
    function copyText() {
        const text = result.text;
        navigator.clipboard.writeText(text);
    }

    // テキストエリアの内容が変更されたときの処理
    function textareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setResult({ text: event.target.value, length: event.target.value.length });
    }

    //====================================================================
    // ==== レンダリング ====
    return (
        <main>
            <Headline2>文章要約</Headline2>

            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <Strong>入力</Strong>
                <div className="flex flex-col">
                    <textarea
                        name="inputText"
                        id="inputText"
                        placeholder={
                            'ここに要約したい文章を入力してください\n日本語以外の文章を入れた場合は要約された日本語訳を取得できます'
                        }
                        required
                        onChangeCapture={showFormTextLength}
                        className="mt-2 p-2 h-64 border border-gray-300 rounded-md dark:text-gray-900"
                    />
                    <p className="text-gray-700 text-right dark:text-white">{formTextLength}文字</p>
                    <div className="flex gap-5 items-center">
                        <label className="font-bold">要約後の文字数</label>
                        <select
                            name="textLength"
                            id="textLength"
                            className="p-2 w-20 border border-gray-300 rounded-md dark:text-gray-900"
                        >
                            <option>100</option>
                            <option>250</option>
                            <option>500</option>
                            <option>750</option>
                            <option>1000</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading === true}
                    className="relative mt-4 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    要約する
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>

            {/* 出力の表示 */}
            <div className="mt-10">
                <Strong>出力</Strong>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="relative mt-2">
                    <textarea
                        placeholder="ここに要約結果が表示されます"
                        onChange={textareaChange}
                        value={result.text}
                        className="p-2 h-64 w-full border border-gray-300 rounded-md overflow-y-scroll whitespace-pre-wrap dark:text-gray-900"
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
                <p className="text-gray-700 text-right dark:text-white">{result.length}文字</p>
            </div>
        </main>
    );
}
