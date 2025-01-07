import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-4o-mini',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqText = body.text;
    const reqMode = body.mode;
    const reqFixOrder = body.fixOrder;

    // テンプレートを作成
    let multipleInputPrompt;

    // モードによってテンプレートを変更
    switch (reqMode) {
        case 'other':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['text', 'fixOrder'],
                template:
                    '以下のデータを指示をもとにフォーマットし直してください。\n\n\n# 指示\n{fixOrder}\n\n\n# データ\n{text}\n\n',
            });
            break;
        default:
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['mode', 'text', 'fixOrder'],
                template:
                    '以下のデータを{mode}形式にフォーマットし直してください。追加指示がある場合は追加指示に則ってフォーマットしてください。\n\n\n# 追加指示\n{fixOrder}\n\n\n# データ\n{text}\n\n',
            });
    }

    // テンプレートに入力を埋め込む
    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
        mode: reqMode,
        text: reqText,
        fixOrder: reqFixOrder,
    });

    // OpenAIへリクエストを送信
    const res = await llm.predict(formattedMultipleInputPrompt);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
