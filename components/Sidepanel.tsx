import React from 'react';
import Link from 'next/link';
import { pagesData } from './data/pagesData';

export function Sidepanel(props: {
    hidden?: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page, i) => (
        <li key={i} className="">
            <Link href={'./' + page.link} className="my-2 py-1 w-fit text-white">
                {page.name}
            </Link>
        </li>
    ));
    return (
        <div
            id="sidepanel"
            hidden={props.hidden}
            className={
                props.isOpen
                    ? 'w-[220px] h-full bg-green-700 z-10 dark:bg-stone-800 fixed left-0'
                    : 'w-[220px] h-full bg-green-700 z-10 dark:bg-stone-800 fixed left-[-220px]'
            }
        >
            <div className="flex flex-col pl-4 h-full">
                <ul className="mt-2">{linkItems}</ul>
            </div>
        </div>
    );
}
