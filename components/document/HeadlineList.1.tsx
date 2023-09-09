'use client';
import { useState } from 'react';

export function HeadlineList(props: { toggle: boolean; number: number; wordCount: number }) {
    // ステートの宣言
    const [inputHeadlineText, setInputHeadlineText] = useState(['', '', '', '', '', '', '', '', '', '']); // テキストエリアの内容を管理
    const [responseSentenceText, setResponseSentenceText] = useState(['', '', '', '', '', '', '', '', '', '']); //レスポンスの文字数と内容を管理
    const [responseSentenceLength, setResponseSentenceLength] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //レスポンスの文字数と内容を管理

    // const [responseSentence, setResponseSentence] = useState({
    //     text: ['', '', '', '', '', '', '', '', '', ''],
    //     length: 0,
    // }); //レスポンスの文字数と内容を管理
    const [status, setStatus] = useState('typing'); // 表示状態を管理、'typing'は入力中、'loading'はロード中
    const [isError, setIsError] = useState({ statusBoolean: false, messageText: '' }); // エラー状態の有無とエラーメッセージを管理

    if (!props.toggle) {
        return;
    }

    // 生成ボタンが押されたときの処理
    async function genereteSentence(event: React.FormEvent<HTMLButtonElement>, num: Number) {
        event.preventDefault();
        setStatus('loading');
        console.log(status);
        console.log(status);
        console.log(status);

        // フォームの内容を取得し、サーバーに送信
        try {
            const serverResponse = await fetch('../api/document/sentence', {
                method: 'POST',
                body: JSON.stringify({
                    text: inputHeadlineText[num],
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
            setResponseSentenceText({ text: text, length: length });
        } catch (error) {
            const messageText = (error as Error).toString();
            setIsError({ statusBoolean: true, messageText: messageText });
        }

        setStatus('typing');
    }

    // インプットエリアの内容が変更されたときの処理
    // 引数としてイベントと配列の要素番号を受け取り、配列の要素番号に対応するステートを更新
    function inputHeadlineTextChange(event: React.ChangeEvent<HTMLInputElement>, num: Number) {
        setInputHeadlineText(inputHeadlineText.map((text, index) => (index === num ? event.target.value : text)));
    }

    // テキストエリアの内容が変更されたときの処理
    function textareaChange(event: React.ChangeEvent<HTMLTextAreaElement>, num: Number) {
        setResponseSentenceText(responseSentenceText.map((text, index) => (index === num ? event.target.value : text)));
        setResponseSentenceLength(
            responseSentenceLength.map((length, index) => (index === num ? event.target.value.length : length))
        );
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
                    onChange={(e) => inputHeadlineTextChange(e, num)}
                    data-num-input={num}
                />
                <button
                    onClick={(e) => genereteSentence(e, num)}
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
