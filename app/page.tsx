import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';
import { Metadata } from 'next';
import { OpenAI } from 'langchain/llms/openai';

const llm = new OpenAI({
    openAIApiKey: process.env.API_KEY,
    temperature: 0.9,
});

// "Feetful of Fun"

export const metadata: Metadata = {
    title: '大規模AI系便利ツール',
    description:
        'このサイトは「大規模AI系便利ツール- 倫理的に食べる」の非公式ファンサイトです。このサイトを見られた方のヴィーガンという概念を少しでも変えられたらと思っています。',
    referrer: 'origin-when-cross-origin',
    keywords: ['大規模AI系便利ツール'],
};

export default async function Page() {
    let result = 'テスト表示';
    // result = await llm.predict('What would be a good company name for a company that makes colorful socks?');
    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>大規模AI系便利ツール</Headline2>
            <Headline2>{result}</Headline2>
            {/* フォーム */}
        </main>
    );
}
