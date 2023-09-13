import './globals.css';
import type { Metadata } from 'next';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
    title: 'AIを便利に使おう！',
    description:
        'このサイトは「AIを便利に使おう！」をスローガンとして作成されました。皆が使いやすいアプリを手軽に提供していく予定です。',
    openGraph: {
        images: 'img/leaf.png',
    },
    referrer: 'origin-when-cross-origin',
    keywords: ['AIを便利に使おう！', 'アプリ', '使いやすい', '文章要約'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="jp">
            <head>
                <meta name="robots" content="noindex" />
                <link rel="icon" href="img/favicon.ico" />
                <link rel="stylesheet" href="css/top.css" />
            </head>
            <body className="font-gothic text-gray-900 text-sm lg:text-base dark:bg-neutral-950 dark:text-white">
                <Header />
                {children}
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
