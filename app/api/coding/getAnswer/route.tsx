import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export const maxDuration = 300;

// OpenAIのモデルを作成
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-4-1106-preview',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqLanguage = body.language;
    const reqMode = body.mode;
    const reqText = body.text;
    const reqFixOrder = body.fixOrder;

    // テンプレートを作成
    let multipleInputPrompt;

    //reqModeによって処理を分岐
    switch (reqMode) {
        case 'generate':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下のフローをもとに{language}のコードを生成してください。また丁寧にコメントをつけてください。\n\n{text}\n\n',
            });
            break;
        case 'explain':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下のコードがしている処理をわかりやすく解説してください。\n\n{text}\n\n',
            });
            break;
        case 'fix':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text', 'fixOrder'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下のコードを指示をもとに修正してください。また提示するコードには丁寧にコメントをつけてください。\n\n\n# 指示\n{fixOrder}\n\n\n# コード\n{text}\n\n',
            });
            break;
        case 'error':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下のエラー文が示している内容とその修正方法を、例を用いながら初心者にもわかるように解説してください。\n\n{text}\n\n',
            });
            break;
        case 'comment':
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下のコードに読む人がわかりやすいようなコメントを追加してください。\n\n{text}\n\n',
            });
            break;
        default:
            multipleInputPrompt = new PromptTemplate({
                inputVariables: ['language', 'text'],
                template:
                    'あなたは{language}言語の優秀なプログラマーです。以下の指示をもとに{language}のコードを生成してください。また丁寧にコメントをつけてください。\n\n{text}\n\n',
            });
    }

    // テンプレートに入力を埋め込む
    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
        language: reqLanguage,
        text: reqText,
        fixOrder: reqFixOrder,
    });

    // OpenAIへリクエストを送信
    const res = await llm.predict(formattedMultipleInputPrompt);

    // レスポンスを返す
    return NextResponse.json({ result: res });
}
