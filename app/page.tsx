'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

export default function Page() {
    // ステートの宣言
    const [result, setResult] = useState('');
    const [resultTextLength, setResultTextLength] = useState(0);
    const [formTextLength, setFormTextLength] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // ボタンを無効化
        setButtonDisabled(true);

        // フォームの内容を取得し、サーバーに送信
        const formData = new FormData(event.currentTarget);
        const serverResponse = await fetch('/api/summary', {
            method: 'POST',
            body: JSON.stringify({
                text: formData.get('inputText'),
                length: formData.get('textLength'),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // レスポンスをJSONとしてパース、返信を返す
        const serverResponseJson = await serverResponse.json();
        let result = serverResponseJson.result;
        setResult(result);

        // レスポンスの文字数を表示する
        const length = result.length;
        setResultTextLength(length);

        // ボタンを有効化
        setButtonDisabled(false);
    }

    // 入力トリガーでテキストエリア（フォーム）の文字数を表示する
    function showFormTextLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setFormTextLength(length);
    }

    // 入力トリガーでテキストエリア（結果）の文字数を表示する
    function showREsultTextLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setResultTextLength(length);
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>大規模AI系便利ツール</Headline2>

            {/* フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <p className="text-2xl text-gray-900">入力</p>
                <div className="flex flex-col">
                    <label htmlFor="inputText" className="mt-2 text-gray-900">
                        要約したい文章
                    </label>
                    <textarea
                        name="inputText"
                        id="inputText"
                        className="mt-2 p-2 h-64 border border-gray-300 rounded-md"
                        onChangeCapture={showFormTextLength}
                    />
                    <p className="text-gray-700 text-right">{formTextLength}文字</p>
                    <label htmlFor="inputText" className="text-gray-900">
                        要約後の文字数
                    </label>
                    <select
                        name="textLength"
                        id="textLength"
                        className="mt-2 p-2 w-20 border border-gray-300 rounded-md"
                    >
                        <option>100</option>
                        <option selected>200</option>
                        <option>300</option>
                        <option>400</option>
                        <option>500</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={buttonDisabled}
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    送信
                </button>
            </form>

            {/* 結果の表示 */}
            <div className="mt-10">
                <p className="text-2xl text-gray-900">結果</p>
                <textarea
                    className="mt-2 p-2 h-64 w-full border border-gray-300 rounded-md"
                    onChangeCapture={showREsultTextLength}
                    placeholder="ここに結果が表示されます"
                    value={result}
                    readOnly
                ></textarea>
                <p className="mt-2 text-gray-700">{resultTextLength}文字</p>
            </div>
        </main>
    );
}
