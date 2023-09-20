'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pagesData } from '../components/data/pagesData';

export function Footer() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isSpMode, setIsSpMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    //====================================================================
    // ==== メソッド ====
    // ハンバーガーメニューの開閉
    function menuOpen() {
        setIsMenuOpen(!isMenuOpen);
    }

    // 画面幅に応じてハンバーガーメニューの表示を切り替える、1000px以上の場合は常に表示
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 768) {
                setIsSpMode(false);
            } else {
                setIsSpMode(true);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return;
    }, []);

    //====================================================================
    // ==== ナビゲーションパーツの生成 ====
    const linkItems = pagesData.map((page, i) => (
        <Link key={i} href={'./' + page.link} className="block my-2 py-1 w-fit">
            {page.name}
        </Link>
    ));

    //====================================================================
    // ==== レンダリング ====
    if (isSpMode) {
        return (
            <footer className="fixed bottom-0 left-0 w-full z-20 bg-green-800 dark:bg-stone-950">
                <div
                    className={isMenuOpen ? 'flex p-2 gap-x-8 gap-y-0 flex-wrap items-center justify-center' : 'hidden'}
                >
                    {linkItems}
                </div>
                <div className="flex w-full">
                    <Link href="./" className="flex py-5 w-2/4 item-center justify-center text-xl">
                        /
                    </Link>
                    <div
                        onClick={menuOpen}
                        className="flex py-5 w-2/4 item-center justify-center text-xl hover:cursor-pointer"
                    >
                        三
                    </div>
                </div>
            </footer>
        );
    } else {
        return (
            <footer className="fixed bottom-0 left-0 py-1 w-full z-20 bg-green-800 dark:bg-stone-950">
                <Link
                    href="./"
                    className="flex mx-auto py-1 w-fit item-center justify-center text-lg hover:before:scale-x-0"
                >
                    AIを便利に使おう！
                </Link>
                <p className="py-1 text-xs text-white text-center">Copyright © 2023 AIを便利に使おう！ by root-5</p>
            </footer>
        );
    }
}
