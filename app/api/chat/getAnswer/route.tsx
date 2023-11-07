import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { AIMessage, BaseMessageFields, HumanMessage } from 'langchain/schema';

export const maxDuration = 300;

// OpenAIのモデルを作成
const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-4-1106-preview',
    streaming: true,
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();
    let reqMessages = body.messages;

    // reqMessagesの長さが10以上の場合、最後の10個を残して削除
    const maxMessages = 10;
    if (reqMessages.length > maxMessages) {
        reqMessages = reqMessages.slice(reqMessages.length - maxMessages, reqMessages.length);
    }

    // OpenAIへリクエストを送信
    const res = await chat.call(
        reqMessages.map((m: { role: string; content: string | BaseMessageFields }) =>
            m.role == 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
        ),
        {
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        // console.log({ token });
                    },
                },
            ],
        }
    );

    // レスポンスを返す
    return NextResponse.json({ result: res.content });
}
