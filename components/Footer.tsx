import Link from 'next/link';
import { pagesData } from '../components/data/pagesData';

export function Footer() {
    //====================================================================
    // ==== 機能一覧パーツを生成 ====
    const linkItems = pagesData.map((page, i) => (
        <li key={i}>
            <Link href={'./' + page.link} className="py-2 w-fit text-white">
                {page.name}
            </Link>
        </li>
    ));

    //====================================================================
    // ==== レンダリング ====
    return (
        <footer className="mt-24 pt-12 bg-green-800 dark:bg-stone-950">
            <div className="flex flex-wrap gap-12 w-11/12 max-w-6xl mx-auto justify-between">
                <div>
                    <Link href="./" className="text-xl text-white hover:before:scale-x-0">
                        AIを便利に使おう！
                    </Link>
                    <p className="pt-2 text-sm text-white">製作者：root-5</p>
                </div>

                <ul className="flex flex-wrap gap-x-8 gap-y-4 w-full max-w-sm ">{linkItems}</ul>
            </div>

            <p className="pt-16 pb-2 text-xs text-white text-center">Copyright © 2023 AIを便利に使おう！ by root-5</p>
        </footer>
    );
}
