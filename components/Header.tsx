'use client';
import React from 'react';
import Link from 'next/link';

export function Header(props: { isOpen: boolean; humbergurBtnFunc: () => void; hidden?: boolean }) {
    return (
        <>
            <header
                hidden={props.hidden}
                className="fixed top-0 w-full py-2 md:py-2 bg-green-800 z-50 dark:bg-stone-950"
            >
                <div className="relative flex pl-4 mx-auto gap-3 md:gap-4">
                    <button
                        onClick={() => props.humbergurBtnFunc()}
                        type="button"
                        className="z-10 space-y-1"
                    >
                        <div
                            className={
                                props.isOpen
                                    ? 'w-4 md:w-5 h-0.5 bg-white duration-300 translate-y-1.5 md:translate-y-0 rotate-45 md:rotate-0'
                                    : 'w-4 md:w-5 h-0.5 bg-white duration-300'
                            }
                        />
                        <div
                            className={
                                props.isOpen
                                    ? 'w-4 md:w-5 h-0.5 bg-white duration-300 opacity-0 md:opacity-100'
                                    : 'w-4 md:w-5 h-0.5 bg-white duration-300'
                            }
                        />
                        <div
                            className={
                                props.isOpen
                                    ? 'w-4 md:w-5 h-0.5 bg-white duration-300 -translate-y-1.5 md:translate-y-0 -rotate-45 md:rotate-0'
                                    : 'w-4 md:w-5 h-0.5 bg-white duration-300'
                            }
                        />
                    </button>
                    <Link href="./" className="text-white hover:before:scale-x-0">
                        <h1 className="text-lg md:text-lg">AIを便利に使おう！</h1>
                    </Link>
                </div>
            </header>
            <div hidden={props.hidden} className="h-11 md:h-11"></div>
        </>
    );
}
