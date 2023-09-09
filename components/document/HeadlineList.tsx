'use client';

import { useState } from 'react';

export function HeadlineList(props: { title: string; toggle: boolean; number: number; wordCount: number }) {
    // ステートの宣言
    const [inputHeadlineText, setInputHeadlineText] = useState(['', '', '', '', '', '', '', '', '', '']); // テキストエリアの内容を管理
    const [responseSentenceText, setResponseSentenceText] = useState(['', '', '', '', '', '', '', '', '', '']); //レスポンスの文字数と内容を管理
    const [responseSentenceLength, setResponseSentenceLength] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //レスポンスの文字数と内容を管理
    const [status, setStatus] = useState([
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
        'typing',
    ]); // 表示状態を管理、'typing'は入力中、'loading'はロード中
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理

    // 配列番号を指定して、ステート配列の該当箇所のみを変更する関数
    function setInputHeadlineTextFunc(newText: string, num: number) {
        setInputHeadlineText(inputHeadlineText.map((text, index) => (index !== num ? text : newText)));
    }
    function setResponseSentenceTextFunc(newText: string, num: number) {
        setResponseSentenceText(responseSentenceText.map((text, index) => (index !== num ? text : newText)));
    }
    function setResponseSentenceLengthFunc(newLength: number, num: number) {
        setResponseSentenceLength(responseSentenceLength.map((length, index) => (index !== num ? length : newLength)));
    }
    function setStatusFunc(newStatus: string, num: number) {
        setStatus(status.map((status, index) => (index !== num ? status : newStatus)));
    }

    // 見出しを利用する場合のみ、このコンポーネントを表示
    if (!props.toggle) {
        return;
    }

    // 生成ボタンが押されたときの処理
    async function genereteSentenceFunc(event: React.FormEvent<HTMLButtonElement>, num: number) {
        event.preventDefault();

        // ロード中のステータスを設定
        setStatusFunc('loading', num);

        // フォームの内容を取得し、サーバーに送信
        try {
            const serverResponse = await fetch('../api/document/sentence', {
                method: 'POST',
                body: JSON.stringify({
                    title: props.title,
                    headline: inputHeadlineText[num],
                    length: props.wordCount,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseJson = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const newText = serverResponseJson.result;
            const newLength = newText.length;

            // レスポンスのテキストと長さをステートに保存
            setResponseSentenceTextFunc(newText, num);
            setResponseSentenceLengthFunc(newLength, num);
        } catch (error) {
            // エラーが発生した場合、エラー状態をステートに保存
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }
        // ロード中のステータスを解除
        setStatusFunc('typing', num);
    }

    // テキストエリアの内容が変更されたときの処理
    function textareaChange(event: React.ChangeEvent<HTMLTextAreaElement>, num: number) {
        setResponseSentenceTextFunc(event.target.value, num);
        setResponseSentenceLengthFunc(event.target.value.length, num);
    }

    // numberを上限として、1,2,3...を格納した配列を作成
    let headlineNumberArr: number[] = [];
    for (let i = 0; i < props.number; i++) {
        headlineNumberArr.push(i + 1);
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
                    value={inputHeadlineText[num]}
                    onChange={(e) => setInputHeadlineTextFunc(e.target.value, num)}
                    data-num-input={num}
                />
                <button
                    onClick={(e) => genereteSentenceFunc(e, num)}
                    disabled={status[num] === 'loading'}
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
                    value={responseSentenceText[num]}
                    onChange={(e) => textareaChange(e, num)}
                ></textarea>
            </div>
            <p hidden={isError.statusBoolean} className="text-gray-700 text-right">
                {isError.messageText}
            </p>
            <p className="text-gray-700 text-right">{responseSentenceLength[num]}文字</p>
        </li>
    ));

    return <ul>{listItems}</ul>;
}
