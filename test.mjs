import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import { SystemMessage } from 'langchain/schema';
import { PromptTemplate } from 'langchain/prompts';
// import { PromptTemplate } from '../../prompts/prompt.js';

// この例では、ドキュメントのセットを要約するために特にプロンプトされた `MapReduceDocumentsChain` を使用します。
const text = fs.readFileSync('state_of_the_union.txt', 'utf8');
const model = new OpenAI({
    openAIApiKey: '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',
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// この便利な関数は、ドキュメントのセットを要約するためにプロンプトされたドキュメントチェーンを作成します。
const prompt = new PromptTemplate({
    inputVariables: ['text'],
    template: `
    あなたは以下のドキュメントを要約してください。その際に各トピックについてできる限り多くの情報を含めてください。:
    "{text}"
    ---
    要約:
    `,
});
const chain = loadSummarizationChain(model, {
    type: 'map_reduce',
    combineMapPrompt: prompt,
    combinePrompt: prompt,
    reducePrompt: prompt,
});
const res = await chain.call({
    question: new SystemMessage(''),
    input_documents: docs,
});
console.log(res.text);
