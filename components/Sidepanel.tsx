import React from 'react';
import Link from 'next/link';
import { pagesData } from './data/pagesData';

export function Sidepanel(props: { isOpen: boolean }) {
    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page, i) => (
        <li key={i} className="">
            <Link href={'./' + page.link} className="my-2 py-1 w-fit">
                {page.name}
            </Link>
        </li>
    ));
    return (
        <div
            id="sidepanel"
            className={
                props.isOpen
                    ? 'w-[220px] h-full bg-green-100 z-10 duration-300 dark:bg-stone-800 fixed left-0'
                    : 'w-[220px] h-full bg-green-100 z-10 duration-300 dark:bg-stone-800 fixed left-[-220px]'
            }
        >
            <div className="flex flex-col pl-4 h-full">
                <ul className="mt-16">{linkItems}</ul>
            </div>
        </div>
    );
}
