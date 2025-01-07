import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';

export const maxDuration = 300;

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-4o-mini',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqTitle = body.title;
    const reqHeadlineArray = body.headlineArray;
    const reqHeadline = body.headline;
    const reqLength = body.length;
    const reqPrevText = body.prevText;

    let reqHeadlineArrayString = '';
    for (let i = 0; i < reqHeadlineArray.length; i++) {
        reqHeadlineArrayString += `${i + 1}. ${reqHeadlineArray[i]}\n`;
    }

    // テンプレートに変数を挿入
    const formattedMultipleInputPrompt = `
    以下に示す"文章のタイトル"、"章の構成"、"直前の一文"を強く意識し、"${reqHeadline}"という章を**${reqLength}文字以内で**書いて

    ### タイトル
    ${reqTitle}

    ### 章の構成
    ${reqHeadlineArrayString}

    ### 直前の一文
    ${reqPrevText}
    `;

    // OpenAIへリクエストを送信
    let res = await llm.predict(formattedMultipleInputPrompt);
    res = `# ${reqHeadline}\n${res}\n\n`;

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
