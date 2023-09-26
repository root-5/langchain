'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pagesData } from '../components/data/pagesData';

export function Footer(props: { hidden?: boolean }) {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isSpMode, setIsSpMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    //====================================================================
    // ==== メソッド ====
    // ハンバーガーメニューの開閉
    function menuOpenToggle() {
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
        <Link key={i} onClick={menuOpenToggle} href={'./' + page.link} className="block w-fit">
            {page.name}
        </Link>
    ));

    //====================================================================
    // ==== レンダリング ====
    if (isSpMode) {
        return (
            <footer hidden={props.hidden} className="fixed bottom-0 left-0 w-full z-20 bg-green-800 dark:bg-stone-950">
                <div
                    className={
                        isMenuOpen
                            ? 'flex p-3 gap-x-8 gap-y-1 flex-wrap items-center justify-center text-white bg-green-700 dark:bg-stone-800'
                            : 'hidden'
                    }
                >
                    {linkItems}
                </div>
                <div className="flex w-full">
                    <Link href="./" className="flex py-1.5 w-2/4 item-center justify-center text-lg text-white">
                        /
                    </Link>
                    <div
                        onClick={menuOpenToggle}
                        className="flex py-1.5 w-2/4 item-center justify-center text-lg text-white hover:cursor-pointer"
                    >
                        三
                    </div>
                </div>
            </footer>
        );
    } else {
        return (
            <footer
                hidden={props.hidden}
                className="fixed bottom-0 left-0 pl-4 py-2.5 w-full z-20 bg-green-800 dark:bg-stone-950"
            >
                <div className="flex items-center gap-10 ">
                    <Link href="./" className="block w-fit hover:before:scale-x-0 text-white">
                        AIを便利に使おう！
                    </Link>
                    <p className="text-xs text-white text-center">
                        Copyright © 2023 AIを便利に使おう！ powered by GPT-3.5
                    </p>
                    <Link href="https://github.com/" className="block w-fit hover:before:scale-x-0 text-white text-xs">
                        GitHub
                    </Link>
                </div>
            </footer>
        );
    }
}
