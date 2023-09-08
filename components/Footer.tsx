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
                        AIを便利に使おう！
                    </Link>
                    <p className="pt-2 text-sm text-white">製作者：root-5</p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 w-full max-w-sm ">
                    <Link href="./summary" className="text-white">
                        文章要約
                    </Link>
                    <Link href="./document" className="text-white">
                        文書作成
                    </Link>
                    <Link href="./" className="text-white">
                        リンク
                    </Link>
                </div>
            </div>

            <p className="pt-16 pb-2 text-xs text-white text-center">Copyright © 2023 AIを便利に使おう！ by root-5</p>
        </footer>
    );
}
