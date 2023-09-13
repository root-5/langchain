'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Headline2 } from '../../components/Headline2';

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [mode, setMode] = useState(''); // モードを管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [fixOrder, setFixOrder] = useState('なし'); // 修正指示を管理
    const [result, setResult] = useState(''); //出力の内容を管理
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
            const serverResponse = await fetch('../api/format/getAnswer', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
                    mode: formData.get('mode'),
                    fixOrder: formData.get('fixOrder'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            console.log(text);
            setResult(text);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>データフォーマット</Headline2>
            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <p className="text-2xl font-black">入力</p>
                <div className="flex flex-col">
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={
                            'フォーマットしたいデータを入力してください\n\n例：\n昭和9年3月1日、平成17年7月31日、令和3年12月1日\n>>和暦形式になっているに付け表記をyyyy/mm/dd形式に修正し、カンマ区切りにしてください\n\n苗字,名前,年齢\n佐藤,太郎,20\n鈴木,次郎,30\n田中,花子,40\n>>特定の形式を「JSON」に指定'
                        }
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        className="mt-4 p-2 h-72 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div className="flex mt-4 gap-5 items-center">
                        <label htmlFor="mode" className="font-bold">
                            特定の形式
                        </label>
                        <select
                            name="mode"
                            id="mode"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="p-2 w-32 border border-gray-300 rounded-md dark:text-gray-900"
                        >
                            <option value="other">指定なし</option>
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>
                    <div className="flex mt-4 gap-5 items-center">
                        <label htmlFor="fixOrder" className="font-bold">
                            追加指示
                        </label>
                        <input
                            type="text"
                            id="fixOrder"
                            name="fixOrder"
                            placeholder={'全てのconsole.logをalertに変更してください'}
                            value={fixOrder}
                            onChange={(e) => setFixOrder(e.target.value)}
                            className="flex-1 p-2 w-full border border-gray-300 rounded-md dark:text-gray-900"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading === true}
                    className="relative mt-4 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    フォーマット
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>

            {/* 出力の表示 */}
            <div className="mt-10">
                <p className="text-2xl font-black">出力</p>
                <p hidden={isError.statusBoolean} className="mt-2 text-gray-700">
                    {isError.statusBoolean ? isError.messageText : ''}
                </p>
                <div className="relative mt-2">
                    <textarea value={result} className="mt-2 p-2 h-96 w-full rounded-md dark:text-gray-900"></textarea>
                    <Image
                        src="/img/copy.png"
                        width={24}
                        height={24}
                        alt={'コピー'}
                        className="absolute z-10 bottom-2 right-1 p-2 w-10 h-10 opacity-30 duration-300 rounded-2xl hover:opacity-100 cursor-pointer active:bg-blue-500"
                        onClick={() => navigator.clipboard.writeText(result)}
                    />
                </div>
            </div>
        </main>
    );
}
