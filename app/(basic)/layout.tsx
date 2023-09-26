'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Sidepanel } from '../../components/Sidepanel';

export default function BasicLayout({ children }: { children: React.ReactNode }) {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isOpen, setIsOpen] = useState(false);
    const [isZenn, setIsZenn] = useState(false);

    //====================================================================
    // ==== 処理 ====
    // ハンバーガーメニューの開閉
    const handleMenuOpen = () => {
        setIsOpen(!isOpen);
    };

    // 画面幅に応じてハンバーガーメニューの表示を切り替える、1000px以上の場合は常に表示
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return;
    }, []);

    //====================================================================
    // ==== レンダリング ====
    return (
        <div>
            <Header hidden={isZenn} isOpen={isOpen} humbergurBtnFunc={handleMenuOpen} />
            <div className="flex">
                <Sidepanel hidden={isZenn} isOpen={isOpen} setIsOpen={setIsOpen} />
                <div
                    id="mainpanel"
                    className={
                        !isZenn && isOpen ? 'relative w-full pb-12 ml-0 md:ml-[220px]' : 'relative w-full pb-12 ml-0'
                    }
                >
                    <div className="relative max-w-4xl w-11/12 mx-auto">
                        <button
                            id="zennBtn"
                            onClick={() => setIsZenn(!isZenn)}
                            data-zenn-status={isZenn}
                            className="absolute right-0 top-2 z-10 py-1 px-2 bg-blue-800 text-white rounded-md duration-300 opacity-40 hover:opacity-100 hover:bg-blue-600 hover:cursor-pointer"
                        >
                            Zenn
                        </button>
                        {children}
                    </div>
                </div>
            </div>
            <Footer hidden={isZenn} />
        </div>
    );
}
