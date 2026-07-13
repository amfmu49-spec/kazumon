# fraction-rpg Project Rules

## スマホ向けWebゲームのレイアウト制約 (Mobile-First Flexbox Layouts)
- フルスクリーンのスマホ向けUIを構築する際は、大枠のコンテナを `100dvh` および `overflow: hidden` とすること。
- 画面中央の画像（キャラクターなど）エリアには必ず `flex: 1; min-height: 0;` を設定し、画像自体に `height: 100%; object-fit: contain;` を指定すること。これにより、上下のUIを固定したまま、中央の画像を画面サイズに合わせて自動縮小させることができる。
- タップ操作するボタンは、十分なパディング（縦幅）を確保し、モバイルでの押し間違いを防ぐ適切な余白を持たせること。

## Firebase v9+ と Vite のインポート制約 (Firebase ES Modules in Vite)
- Vite環境でFirebaseを使用する場合、`initializeApp` 以外のFirestore関連関数（`getDocs`, `collection`, `addDoc` 等）は必ず `firebase/firestore` からインポートすること。(`firebase/app`からはインポートしない)
- モックや環境切り替えの際に、ESモジュール環境（Vite）においてCommonJSの `require()` を使った動的読み込みは避けること。

## ゲーム音声とカスタム音源の競合防止 (Audio Mixing Guidelines)
- ユーザーが独自の音声ファイル（MP3等）を追加・指定した場合、同じタイミングで発火する既存の合成音やデフォルトの効果音は、再生が重複（被り）しないように必ずコメントアウトするか削除すること。
