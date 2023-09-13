# 初期環境構築

1. `npm create next-app` yarn を利用して、コマンドを実行したフォルダ内に Nextjs のプロジェクトファイルを作成する。
2. `git remote add origin https://github.com/root-5/langchain.git`
3. `git push -u origin main`
4. `yarn` yarn 管理に切り替え
5. `yarn add langchain`

# vercel 関係

1. vercel 側から github のプロジェクトを追加
2. `yarn add @vercel/analytics` vercel アナリティクスの設定
3. `vercel deploy`

# DB 関係

1. vercel のダッシュボードで postgres をセットアップ
   https://zenn.dev/msy/articles/8d991c79b739aa
2. `vercel env pull .env` vercel 上から DB 関係の.env ファイルをプル
3. `yarn add @vercel/postgres`
4. `yarn add prisma @prisma/client`
5. prisma/schema.prisma に migration を定義
6. `npx prisma generate` prisma client への反映
7. package.json の"build"を"prisma generate && prisma db push && next build"に変更

# その他ライブラリ

1. `yarn add three @react-three/fiber @types/three` three.js
2. `yarn add react-syntax-highlighter` React-Syntaxhighlihter、のちに`yarn add --dev @types/react-syntax-highlighter`

# 本番環境

https://langchain-wine-six.vercel.app/

1. `yarn dev` 開発環境の実行
2. `yarn build` 本番環境のビルド（vercel を使っているため基本的に使用しない）
3. `yarn start` 本番環境の実行（vercel を使っているため基本的に使用しない）

# 注意点

-   vercel が読めなくなってしまうので、基本的に gitignore を追加で設定してはいけない

# ESLint

基本的にはこのサイトを元に作業してみた。
https://zenn.dev/crsc1206/articles/d92548257fb445

1. .eslintrc.json に`{"extends": "next/core-web-vitals"}`を記述
2. `next lint`

# git コメント

-   fix：バグ修正
-   add：新規ファイル、新規機能追加
-   update：機能修正（バグではない）
-   remove：削除（ファイル）
-   little：軽微な修正（コメント付与、変数名変更など）

# 現在の方針

1. 仕事をやる上で便利なサイトにする
2. 他の人も一部使えるように
3. three.js などのテスト実装も行う

# ホワイトボード

" 入力後、ホワイトボード以外をクリックすると入力内容が勝手にデータベースに保存されます。
" =================================================
" >>バグ報告など
"
"
" =================================================
" >>更新履歴
" 2023/09/14 データフォーマット機能を追加
" 2023/09/13 ダークモード追加、コーディング補助機能を追加
" 2023/09/12 トップにホワイトボードを追加
