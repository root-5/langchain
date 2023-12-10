'use client';

import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { modeData, docData } from '../../../components/data/codingData';

const templateList = [
    {
        id: 1,
        title: '概要説明',
        text: 'AAAAについて、概要、メリットとデメリット、基本的な流れ、具体例の4つの観点から説明してください。',
    },
    {
        id: 2,
        title: '比較検討',
        text: 'AAAAとBBBBの違いについて、どういった点が異なるのか、それぞれのメリットとデメリット、それぞれの具体例の3つの観点から説明してください。',
    },
    {
        id: 3,
        title: '問題解決',
        text: '私は現在、TARGETを目的としてACTIONを行なっていますが、PROBLEMに直面しています。どういった解決策が考えられますか？解決策は複数挙げ、理由を添えて回答してください。',
    },
];

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [language, setLanguage] = useState('JavaScript'); // モードを管理
    const [mode, setMode] = useState({
        name: modeData[0].name,
        text: modeData[0].text,
        placeholder: modeData[0].placeholder,
    }); // モードを管理
    const [isShortcutRegisted, setIsShortcutRegisted] = useState(false); // ショートカットキーの登録状態を管理
    const [isSearchMode, setIsSearchMode] = useState('google'); // 検索モードの状態を管理
    const [searchInput, setSearchInput] = useState(''); // 検索ボックスの入力を管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [chatText, setcChatText] = useState(''); // フォームのテキストを管理
    const [fixOrder, setFixOrder] = useState(
        'このコードではエラーが出ているので、エラーが発生しないように修正してください'
    ); // 修正指示を管理
    const [result, setResult] = useState(''); //出力の内容を管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理
    const [isTooltip, setIsTooltip] = useState(false); // ツールチップの表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // コーディング補助フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('../api/coding/getAnswer', {
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
        } catch (error) {}
        setIsLoading(false);
    }

    // 検索ボックスの送信ボタンが押されたときの処理
    async function searchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isSearchMode === 'ai') {
            setIsLoading(true);

            // テキストをapi/chat/getAnswer
            const response = await fetch('../api/chat/getAnswer', {
                method: 'POST',
                body: JSON.stringify({ messages: [{ role: 'user', content: searchInput }] }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const stream = await response.body;
            if (!stream) return;
            const reader = stream.getReader();

            // chatGPTの返答を生成
            let text = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // valueはUint8Array型なので、文字列に変換
                const valueDecorded = new TextDecoder().decode(value);

                // 不要な文字列を削除して、返答文に追加
                let textPart = valueDecorded.replace(/0:"/g, '').replace(/"\n/g, '');

                // \\nは改行に変換
                if (textPart.includes('\\n')) textPart = textPart.replace(/\\n/g, '\n');

                // textPartの最後に改行を追加
                text += textPart;

                // textの中身が改行のみの場合は、textを空に初期化する
                if (text === '\n') text = '';

                setcChatText(text);
            }
            setIsLoading(false);
        } else if (searchInput.startsWith('http')) {
            window.open(searchInput);
            setSearchInput('');
        } else {
            window.open('https://www.google.com/search?q=' + searchInput, '_self');
            setSearchInput('');
        }
    }

    // 検索ボックスの入力があった時の処理
    const seachInputFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);

        // Googleモードとプライベート検索の切り替え
        if (e.target.value.startsWith(' ') || e.target.value.startsWith('　')) {
            isSearchMode === 'private' ? setIsSearchMode('google') : setIsSearchMode('private');
            setSearchInput('');
            return;
        }
        // AIモードとGoogleモードの切り替え
        if (e.target.value.startsWith('?') || e.target.value.startsWith('？')) {
            isSearchMode === 'ai' ? setIsSearchMode('google') : setIsSearchMode('ai');
            setSearchInput('');
            return;
        }

        // プライベート検索の時は、検索ボックスに入力があったらリンクを開く
        if (isSearchMode === 'private') {
            let searchHitCount = 0;
            let searchHitDataNum = 0;

            // ドキュメント一覧から検索ヒットしたものを探す
            for (let i = 0; i < docData.length; i++) {
                const lowerDocData = docData[i].name.toLowerCase();
                const lowerSearchInput = e.target.value.toLowerCase();
                if (!lowerDocData.indexOf(lowerSearchInput)) {
                    searchHitCount++;
                    searchHitDataNum = i;
                }
            }

            if (searchHitCount === 1) {
                window.open(docData[searchHitDataNum].link, '_self');
                setSearchInput('');
            }
        }

        // AIモードの時は'/'キーでテンプレートツールチップを表示
        if (isSearchMode === 'ai') {
            if (e.target.value.startsWith('/')) {
                e.preventDefault();
                setIsTooltip(true);

                // テンプレート番号を取得
                const templateNum = e.target.value.replace('/', '');
                // テンプレート番号が存在するかチェック
                if (templateNum.match(/^[0-9]+$/)) {
                    // テンプレート番号が存在する場合は、テンプレートを表示
                    const template = templateList[Number(templateNum) - 1];
                    setSearchInput(template.text);
                }
            } else {
                setIsTooltip(false);
            }
        }
    };

    //====================================================================
    // ==== マウント時の処理 ====
    // ショートカットキーの登録とフォーカスの当て方を設定
    useEffect(() => {
        const inputDocsNameEle = document.getElementById('inputDocsName') as HTMLInputElement;
        const inputTextEle = document.getElementById('inputText') as HTMLTextAreaElement;
        const modalEle = document.getElementById('modal') as HTMLInputElement;

        if (isShortcutRegisted) return;

        // ショートカットキーの登録
        document.addEventListener('keydown', (e) => {
            // Escキーで検索モードの切り替え
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsSearchMode((prev) => (prev === 'coding' ? 'google' : 'coding'));
                setSearchInput('');

                // モーダルが非表示の時は検索ボックスにフォーカスを当てる
                if (modalEle.classList.contains('opacity-0')) {
                    inputDocsNameEle.focus();
                } else {
                    inputTextEle.focus();
                }
            }
            setIsShortcutRegisted(true);
        });
        // ロード時にフォーカスを当てる
        inputDocsNameEle.focus();
    }, [isShortcutRegisted]);

    // #modalをクリックした時に検索ボックスにフォーカスを当てる
    useEffect(() => {
        const inputDocsNameEle = document.getElementById('inputDocsName') as HTMLInputElement;
        const modalEle = document.getElementById('modal') as HTMLInputElement;
        const hukidashiEle = document.getElementById('hukidashi') as HTMLInputElement;

        // #modalをクリックした時に検索ボックスにフォーカスを当てる
        modalEle.addEventListener('click', (e) => {
            if (e.target !== hukidashiEle) {
                e.preventDefault();
                inputDocsNameEle.focus();
            }
        });
    }, []);

    //====================================================================
    // ==== パーツを生成 ====
    // モードの選択パーツを生成
    const modeItems = modeData.map((item, i) => (
        <li key={i} className="w-36 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-500">
            <div className="flex items-center pl-3">
                <input
                    type="radio"
                    id={item.name}
                    name="mode"
                    onChange={(e) => {
                        setMode({ name: item.name, text: item.text, placeholder: item.placeholder });
                    }}
                    value={item.name}
                    className="w-4 h-4 text-blue-600 dark:ring-offset-gray-700 hover:cursor-pointer"
                />
                <label htmlFor={item.name} className="w-full py-2 ml-2 text-sm hover:cursor-pointer">
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

    // テンプレートの生成
    const templateParts = templateList.map((template) => {
        return (
            <div key={template.id} className="relative flex gap-1 text-xs text-gray-600">
                <p className="block font-bold w-20">
                    {template.id}. {template.title}
                </p>
                {/* クリックでテンプレートの内容をフォームに入力 */}
                <p
                    onClick={() => {
                        setSearchInput(template.text);
                        setIsTooltip(false);
                    }}
                    className="block flex-1 cursor-pointer hover:text-blue-500"
                >
                    {template.text}
                </p>
            </div>
        );
    });

    //====================================================================
    // ==== レンダリング ====
    return (
        <main className="pt-6 max-w-4xl w-11/12 mx-auto">
            <div
                id="modal"
                className={
                    isSearchMode === 'coding'
                        ? 'absolute top-0 left-0 items-center justify-center w-screen h-screen dark:bg-black bg-white z-10 opacity-0 pointer-events-none'
                        : 'absolute top-0 left-0 items-center justify-center w-screen h-screen dark:bg-black bg-white z-10'
                }
            >
                <form onSubmit={searchSubmit} className="flex flex-col pb-24 w-screen h-screen item-center">
                    {/* <p className="block mx-auto w-fit text-light text-[8rem] font-serif mb-[-40px]">Google</p> */}
                    <p className="block mt-24 mx-auto w-fit text-light text-[14rem]">+ +</p>
                    <div className="relative mt-36 mx-auto w-fit h-fit">
                        <input
                            type="text"
                            name="inputDocsName"
                            id="inputDocsName"
                            disabled={isLoading === true}
                            value={searchInput}
                            onChange={seachInputFunc}
                            placeholder={
                                isSearchMode === 'google'
                                    ? 'Google Search...'
                                    : isSearchMode === 'ai'
                                    ? 'Ask AI...  (Template: "/" + No.)'
                                    : isSearchMode === 'private'
                                    ? 'Private Search...'
                                    : ''
                            }
                            required
                            className={
                                'relative block p-2 w-[400px] border-8 text-[20px] focus-visible:outline-none ' +
                                (isLoading === true
                                    ? 'rounded-md border-gray-300 animate-pulse'
                                    : isSearchMode === 'google'
                                    ? 'rounded-md dark:text-gray-900 border-t-blue-500 border-r-red-500 border-b-yellow-400 border-l-green-600'
                                    : isSearchMode === 'private'
                                    ? 'border-blue-600 rounded-md dark:text-gray-900 bg-blue-100'
                                    : isSearchMode === 'ai'
                                    ? 'border-white rounded-md dark:text-white bg-gray-900 !text-[14px]'
                                    : '')
                            }
                        />
                        <div id="tooltipArea" className={isSearchMode === 'ai' ? 'w-7' : 'hidden'}>
                            <div
                                id="tooltipBack"
                                hidden={!isTooltip}
                                className="fixed inset-0 z-10"
                                onClick={() => setIsTooltip(false)}
                            ></div>
                            <div
                                id="tooltip"
                                hidden={!isTooltip}
                                className="absolute z-20 bottom-12 p-2 bg-gray-100 rounded-md shadow-md"
                            >
                                <div className="flex flex-col gap-2 mt-2">{templateParts}</div>
                            </div>
                        </div>
                    </div>
                    <div id="hukidashiArea">
                        <div
                            className={
                                !(isSearchMode === 'ai' && chatText !== '')
                                    ? 'hidden'
                                    : 'mt-8 mx-auto w-0 h-0 border-t-0 border-r-[18px] border-b-[18px] border-l-[18px] border-t-transparent border-r-transparent border-b-white border-l-transparent'
                            }
                        ></div>
                        <div className="relative mx-auto w-[80%]">
                            <textarea
                                id="hukidashi"
                                value={chatText}
                                readOnly
                                className={
                                    !(isSearchMode === 'ai' && chatText !== '')
                                        ? 'hidden'
                                        : 'block p-2 w-full h-96 border-4 border-white rounded-md dark:text-gray-900 focus-visible:outline-none'
                                }
                            ></textarea>
                            <p
                                className={
                                    !(isSearchMode === 'ai' && chatText !== '')
                                        ? 'hidden'
                                        : 'absolute z-2 bottom-1.5 right-0 flex items-center justify-center w-16 h-8 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200'
                                }
                                onClick={(e) => {
                                    navigator.clipboard.writeText(chatText);
                                    e.currentTarget.innerText = 'Copied!';
                                }}
                            >
                                Copy
                            </p>
                        </div>
                    </div>
                </form>
                <p className="fixed z-30 py-3 px-10 bottom-0 left-0 w-screen bg-black text-white">
                    Escape&nbsp;&nbsp;&nbsp;Coding assist
                    <br />
                    Space&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Private search
                    <br />
                    &apos;?&apos;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ask AI
                </p>
            </div>
            {/* 入力フォーム */}
            <form onSubmit={submitClick}>
                <div className="flex flex-col">
                    <div className={'flex mt-0 gap-5 items-center'}>
                        <label htmlFor="language" hidden={true} className="font-bold">
                            言語
                        </label>
                        <select
                            name="language"
                            id="language"
                            onChange={(e) => setLanguage(e.target.value)}
                            className={'p-1 w-28 border border-gray-300 rounded-md dark:text-gray-900'}
                        >
                            {langItems}
                        </select>
                    </div>
                    <div className="flex mt-4 gap-5 items-center">
                        <p hidden={true} className="font-bold">
                            モード
                        </p>
                        <ul className="flex items-center w-fit text-sm font-medium gap-[1px] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
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
                        className="mt-4 p-2 h-40 border border-gray-300 rounded-md dark:text-gray-900"
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
            <div className={'mt-6'}>
                <div className="relative mt-2">
                    <SyntaxHighlighter
                        language={language.toLowerCase()}
                        className={'mt-2 w-full border border-gray-300 rounded-md resize-y h-60'}
                    >
                        {result}
                    </SyntaxHighlighter>
                    <p
                        className="absolute z-2 bottom-1.5 right-0 flex items-center justify-center w-16 h-8 opacity-30 text-black text-sm duration-300 rounded-lg hover:opacity-100 cursor-pointer select-none active:bg-blue-200"
                        onClick={(e) => {
                            navigator.clipboard.writeText(result);
                            e.currentTarget.innerText = 'Copied!';
                        }}
                    >
                        Copy
                    </p>
                </div>
            </div>
        </main>
    );
}
