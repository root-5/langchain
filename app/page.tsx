'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

export default function Page() {
    // ステートの宣言
    const [result, setResult] = useState('ここに結果が表示されます');
    const [resultTextLength, setResultTextLength] = useState(0);

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // フォームの内容を取得し、サーバーに送信
        const formData = new FormData(event.currentTarget);
        const serverResponse = await fetch('/api/summary', {
            method: 'POST',
            body: JSON.stringify({
                text: formData.get('inputText'),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // レスポンスをJSONとしてパース、返信を返す
        const serverResponseJson = await serverResponse.json();
        let result = serverResponseJson.result;
        setResult(result);

        // const text = event.currentTarget.value;
        // const length = text.length;
        // setResultTextLength(length);
    }

    // テキストエリアの文字数を表示する
    const [formTextLength, setFormTextLength] = useState(0);
    function showLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setFormTextLength(length);
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>大規模AI系便利ツール</Headline2>

            {/* フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <div className="flex flex-col">
                    <label htmlFor="inputText" className="text-gray-900">
                        質問を入力してください
                    </label>
                    <textarea
                        // type="text"
                        name="inputText"
                        id="inputText"
                        className="mt-2 p-2 border border-gray-300 rounded-md"
                        onKeyUp={showLength}
                    />
                    <p className="text-gray-700">{formTextLength}文字</p>
                </div>
                <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    送信
                </button>
            </form>

            {/* 結果の表示 */}
            <div className="mt-8">
                <p className="text-2xl text-gray-900">結果</p>
                <p className="mt-2 text-gray-900">{result}</p>
                <p className="text-gray-700">{resultTextLength}文字</p>
            </div>
        </main>
    );
}
