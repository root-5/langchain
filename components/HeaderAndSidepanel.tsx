'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from '../components/Footer';
import { Sidepanel } from './Sidepanel';

export function HeaderAndSidepanel(props: { children: React.ReactNode }) {
    //====================================================================
    // ==== ステートの宣言 ====
    const [isOpen, setIsOpen] = useState(false);

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
        <>
            <Header isOpen={isOpen} humbergurBtnFunc={handleMenuOpen} />
            <div className="flex">
                <Sidepanel isOpen={isOpen} setIsOpen={setIsOpen} />
                <div id="mainpanel" className={isOpen ? 'w-full pb-12 ml-0 md:ml-[220px]' : 'w-full pb-12 ml-0'}>
                    {props.children}
                </div>
            </div>
            <Footer />
        </>
    );
}
