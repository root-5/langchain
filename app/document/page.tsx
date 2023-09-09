'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../../components/Headline2';
import { HeadlineList } from '@/components/document/HeadlineList';

export default function Page() {
    // ステートの宣言
    const [isChecked, setIsChecked] = useState(true); // チェックボックスの状態を管理
    const [headlineState, setHeadlineState] = useState({ toggle: true, number: 3 }); // 見出しの有無と見出しの数を管理
    const [result, setResult] = useState({ resultText: '', resultLength: 0 }); //レスポンスの文字数と内容を管理
    const [textLength, setTextLength] = useState(100); //レスポンスの文字数と内容を管理
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理
    const [status, setStatus] = useState('typing'); // 表示状態を管理、'typing'は入力中、'loading'はロード中

    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('loading');

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('../api/document', {
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
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setStatus('typing');
    }
    // トグルスイッチが押されたときの処理
    function kansaiToggleClick() {
        setHeadlineState({
            toggle: !headlineState.toggle,
            number: headlineState.number,
        });
        setIsChecked(!isChecked);
    }

    // 結果のテキストをコピーする関数
    function copyText() {
        const text = result.resultText;
        navigator.clipboard.writeText(text);
    }

    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>文章作成（！製作中！）</Headline2>

            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <p className="text-2xl">入力</p>
                <div className="flex flex-col">
                    <label className="mt-4">文章のタイトル</label>
                    <input
                        type="text"
                        name="inputHeadline"
                        id="inputHeadline"
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                    />
                    <label className="relative mt-4 w-fit flex gap-5 items-center cursor-pointer">
                        <span className="">章の見出し</span>
                        <input
                            type="checkbox"
                            name="kansaiToggle"
                            id="kansaiToggle"
                            className="sr-only peer"
                            checked={isChecked}
                            onChange={kansaiToggleClick}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <ol className="mt-2">
                        <HeadlineList
                            toggle={headlineState.toggle}
                            number={headlineState.number}
                            wordCount={textLength}
                        />
                    </ol>
                    <div className="flex mt-4 gap-5 items-center">
                        <label className="">各章の文字数</label>
                        <select
                            name="textLength"
                            id="textLength"
                            className="p-2 w-20 border border-gray-300 rounded-md"
                            onChange={(event) => setTextLength(parseInt(event.target.value))}
                        >
                            <option value="100">100</option>
                            <option value="250">250</option>
                            <option value="500">500</option>
                            <option value="750">750</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="relative mt-4 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-gray-300"
                >
                    要約する
                    <div
                        hidden={status === 'typing'}
                        className="absolute top-1 left-28 animate-spin h-8 w-8 bg-blue-200 duration-300 rounded-xl pointer-events-none"
                    ></div>
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>

            {/* 出力の表示 */}
            <div className="mt-10">
                <p className="text-2xl">出力</p>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="relative mt-2">
                    <div
                        className="p-2 h-64 w-full border border-gray-300 rounded-md overflow-y-scroll whitespace-pre-wrap"
                        placeholder="ここに要約結果が表示されます"
                        // contentEditable="true"
                    >
                        {result.resultText}
                    </div>
                    <Image
                        src="/img/copy.png"
                        width={24}
                        height={24}
                        alt={'コピー'}
                        className="absolute z-10 bottom-2 right-1 p-2 w-10 h-10 opacity-30 duration-300 rounded-2xl hover:opacity-100 cursor-pointer active:bg-blue-500"
                        onClick={copyText}
                    />
                </div>
                <p className="text-gray-700 text-right">{result.resultLength}文字</p>
            </div>
        </main>
    );
}
