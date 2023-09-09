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
    const reqHeadlineNumber = body.headlineNumber;
    const reqHeadlines = body.headlines;
    const reqLength = body.length;

    // テンプレートを作成
    const multipleInputPrompt = new PromptTemplate({
        inputVariables: ['title', 'headline', 'length'],
        template:
            'あなたは記事ライターです。{title}というタイトルの記事を作成しています。この記事の一部である{headline}という見出しに沿った文章を{length}文字で生成してください。',
    });

    // 生成する本文の宣言
    let generatedBodyText = '';

    // 見出しの数だけループ
    for (let i = 0; i < reqHeadlineNumber; i++) {
        // テンプレートに入力を埋め込む
        const formattedMultipleInputPrompt = await multipleInputPrompt.format({
            title: reqTitle,
            headline: reqHeadlines[i],
            length: reqLength,
        });

        // OpenAIへリクエストを送信
        const res = await llm.predict(formattedMultipleInputPrompt);

        // generatedBodyTextに見出し、生成した本文、改行を追加
        generatedBodyText += `${i+1}. ${reqHeadlines[i]}\n${res}\n\n`;
    }

    // 終了時間を記録し、かかった時間を表示
    const endTime = performance.now();
    // console.log(`要約にかかった時間: ${endTime - startTime}ms`);

    // レスポンスを返す
    return NextResponse.json({ result: generatedBodyText });
}
