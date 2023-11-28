'use client';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Headline2 } from '../../../components/Headline2';
import Image from 'next/image';

// chatsの型を定義
interface ChatsInterface {
    id: number;
    speaker: string;
    text: string;
}

const initialChats: ChatsInterface[] = [
    {
        id: 1,
        speaker: 'chatGPT',
        text: 'こんにちは。私はchatGPTです。質問を入力してください。',
    },
];

const templateList = [
    {
        id: 1,
        title: '概要説明',
        text: 'AAAAの概要について、メリットとデメリット、具体例を踏まえて説明してください。',
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
    const [isZen, setIsZen] = useState(false); // Zenモードを管理
    const [chats, setChats] = useState<ChatsInterface[]>(initialChats); // チャットの内容を管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理
    const [isTooltip, setIsTooltip] = useState(false); // ツールチップの表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormText('');
        setIsLoading(true);
        createNewChat('user', formText);

        // chatsからspeakerとtext部分を取り出して、chatTextsに格納
        const chatTexts = chats.map((chat) => {
            return { role: chat.speaker, content: chat.text };
        });

        // フォームの内容を取得し、サーバーに送信
        try {
            const serverResponse = await fetch('../api/chat/getAnswer', {
                method: 'POST',
                body: JSON.stringify({
                    messages: chatTexts,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // レスポンスをJSONとしてパース
            const serverResponseObj = await serverResponse.json();

            // レスポンスのテキストと長さをステートに保存
            const text = serverResponseObj.result;
            createNewChat('chatGPT', text);
        } catch (error) {}
        setIsLoading(false);
    }

    //====================================================================
    // ==== チャットの処理 ====
    // チャットの内容を生成
    function createNewChat(speaker: string, text: string) {
        const chat = {
            id: chats.length + 1,
            speaker: speaker,
            text: text,
        };
        chats.push(chat);
        setChats(chats);
    }

    // チャットの内容を削除
    function deleteChat() {
        setChats([]);
    }

    // チャットの内容が更新されたら、一番下までスクロール
    useEffect(() => {
        const frameEle = document.getElementById('frame');
        if (!frameEle) return;
        frameEle.scrollTop = frameEle.scrollHeight;
    });

    //====================================================================
    // ==== フォーム幅調整の処理 ====
    useEffect(() => {
        // サイドパネルの変更時、main要素の幅に合わせてform要素の幅を変更
        const mainEle = document.querySelector('main');
        const formEle = document.querySelector('form');
        const sidePanelEle = document.getElementById('sidepanel');

        if (mainEle && formEle && sidePanelEle) {
            const observer = new MutationObserver(() => {
                formEle.style.width = `${mainEle.clientWidth}px`;
            });
            if (!sidePanelEle || !formEle) return;
            observer.observe(sidePanelEle, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }
    }, [isZen]);

    //====================================================================
    // ==== ショートカットの処理 ====
    useEffect(() => {
        // command+enterで送信、/でフォームにフォーカス
        const submitBtnEle = document.getElementById('submit');
        const inputTextEle = document.getElementById('inputText');

        document.addEventListener('keydown', (e) => {
            if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.key == 'Enter') {
                e.preventDefault();
                submitBtnEle ? submitBtnEle.click() : null;
            }
            if (e.key === '/' && inputTextEle !== document.activeElement) {
                e.preventDefault();
                inputTextEle ? inputTextEle.focus() : null;
            }
        });
    });

    //====================================================================
    // ==== Zenモードの処理 ====
    // #zenBtnのdata-isZenStatus属性が変更されたら、isZenのステートを更新
    useEffect(() => {
        const zenBtnEle = document.getElementById('zenBtn');
        if (!zenBtnEle) return;
        const observer = new MutationObserver(() => {
            const isZenStatus = zenBtnEle.getAttribute('data-zen-status');
            if (isZenStatus === 'true') {
                setIsZen(true);
            } else {
                setIsZen(false);
            }
        });
        observer.observe(zenBtnEle, {
            attributes: true,
            attributeFilter: ['data-zen-status'],
        });
    }, []);

    //====================================================================
    // ==== チャットパーツの生成 ====
    const chatParts = chats.map((chat) => {
        return (
            <div key={chat.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={chat.speaker === 'chatGPT' ? '/img/guruguru.png' : '/img/leaf.png'}
                        alt={chat.speaker === 'chatGPT' ? 'chatGPT' : 'ユーザー'}
                        width={40}
                        height={40}
                    />
                </div>
                <div className="flex flex-col mt-[-4px] gap-1 flex-1">
                    <p className="font-bold">{chat.speaker}</p>
                    <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                </div>
            </div>
        );
    });

    //====================================================================
    // ==== テンプレートの生成 ====
    const templateParts = templateList.map((template) => {
        return (
            <div key={template.id} className="relative flex gap-1 text-xs text-gray-600">
                <p className="block font-bold w-14">{template.title}</p>
                {/* クリックでテンプレートの内容をフォームに入力 */}
                <p
                    onClick={() => {
                        setFormText(template.text);
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
        <main>
            {/* chatGPTとの対話がチャット形式で出力されるエリア */}
            <Headline2 className={isZen ? 'hidden' : ''}>チャット</Headline2>
            <div className="relative">
                <div
                    id="frame"
                    className={
                        isZen
                            ? 'flex flex-col gap-2 h-[calc(100vh-100px)] overflow-y-scroll'
                            : 'flex flex-col gap-2 h-[calc(100vh-240px)] md:h-[calc(100vh-240px)] overflow-y-scroll'
                    }
                >
                    <button
                        onClick={deleteChat}
                        className={
                            isZen
                                ? 'absolute top-2 right-14 w-7 h-7 bg-blue-500 text-white rounded-md duration-300 opacity-20 hover:bg-blue-600 hover:opacity-100'
                                : 'absolute top-0 right-0 w-7 h-7 bg-blue-500 text-white rounded-md duration-300 opacity-20 hover:bg-blue-600 hover:opacity-100'
                        }
                    >
                        ×
                    </button>
                    <div className={isZen ? 'flex flex-col p-4 gap-4 pt-8' : 'flex flex-col p-4 gap-4'}>
                        {chatParts}
                        <div hidden={!isLoading} className="animate-pulse">
                            <Image
                                src={'/img/guruguru.png'}
                                alt={'chatGPT'}
                                width={40}
                                height={40}
                                className="animate-spin [animation-duration:3s]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 入力フォーム */}
            <form
                className={
                    isZen
                        ? 'fixed w-11/12 md:w-[calc(92%_-_200px)] md:max-w-4xl box-border bottom-2'
                        : 'fixed w-11/12 md:w-[calc(92%_-_200px)] md:max-w-4xl box-border bottom-9'
                }
                onSubmit={submitClick}
            >
                <div className="flex gap-2 h-full">
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={'Ctrl + Enterで送信'}
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        // フォーカスされている間だけ高さを自動調整
                        onFocus={(e) => (e.target.style.height = '150px')}
                        onBlur={(e) => (e.target.style.height = '40px')}
                        className="block p-2 h-10 flex-1 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <div
                        id="tooltipBtn"
                        onClick={() => setIsTooltip(!isTooltip)}
                        className="relative py-2.5 px-3 h-10 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse cursor-pointer"
                    >
                        ？
                    </div>
                    <div
                        id="tooltipBack"
                        hidden={!isTooltip}
                        className="fixed inset-0 z-10"
                        onClick={() => setIsTooltip(false)}
                    ></div>
                    <div
                        id="tooltip"
                        hidden={!isTooltip}
                        className="absolute z-20 bottom-12 right-0 w-96 p-2 bg-gray-100 rounded-md shadow-md"
                    >
                        <div className="flex flex-col gap-2 mt-2">{templateParts}</div>
                    </div>
                    <button
                        id="submit"
                        type="submit"
                        disabled={isLoading === true}
                        className="py-2 px-4 h-10 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                    >
                        送信
                    </button>
                </div>
            </form>
        </main>
    );
}
