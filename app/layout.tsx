import './globals.css';
import type { Metadata } from 'next';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
    title: 'AIを便利に使おう！',
    description:
        'このサイトは「AIを便利に使おう！- 倫理的に食べる」の非公式ファンサイトです。このサイトを見られた方のヴィーガンという概念を少しでも変えられたらと思っています。',
    openGraph: {
        images: 'img/FV.jpg',
    },
    referrer: 'origin-when-cross-origin',
    keywords: [
        'AIを便利に使おう！',
        'ヴィーガン',
        'ピーター・シンガー',
        '倫理的に食べる',
        'Why Vegan?',
        '児玉聡',
        '林和雄',
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="jp">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="css/top.css" />
            </head>
            <body className="font-gothic">
                <Header />
                {children}
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
