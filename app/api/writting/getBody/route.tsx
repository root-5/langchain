import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

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

    const reqTitle = body.title;
    const reqHeadline = body.headline;
    const reqLength = body.length;

    // テンプレートを作成
    const multipleInputPrompt = new PromptTemplate({
        inputVariables: ['title', 'headline', 'length'],
        template:
            'あなたは記事ライターです。{title}というタイトルの記事を作成しています。この記事の一部である{headline}という見出しに沿った文章を{length}文字で生成してください。',
    });

    // テンプレートに入力を埋め込む
    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
        title: reqTitle,
        headline: reqHeadline,
        length: reqLength,
    });

    // OpenAIへリクエストを送信
    let res = await llm.predict(formattedMultipleInputPrompt);
    res = `# ${reqHeadline}\n${res}\n\n`;
    console.log(res);

    // 終了時間を記録し、かかった時間を表示
    const endTime = performance.now();
    // console.log(`要約にかかった時間: ${endTime - startTime}ms`);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}