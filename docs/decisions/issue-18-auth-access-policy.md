# Issue #18 認証・権限方針メモ

- Status: Working decisions for [#18](https://github.com/Anotokinotori/elite-run-db/issues/18)
- Related Issues: [#12](https://github.com/Anotokinotori/elite-run-db/issues/12), [#18](https://github.com/Anotokinotori/elite-run-db/issues/18), [#19](https://github.com/Anotokinotori/elite-run-db/issues/19), [#20](https://github.com/Anotokinotori/elite-run-db/issues/20)
- Note: `Supabase` はこの文書では security-first の `working assumption` として扱う。採用技術の最終確定は [#12](https://github.com/Anotokinotori/elite-run-db/issues/12) で行う。

## 背景

このサービスでは、一般的なメール / パスワード方式ではなく、Google-only のアカウント連携を前提に設計を進める。
ただし、今回の最優先事項は機能拡張の速度ではなく、初心者運用でも DB アクシデントを起こしにくい安全設計を先に固定することにある。

## 設計原則

1. 初心者でも運用事故を起こしにくいことを優先する。
2. DB を browser へ広く露出しない。
3. public 閲覧と権限付き操作を分離する。
4. 削除・公開・権限変更は保守的に扱う。
5. client 側の利便性より、server/BFF 側での強制と権限制御を優先する。
6. 複雑さより事故率低下を優先する。

## 今回の決定事項

- 認証は Google-only を前提にする。
- 一般ユーザーは誰でも Google ログイン可能とする。
- public 閲覧は未ログインでも可能にする。
- role は `user / reviewer / admin` の 3 ロールで開始する。
- reviewer/admin は個別 allowlist による手動昇格で付与する。
- 管理画面は public 側とは別 origin に分離する。
- 公開名は Google 表示名ではなく、アプリ内ハンドルを正本にする。
- 再認証は admin の危険操作にだけ要求する。
- public 配信は publish/unpublish 時に更新される snapshot を使う。
- DB 到達面は BFF 中心に設計する。

## Working assumptions

- Auth/DB 基盤は `Supabase` を前提に検討する。
- session は `httpOnly cookie` を使う BFF モデルを前提にする。
- MVP の BFF は `Supabase Edge Functions` を第一候補にする。
- 管理画面の別 origin は、まず same-site の別 subdomain を前提にする。

## Trust boundary

- Google は本人確認の入口としてのみ利用する。
- client の role 情報は UI 表示制御のための補助情報であり、認可の正本にしない。
- 実権限の判定は server/BFF と DB で強制する。
- role の正本は DB 側に置き、cookie や token に含まれる role はキャッシュ扱いにする。
- public browser は live DB を直接読まない。
- reviewer/admin の操作は必ず BFF を経由して DB に到達する。

## Role matrix

### user

- Google ログイン
- 自分のプロフィール/ハンドル設定
- 自分の申請作成、編集、送信
- 自分の申請状態の確認

### reviewer

- 申請一覧の閲覧
- 承認、差し戻し、却下
- 公開/非公開の運用判断
- 通報の一次対応

### admin

- reviewer の全権限
- reviewer/admin の role 付与と剥奪
- allowlist 管理
- マスターデータ管理
- 危険操作の実行
- 運用設定変更

## Session model

- ログイン後の session は BFF が発行する `httpOnly + Secure` cookie を前提にする。
- browser に長寿命の privileged token を広く持たせない。
- session は通常操作では維持しつつ、admin の危険操作では再認証を要求する。
- 再認証対象の初期候補は次の通り。
  - role 変更
  - staff allowlist 更新
  - hard delete 相当
  - secret 級設定変更

## Public snapshot strategy

- DB は正本とするが、public 側は公開済みデータだけを整形した snapshot を読む。
- snapshot は publish/unpublish を契機に更新する。
- 通常の public 閲覧では live DB を叩かない。
- public 配信に使う read model は `published` 相当の専用 view または整形済み read model から生成する。

## 初心者運用で避けるべき事故

- `service_role` を client に置く。
- public browser から live DB を広く直読させる。
- role を UI 表示だけで信頼する。
- hard delete を初期から許す。
- publish 対象を限定しないまま snapshot を生成する。
- 本番 DB に対して手作業変更を常態化する。
- public 面と admin 面の origin を分けず、同じ到達面に載せる。

## 保留事項 / #12 で正式確定する点

- `Supabase` を正式採用するかどうか。
- DB と Spreadsheet の最終分担。
- 本番時の BFF 配置詳細。
- 公開 snapshot の物理配置先。
- backup / restore / migration の運用細則。

## 補足

- この文書は最終実装仕様ではなく、Issue #18 のための設計判断の保存を目的とする。
- comments / likes / share の永続化や community 系ページは、この文書の前提から外す。
- 次の実装・設計タスクは派生 Issue に分割して扱う。
