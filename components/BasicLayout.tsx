'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidepanel } from './Sidepanel';

export function BasicLayout(props: { children: React.ReactNode; hidden?: boolean }) {
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
        <div>
            <Header hidden={props.hidden} isOpen={isOpen} humbergurBtnFunc={handleMenuOpen} />
            <div className="flex">
                <Sidepanel hidden={props.hidden} isOpen={isOpen} setIsOpen={setIsOpen} />
                <div
                    id="mainpanel"
                    className={
                        !props.hidden && isOpen
                            ? 'relative w-full pb-12 ml-0 md:ml-[220px]'
                            : 'relative w-full pb-12 ml-0'
                    }
                >
                    {props.children}
                </div>
            </div>
            <Footer hidden={props.hidden} />
        </div>
    );
}
