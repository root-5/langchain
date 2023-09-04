import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';

const llm = new OpenAI({
    openAIApiKey: process.env.API_KEY,
    temperature: 0.5,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();
    const question = body.text;
    console.log(question);

    // OpenAIに質問を投げて結果を取得
    const result = await llm.predict(question);
    console.log(result);
    return NextResponse.json({ result: result });
}
