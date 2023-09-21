import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { translateData } from '../../../../components/data/translateData';

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqText = body.text;
    const reqLanguage = body.language;

    // reqLanguageから言語名を取得
    const reqLanguageName = translateData.find((data) => data.lang === reqLanguage)?.name;

    // テンプレートを作成
    const inputPrompt = new PromptTemplate({
        inputVariables: ['language', 'text'],
        template: '以下のテキストを{language}に翻訳してください。\n\n# テキスト\n{text}\n\n',
    });

    // テンプレートに入力を埋め込む
    const formattedInputPrompt = await inputPrompt.format({
        language: reqLanguageName,
        text: reqText,
    });

    // OpenAIへリクエストを送信
    const res = await llm.predict(formattedInputPrompt);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
