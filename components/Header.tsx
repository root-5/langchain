'use client';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const handleMenuOpen = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <header className="fixed top-0 w-full py-4 bg-white z-50">
            <div className="flex w-11/12 max-w-6xl mx-auto justify-between">
                <Link href="./" className="hover:before:scale-x-0">
                    <h1 className="text-xl text-gray-900">AIを便利に使おう！</h1>
                </Link>

                <button onClick={handleMenuOpen} type="button" className="z-10 space-y-2">
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white duration-700 translate-y-2.5 rotate-45'
                                : 'w-8 h-0.5 bg-gray-600 duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white duration-700 opacity-0'
                                : 'w-8 h-0.5 bg-gray-600 duration-700'
                        }
                    />
                    <div
                        className={
                            openMenu
                                ? 'w-8 h-0.5 bg-white duration-700 -translate-y-2.5 -rotate-45'
                                : 'w-8 h-0.5 bg-gray-600 duration-700'
                        }
                    />
                </button>

                <nav
                    className={
                        openMenu
                            ? 'text-left fixed bg-green-800 right-0 top-0 w-9/12 sm:w-5/12 h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                            : 'text-left fixed bg-green-800 right-[-100%] top-0 w-9/12 sm:w-5/12 h-screen flex flex-col justify-start pt-8 px-5 duration-700'
                    }
                >
                    <ul className="mt-6">
                        <li>
                            <Link href="./" className="py-2 w-fit text-xl text-white">
                                ホーム
                            </Link>
                        </li>
                        <li>
                            <Link href="./author" className="py-2 w-fit text-xl text-white">
                                ピーターシンガーについて
                            </Link>
                        </li>
                        <li>
                            <Link href="./dashboard" className="py-2 w-fit text-xl text-white">
                                リンク
                            </Link>
                        </li>
                        <li>
                            <Link href="./dashboard" className="py-2 w-fit text-xl text-white">
                                リンク
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
