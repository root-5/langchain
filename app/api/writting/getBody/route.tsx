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
    // リクエストを受け取った時間を記録
    const startTime = performance.now();

    // リクエストから質問部分を取得
    const body = await req.json();

    const reqTitle = body.title;
    const reqHeadlineArray = body.headlineArray;
    const reqHeadline = body.headline;
    const reqLength = body.length;

    let reqHeadlineArrayString = '';
    for (let i = 0; i < reqHeadlineArray.length; i++) {
        reqHeadlineArrayString += `${i + 1}. ${reqHeadlineArray[i]}\n`;
    }

    // テンプレートに変数を挿入
    const formattedMultipleInputPrompt = `
    あなたは文章ライターです。${reqTitle}というタイトルの文章を作成しています。章の構成は以下の通りです。

    # 章の構成
    ${reqHeadlineArrayString}

    この文章の一部である${reqHeadline}という見出しに沿った文章を${reqLength}文字で生成してください。
    `;

    // OpenAIへリクエストを送信
    let res = await llm.predict(formattedMultipleInputPrompt);
    res = `# ${reqHeadline}\n${res}\n\n`;

    // 終了時間を記録し、かかった時間を表示
    const endTime = performance.now();
    // console.log(`要約にかかった時間: ${endTime - startTime}ms`);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
