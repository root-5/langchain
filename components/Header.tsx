'use client';
import Link from 'next/link';

export function Header(props: { isOpen: boolean; humbergurBtnFunc: () => void }) {
    return (
        <header className="fixed top-0 w-full py-4 bg-green-800 z-50 dark:bg-stone-950">
            <div className="relative flex pl-4 max-w-7xl mx-auto gap-6">
                <button onClick={() => props.humbergurBtnFunc()} type="button" className="z-10 space-y-2">
                    <div
                        className={
                            props.isOpen
                                ? 'w-6 h-0.5 bg-white duration-300 translate-y-2.5 md:translate-y-0 rotate-45 md:rotate-0'
                                : 'w-6 h-0.5 bg-white duration-300'
                        }
                    />
                    <div
                        className={
                            props.isOpen
                                ? 'w-6 h-0.5 bg-white duration-300 opacity-0 md:opacity-100'
                                : 'w-6 h-0.5 bg-white duration-300'
                        }
                    />
                    <div
                        className={
                            props.isOpen
                                ? 'w-6 h-0.5 bg-white duration-300 -translate-y-2.5 md:translate-y-0 -rotate-45 md:rotate-0'
                                : 'w-6 h-0.5 bg-white duration-300'
                        }
                    />
                </button>
                <Link href="./" className="text-white hover:before:scale-x-0">
                    <h1 className="text-xl">AIを便利に使おう！</h1>
                </Link>
            </div>
        </header>
    );
}
