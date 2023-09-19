'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Headline2 } from '../../components/Headline2';

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

export default function Page() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isZenn, setIsZenn] = useState(false); // Zennモードを管理
    const [chats, setChats] = useState<ChatsInterface[]>(initialChats); // チャットの内容を管理
    const [formText, setFormText] = useState(''); // フォームのテキストを管理
    const [isLoading, setIsLoading] = useState(false); // 表示状態を管理

    //====================================================================
    // ==== ボタンの処理 ====
    // フォームの送信ボタンが押されたときの処理
    async function submitClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormText('');
        setIsLoading(true);
        createNewChat('あなた', formText);

        // フォームの内容を取得し、サーバーに送信
        try {
            const formData = new FormData(event.currentTarget);
            const serverResponse = await fetch('../api/chat/getAnswer', {
                method: 'POST',
                body: JSON.stringify({
                    text: formData.get('inputText'),
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
    // ==== ショートカットの処理 ====
    // command+enterで送信、/でフォームにフォーカス
    useEffect(() => {
        const submitBtnEle = document.getElementById('submit');
        const inputTextEle = document.getElementById('inputText');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.metaKey) {
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
                <div className="flex flex-col gap-1 flex-1">
                    <p className="font-bold">{chat.speaker}</p>
                    <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                </div>
            </div>
        );
    });

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
        <main className={isZenn ? 'max-w-4xl w-11/12 mx-auto' : 'max-w-4xl w-11/12 mx-auto pt-14'}>
            {/* chatGPTとの対話がチャット形式で出力されるエリア */}
            <Headline2 className={isZenn ? 'hidden' : ''}>チャット</Headline2>
            <div className="relative">
                <div
                    id="frame"
                    className={
                        isZenn
                            ? 'flex flex-col gap-2 h-[calc(100vh-100px)] overflow-scroll'
                            : 'flex flex-col gap-2 h-[600px] overflow-scroll'
                    }
                >
                    <div
                        onClick={() => setIsZenn(!isZenn)}
                        className={
                            isZenn
                                ? 'absolute right-12 top-4 py-1 px-2 bg-blue-800 text-white rounded-md duration-300 opacity-20 hover:opacity-100 hover:bg-blue-600 hover:cursor-pointer'
                                : 'absolute right-12 top-0 py-1 px-2 bg-blue-800 text-white rounded-md duration-300 opacity-20 hover:opacity-100 hover:bg-blue-600 hover:cursor-pointer'
                        }
                    >
                        Zenn
                    </div>
                    <button
                        onClick={deleteChat}
                        className={
                            isZenn
                                ? 'absolute top-4 right-3 w-7 h-7 bg-blue-500 text-white rounded-md duration-300 opacity-20 hover:bg-blue-600 hover:opacity-100'
                                : 'absolute top-0 right-3 w-7 h-7 bg-blue-500 text-white rounded-md duration-300 opacity-20 hover:bg-blue-600 hover:opacity-100'
                        }
                    >
                        ×
                    </button>
                    <div className={isZenn ? 'flex flex-col p-4 gap-4 pt-8' : 'flex flex-col p-4 gap-4'}>
                        {chatParts}
                    </div>
                </div>
                {/* <div id="scrollAreaFin" ref={scrollBottomRef} className="h-0" /> */}
            </div>

            {/* 入力フォーム */}
            <form className="mt-8" onSubmit={submitClick}>
                <div className="flex flex-wrap gap-2">
                    <textarea
                        name="inputText"
                        id="inputText"
                        value={formText}
                        placeholder={'質問を入力してください。'}
                        required
                        onChange={(e) => setFormText(e.target.value)}
                        className="block mt-4 p-2 h-10 flex-1 border border-gray-300 rounded-md dark:text-gray-900"
                    ></textarea>
                    <button
                        id="submit"
                        type="submit"
                        disabled={isLoading === true}
                        className="mt-4 py-2 px-4 h-10 bg-blue-500 text-white rounded-md duration-300 hover:bg-blue-600 disabled:bg-blue-400 disabled:animate-pulse"
                    >
                        送信
                    </button>
                </div>
            </form>
            {isZenn ? zennHeader : ''}
        </main>
    );
}
