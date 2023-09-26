// モードに関わるデータ
export const modeData = [
    {
        name: 'generate',
        text: 'コードの生成',
        placeholder:
            '生成したい処理の内容を入力してください\n\n例: \n1. 今年の1月1日から今日までの日数を取得する\n2. 取得した日数をconsole.logで出力する',
    },
    {
        name: 'explain',
        text: 'コードの解説',
        placeholder: '解説してほしいコードを入力してください\n\n例: \nRange("A1:B2").Value',
    },
    {
        name: 'fix',
        text: 'コードの修正',
        placeholder: '修正してほしいコードを入力してください\n\n例: \nRange(A1:B2).Value',
    },
    {
        name: 'error',
        text: 'エラーの解説',
        placeholder:
            '解説してほしいエラーを入力してください\n\n例: \nインデックスが有効範囲にありません。：実行時エラー9',
    },
    {
        name: 'comment',
        text: 'コメントの挿入',
        placeholder: 'コメントを挿入してほしいコードを入力してください',
    },
];

// ドキュメント一覧
export const docData = [
    {
        name: 'JavaScript',
        link: 'https://developer.mozilla.org/ja/docs/Web/JavaScript',
        isLang: true,
    },
    {
        name: 'TypeScript',
        link: 'https://www.typescriptlang.org/docs/',
        isLang: true,
    },
    {
        name: 'Python',
        link: 'https://docs.python.org/ja/3/',
        isLang: true,
    },
    {
        name: 'HTML',
        link: 'https://developer.mozilla.org/ja/docs/Web/HTML',
        isLang: true,
    },
    {
        name: 'CSS',
        link: 'https://developer.mozilla.org/ja/docs/Web/CSS',
        isLang: true,
    },
    {
        name: 'PHP',
        link: 'https://www.php.net/manual/ja/index.php',
        isLang: true,
    },
    {
        name: 'Ruby',
        link: 'https://www.ruby-lang.org/ja/documentation/',
        isLang: true,
    },
    {
        name: 'VBA',
        link: 'https://learn.microsoft.com/ja-jp/office/vba/api/overview/excel',
        isLang: true,
    },
    {
        name: 'Tailwindcss',
        link: 'https://tailwindcss.com/docs/installation',
        isLang: false,
    },
    {
        name: 'React',
        link: 'https://ja.react.dev/learn',
        isLang: false,
    },
    {
        name: 'Next.js',
        link: 'https://nextjs.org/docs',
        isLang: false,
    },
    {
        name: 'LangChain',
        link: 'https://js.langchain.com/docs/get_started/introduction/',
        isLang: false,
    },
    {
        name: 'GitHub',
        link: 'https://github.com/',
        isLang: false,
    },
    {
        name: 'Notion',
        link: 'https://www.notion.so/',
        isLang: false,
    },
    {
        name: 'MyApp',
        link: './',
        isLang: false,
    },
];
