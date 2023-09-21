import React from 'react';
import Link from 'next/link';
import { pagesData } from './data/pagesData';

export function Sidepanel(props: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
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
            className={
                props.isOpen
                    ? 'w-[220px] h-full bg-green-700 z-10 duration-300 dark:bg-stone-800 fixed left-0'
                    : 'w-[220px] h-full bg-green-700 z-10 duration-300 dark:bg-stone-800 fixed left-[-220px]'
            }
        >
            <div
                className="ml-2 mt-2 w-8 h-8 flex justify-center items-center mr-4 text-3xl text-white font-extralight cursor-pointer"
                onClick={() => props.setIsOpen(!props.isOpen)}
            >
                ×
            </div>
            <div className="flex flex-col pl-4 h-full">
                <ul className="mt-6">{linkItems}</ul>
            </div>
        </div>
    );
}
