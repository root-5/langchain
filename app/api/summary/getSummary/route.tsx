import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PromptTemplate } from 'langchain/prompts';

export const maxDuration = 300;

// OpenAIのモデルを作成
const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-4o-mini',
});

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();
    const text = body.text;
    const length = body.length;

    // テキストを分割してOpenAIの入力形式に変換
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([text]);

    // プロンプトを作成
    const prompt = new PromptTemplate({
        inputVariables: ['text'],
        template: `
            本文で提示された重要な論点を${length}文字程度に簡潔にまとめてください。箇条書きの使用はできるだけ控えてください:
            "{text}"
            ---
            要約:
        `,
    });

    // 要約を実行
    const chain = loadSummarizationChain(model, {
        type: 'map_reduce',
        combineMapPrompt: prompt,
        combinePrompt: prompt,
    });
    const res = await chain.call({
        input_documents: docs,
    });

    // レスポンスを返す
    return NextResponse.json({ result: res.text });
}
