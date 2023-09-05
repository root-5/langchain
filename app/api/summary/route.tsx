import { NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PromptTemplate } from 'langchain/prompts';

// OpenAIのモデルを作成
const model = new OpenAI({
    openAIApiKey: process.env.API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    // リクエストを受け取った時間を記録
    const startTime = performance.now();

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
            本文で提示された重要な論点を${length}文字程度に簡潔にまとめてください:
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

    // 終了時間を記録し、かかった時間を表示
    const endTime = performance.now();
    console.log(`要約にかかった時間: ${endTime - startTime}ms`);

    // レスポンスを返す
    return NextResponse.json({ result: res.text });
}
