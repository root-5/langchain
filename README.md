# 環境構築

1. `npm create next-app` yarn を利用して、コマンドを実行したフォルダ内に Nextjs のプロジェクトファイルを作成する。
2. `git remote add origin https://github.com/root-5/langchain.git`
3. `git push -u origin main`
4. `yarn` yarn 管理に切り替え
5. `yarn add langchain`
6. versel 側から github のプロジェクトを追加
7. `yarn add @vercel/analytics`
8. `vercel deploy`

# 本番環境

https://langchain-wine-six.vercel.app/

1. `yarn dev` 開発環境の実行
2. `yarn build` 本番環境のビルド（versel を使っているため基本的に使用しない）
3. `yarn start` 本番環境の実行（versel を使っているため基本的に使用しない）

# 注意点

-   versel が読めなくなってしまうので、gitignore を追加で設定してはいけない

# ESLint

基本的にはこのサイトを元に作業してみた。
https://zenn.dev/crsc1206/articles/d92548257fb445

1. .eslintrc.json に`{"extends": "next/core-web-vitals"}`を記述
2. `next lint`

# 試すべきこと

-   props での関数渡し
-   マークダウンで構造化した要約の作成
