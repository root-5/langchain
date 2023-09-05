'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';

export default function Page() {
    // ステートの宣言
    const [formTextLength, setFormTextLength] = useState(0); // フォームの文字数を管理
    const [result, setResult] = useState({ resultText: '', resultLength: 0 }); //レスポンスの文字数と内容を管理
    const [isError, setIsError] = useState({ errorStatus: false, errorMessage: '' }); // エラー状態の有無とエラーメッセージを管理
    const [status, setStatus] = useState('typing'); // 表示状態を管理、'typing'は入力中、'loading'はロード中

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('loading');

        // フォームの内容を取得し、サーバーに送信
        try {
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
            // レスポンスをJSONとしてパース
            const serverResponseJson = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseJson.result;
            const length = text.length;
            setResult({ resultText: text, resultLength: length });
        } catch (error) {
            const errorMessage = (error as Error).toString();
            setIsError({ errorStatus: true, errorMessage: errorMessage });
        }
        setStatus('typing');
    }

    // 入力トリガーでテキストエリア（フォーム）の文字数を表示する
    function showFormTextLength(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value;
        const length = text.length;
        setFormTextLength(length);
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>AIを便利に使おう！</Headline2>

            {/* フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <p className="text-2xl text-gray-900">入力</p>
                <div className="flex flex-col">
                    <label className="mt-2 text-gray-900">要約したい文章</label>
                    <textarea
                        name="inputText"
                        id="inputText"
                        className="mt-2 p-2 h-64 border border-gray-300 rounded-md"
                        onChangeCapture={showFormTextLength}
                    />
                    <p className="text-gray-700 text-right">{formTextLength}文字</p>
                    <label className="text-gray-900">要約後の文字数</label>
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
                    disabled={status === 'loading'}
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    送信
                </button>
            </form>

            {/* 結果の表示 */}
            <div className="mt-10">
                <p className="text-2xl text-gray-900">結果</p>
                <p hidden={isError.errorStatus} className="mt-2 text-gray-700">
                    {isError.errorStatus ? isError.errorMessage : ''}
                </p>
                <textarea
                    className="mt-2 p-2 h-64 w-full border border-gray-300 rounded-md"
                    placeholder="ここに結果が表示されます"
                    value={result.resultText}
                    readOnly
                ></textarea>
                <p className="mt-2 text-gray-700">{result.resultLength}文字</p>
            </div>
        </main>
    );
}
