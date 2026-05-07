# DB Migration Roadmap

## このドキュメントの目的

このドキュメントは、Teyvat EliteDB / elite-run-db を、モックデータ中心のUIプロトタイプから、将来的にSupabase/PostgreSQLを用いたDB連携アプリへ移行するための段階的な方針を記録するものです。

現時点ではDB化を実装しません。
このドキュメントは、将来DB化をCodex等のAIエージェントに依頼する際に、既存UIの思想を壊さず、安全に移行するための参照資料として使います。

## 現時点の前提

- 現在の主目的はUI/UXプロトタイプの品質を高めること
- DB化はまだ行わない
- Supabase接続もまだ行わない
- 既存のモックデータとUIを壊さない
- DB化時も、既存UIをDB都合で簡略化しない
- DB化は一気に行わず、小さな段階に分けて進める

## 基本方針

- UI表示用の型とDB保存用の型を分ける
- UI表示用の `RunRecord` をそのままDBテーブル設計にしない
- DB保存用の型からUI表示用の型へ変換するadapterを作る
- `mockRuns` は当面残す
- 最初から全画面をDB対応しない
- 最初はランキング一覧など、影響範囲が小さい場所からDB取得に差し替える
- 投稿、詳細、Library検索は段階的にDB対応する

## ドメイン設計上の重要方針

### tagsを万能分類として使わない

`tags` には何でも入れないでください。

以下は `tags` ではなく、構造化データとして扱います。

- `platform`
- `ruleset`
- `category`
- `season`
- `version`
- `characters`
- `weapons`
- `main_attackers`
- `cost`
- `bracket`
- `WR`
- ランキング順位

`tags` は以下のような、検索補助・文脈補助・任意ラベルに限定します。

- `OffMeta`
- `low_cost`
- `beginner_friendly`
- `stable_route`
- `reference`
- `experimental`
- `route_note`

キャラ名、武器名、端末、カテゴリ、バージョン、WR、順位はタグにしないでください。

### WRや順位は保存値にしない

`WR` やランキング順位は、記録に固定保存する値ではありません。
ランキング条件に基づいて集計した結果として表示します。

DBに `is_wr` のような固定値を持たせると、記録追加や条件変更のたびに整合性が崩れます。

### main attackerは自動推定しない

`main attacker` はpartyの先頭キャラやDPSっぽいキャラから自動推定しないでください。

このプロジェクトでは、メインアタッカー分類は自己申告を正とします。
投稿時の `mainAttackerIds` を正として、DBでは `run_main_attackers` のような中間テーブルで保存します。

通常は1人、マルチや特殊な記録では複数人を許可します。

### cost / bracketはスナップショットとして保存する

`cost` や `bracket` は派生値ですが、投稿時点のスナップショットとしてDBに保存します。

同時に `cost_rule_version` を保存します。

理由は、将来的にコスト計算ルールが変わった場合でも、当時の分類を再現できるようにするためです。

## Migration Tasks

### Task 1: DB保存用の型だけ作る

Supabase接続はまだしません。

既存UI型を壊さず、DB保存用のtypeを追加します。

想定する型:

- `DbRecord`
- `DbRunMember`
- `DbRunMainAttacker`
- `DbTag`
- `DbRunTag`
- `DbRecordCostSnapshot`

目的は、UI表示用データとDB保存用データを分離することです。

この段階では、既存画面の表示はまだ `mockRuns` のままでよいです。

### Task 2: mockRunsをDB保存形式へ変換するadapterを作る

`mockRuns` を `DbRecordPayload` に変換するadapterを作ります。

この段階では、UI側はまだ `mockRuns` 表示のままにします。

目的は、DB接続前に「現在のモックデータをDB保存形に落とし込めるか」を確認することです。

想定するadapter:

- `mockRunToDbPayload`
- `dbPayloadToRunRecord`

このadapterによって、将来DB取得へ差し替えるときの影響範囲を小さくします。

### Task 3: Supabase migrationを作る

この段階で初めてSupabase/PostgreSQL用のmigrationを作成します。

想定テーブル:

- `records`
- `run_members`
- `run_main_attackers`
- `tags`
- `run_tags`
- `record_cost_snapshots`

必要に応じて、以下も検討します。

- `runners`
- `characters`
- `weapons`
- `rulesets`
- `platforms`

最初から全てを正規化しすぎず、既存UIの移行に必要な最小構成から始めます。

### Task 4: ランキング一覧だけDB取得に差し替える

ランキング一覧だけDB取得に差し替えます。

投稿・詳細・Libraryはまだmockのままでよいです。

目的は、DB取得の最小ループを作り、既存UIとの接続リスクを確認することです。

この段階で確認すること:

- `time_ms` によるランキング順ソート
- `ruleset` ごとのランキング切り替え
- `main_attackers` によるキャラTOP表示
- `cost` / `bracket` の表示
- 既存UIの見た目が崩れないこと

### Task 5: 投稿フォームのsubmitをDB insertに差し替える

投稿フォームのsubmitをDB insertに差し替えます。

`localStorage` のdraft保存は残します。

目的は、投稿された記録がDBに入り、ランキングに反映される最小ループを作ることです。

この段階でDBに保存するもの:

- 記録本体
- 走者情報
- タイム
- 動画URL
- 編成スロット
- 武器
- 凸
- 精錬
- 自己申告メインアタッカー
- タグ
- cost / bracket snapshot

### Task 6: 詳細ページをDB取得に差し替える

記録詳細ページをDBの1件取得に差し替えます。

目的は、一覧から詳細まで同じDBデータでつながる状態を作ることです。

この段階で確認すること:

- 一覧から詳細へ遷移できる
- 詳細ページがDBの1件を正しく表示できる
- 編成、武器、凸、精錬、メインアタッカーが正しく対応する
- 動画URLやメモが表示できる
- 既存の詳細UIの見た目を壊さない

### Task 7: Library検索をDB取得 + フロント後処理に分ける

Library検索を以下の2段階に分けます。

1. DB側で大きく絞り込む
2. フロント側で検索補助・類似度・表示用フィルタを後処理する

DB側で絞り込む候補:

- `ruleset`
- `category`
- `season`
- `version`
- `platform`
- `main_attackers`
- `party characters`
- `bracket`
- `time range`

フロント側で後処理してよい候補:

- 表示用タグ
- 簡易キーワード
- 類似記録スコア
- UI上の補助的な並び替え

目的は、複雑な検索UIをいきなり全てSQL化せず、段階的にDB対応することです。

## 初期DB化でやらないこと

初期DB化では以下をやらないでください。

- Next.jsへの移行
- 大規模なディレクトリ再設計
- 既存UIの簡略化
- すべての画面の一括DB化
- いいね、コメント、閲覧履歴、検索履歴の永続化
- 認証機能の本格導入
- 管理者画面の本格実装
- tagsへの全属性詰め込み
- main attackerの自動推定
- WRの固定保存

## 将来の注意事項

DB化を進めるときは、実装前に必ず以下を確認してください。

- 公式ランキング画面とLibrary検索画面の責務が混ざっていないか
- タグが万能分類になっていないか
- キャラ、武器、端末、カテゴリ、バージョンをタグにしていないか
- メインアタッカーをpartyから推定していないか
- cost / bracket のルールバージョンを保持しているか
- UI表示用の都合をそのままDB設計にしていないか
- DB都合で既存UIを壊していないか

## このドキュメントの扱い

このドキュメントは、将来のDB化作業のためのロードマップです。

現時点でこの内容をすべて実装する必要はありません。
DB化を開始する段階で、このドキュメントを参照しながら、Task 1から順に小さく進めてください。
