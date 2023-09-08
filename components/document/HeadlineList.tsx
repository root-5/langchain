'use client';

import { useState } from 'react';

export function HeadlineList(props: { toggle: boolean; number: number; wordCount: number }) {
    // ステートの宣言
    const [inputHeadlineText, setInputHeadlineText] = useState(''); // テキストエリアの内容を管理
    const [responseSentence, setResponseSentence] = useState({ text: '', length: 0 }); //レスポンスの文字数と内容を管理
    const [status, setStatus] = useState('typing'); // 表示状態を管理、'typing'は入力中、'loading'はロード中
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理

    // numberを上限として、1,2,3...を格納した配列を作成
    let headlineNumberArr: number[] = [];
    for (let i = 0; i < props.number; i++) {
        headlineNumberArr.push(i + 1);
    }

    if (!props.toggle) {
        return;
    }

    // 生成ボタンが押されたときの処理
    async function genereteSentence(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        setStatus('loading');

        // フォームの内容を取得し、サーバーに送信
        try {
            const serverResponse = await fetch('../api/document/sentence', {
                method: 'POST',
                body: JSON.stringify({
                    text: inputHeadlineText,
                    length: props.wordCount,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseJson = await serverResponse.json();
            console.log(serverResponseJson);

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseJson.result;
            const length = text.length;
            setResponseSentence({ text: text, length: length });
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }

        setStatus('typing');
    }

    // テキストエリアの内容が変更されたときの処理
    function textareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setResponseSentence({ text: event.target.value, length: event.target.value.length });
    }

    const listItems = headlineNumberArr.map((num) => (
        <li className="" key={num.toString()}>
            <div className="flex w-full mt-4 gap-3 items-center">
                <p className="text-lg">{num}. </p>
                <input
                    type="text"
                    name="inputHeadline"
                    placeholder={'見出し' + num}
                    className="flex-1 p-2 w-full border border-gray-300 rounded-md"
                    value={inputHeadlineText}
                    onChange={(event) => setInputHeadlineText(event.target.value)}
                />
                <button
                    onClick={genereteSentence}
                    disabled={status === 'loading'}
                    className="p-2 w-14 bg-blue-500 text-white rounded-md duration-300 cursor-pointer hover:bg-blue-600 disabled:bg-gray-300"
                >
                    生成
                </button>
            </div>
            <div className="flex w-full mt-2 gap-3">
                <p className="text-lg w-3"></p>
                <textarea
                    placeholder="ここに要約結果が表示されます"
                    className="p-2 w-full h-64 border border-gray-300 rounded-md overflow-y-scroll whitespace-pre-wrap"
                    value={responseSentence.text}
                    onChange={textareaChange}
                ></textarea>
            </div>
            <p hidden={isError.statusBoolean} className="text-gray-700 text-right">
                {isError.messageText}
            </p>
            <p className="text-gray-700 text-right">{responseSentence.length}文字</p>
        </li>
    ));

    return <ul>{listItems}</ul>;
}
