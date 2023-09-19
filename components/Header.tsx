'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { pagesData } from '../components/data/pagesData';

export function Header() {
    //====================================================================
    // ==== ステートの宣言 ====
    const [openMenu, setOpenMenu] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    // ハンバーガーメニューの開閉
    const handleMenuOpen = () => {
        setOpenMenu(!openMenu);
    };

    // 画面幅に応じてハンバーガーメニューの表示を切り替える、1000px以上の場合は常に表示
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 1330) {
                setOpenMenu(true);
            } else {
                setOpenMenu(false);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return;
    }, []);

    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page, i) => (
        <li key={i} className="">
            <Link href={'./' + page.link} className="py-2 w-fit text-white">
                {page.name}
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <header className="fixed top-0 w-full py-4 bg-white z-50 dark:bg-stone-950">
            <div className="relative flex w-11/12 max-w-4xl mx-auto gap-6">
                <button onClick={handleMenuOpen} hidden={openMenu} type="button" className="z-10 space-y-2">
                    <div
                        className={
                            openMenu
                                ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 translate-y-2.5 rotate-45'
                                : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 opacity-0'
                                : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 -translate-y-2.5 -rotate-45'
                                : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                        }
                    />
                </button>
                <Link href="./" className="hover:before:scale-x-0">
                    <h1 className="text-xl">AIを便利に使おう！</h1>
                </Link>

                <nav
                    className={
                        openMenu
                            ? 'text-left fixed bg-green-800 dark:bg-stone-950 left-0 top-0 w-9/12 sm:w-[200px] h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                            : 'text-left fixed bg-green-800 dark:bg-stone-950 left-[-100%] top-0 w-9/12 sm:w-[200px] h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                    }
                >
                    <button onClick={handleMenuOpen} type="button" className="block w-fit z-10 space-y-2">
                        <div
                            className={
                                openMenu
                                    ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 translate-y-2.5 rotate-45'
                                    : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                            }
                        />
                        <div
                            className={
                                openMenu
                                    ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 opacity-0'
                                    : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                            }
                        />
                        <div
                            className={
                                openMenu
                                    ? 'w-6 h-0.5 bg-white dark:bg-white duration-700 -translate-y-2.5 -rotate-45'
                                    : 'w-6 h-0.5 bg-gray-600 dark:bg-white duration-700'
                            }
                        />
                    </button>
                    <ul className="mt-6">{linkItems}</ul>
                </nav>
            </div>
        </header>
    );
}
