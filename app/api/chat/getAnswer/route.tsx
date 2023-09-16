import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    // リクエストを受け取った時間を記録
    const startTime = performance.now();

    // リクエストから質問部分を取得
    const body = await req.json();

    const reqText = body.text;

    // OpenAIへリクエストを送信
    const res = await llm.predict(reqText);

    // 終了時間を記録し、かかった時間を表示
    const endTime = performance.now();
    // console.log(`要約にかかった時間: ${endTime - startTime}ms`);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
