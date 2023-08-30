# 環境構築

1. `npm create next-app` yarn を利用して、コマンドを実行したフォルダ内に Nextjs のプロジェクトファイルを作成する。
2. `git remote add origin https://github.com/root-5/langchain.git`
3. `git push -u origin main`
4. `yarn dev` 開発環境の実行

# 本番環境

1. `yarn build` 本番環境のビルド
2. `yarn start` 本番環境の実行

# 注意点

-   versel が読めなくなってしまうので、gitignore を追加で設定してはいけない

# ESLint

基本的にはこのサイトを元に作業してみた。
https://zenn.dev/crsc1206/articles/d92548257fb445

1. .eslintrc.json に`{"extends": "next/core-web-vitals"}`を記述
2. `next lint`

# 試すべきこと

-   propsでの関数渡し
-
