import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqTitle = body.title;
    const reqNumber = body.number;

    // テンプレートを作成
    const multipleInputPrompt = new PromptTemplate({
        inputVariables: ['title', 'number'],
        template: `あなたは記事ライターです。{title}というタイトルの記事を作成しています。この記事に見出しを{number}個作成してください。回答は作成した見出しのみ羅列し、作成した見出し以外の文章は不要です。`,
    });

    // テンプレートに入力を埋め込む
    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
        title: reqTitle,
        number: reqNumber,
    });

    // OpenAIへリクエストを送信
    const res = await llm.predict(formattedMultipleInputPrompt);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
