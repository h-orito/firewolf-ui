# Project Overview

## Purpose

FIREWOLFは、howling-wolf-uiから派生した人狼ゲームが無料で遊べるサービスです。ユーザーが自由に村を作成できるWebアプリケーションです。

## Tech Stack

- **Framework**: Nuxt.js 2.x (SPA mode)
- **Language**: TypeScript
- **UI Library**: Buefy (Bulma based)
- **CSS Preprocessor**: SASS/SCSS
- **Package Manager**: npm
- **Backend API**: firewolf-api (別リポジトリ)
- **Authentication**: Firebase
- **State Management**: Vuex + Vuexfire
- **Build Tool**: Nuxt TypeScript Build

## Architecture

- SPAモード
- Vue.js + Nuxt.jsベースのフロントエンド
- APIサーバーは別リポジトリ(firewolf-api)として分離
- Firebaseを使用した認証とリアルタイムデータ管理
- PWA対応（Service Workerを使用）

## Environment

- Node.js環境で動作
- ローカル開発用ポート: 3000
- APIのベースURL: http://localhost:8087/firewolf (開発環境)
