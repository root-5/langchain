'use client';
import { useState } from 'react';
import Link from 'next/link';
import { pagesData } from '../components/data/pagesData';

export function Header() {
    //====================================================================
    // ==== ハンバーガーメニューのステートと処理 ====
    const [openMenu, setOpenMenu] = useState(false);
    const handleMenuOpen = () => {
        setOpenMenu(!openMenu);
    };

    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page) => (
        <li key={page.key} className="mt-2">
            <Link href={'./' + page.link} className="py-2 w-fit text-xl text-white">
                {page.name}
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <header className="fixed top-0 w-full py-4 bg-white z-50 dark:bg-stone-950">
            <div className="flex w-11/12 max-w-6xl mx-auto justify-between">
                <Link href="./" className="hover:before:scale-x-0">
                    <h1 className="text-xl">AIを便利に使おう！</h1>
                </Link>

                <button onClick={handleMenuOpen} type="button" className="z-10 space-y-2">
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white dark:bg-white duration-700 translate-y-2.5 rotate-45'
                                : 'w-8 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white dark:bg-white duration-700 opacity-0'
                                : 'w-8 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white dark:bg-white duration-700 -translate-y-2.5 -rotate-45'
                                : 'w-8 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                </button>

                <nav
                    className={
                        openMenu
                            ? 'text-left fixed bg-green-800 dark:bg-stone-950 right-0 top-0 w-9/12 sm:w-5/12 h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                            : 'text-left fixed bg-green-800 dark:bg-stone-950 right-[-100%] top-0 w-9/12 sm:w-5/12 h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                    }
                >
                    <ul className="mt-6">{linkItems}</ul>
                </nav>
            </div>
        </header>
    );
}
