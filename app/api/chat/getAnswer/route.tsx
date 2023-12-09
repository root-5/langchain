import { LangChainStream, StreamingTextResponse, experimental_StreamData } from 'ai';
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export const runtime = 'edge';

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();
    let reqMessages = body.messages;

    // reqMessagesの長さがmaxMessages以上の場合、最後のmaxMessages個を残して削除
    const maxMessages = 5;
    if (reqMessages.length > maxMessages) {
        reqMessages = reqMessages.slice(reqMessages.length - maxMessages, reqMessages.length);
    }

    // プロンプトを作成
    const prompt =
        PromptTemplate.fromTemplate(`以下の文章の流れを読んで、「AI」として続きをマークダウン形式で回答してください。
    ${reqMessages.map((m: { role: string; content: string }) => {
        if (m.role == 'user') {
            return `    User: ${m.content}\n`;
        } else {
            return `    AI: ${m.content}\n`;
        }
    })}
    AI: `);

    const model = new OpenAI({ temperature: 0, streaming: true });
    const chain = new LLMChain({ llm: model, prompt });
    const data = new experimental_StreamData();

    // ストリーミングで回答を返答
    const { stream, handlers } = LangChainStream({
        onFinal: () => {
            data.close();
        },
        experimental_streamData: true,
    });

    await chain.stream({ callbacks: [handlers] });

    return new StreamingTextResponse(stream, {}, data);
}
