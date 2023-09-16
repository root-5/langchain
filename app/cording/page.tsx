'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Headline2 } from '../../components/Headline2';
import SyntaxHighlighter from 'react-syntax-highlighter';

//====================================================================
// ==== データ ====
// モードに関わるデータ
const modeData = [
    {
        name: 'generate',
        text: 'コードの生成',
        placeholder:
            '生成したい処理の内容を入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \n1. 今年の1月1日から今日までの日数を取得する\n2. 取得した日数をconsole.logで出力する',
    },
    {
        name: 'explain',
        text: 'コードの解説',
        placeholder:
            '解説してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nRange("A1:B2").Value',
    },
    {
        name: 'fix',
        text: 'コードの修正',
        placeholder:
            '修正してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nRange(A1:B2).Value',
    },
    {
        name: 'error',
        text: 'エラーの解説',
        placeholder:
            '解説してほしいエラーを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け\n\n例: \nインデックスが有効範囲にありません。：実行時エラー9',
    },
    {
        name: 'comment',
        text: 'コメントの挿入',
        placeholder:
            'コメントを挿入してほしいコードを入力してください\n※テキストエリアをダブルクリックでクリップボードの内容を貼り付け',
    },
];

// ドキュメント一覧
const docData = [
    {
        short: 'ja',
        name: 'JavaScript',
        link: 'https://developer.mozilla.org/ja/docs/Web/JavaScript',
        isLang: true,
    },
    {
        short: 'ty',
        name: 'TypeScript',
        link: 'https://www.typescriptlang.org/docs/',
        isLang: true,
    },
    {
        short: 'py',
        name: 'Python',
        link: 'https://docs.python.org/ja/3/',
        isLang: true,
    },
    {
        short: 'ph',
        name: 'PHP',
        link: 'https://www.php.net/manual/ja/index.php',
        isLang: true,
    },
    {
        short: 'ru',
        name: 'Ruby',
        link: 'https://www.ruby-lang.org/ja/documentation/',
        isLang: true,
    },
    {
        short: 'vb',
        name: 'VBA',
        link: 'https://learn.microsoft.com/ja-jp/office/vba/api/overview/excel',
        isLang: true,
    },
    {
        short: 'ta',
        name: 'Tailwindcss',
        link: 'https://tailwindcss.com/docs/installation',
        isLang: false,
    },
    {
        short: 're',
        name: 'React',
        link: 'https://ja.react.dev/learn',
        isLang: false,
    },
    {
        short: 'ne',
        name: 'Next.js',
        link: 'https://nextjs.org/docs',
        isLang: false,
    },
    {
        short: 'la',
        name: 'LangChain',
        link: 'https://js.langchain.com/docs/get_started/introduction/',
        isLang: false,
    },
];

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isZenn, setIsZenn] = useState(false); // Zennモードを管理
    const [language, setLanguage] = useState('JavaScript'); // モードを管理
    const [mode, setMode] = useState({
        name: modeData[0].name,
        text: modeData[0].text,
        placeholder: modeData[0].placeholder,
    }); // モードを管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [fixOrder, setFixOrder] = useState(
        'このコードではエラーが出ているので、エラーが発生しないように修正してください'
    ); // 修正指示を管理
    const [result, setResult] = useState(''); //出力の内容を管理
    const [searchInput, setSearchInput] = useState(''); // 検索ボックスの入力を管理
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

    // 検索ボックスの入力があった時の処理
    const seachInputFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        for (let i = 0; i < docData.length; i++) {
            if (!e.target.value.indexOf(docData[i].short)) {
                window.open(docData[i].link, '_blank');
                setSearchInput('');
            }
        }
    };

    //====================================================================
    // ==== マウント時の処理 ====
    // textareaやinputにフォーカスがついていない時、"/"入力で検索ボックスにフォーカスを当てる
    useEffect(() => {
        const inputText = document.getElementById('inputText') as HTMLTextAreaElement;
        const inputDocsName = document.getElementById('inputDocsName') as HTMLInputElement;

        document.addEventListener('keydown', (e) => {
            if (e.key === '/') {
                if (inputText !== document.activeElement && inputDocsName !== document.activeElement) {
                    e.preventDefault();
                    setSearchInput('');
                    inputDocsName.focus();
                }
            }
        });
    });

    //====================================================================
    // ==== パーツを生成 ====
    // モードの選択パーツを生成
    const modeItems = modeData.map((item, i) => (
        <li key={i} className="w-36 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center pl-3">
                <input
                    type="radio"
                    id={item.name}
                    name="mode"
                    onChange={(e) => {
                        setMode({ name: item.name, text: item.text, placeholder: item.placeholder });
                    }}
                    value={item.name}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-700  dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                    htmlFor={item.name}
                    className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    {item.text}
                </label>
            </div>
        </li>
    ));

    // 言語の選択パーツを生成
    const langItems = docData
        .filter((doc) => {
            return doc.isLang === true;
        })
        .map((doc, i) => (
            <option key={i} value={doc.name}>
                {doc.name}
            </option>
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

    // ドキュメントの例を表示するパーツを生成
    const examples = docData.map((doc, i) => (
        <span key={i}>
            &quot;{doc.short}&quot; =&gt; {doc.name}, &nbsp;
        </span>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className={isZenn ? 'max-w-5xl w-11/12 mx-auto' : 'max-w-5xl w-11/12 mx-auto pt-14'}>
            <Headline2 className={isZenn ? '!text-2xl' : ''}>コーディング補助</Headline2>
            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <div className="relative flex items-center justify-between">
                    <p hidden={isZenn} className="text-2xl font-black">
                        入力
                    </p>
                    <div
                        onClick={() => setIsZenn(!isZenn)}
                        className={
                            isZenn
                                ? 'absolute right-0 top-0 ml-auto py-1 px-2 bg-blue-800 text-white rounded-md duration-300 hover:bg-blue-600 hover:cursor-pointer'
                                : 'relative ml-auto py-1 px-2 bg-blue-800 text-white rounded-md duration-300 hover:bg-blue-600 hover:cursor-pointer'
                        }
                    >
                        Zenn
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className={isZenn ? 'flex mt-0 gap-5 items-center' : 'flex mt-4 gap-5 items-center'}>
                        <label htmlFor="language" hidden={isZenn} className="font-bold">
                            言語
                        </label>
                        <select
                            name="language"
                            id="language"
                            onChange={(e) => setLanguage(e.target.value)}
                            className={
                                isZenn
                                    ? 'p-1 w-28 border border-gray-300 rounded-md dark:text-gray-900'
                                    : 'p-2 w-40 border border-gray-300 rounded-md dark:text-gray-900'
                            }
                        >
                            {langItems}
                        </select>
                    </div>
                    <div className="flex mt-4 gap-5 items-center">
                        <p hidden={isZenn} className="font-bold">
                            モード
                        </p>
                        <ul className="flex-wrap items-center w-fit text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {modeItems}
                        </ul>
                    </div>
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={mode.placeholder}
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        className="mt-4 p-2 h-64 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div className="flex mt-4 gap-5 items-center">
                        <label hidden={mode.name !== 'fix'} htmlFor="fixOrder" className="font-bold">
                            どう修正したいか
                        </label>
                        <input
                            type="text"
                            hidden={mode.name !== 'fix'}
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
                    {mode.text}
                </button>
                <div className="flex w-fit m-0 justify-center" aria-label="読み込み中"></div>
            </form>
            {/* 出力の表示 */}
            <div className={isZenn ? 'mt-6' : 'mt-10'}>
                <p hidden={isZenn} className="text-2xl font-black">
                    出力
                </p>
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
            <Headline2 className={isZenn ? '!text-2xl mt-6' : 'mt-12'}>ドキュメント検索</Headline2>
            <input
                type="text"
                name="inputDocsName"
                id="inputDocsName"
                value={searchInput}
                onChange={seachInputFunc}
                placeholder={
                    isZenn
                        ? 'ショートカット "/"'
                        : '言語・ライブラリを英小文字表記で入力することで該当のドキュメントを開きます'
                }
                required
                className={'block m-0 p-2 border border-gray-300 rounded-md dark:text-gray-900 w-2/3'}
            />
            <p hidden={isZenn} className="mt-2">
                <span>{examples}</span>
            </p>
            {isZenn ? zennHeader : ''}
        </main>
    );
}
