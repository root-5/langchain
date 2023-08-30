import Link from 'next/link';
import Image from 'next/image';
import { Headline2 } from '../components/Headline2';
import { Metadata } from 'next';
import { OpenAI } from 'langchain/llms/openai';

const llm = new OpenAI({
    openAIApiKey: 'YOUR_KEY_HERE',
});

export const metadata: Metadata = {
    title: '大規模AI系便利ツール',
    description:
        'このサイトは「大規模AI系便利ツール- 倫理的に食べる」の非公式ファンサイトです。このサイトを見られた方のヴィーガンという概念を少しでも変えられたらと思っています。',
    openGraph: {
        images: 'img/FV.jpg',
    },
    referrer: 'origin-when-cross-origin',
    keywords: [
        '大規模AI系便利ツール',
    ],
};

export default function Page() {
    return (
        <main className="max-w-5xl w-11/12 mx-auto pt-14">
            <Headline2>大規模AI系便利ツール</Headline2>
            {/* フォーム */}
        </main>
    );
}
