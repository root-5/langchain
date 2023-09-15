'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Headline2 } from '../../components/Headline2';
import SyntaxHighlighter from 'react-syntax-highlighter';

//====================================================================
// ==== データ ====
// ドキュメント一覧
const docArr = [
    {
        key: 1,
        link: 'https://tailwindcss.com/docs/installation',
        name: 'tailwindcss',
    },
    {
        key: 2,
        link: 'https://ja.react.dev/learn',
        name: 'React',
    },
    {
        key: 3,
        link: 'https://nextjs.org/docs',
        name: 'Next.js',
    },
    {
        key: 4,
        link: 'https://js.langchain.com/docs/get_started/introduction/',
        name: 'LangChain',
    },
    {
        key: 5,
        link: 'https://www.typescriptlang.org/docs/',
        name: 'TypeScript',
    },
];

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isZenn, setIsZenn] = useState(false); // Zennモードを管理
    const [language, setLanguage] = useState('JavaScript'); // モードを管理
    const [mode, setMode] = useState('generate'); // モードを管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [fixOrder, setFixOrder] = useState(
        'このコードではエラーが出ているので、エラーが発生しないように修正してください'
    ); // 修正指示を管理
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
            const serverResponse = await fetch('../api/cording/getAnswer', {
                method: 'POST',
                body: JSON.stringify({
                    language: formData.get('language'),
                    mode: formData.get('mode'),
                    text: formData.get('inputText'),
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
            setResult(text);
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        setIsLoading(false);
    }

    //====================================================================
    // ==== ドキュメント一覧パーツを生成 ====
    const docItems = docArr.map((doc) => (
        <li key={doc.key} className="block border rounded-lg">
            <Link href={doc.link} className="block p-6 w-72 hover:opacity-40">
                <h3 className="text-2xl font-bold">{doc.name}</h3>
            </Link>
        </li>
    ));

    // ヘッダーとフッターを非表示にするパーツを生成
    const zennHeader = (
        <style jsx global>{`
            header {
                display: none;
            }
            footer {
                display: none;
            }
        `}</style>
    );

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className={isZenn ? 'max-w-5xl w-11/12 mx-auto' : 'max-w-5xl w-11/12 mx-auto pt-14'}>
            <Headline2>コーディング補助</Headline2>

            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-black">入力</p>
                    <div
                        onClick={() => setIsZenn(!isZenn)}
                        className="relative ml-auto py-1 px-2 bg-blue-800 text-white rounded-md duration-300 hover:bg-blue-600 hover:cursor-pointer"
                    >
                        Zenn
                    </div>
                    {isZenn ? zennHeader : ''}
                </div>
                <div className="flex flex-col">
                    <div className="flex mt-4 gap-5 items-center">
                        <label htmlFor="language" className="font-bold">
                            言語
                        </label>
                        <select
                            name="language"
                            id="language"
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 w-40 border border-gray-300 rounded-md dark:text-gray-900"
                        >
                            <option value={'JavaScript'}>JavaScript</option>
                            <option value={'Python'}>Python</option>
                            <option value={'VBA'}>VBA</option>
                        </select>
                    </div>
                    <div className="flex mt-4 gap-5 items-center">
                        <p className="font-bold">モード</p>
                        <ul className="flex-wrap items-center w-fit text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <li className="w-36 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        type="radio"
                                        id="generate"
                                        name="mode"
                                        value={'generate'}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor="generate"
                                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        コードの生成
                                    </label>
                                </div>
                            </li>
                            <li className="w-36 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        type="radio"
                                        id="explain"
                                        name="mode"
                                        value={'explain'}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor="explain"
                                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        コードの解説
                                    </label>
                                </div>
                            </li>
                            <li className="w-36 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        type="radio"
                                        id="fix"
                                        name="mode"
                                        value={'fix'}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor="fix"
                                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        コードの修正
                                    </label>
                                </div>
                            </li>
                            <li className="w-36 dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        type="radio"
                                        id="error"
                                        name="mode"
                                        value={'error'}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor="error"
                                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        エラーの解説
                                    </label>
                                </div>
                            </li>
                            <li className="w-36 dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        type="radio"
                                        id="comment"
                                        name="mode"
                                        value={'comment'}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor="comment"
                                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        コメントの挿入
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={
                            mode === 'generate'
                                ? '生成したい処理の内容を入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \n1. 今年の1月1日から今日までの日数を取得する\n2. 取得した日数をconsole.logで出力する'
                                : mode === 'explain'
                                ? '解説してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nRange("A1:B2").Value'
                                : mode === 'fix'
                                ? '修正してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nRange(A1:B2).Value'
                                : mode === 'error'
                                ? '解説してほしいエラーを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nインデックスが有効範囲にありません。：実行時エラー9'
                                : mode === 'comment'
                                ? 'コメントを挿入してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け'
                                : ''
                        }
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        className="mt-4 p-2 h-64 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div className="flex mt-4 gap-5 items-center">
                        <label hidden={mode !== 'fix'} htmlFor="fixOrder" className="font-bold">
                            どう修正したいか
                        </label>
                        <input
                            type="text"
                            hidden={mode !== 'fix'}
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
                    className="relative mt-2 py-2 px-4 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                >
                    {mode === 'generate'
                        ? '生成する'
                        : mode === 'explain'
                        ? '解説する'
                        : mode === 'fix'
                        ? '修正する'
                        : mode === 'error'
                        ? '解説する'
                        : mode === 'comment'
                        ? 'コメントを挿入する'
                        : ''}
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
                    <SyntaxHighlighter
                        language={language === 'JavaScript' ? 'javascript' : language === 'Python' ? 'python' : 'vba'}
                        className={result == '' ? 'mt-2 h-32 w-full rounded-md' : 'mt-2 h-96 w-full rounded-md'}
                    >
                        {result}
                    </SyntaxHighlighter>
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
            <Headline2 className="mt-12">ドキュメント一覧</Headline2>
            <ul className="flex flex-wrap gap-6 justify-center">{docItems}</ul>
        </main>
    );
}
