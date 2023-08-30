'use client';
import { useState } from 'react';
import Link from 'next/link';

export function Footer() {
    const [openMenu, setOpenMenu] = useState(false);
    const handleMenuOpen = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <footer className="mt-24 pt-12 bg-green-800">
            <div className="flex flex-wrap gap-12 w-11/12 max-w-6xl mx-auto justify-between">
                <div>
                    <Link href="./" className="text-xl text-white hover:before:scale-x-0">
                        大規模AI系便利ツール
                    </Link>
                    <p className="pt-2 text-sm text-white">非公式ファンサイト</p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 w-full max-w-sm ">
                    <Link href="./author" className="text-white">
                        ピーターシンガーについて
                    </Link>
                    <Link href="./dashboard" className="text-white">
                        リンク
                    </Link>
                    <Link href="./dashboard" className="text-white">
                        リンク
                    </Link>
                </div>
            </div>

            <p className="pt-16 pb-2 text-xs text-white text-center">
                Copyright © 2023 大規模AI系便利ツール 非公式ファンサイト
            </p>
        </footer>
    );
}
