'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';
// import { Metadata } from 'next';

export default function Page() {
    // 初期値とステートの宣言
    let initial = 'ここに結果が表示されます';
    const [result, setResult] = useState(initial);

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>大規模AI系便利ツール</Headline2>

            {/* フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <div className="flex flex-col">
                    <label htmlFor="inputText" className="text-gray-700">
                        質問を入力してください
                    </label>
                    <textarea
                        // type="text"
                        name="inputText"
                        id="inputText"
                        className="mt-2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    送信
                </button>
            </form>

            {/* 結果の表示 */}
            <div className="mt-8">
                <p className="text-gray-700">結果</p>
                <p className="mt-2 text-gray-700">{result}</p>
            </div>
        </main>
    );
}
