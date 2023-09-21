import { NextResponse } from 'next/server';
import * as deepl from 'deepl-node';

// DeepLのモデルを作成
const authKey = process.env.DEEPL_API_KEY;
if (authKey === undefined) throw new Error('DEEPL_API_KEY is not defined');
const translator = new deepl.Translator(authKey);

export async function POST(req: Request) {
    // リクエストから質問部分を取得
    const body = await req.json();

    const reqText: string = body.text;
    const reqLanguage = body.language;

    try {
        // DeepLへリクエストを送信
        const res: deepl.TextResult = await translator.translateText(reqText, null, reqLanguage);
        return NextResponse.json({ result: res.text });
    } catch (error) {
        return NextResponse.json({ result: error });
    }
}
