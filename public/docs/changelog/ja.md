# 更新履歴

CC Switch の重要なリリース更新記録です。

## [3.15.0] - 2026-05-16

> Claude Desktop が一等管理パネルに昇格（プロキシゲートウェイ経由のサードパーティプロバイダー切り替えを含む）、ロールベースのモデルマッピング、リバースプロキシの大幅強化、Codex OAuth ライブモデル検出、Usage ダッシュボードのフィルター駆動 Hero カード

> [!WARNING]
>
> ## 唯一の公式チャネル（必ずお読みください）
>
> CC Switch は**完全に無料・オープンソース**のデスクトップアプリで、**ユーザーから料金を徴収することはありません**。最近、CC Switch の名を騙って課金を要求したり認証情報を収集する偽サイトが複数確認されており、一部のユーザーには既に金銭的被害が発生しています。本ソフトウェアは下記の公式チャネルからのみ入手してください：
>
> | チャネル     | 唯一の公式                                                                     |
> | ------------ | ------------------------------------------------------------------------------ |
> | 公式サイト   | **[ccswitch.io](https://ccswitch.io)**                                         |
> | ソースコード | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | ダウンロード | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | 作者         | **[@farion1231](https://github.com/farion1231)**                               |
> | 偽サイト通報 | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **料金請求・チャージ・認証情報の提供を求める「CC Switch」サイトやクライアントはすべて偽物です。** 支払いを誘導された場合は、直ちに取引を中止し、偽サイトを速やかに削除できるよう GitHub Issues からご報告ください。

### Claude Desktop 利用ガイド

本リリースの主役は **Claude Desktop の一等管理パネル**です。すでに Claude Code 側で多くのプロバイダーを設定している場合は、まずこのガイドをご覧ください：

**[CC Switch で Claude Desktop プロバイダーを一括設定・管理・切り替える](/ja/docs?section=providers&item=claude-desktop)**

このガイドでは、Claude Code から既存プロバイダーを一括インポートする方法、Claude Desktop 専用プロバイダーの追加、直結 / モデルマッピングの 2 モード、非表示のローカルルーティング切り替えを表示する設定、Claude Desktop 公式サインインモードへの復帰までを説明しています。

### 概要

CC Switch v3.15.0 は v3.14.x に続く大型バージョンアップで、コアの焦点は **Claude Desktop を一等管理パネルに昇格させること**にあります。これに合わせて、内蔵プロキシゲートウェイを介したサードパーティプロバイダーの切り替え、ロールベースのモデルマッピング（sonnet / opus / haiku）+ `supports1m` ロングコンテキストフラグ、Copilot / Codex OAuth プロバイダーの再利用、再設計された Claude Code インポートフロー、App スイッチャーでの「Claude Code」と「Claude Desktop」の視覚的な区別、そして Claude Code プリセットディレクトリから翻訳された 44 個の Claude Desktop プリセットを提供します。

リバースプロキシの信頼性については、本リリースで系統的なハードニングを行いました: P0–P3 の複数回にわたるルーティング / ライフサイクル / リトライ / フェイルオーバー / 補正器の修正; 非 Anthropic バックエンドで HTTPS コネクションプールを再利用してリクエスト単位のレイテンシを低減; Codex と OpenAI Responses のキャッシュヒット率改善（`prompt_cache_key` は本物のクライアントセッション識別子がある場合のみ送信、外部リクエストボディと `tool_call` 引数 / `tool_result` 内容の JSON キーを正規化してソート、`session_id` を Usage ロガーに通す）; Anthropic ↔ OpenAI `tool_choice` の正しい相互変換; Vertex AI の完全な URL を切り詰めない; Gemini は URI パスからモデル名を抽出するように変更; Local Routing のテイクオーバー検出をより精緻化; IPv6 リッスンアドレスのサポート。Codex OAuth 系の Claude プロバイダーはハードコードされたモデルリストに依存しなくなり、CC Switch が必要に応じて ChatGPT バックエンドからライブモデルリストを取得します。

Claude Code のモデルマッピングはロールベース（`sonnet` / `opus` / `haiku`）+ 表示名に変更され、`supports1m` 真偽値フラグが導入されました。これは旧来の `[1M]` サフィックス記法に取って代わり、ルーティング判定と元のモデル ID を分離します。Usage ダッシュボードには**フィルター駆動 Hero カード**が追加され、キャッシュ正規化後の真の総トークン数とキャッシュヒット率を表示し、現在の日付範囲 / プロバイダー / モデルのフィルターに追従してリアルタイム更新します。あわせてキャッシュコストのセマンティクスエラーと、リクエストごとに発生していた pricing 警告ノイズを修正しました。OpenAI Responses API の usage 解析パスを堅牢化し、上流の欠損または不正な `usage` のせいで VSCode Claude Code プラグインが `null` 出力でクラッシュしないようにしました。

プロバイダーエコシステムはさらに拡張されました: BytePlus、Volcengine Agentplan、ClaudeAPI、ClaudeCN、RunAPI、RelaxyCode、PatewayAI、Baidu Qianfan Coding Plan のパートナープリセットを追加; Doubao Seed をパートナープリセットに昇格; プロバイダーカードに「Local Routing 対応」バッジを表示。本リリースでは、Codex セッション、OAuth、Claude Desktop フォーム、Linux segfault、ターミナルフォールバックなどに関する多くの細部の問題も修正し、複数の GitHub Actions 依存関係をアップグレードしました。

### ハイライト

- **Claude Desktop が一等管理パネルに**: 内蔵プロキシゲートウェイを介したサードパーティプロバイダーの切り替え、ロールベースのモデルマッピング（sonnet / opus / haiku）+ `supports1m` ロングコンテキストフラグ、Copilot / Codex OAuth プロバイダーの再利用、Claude Code プリセットディレクトリから翻訳された 44 個のプリセットを提供。注意: 20 個の Claude Desktop プリセットがデフォルトでプロキシモードから直接接続モードに切り替わったため、アップグレード後にプロキシルーティングに依存している場合は接続性を検証してください
- **リバースプロキシの大幅強化**: P0–P3 のライフサイクル / リトライ / フェイルオーバー / 補正器の修正; 非 Anthropic バックエンドの HTTPS コネクションプール再利用; Codex / Responses キャッシュヒット率改善; Anthropic ↔ OpenAI `tool_choice` の正しいマッピング; Vertex AI URL の完全保持; Gemini パスベースのモデル抽出; テイクオーバー検出の精緻化; IPv6 リッスンアドレスのサポート
- **プロバイダーエコシステムの拡張**: BytePlus、Volcengine Agentplan、ClaudeAPI、ClaudeCN、RunAPI、RelaxyCode、PatewayAI、Baidu Qianfan Coding Plan のパートナープリセットを追加; Doubao Seed をパートナーに昇格; プロバイダーカードに「ルーティングプロキシ対応」バッジを表示
- **ロールベースのモデルマッピング + 1M フラグ**: ロールベースの sonnet / opus / haiku ルーティング + 表示名 + `supports1m` フラグ。旧来の `[1M]` サフィックスに取って代わる
- **Codex OAuth ライブモデル検出**: ChatGPT Codex 系プロバイダーは必要に応じて ChatGPT バックエンドからライブモデルリストを取得
- **Usage ダッシュボードのフィルター駆動 Hero**: キャッシュ正規化後の真の総トークン数とキャッシュヒット率を表示し、現在の日付 / プロバイダー / モデルフィルターに追従してリアルタイム更新
- **DeepSeek ツール呼び出し + ゼロ usage 最終 delta**: DeepSeek のツール呼び出しが `reasoning_content` も返却するように (#2543, 感謝 @bling-yshs); 最終 `message_delta` は常に usage ブロックを含む（すべてゼロでも）ため、厳格な Anthropic クライアントが `null` でクラッシュしなくなった (#2485, 感謝 @Myoontyee)
- **OpenAI Responses API usage 解析の堅牢化**: 上流の欠損または不正な usage によって VSCode Claude Code プラグインがクラッシュしないように (#2422, 感謝 @magucas)

### 追加機能

#### Claude Desktop サードパーティプロバイダーのプロキシ切り替え

CC Switch は初めて **Claude Desktop** を一等管理対象パネルとして扱い、Claude Code / Codex / Gemini / OpenCode / OpenClaw / Hermes と並列に位置づけます。

- Claude Desktop 専用パネルを追加し、CC Switch 内蔵プロキシゲートウェイを介してサードパーティプロバイダーを Claude Desktop に代理転送
- ルーティングプロキシを必要とするプロバイダーには、カード上に「Local Routing 対応」バッジを表示
- ロールベースのモデルルーティングマッピングで `sonnet` / `opus` / `haiku` にロック
- Copilot / Codex OAuth プロバイダーを Claude Desktop パネルで再利用可能
- 再設計された Claude Code 設定インポートフロー
- App スイッチャーで「Claude Code」と「Claude Desktop」を視覚的に区別、アプリ可視性設定では「Claude Code」ラベルを使用
- Claude Code プリセットディレクトリから翻訳された 44 個の Claude Desktop プロバイダープリセット

#### プロバイダーカード: ルーティングプロキシ対応バッジ

Claude Code と Codex パネルのプロバイダーカードに「ルーティングプロキシ対応」バッジを追加し、Local Routing 経由で提供可能なプロバイダーを一目で識別できるようにしました。

#### Codex OAuth ライブモデルリスト

ChatGPT Codex 系プロバイダーはハードコードされたモデル選択に依存しなくなり、CC Switch が必要に応じて ChatGPT バックエンドから**ライブモデルリスト**を取得します。

#### ロールベースのモデルマッピング + 1M フラグ

Claude Code のモデルマッピングはロールベース（`sonnet` / `opus` / `haiku`）+ 表示名に変更され、`supports1m` 真偽値フラグが導入されました。これは旧来の `[1M]` サフィックス記法に取って代わり、ルーティング判定と元のモデル ID を分離します。

#### Usage ダッシュボードのフィルター駆動 Hero

Usage ダッシュボードの Hero サマリーがフィルター駆動になり、現在の日付範囲 / プロバイダー / モデルフィルターに追従してリアルタイムに変化します。**キャッシュ正規化後の真の総トークン数**とキャッシュヒット率を表示することで、Hero の数値が下部の詳細リストと整合するようになります。

#### プロバイダーフォームの「とりあえず保存」

プロバイダーフォームの入力検証を緩和し、非ブロッキングな入力上の問題を「とりあえず保存」型のヒントに変更しました。無害な軽微なフィールド問題が原因で保存が阻まれることがなくなります (#2307, 感謝 @allenxln)。

#### Universal プロバイダーの複製アクション

プロバイダーリスト内の universal プロバイダーに「複製」ボタンを追加しました (#2416, 感謝 @hubutui)。

#### Tauri ウィンドウ状態の永続化

ウィンドウの位置とサイズが再起動をまたいで保持されるようになりました (#2377, 感謝 @BillSaul)。

#### トレイアイコンのホバーヒント

システムトレイアイコンにホバー時のステータスヒントを表示するようになりました (#2417, 感謝 @Coconut-Fish)。

#### Warp ターミナルセッション起動

Warp ターミナルのサポートを追加し、保存されたセッションを Warp で実行できるようになりました (#2466, 感謝 @tisonkun)。

#### DeepSeek ツール呼び出し `reasoning_content`

DeepSeek のツール呼び出しレスポンスが `reasoning_content` と `tool_calls` を同時に返却するようになり、呼び出し側が両方を一緒にレンダリングできるようになりました (#2543, 感謝 @bling-yshs)。

#### Baidu Qianfan Coding Plan（Claude Code）

Baidu Qianfan Coding Plan プリセットを追加しました (#2322, 感謝 @jimmyzhuu)。

#### Compshare Coding Plan プリセット（クロスアプリ）

Compshare Coding Plan プリセットを claude / codex / hermes / openclaw の全アプリに展開しました。

#### パートナープロバイダープリセット

**BytePlus**、**Volcengine Agentplan**、**ClaudeAPI**、**ClaudeCN**、**RunAPI**、**RelaxyCode**、**PatewayAI** のパートナープリセットを追加; **Doubao Seed** をパートナープリセットに昇格（エンドポイントとリンクをリフレッシュ）。

#### 44 個の Claude Desktop プロバイダープリセット

Claude Code プリセットディレクトリから 44 個のプロバイダープリセットを翻訳し、新しい Claude Desktop パネルに投入しました。

### 変更

#### 20 個の Claude Desktop プリセットがデフォルトで直接接続モードに

20 個の Claude Desktop プリセットがデフォルトでプロキシモードから直接接続モードに切り替わり、プロキシ互換シムを必要としないユーザーの導入摩擦を低減しました。アップグレード前にこれらのプリセットのプロキシルーティング経由の接続性に依存していた場合は、アップグレード後に検証してください。

#### Claude Desktop の操作制約

Claude Desktop のプロバイダーを切り替えると CC Switch 管理の 3P プロファイルが書き込まれます。**Claude Desktop の再起動**が必要です; プロキシモードのプロバイダーは、使用中 CC Switch の Local Routing が動作し続けている必要があります。

#### Failover / Local Routing 連動検証

Failover コントロールは、ターゲットアプリの Local Routing テイクオーバーが有効になっていないと開けないように変更しました。プロキシサービスのみを止めてもテイクオーバー状態に依存するアプリがある場合はブロックされ、「プロキシは止めたがアプリはまだテイクオーバー中と認識している」という不整合を回避します。

#### Usage 統計のセマンティクス変更

Usage サマリーは**キャッシュ正規化後の真の総トークン数**と**キャッシュヒット率**を報告するようになりました。データの重複排除と価格再計算により、過去のトークン数とコスト数値は**ずれる可能性があります** — 新しい数値の方が正確ですが、旧バージョンの数値とは一致しません。

#### プロバイダープリセットのレンダリング順序

プリセットリストは作者が定義した配列順序でレンダリングされるようになり、パートナーが先頭に並びます。以前の暗黙的なソートを置き換えます。

#### モデルマッピングヒント文面の簡素化

`modelMappingOffHint` を中 / 英 / 日でアクション指向の簡潔な文面に書き直しました。

#### CC Switch ブランド公式サイトを ccswitch.io に統一

アプリ内および README 内のすべての「公式サイト」参照を、唯一の公式サイトとして ccswitch.io に統一しました; Release notes テンプレートにも ccswitch.io を反映。

#### テーマ切り替えの簡素化

テーマ切り替え時の円形拡散アニメーションを削除し、即座にクロスフェードする方式に変更しました。

#### Claude Code App スイッチャーの視覚的な区別

App スイッチャーで「Claude Code」と「Claude Desktop」を視覚的に区別し、アプリ可視性設定では「Claude Code」ラベルを使用するようにしました。

#### CI: Claude Review を Opus 4.7 にアップグレード

Claude review GitHub Action を Opus 4.7 にアップグレード; nitpick ノイズを減らすためプロンプトを調整; `@claude` レビュー専用 Code Action を追加; PR head SHA を checkout 用にロック; `--max-turns 5` 制限を削除。

#### GitHub Actions 依存関係のアップグレード

- `actions/checkout` 4 → 6 (#2517)
- `pnpm/action-setup` 5 → 6 (#2518)
- `softprops/action-gh-release` 2 → 3 (#2519)
- `actions/stale` 9 → 10 (#2520)

#### DeepSeek プリセットを V4 に

DeepSeek プリセットが V4（flash / pro）+ リフレッシュされた価格シードを出荷するようになりました。

#### Codex 1M コンテキストトグルを編集フォームから隠す

Codex プロバイダー編集フォームでは 1M コンテキストトグルを表示しなくなり、現在の Codex デプロイメントには実効性のないノブの密度を低減しました。

#### OpenClaudeCode を MicuAPI ドメインに移行

OpenClaudeCode プリセットを MicuAPI ドメインに移行; Micu API リンクを `micuapi.ai` にリフレッシュ。

#### CrazyRouter エンドポイントを `cn` サブドメインに切り替え

CrazyRouter プリセットのエンドポイントを `cn` サブドメインに変更しました。

#### RelaxyCode カスタムアイコン

RelaxyCode プリセットのアイコンをカスタム `relaxcode.png` アセットに変更しました。

#### Kimi For Coding ドキュメント URL

Kimi For Coding のウェブサイト URL を `/code/docs/` パスに更新しました。

#### SiliconFlow 国際版で USD 表示

SiliconFlow 国際版の残高を正しく USD で表示するように修正しました（以前は誤って CNY と表示）。

### 修正

#### OpenAI Responses API usage 解析の堅牢化

`build_anthropic_usage_from_responses()` と Responses → Anthropic SSE トランスレーターを強化し、上流の欠損または不正な `usage` が `message_delta` 内で `"usage": null` を生成しないようにしました。これにより、厳格な Anthropic クライアント（典型例: VSCode Claude Code プラグイン）が一部のプロバイダー（Codex OAuth、DashScope の `compatible-mode/v1/responses` エンドポイント）で `Cannot read properties of null (reading 'output_tokens')` でクラッシュしていた問題が解消されます。OpenAI フィールド名のフォールバック（`prompt_tokens` / `completion_tokens`）、null / 空 / 部分オブジェクトの処理、input/output tokens が欠損していても cache token フィールドを保持する処理を追加しました (#2422, 感謝 @magucas)。

#### プロキシ信頼性パッチ（P0–P3）

request-forwarder パス全体で複数回にわたるルーティング / ライフサイクル / リトライ / 補正器の修正を実施; 共有された `handle_rectifier_retry_failure` ヘルパーと `auth_header_value` ヘルパーを抽出。

#### プロキシ: 非 Anthropic バックエンドの HTTPS コネクションプール再利用

非 Anthropic バックエンドはプールされた HTTPS コネクションを再利用し、リクエストごとに新しい TLS セッションを開かなくなりました。リクエスト単位のレイテンシが大幅に低減します。

#### プロキシ: クライアントの実際の HTTP メソッドを転送

`POST` のハードコーディングをやめ、クライアントの実際の HTTP メソッドに従って転送するようになりました; 上流の非 POST エンドポイント（例: GET `/v1/models`）が正常に動作します。

#### プロキシ: 試行ごとのカウンター + `max_retries` の接続

クライアントリクエストカウンターを試行ごとのループから外に移動; `AppProxyConfig.max_retries` がリクエストフォワーダーに正しく接続されるようになりました。

#### プロキシ: フェイルオーバー判定の精緻化

リクエストフォワーダー内でのリトライ可能 / 不可能エラーの分類がより正確になりました。

#### プロキシ: テイクオーバー検出の精緻化

テイクオーバー検出をより厳密にしました; テイクオーバー OFF 時はフォールバック復旧パスを通り、残留状態によってプロバイダーが固まらないようにします。

#### プロキシ: Anthropic ↔ OpenAI `tool_choice` の相互変換

フォーマット変換時に Anthropic の `tool_choice` を OpenAI Chat のネスト形式に正しくマッピングするようになりました。

#### プロキシ: Gemini リクエストのモデルを URI パスから抽出

Gemini リクエストのモデルを URI パスから抽出するようになりました（body からは取らない）。変換後のトラフィックが正しいモデル名を報告します。

#### プロキシ: 認証ヘッダーのエラー処理

`get_auth_headers` が `Result` を返すようになり、認証情報に問題がある場合にパニックしなくなりました。

#### プロキシ: IPv6 リッスンアドレスの検証

プロキシパネルが IPv6 リッスンアドレスを受け付けるようになりました。

#### プロキシ: Codex / Responses キャッシュヒット率の改善

安定したキャッシュキー導出によって Codex と OpenAI Responses リクエストのキャッシュヒット率を改善: クライアントが本当にセッション識別子を持参してきた場合にのみ `prompt_cache_key` を送信し、無関係な会話が同じキーに潰されないようにする; 外部リクエストボディと `tool_call` 引数 / `tool_result` 内容内の JSON キーを正規化してソートし、プレフィックスキャッシュがバイト単位でマッチできるようにする; `session_id` を usage ロガーに通してリクエストを関連付けする。

#### プロキシ: JSON Schema のアンダースコアフィールド保持

プライベートパラメータフィルタリングが JSON Schema name map（`properties`、`patternProperties`、`definitions`、`$defs`）内のアンダースコア接頭辞のフィールド名を保持するようになりました。ユーザー定義 schema キー（`_id`、`_meta` など）がフィルターを正常に通り抜けられます。

#### プロキシ: Read ツールの空白ページ除去

`Read` ツールの入力から空白ページを除去し、プロバイダーがリクエストを拒否しないようにしました (#2472, 感謝 @Kwensiu)。

#### プロキシ: リクエスト単位のホットパス軽量化

リクエストごとのホットパスのオーバーヘッドとデータベース待ち時間を削減しました。

#### プロキシ: テイクオーバー下で真のプロバイダーモデル名を表示

テイクオーバー実行時に、Claude Code メニューが古いエイリアスではなく真のプロバイダーモデル名を露出するようになりました。

#### プロキシ: 最終 `message_delta` は常に usage を含む

最終 `message_delta` イベントには常に usage ブロックが含まれるようになりました（すべてゼロでも）。厳格な Anthropic クライアントが `null` でクラッシュしなくなります (#2485, 感謝 @Myoontyee)。

#### プロキシ: ストリーミング `message_delta` の重複排除

一部の上流が二重に送信する `message_delta` イベントの重複排除を行います (#2366, 感謝 @codeasier)。

#### プロキシ: ツール呼び出しパスでの `reasoning_content` 保持

ツール呼び出しパスの変換時に scoped `reasoning_content` フィールドを正しく保持するようにしました; Kimi / Moonshot の OpenAI Chat 互換パスではこのフィールドを保持し、汎用 OpenAI 互換リクエストでは引き続き付加しません (#2367, 感謝 @codeasier)。

#### プロキシ: Vertex AI の完全 URL 保持

Vertex AI の完全 URL がプロキシ転送時に切り詰められないようにしました (#2415, 感謝 @xpfo-go)。

#### プロキシ: system content 先頭の課金ヘッダーを除去

一部の上流が system message の先頭に挿入する課金ヘッダー内容を除去するようにしました (#2350)。

#### プロキシ: Claude 認証ストラテジーを `ANTHROPIC_*` 環境変数名から導出

不透明なヒューリスティックに依存するのをやめ、認証ストラテジーを実際の `ANTHROPIC_*` 環境変数名から導出するようにしました。

#### サードパーティ Claude プロバイダー: モデルテストの無効化

`/v1/models` を一貫して実装していないサードパーティ Claude ゲートウェイに対して、モデルプローブを無効化しました。

#### Model-Fetch: Anthropic 互換サブパスプロバイダーの `/models`

`/models` ディスカバリーが Anthropic 互換のサブパスプロバイダーに対しても動作するようになりました。

#### Copilot: Claude モデル ID をライブ `/models` と照合

Copilot バックエンドのプロバイダーはライブ `/models` リストを使って Claude モデル ID を照合し、古い ID の不整合を回避するようになりました。

#### Codex: セッションタイトルが `environment_context` を取り込まないように

Codex のセッションタイトル抽出が `environment_context` のノイズを引き込まなくなりました (#2439, 感謝 @eclipsehx)。

#### Codex: subagent セッションを非表示

Codex の subagent セッションをメインセッションリストから非表示にしました (#2445, 感謝 @LanternCX)。

#### Codex 起動時の live import 重複排除

Codex 起動時の live import パスにおける重複インポートのバグを修正しました (#2590, 感謝 @DhruvShankpal)。

#### Codex プロバイダー切り替えで履歴を擾乱しないように

アクティブな Codex プロバイダーの切り替えが既存のセッション履歴を変更しなくなりました (#2349, 感謝 @SaladDay)。

#### Codex usage ログの文言修正

Codex セッション usage の誤解を招くログを 1 件修正しました (#2473, 感謝 @tisonkun)。

#### Claude: `max` effort を env 経由で永続化

`max` effort が再起動をまたいで env 変数経由で正しく永続化されるようになりました (#2493, 感謝 @makoMakoGo)。

#### Claude Desktop: モデルルーティングで `[1M]` サフィックスを要求しないように

ルーティングマッチングがレガシーな `[1M]` サフィックスを要求しなくなりました。

#### Claude Desktop: プロバイダーフォームの入力フォーカス消失

Claude Desktop プロバイダーフォームで入力ボックス編集中にフォーカスを失う問題を修正しました。

#### Claude Desktop: 偽の「プロキシ停止」ステータス通知

プロキシが能動的に停止された際に誤って発火するヒントを削除しました。

#### Claude Desktop: 空のツールバーカプセル非表示

Claude Desktop がアクティブアプリの場合、空のツールバーカプセルを非表示にします。

#### UI: Monitor バッジアイコンのセンタリング

App スイッチャー内の Monitor バッジアイコンをセンタリングしました。

#### Linux: テーマ選択で segfault

Linux でテーマを選択した際の segfault を防止しました (#2502, 感謝 @definfo)。

#### ターミナル: コールドスタート時の iTerm fallback

コールドスタート時に存在しない iTerm をフォールバックに選んでしまうのを防止しました (#2448, 感謝 @hulkbig)。

#### 設定: JSON キーを辞書順でソート

設定の書き込みが JSON キーを辞書順にソートするようになり、出力が決定的になりました (#2469, 感謝 @fuleinist)。

#### 「既存をインポート」を副作用なしに

「既存をインポート」操作を副作用なしに変更しました (#2429, 感謝 @xwil1)。

#### Coding Plan: Zhipu の週次ウィンドウをリセット時刻で命名

Zhipu の週次ウィンドウのティア名を実際のリセット時刻に合うように修正しました (#2420, 感謝 @TuYv)。

#### DashScope: usage 解析の堅牢化

DashScope の usage 解析を強化し、不正なペイロードが VSCode Claude Code プラグインをクラッシュさせないようにしました (#2425, 感謝 @magucas)。

#### Usage: プロキシとセッションログの重複排除

プロキシとセッションログという 2 つのソースをまたいで usage レコードの重複排除を行います。

#### Usage: キャッシュコストのセマンティクス + pricing 警告の嵐

キャッシュコストのセマンティクスを修正し、リクエストごとに発生していたノイズの多い pricing 警告を解消しました。

#### CI: フロントエンドフォーマット + Linux clippy の復活

CI のフロントエンドフォーマットと Linux clippy の実行を復活させました。

#### プロキシテストヘルパー clippy 警告

プロキシテストヘルパーの clippy 警告を 1 件修正しました。

### 削除

#### Hermes Agent usage トラッキング統合

本サイクルでオンラインにする予定だった Hermes Agent usage トラッキング統合を削除しました — 上流の動作変更によって、この統合のメンテナンスが現実的でなくなりました。この統合は**いかなるリリース版でも有効化されたことはなく**; 開発過程で発見された「ゼロコストレンダリング」バグは統合をロールバックする前に修正済みです。

#### テーマ切り替えの円形拡散アニメーション

テーマ切り替え時の円形拡散アニメーションを削除しました — 性能の弱いコンポジターでカクつき、視覚的なメリットが限定的でした。

#### DDSHub パートナー統合

DDSHub をパートナープリセットから削除し、各 README 内の相互リンクセクションも削除しました。

### ドキュメント

#### README スポンサー更新（中 / 英 / 日）

BytePlus、ClaudeCN、RunAPI、PatewayAI のスポンサーエントリを追加; BytePlus と Volcengine のエントリを相互リンク; CrazyRouter の $2 クレジット受領フロー、Compshare の説明、Right Code の説明、その他スポンサーのロゴおよびリストアイテムをリフレッシュ; LionCC のロゴを白背景にフラット化; 中国語 README のスポンサーロゴを Volcengine 画像に切り替え; README のサブタイトルに Hermes Agent を追加。

#### Release notes テンプレート

Release notes テンプレート内に `ccswitch.io` を反映しました。

#### ブランド公式サイト

各 README およびアプリ内参照で `ccswitch.io` を唯一の公式サイトとしてドキュメント化しました。

### ⚠️ アップグレード時の注意

#### 20 個の Claude Desktop プリセットがデフォルトで直接接続モードに

これら 20 個のプリセットは以前はデフォルトでプロキシ経由でルーティングされていましたが、現在はデフォルトで直接接続です。アップグレード前にこのうちのいずれかを使用しており、かつプロキシルーティングの接続性に依存していた場合（例: プロキシに特殊な補正器や変換層がある場合）、接続性を検証してください; 必要に応じて、CC Switch パネル内で手動でプロキシモードに戻すことができます。

#### Claude Desktop の操作制約

Claude Desktop プロバイダーの切り替えには、**Claude Desktop の再起動**が必要です; プロキシモードのプロバイダーは、使用中 CC Switch の Local Routing が動作し続けている必要があります — CC Switch を終了させたり Local Routing を停止させたりすると、プロキシモードの Claude Desktop プロバイダーへの接続が切断されます。

#### Failover にはテイクオーバーの有効化が必要

Failover を有効化する前に、ターゲットアプリの Local Routing テイクオーバーが有効になっていることを確認してください。さもないと Failover コントロールは起動を拒否します; プロキシサービスを止めたいがテイクオーバーに依存するアプリがある場合はブロックされるため、アプリ層で先にテイクオーバーを止めてからプロキシを停止する必要があります。

#### Usage 統計の数値が過去と一致しない可能性

Usage サマリーはキャッシュ正規化後の真の総トークン数 + キャッシュヒット率を使用するようになりました。データの重複排除と価格再計算により、過去のトークン数とコスト数値は**ずれる可能性があります** — 新しい数値の方が正確ですが、旧バージョンの数値とは一致しません。

### ⚠️ リスク通知

本リリースは、リバースプロキシ系機能について v3.12.3 / v3.13.0 で提起されたリスク通知を継承します。

**GitHub Copilot リバースプロキシ**: Copilot のリバースプロキシパスを使用すると、GitHub / Microsoft の利用規約に違反する可能性があります。詳細は [v3.12.3 リリースノート](v3.12.3-ja.md#️-リスクに関する注意事項) を参照してください。

**Codex OAuth リバースプロキシ**: ChatGPT サブスクリプションを使用した Codex OAuth リバースプロキシは、OpenAI の利用規約に違反する可能性があります。詳細は [v3.13.0 リリースノート](v3.13.0-ja.md#️-リスクに関する注意事項) を参照してください。

**Claude Desktop サードパーティプロバイダーのプロキシ切り替え**: CC Switch 内蔵プロキシゲートウェイ経由で Claude Desktop のリクエストをサードパーティプロバイダーに転送する際、サードパーティプロバイダーの課金、コンプライアンス、データ保持に関する制約はそれぞれ異なります。利用前にターゲットプロバイダーの利用規約をお読みください。

ユーザーが上記機能を有効化することで、**すべてのリスクを自己責任で**受諾したものとみなされます。CC Switch は、これらの機能の使用に起因するアカウントの制限、警告、サービス停止について一切の責任を負いません。

### ダウンロード・インストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から対応バージョンをダウンロードしてください。

#### システム要件

| OS      | 最小バージョン           | アーキテクチャ                      |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 以降          | x64                                 |
| macOS   | macOS 12 (Monterey) 以降 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 下表参照                 | x64 / ARM64                         |

#### Windows

| ファイル                                 | 説明                                        |
| ---------------------------------------- | ------------------------------------------- |
| `CC-Switch-v3.15.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応 |
| `CC-Switch-v3.15.0-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ不要  |

#### macOS

| ファイル                         | 説明                                                   |
| -------------------------------- | ------------------------------------------------------ |
| `CC-Switch-v3.15.0-macOS.dmg`    | **推奨** - DMG インストーラー、Applications にドラッグ |
| `CC-Switch-v3.15.0-macOS.zip`    | 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.15.0-macOS.tar.gz` | Homebrew インストールと自動更新用                      |

> macOS 版は Apple のコード署名および公証済みで、直接インストールして使用できます。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新:

```bash
brew upgrade --cask cc-switch
```

#### Linux

> Linux 向けの成果物は **x86_64** と **ARM64**（`aarch64`）の両方が提供されます。ファイル名にアーキテクチャ識別子が含まれているため、`uname -m` の出力に応じて選択してください：
>
> - `CC-Switch-v3.15.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
> - `CC-Switch-v3.15.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| ディストリビューション                  | 推奨形式    | インストール方法                                                           |
| --------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                    |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を付与して実行、または AUR を使用                                  |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`                  |

---

## [3.14.1] - 2026-04-23

> トレイでの用量可視化、Codex OAuth の複数の安定性修正、Skills インポート/インストールの信頼性向上、Hermes 設定ヘルススキャナーの削除

### 概要

CC Switch v3.14.1 は v3.14.0 に続くパッチリリースで、**Codex OAuth リバースプロキシの安定性**、**トレイでの用量可視化**、**Skills インポート / インストールの信頼性**、**Gemini セッション復元パス**、および **Hermes 設定ヘルス処理の簡素化**を中心に据えています。

システムトレイは初めて、現在の Claude / Codex / Gemini プロバイダーの**キャッシュ済み用量**をサブメニューに直接表示するようになりました — サブスクリプション要約と用量スクリプト要約を、使用率に応じた色分けマーカーとともに表示します。Kimi / Zhipu / MiniMax のような中国系コーディングプランプロバイダーには、公式サブスクリプションバッジと同じ `🟢 h12% w80%` スタイルで **5 時間 + 週次ウィンドウ**の 2 ウィンドウレイアウトを追加描画します（より厳しい方の使用率が絵文字色を決定）。`ANTHROPIC_BASE_URL` が既知のコーディングプランホストに一致する Claude プロバイダーを作成すると、`meta.usage_script` が自動注入されるため、Usage Script モーダルを開かなくてもトレイが点灯します。

Codex OAuth 側では、複数のリバースプロキシ安定性の問題を修正しました: クライアント提供の session ID を `prompt_cache_key` と Codex session ヘッダーの両方に使用し、UUID 生成によるキャッシュ揺らぎを回避。ChatGPT Codex 上流が OpenAI Responses SSE を強制する場合でも、非ストリーミングの Anthropic クライアントが適切な JSON レスポンスを受け取れるようになりました。Stream Check は、本番環境と同じ `store: false`、暗号化 reasoning include、およびプロバイダーの FAST モード設定でプローブを構築するようになり、「検出は失敗するのに実際は動く」というズレが解消されました。新しい明示的な **FAST モードトグル**と組み合わせることで、ユーザーは Codex OAuth バックの Claude プロバイダーで `service_tier="priority"` を選択的に送信でき、レイテンシと ChatGPT 配額消費の間で自分で選べるようになりました。

さらに、CC Switch 内蔵の **Hermes 設定ヘルススキャナー**と警告バナー（および対応する `scan_hermes_config_health` コマンド、`HermesHealthWarning` 型、`HermesWriteOutcome.warnings` ペイロード）を削除し、Hermes サーフェスをアクティブプロバイダー表示、デフォルト切り替え、Memory 編集、および Hermes Web UI の起動に再フォーカスしました — 深い設定ヘルスは Hermes 自身の責任になります。

### ハイライト

- **トレイでの用量可視化**: Claude / Codex / Gemini のトレイサブメニューに、現在のプロバイダーのキャッシュ済み用量（サブスクリプション要約とスクリプト要約、色分けマーカー付き）を表示。リフレッシュはスロットル、可視アプリに限定、React Query に同期 (#2184, 感謝 @TuYv)
- **トレイのコーディングプラン用量（Kimi / Zhipu / MiniMax）**: トレイが 5 時間 + 週次ウィンドウの用量を `🟢 h12% w80%` レイアウトで描画。既知のホストにマッチする Claude プロバイダーは `meta.usage_script` を自動注入
- **Codex OAuth FAST モード**: Codex OAuth バックの Claude プロバイダーに明示的な FAST モードトグルを追加。有効時は変換された Responses リクエストに `service_tier="priority"` を送信、デフォルトは OFF (#2210, 感謝 @JesusDR01)
- **Codex OAuth 安定性**: リバースプロキシのキャッシュルーティング (#2218, 感謝 @majiayu000)、Responses SSE 集約 (#2235, 感謝 @xpfo-go)、Stream Check と本番の一致性 (#2210, 感謝 @JesusDR01) を修正
- **Hermes 設定ヘルススキャナー削除**: Hermes サーフェスをプロバイダー管理、Memory 編集、Web UI 起動に再フォーカス。深い設定ヘルス判定を重複して担わなくなる
- **Skills インポート / インストールの信頼性**: インポート中はダイアログのアクションを無効化し、結果を ID で重複排除 (#2211, 感謝 @TuYv); ワンクリック設定は最新のフォーム状態に基づいて適用 (#2249, 感謝 @Coconut-Fish); ルートレベルの `SKILL.md` リポジトリインストールが安定 (#2231, 感謝 @santugege)
- **Gemini セッション復元パス**: セッションスキャン時に `.project_root` メタデータを読み、元のプロジェクトディレクトリを復元フローに渡す (#2240, 感謝 @tisonkun)
- **セッション / 設定レイアウトの磨き込み**: スクロールエリアビューポートに幅制約を追加して横方向のはみ出しを修正。アプリ下部と設定フッター間隔をよりタイトに (#2201, 感謝 @Coconut-Fish)

### 新機能

#### トレイでの用量可視化

- システムトレイサブメニューに、現在の Claude / Codex / Gemini プロバイダーの**キャッシュ済み用量**を表示 (#2184, 感謝 @TuYv)
- サブスクリプション配額要約と用量スクリプト要約を含み、使用率に応じた色分けマーカー付き
- トレイ起因のリフレッシュは**スロットル**、**可視アプリに限定**、React Query に同期されるため、メインウィンドウとトレイが同じ用量データを共有

#### トレイのコーディングプラン用量（Kimi / Zhipu / MiniMax）

- 中国系コーディングプランプロバイダー向けに、トレイが **5 時間 + 週次ウィンドウ**の用量を描画
- 公式サブスクリプションバッジと同じ `🟢 h12% w80%` の 2 ウィンドウレイアウトを使用（より厳しい使用率が絵文字色を決定）
- `ANTHROPIC_BASE_URL` が既知のコーディングプランホストにマッチする Claude プロバイダーを作成すると、`meta.usage_script` が**自動注入**され、Usage Script モーダルを開かなくてもトレイが点灯
- 更新時は既存の `usage_script` 値を**保持**し、ユーザーカスタマイズを上書きしない

#### Codex OAuth FAST モード

- Codex OAuth バックの Claude プロバイダーに明示的な FAST モードトグルを追加 (#2210, 感謝 @JesusDR01)
- 有効時は変換された Responses リクエストに `service_tier="priority"` を送信してレイテンシを低減
- 予期せぬ ChatGPT 配額消費の増加を避けるため、デフォルトは OFF

### 変更

#### セッション・設定レイアウトの磨き込み

- スクロールエリアビューポートに幅制約を追加して横方向のはみ出しを修正 (#2201, 感謝 @Coconut-Fish)
- アプリ下部と設定フッター間隔をよりタイトにし、長いセッション / 設定ビューをすっきり表示

### 削除

#### Hermes 設定ヘルススキャナー

- アプリ内の Hermes 設定ヘルススキャナーと警告バナーを削除
- `scan_hermes_config_health` コマンド、`HermesHealthWarning` 型、`HermesWriteOutcome.warnings` ペイロードを削除
- CC Switch の Hermes サーフェスは本来の役割に回帰: アクティブプロバイダー表示、デフォルトプロバイダー切り替え、Memory 編集、および深い設定用の Hermes Web UI 起動

### バグ修正

#### Codex OAuth キャッシュルーティング

- クライアント提供の session ID を `prompt_cache_key` と Codex session ヘッダーの両方に使用し、明示的なキャッシュキーを保持 (#2218, 感謝 @majiayu000)
- キャッシュアイデンティティの揺らぎを引き起こしていた UUID 生成を停止し、ChatGPT Codex リバースプロキシのキャッシュアイデンティティを安定化

#### Codex OAuth Responses SSE 集約

- ChatGPT Codex 上流が OpenAI Responses SSE を強制する場合でも、非ストリーミングの Anthropic クライアントが適切な JSON を受け取れるように修正 (#2235, 感謝 @xpfo-go)
- CC Switch が非ストリーミング変換を実行する前に上流 SSE イベントを集約

#### Codex OAuth Stream Check の一致性

- Stream Check が構築する Codex OAuth プローブリクエストは、本番プロキシと同じ `store: false`、暗号化 reasoning include、プロバイダー FAST モード設定を使用するように修正 (#2210, 感謝 @JesusDR01)
- 「検出は失敗するのに実際は動く」ズレを解消

#### Codex モデル抽出

- Codex 設定の `model` フィールドを読む際、先頭行の正規表現マッチではなく TOML パーサーを使用するように変更 (#2227, 感謝 @nmsn)
- 複数行 TOML も正しく処理

#### モデルのクイック入力 / ワンクリック設定

- モデルクイック入力は**最新の**プロバイダーフォーム設定に対して適用されるように修正 (#2249, 感謝 @Coconut-Fish)
- 古いフォーム状態によってワンクリック設定が失敗する問題を修正

#### Skills インポートの重複排除

- Skills インポートダイアログは、インポート中にすべてのアクションボタンを無効化 (#2211, 感謝 @TuYv)
- インストール済み Skills のキャッシュを ID で重複排除し、ダブルクリックによる重複したインストール済みエントリを防止 (#2139)

#### ルートレベルの Skill リポジトリ

- Skill のインストールと更新フローが 3 つのソースパターンを一貫して解決: 直接ネストパス、install-name の再帰検索、およびリポジトリルートの `SKILL.md` ソース (#2231, 感謝 @santugege)

#### Gemini セッション復元パス

- Gemini セッションスキャンが `.project_root` メタデータを読み取るように修正 (#2240, 感謝 @tisonkun)
- 復元フローは利用可能な場合に元のプロジェクトディレクトリを渡せる

#### プロバイダー名のホバー表示

- プロバイダーアイコンは、inline SVG、画像 URL、およびフォールバックの頭文字レンダリングパスで、ホバー時にプロバイダー名を表示 (#2237, 感謝 @tisonkun)

### 備考・注意事項

- **Hermes ヘルススキャナー削除済み**: Hermes YAML の深い設定の問題提示を CC Switch に頼っていた場合は、ツールバーの「Hermes Web UI を起動」ボタンから Hermes 自身のパネルで確認してください。日常のプロバイダー管理、切り替え、Memory 編集、MCP / Skills 同期は引き続き CC Switch が担います。
- **Codex OAuth FAST モードはデフォルト OFF**: レイテンシ低減と引き換えに ChatGPT 配額消費が増える可能性を許容する場合にのみ有効化してください。
- **トレイのキャッシュ用量**: リフレッシュはスロットル済み、かつ現在可視のアプリに限定されており、不要な上流 API 呼び出しを回避します。値は React Query に同期されるため、メインウィンドウとトレイで同じ値が見えます。

### ダウンロード・インストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から対応バージョンをダウンロードしてください。

#### システム要件

| OS      | 最小バージョン           | アーキテクチャ                      |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 以降          | x64                                 |
| macOS   | macOS 12 (Monterey) 以降 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 下表参照                 | x64                                 |

#### Windows

| ファイル                                 | 説明                                        |
| ---------------------------------------- | ------------------------------------------- |
| `CC-Switch-v3.14.1-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応 |
| `CC-Switch-v3.14.1-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ不要  |

#### macOS

| ファイル                         | 説明                                                   |
| -------------------------------- | ------------------------------------------------------ |
| `CC-Switch-v3.14.1-macOS.dmg`    | **推奨** - DMG インストーラー、Applications にドラッグ |
| `CC-Switch-v3.14.1-macOS.zip`    | 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.14.1-macOS.tar.gz` | Homebrew インストールと自動更新用                      |

> macOS 版は Apple のコード署名および公証済みで、直接インストールして使用できます。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                           |
| --------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                    |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を付与して実行、または AUR を使用                                  |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`                  |

---

## [3.14.0] - 2026-04-21

> Hermes Agent が 6 番目の管理対象アプリに、Claude Opus 4.7 をプリセットマトリクス全体へ展開、Gemini Native API プロキシ、「Local Routing」への名称統一、アプリケーションレベルのウィンドウコントロール

### 概要

CC Switch v3.14.0 は、**Hermes Agent を 6 番目の一等管理対象アプリケーション**として CC Switch に取り込み、**Claude Opus 4.7** をアグリゲーターおよび Bedrock プリセットのマトリクス全体に展開することを中心に据えた大型リリースです。Hermes サポートは、データベース v9 → v10 マイグレーション、完全な Rust コマンド面、アトミックバックアップ付きの YAML ベースな `~/.hermes/config.yaml` 読み書き、MCP 同期、Skills 同期、SQLite + JSONL セッション管理、および Memory エディターを含む専用のフロントエンドパネルをカバーします。Hermes Agent 0.10.0 スキーマに整合する 4 つの API プロトコル（`chat_completions`、`anthropic_messages`、`codex_responses`、`bedrock_converse`）すべてを選択可能です。ユーザーが直接記述した `providers:` dict のエントリは読み取り専用カードとして表示され、深い YAML 設定は Hermes Web UI に委譲されます。

Hermes に加えて、本リリースでは **Gemini Native API プロキシ**（`api_format = "gemini_native"`）を追加し、プロキシがリクエストを Google の `generateContent` エンドポイントに直接転送できるようにしました（完全なストリーミング、スキーマ変換、シャドウリクエストをサポート）。また、旧「Local Proxy Takeover」を三言語の UI / README / ドキュメント全体で **Local Routing** に統一リネームし、コンポジターが描画するボタンが無反応になり得る Linux Wayland などのシーンで、CC Switch が自前で最小化 / 最大化 / 閉じるボタンを描画できるオプション「**アプリケーションレベルのウィンドウコントロール**」を導入しました。さらにリリース直前に、ツールバーからの `hermes dashboard` 直接起動、LemonData の全アプリプリセット、DDSHub の Codex エンドポイント、および複数の Hermes ヘルスチェックと Usage モーダルの修正が追加されました。

セッション側では、`@tanstack/react-virtual` によるセッションリストの**仮想化**で数千件のレコードを持つ長い会話も滑らかにスクロールでき、長いメッセージはデフォルトで折り畳まれます。Usage ダッシュボードには**日付範囲ピッカー**（今日 / 1d / 7d / 14d / 30d + カスタム日時カレンダー）とページジャンプ入力が追加され、**Stream Check エラー分類**は色分けされたトーストで提示され、デフォルトの探索モデルが更新され、「モデルが見つからない」レスポンスを個別に識別するようになりました。また、Local Routing が有効な間に公式プロバイダーへの切り替えを**強制的にブロック**する保護を追加し、公式 API トラフィックがローカルプロキシを経由することによるアカウント停止リスクを防ぎます。Pricing データベースは v8 → v9 で再シードされ、約 50 件の新しいモデルエントリ（Claude 4.7、Opus 4.7 Adaptive Thinking、Grok 4、Qwen 3.5/3.6、MiniMax M2.5/M2.7、Doubao Seed 2.0 系列、GLM-5/5.1 など）を追加し、いくつかの古い価格を修正しました。

### ハイライト

- **Hermes Agent サポート（6 番目の管理対象アプリ）**: データベース v9 → v10 マイグレーション、完全な Rust コマンド面、アトミックバックアップ付き YAML 読み書き、MCP 同期、Skills 同期、SQLite + JSONL セッション管理、専用フロントエンドパネル、4 つの API プロトコル（`chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`）
- **Claude Opus 4.7 の全面展開**: 適応的思考のホワイトリスト、百万トークン単位の価格シード、Bedrock SKU（`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`、旧 `-v1` サフィックスを廃止）、全アグリゲーター / Bedrock プリセットを Opus 4.7 をデフォルト Opus モデルに移行
- **Claude `max` エフォートティア**: エフォートのドロップダウンを `high` から `max` に引き上げ
- **Gemini Native API プロキシ**: 新しい `api_format = "gemini_native"` により、プロキシが Google の `generateContent` に直接転送可能に（完全なストリーミング / スキーマ変換 / シャドウリクエスト対応）
- **GitHub Copilot Enterprise Server**: Copilot ベースの Claude プロバイダーに GHES 認証とエンドポイント設定を追加
- **Copilot 交互消費の大幅最適化**: 転送前の thinking ブロック主動削除、`tool_result` メッセージ分類修正、subagent 検出、`x-interaction-id` 課金マージ、孤立 `tool_result` のサニタイズ、Warmup ダウングレードのデフォルト有効化など、premium 交互消費を系統的に削減
- **セッションリスト仮想化**: 長い会話が滑らかにスクロール。長いメッセージはデフォルトで折り畳まれ、テキストレイアウトコストを削減
- **Codex / OpenClaw セッションタイトル抽出**: 意味のあるタイトルを自動抽出（2 行表示）、OpenClaw の `message_id` 末尾ノイズを除去
- **Usage 日付範囲ピッカー**: Today / 1d / 7d / 14d / 30d プリセットタブ + カスタム日時カレンダー。ページネーションリストにページジャンプ入力
- **Stream Check エラー分類**: エラーを分類し色分けトーストで提示。デフォルト探索モデル更新。「モデルが見つからない」レスポンスを明示的に検出
- **Local Routing 有効時の公式プロバイダー切り替えブロック**: 公式 API トラフィックをローカルプロキシ経由で流すとアカウント停止のリスクがあるため、切り替えを強制ブロックして警告トーストを表示
- **Pricing データベース刷新（v8 → v9）**: 約 50 件の新しいモデルエントリを追加し、古い価格を修正
- **アプリケーションレベルのウィンドウコントロール**: CC Switch が自前で最小化 / 最大化トグル / 閉じるボタンを描画するオプション設定。Linux Wayland での体験を大きく改善
- **統一 Skills 管理への Hermes 追加**: Skill のインストール / 有効化 / フィルターが Hermes をカバー
- **Hermes / OpenClaw 設定ディレクトリのカスタマイズ**: 設定で `~/.hermes/config.yaml` や `openclaw.json` のカスタム位置を指定可能
- **ツールバーからの Hermes Dashboard 起動**: Hermes Web UI のプローブに失敗した際、ツールバーエントリからユーザーの優先ターミナルで `hermes dashboard` を実行可能
- **新パートナープリセット**: LemonData を全 6 アプリにわたって追加、DDSHub の Codex エンドポイント、StepFun Step Plan

### 新機能

#### Hermes Agent サポート（6 番目の管理対象アプリ）

CC Switch は Hermes Agent を Claude / Codex / Gemini / OpenCode / OpenClaw と並ぶ一等の管理対象アプリとして初めてサポートします。

- **データベースマイグレーション v9 → v10**: `mcp_servers` と `skills` テーブルに `enabled_hermes` カラムを追加（`DEFAULT 0`、自動マイグレーション、データ損失なし）
- **YAML 設定の読み書き**: `~/.hermes/config.yaml` をアトミックバックアップ付きで読み書き。`tests/hermes_roundtrip.rs` が OAuth MCP `auth` ブロックの消失や無関係なキーの汚染を防止
- **4 つの API プロトコル**: Hermes Agent 0.10.0 と整合する `chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`。新しいディープリンクはデフォルトで `chat_completions`
- **ユーザー `providers:` dict の読み取り専用表示**: YAML に手書きされたプロバイダーエントリは CC Switch で読み取り専用カードとして表示され、深い設定は Hermes Web UI に委譲
- **加算的な切り替え**: Claude / Codex の「上書き」型切り替えと異なり、Hermes ではすべてのプロバイダーが同じ YAML に共存

#### Hermes Memory パネル

- `MEMORY.md` / `USER.md` を直接編集できる Memory パネルを追加（有効化スイッチ、文字数制限、ライブ保存フロー付き）
- Hermes の Prompts エントリを置き換え

#### Hermes プロバイダープリセット（約 50 個）

- Nous Research、Shengsuanyun（胜算云）、OpenRouter、DeepSeek、Together AI、StepFun、Zhipu GLM、Bailian（百炼）、Kimi、MiniMax、DouBao（豆包）、BaiLing（百灵）、ModelScope（魔搭）、KAT-Coder、PackyCode、Cubence、AIGoCode、RightCode、AICodeMirror、AICoding、CrazyRouter、SSSAiCode、Micu、CTok.ai、DDSHub、E-FlowCode、LionCCAPI、PIPELLM、Compshare、SiliconFlow、AiHubMix、DMXAPI、TheRouter、Novita、Nvidia、Xiaomi MiMo をカバー

#### ツールバーからの Hermes Dashboard 起動

- Hermes Web UI のプローブに失敗した際、ツールバーエントリがユーザーの優先ターミナルで `hermes dashboard` を実行する確認ダイアログを表示
- 一時 bash / batch スクリプト経由で起動。`hermes dashboard` 自身が準備完了後にブラウザを開くため、ポーリングは不要
- Memory パネルと Health バナーは既存のトースト動作を維持
- オフラインのトーストにあった古い `hermes web` のヒントも修正（正しいコマンドは `hermes dashboard`）
- Linux ターミナル検出の順序を変更し、`/usr/bin`、`/bin`、`/usr/local/bin` を stat する前に `which` を試すように

#### Claude Opus 4.7 サポート

- Claude Opus 4.7 を追加。適応的思考のホワイトリスト、百万トークン単位の価格シード、Bedrock SKU（`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`、旧 `-v1` サフィックスを廃止）
- 全アグリゲーター / Bedrock プリセットをデフォルト Opus モデルとして Opus 4.7 に移行

#### Claude `max` エフォートティア

- Claude エフォートドロップダウンを `high` から `max` に引き上げ、より強力な推論容量を解放

#### Gemini Native API プロキシ

- 新しい `api_format = "gemini_native"` により、プロキシが Google の `generateContent` API に直接転送可能 (#1918, 感謝 @yovinchen)
- 完全なストリーミング、スキーマ変換、シャドウリクエストに対応
- proxy providers モジュール下に `gemini_url.rs`、`gemini_schema.rs`、`gemini_shadow.rs`、`streaming_gemini.rs`、`transform_gemini.rs` を追加

#### GitHub Copilot Enterprise Server（GHES）

- Copilot ベースの Claude プロバイダーに GHES 認証とエンドポイント設定を追加 (#2175, 感謝 @hotelbe)

#### セッションリスト仮想化

- `@tanstack/react-virtual` によりセッションリストを仮想化。数千件のレコードを持つ長い会話も滑らかにスクロール
- 長いセッションメッセージはデフォルトで折り畳まれ、テキストレイアウトコストを削減

#### Codex / OpenClaw セッションタイトル抽出

- Codex と OpenClaw セッションから意味のあるタイトルを自動抽出し、2 行表示
- OpenClaw の `message_id` 末尾ノイズを除去

#### Usage 日付範囲ピッカー

- Usage ダッシュボードに日付範囲セレクターを追加。プリセットタブ（Today / 1d / 7d / 14d / 30d）+ カスタム日時カレンダー (#2002, 感謝 @yovinchen)
- ページネーションリストにページジャンプ入力を追加

#### モデルマッピングのクイック入力

- プロバイダーフォームのモデルマッピングフィールドの横にクイック入力ボタンを追加し、編集を高速化 (#2179, 感謝 @lispking)

#### Stream Check エラー分類

- Stream Check エラーを分類し、色分けトーストとして提示
- デフォルトの探索モデルを各ベンダーの現行ラインナップに合わせて更新
- 「モデルが見つからない」レスポンスを明示的に検出

#### Local Routing 有効時の公式プロバイダー切り替えブロック

- Local Routing が有効な状態で公式プロバイダーに切り替えようとすると、強制的にブロックされ警告トーストが表示される
- 理由: 公式 API トラフィックをローカルプロキシ経由で流すとアカウント停止のリスクがあるため

#### Pricing データベース刷新（v8 → v9）

- マイグレーション時に定価テーブルを再シード
- Claude 4.7、Opus 4.7 Adaptive Thinking、Grok 4、Qwen 3.5/3.6、MiniMax M2.5/M2.7、Doubao Seed 2.0 系列、GLM-5/5.1 などを含む約 50 件の新しいモデルエントリを追加
- DeepSeek、Kimi K2.5 などの古い価格を修正

#### アプリケーションレベルのウィンドウコントロール

- CC Switch が自前で最小化 / 最大化トグル / 閉じるボタンを描画するオプション設定を追加。システム装飾の代わりに使用 (#1119, 感謝 @git1677967754)
- コンポジター描画ボタンが無反応になり得る Linux Wayland での体験を大きく改善

#### 統一 Skills 管理への Hermes 追加

- 統一 Skills サーフェスに Hermes を追加
- Skill のインストール / 有効化 / フィルターが、Claude / Codex / Gemini / OpenCode / OpenClaw と並んで Hermes アプリをカバー

#### OpenClaw 設定ディレクトリのカスタマイズ

- CC Switch が参照する `openclaw.json` のカスタム位置を設定できるオプションを追加 (#1518, 感謝 @mrFranklin)

#### Hermes 設定ディレクトリのカスタマイズ

- CC Switch が参照する `~/.hermes/config.yaml` のカスタム位置を設定できるオプションを追加。データ駆動 dispatch でサポート

#### StepFun Step Plan プリセット

- StepFun Step Plan（EN / ZH）プロバイダープリセットを追加 (#2155, 感謝 @hengm3467)

#### New API 用量スクリプトテンプレート

- New API の用量スクリプトテンプレートに User-Agent ヘッダーを追加し、上流互換性を向上

#### LemonData プロバイダープリセット（全 6 アプリ）

- LemonData をサードパーティパートナープリセットとして Claude、Codex、Gemini、OpenCode、OpenClaw、Hermes の全 6 アプリに登録
- アイコンアセットと zh / en / ja 三言語のパートナー推奨文面を追加
- Claude プリセットは `ANTHROPIC_API_KEY` 認証を使用。OpenAI 互換アプリは `gpt-5.4` をターゲット

#### DDSHub Codex プリセット

- DDSHub の Codex 互換エンドポイントを追加（Claude サービスと同じホスト）
- ベース URL は `/v1` サフィックスを省略（ゲートウェイが OpenAI SDK パスを自動ルーティング）

### 変更

#### 「Local Proxy Takeover」→「Local Routing」

- 三言語の UI 文言、README、ドキュメント全体で用語を統一リネーム
- 機能的な動作は変更なし

#### Hermes `Auto` api_mode の削除

- ユーザーは明示的にプロトコルを選択する必要あり。新しいディープリンクはデフォルトで `chat_completions`
- URL ベースのヒューリスティックによる意外な挙動を排除

#### Hermes プロバイダーフォーム

- API モードドロップダウンとプロバイダー単位のモデルエディターを追加
- アクティブなプロバイダーを切り替える際、プロバイダー単位のモデルをトップレベルの `model:` にバインド

#### Hermes 深い設定の委譲

- 深い YAML 設定は CC Switch フォームで重複させず、「Hermes Web UI を起動」ボタン経由で Web UI に直接委譲

#### Hermes ツールバーレイアウト

- Hermes Web UI ボタンのアイコンを `ExternalLink` から `LayoutDashboard` に変更（クリック時に単に URL を開くのではなく `hermes dashboard` を起動する場合があるため、パネル型アイコンのほうが意味的に正確）
- MCP をツールバーの末尾に移動し、Hermes のレイアウトを Claude / Codex / Gemini / OpenCode と揃える

#### Claude Quick-Set から `ANTHROPIC_REASONING_MODEL` を削除

- 推論能力とモデル選択を分離。レガシーフィールドは Quick-Set フォームから除外

#### プロバイダー単位のプロキシ設定を削除

- グローバルな Local Routing に統合
- プロバイダー単位のプロキシトグルと関連ストレージは削除済み

#### ツールバーアイコンボタン幅の統一

- Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes パネルの間でアイコンボタン幅を正規化し、ヘッダーの見た目を統一

#### Rust Toolchain を 1.95 にピン留め

- ワークスペース全体で clippy 1.95 の提案を採用し、nightly ドリフトを防ぐためツールチェーンをピン留め

#### トレイメニュー ID 定数

- トレイ識別子をハードコーディング文字列 `"main"` から `TRAY_ID` 定数（`"cc-switch"`）に移行。すべての呼び出し箇所で同期 (#1978, 感謝 @lidaxian121)

#### Copilot 交互消費の大幅最適化

Copilot リバースプロキシの premium 交互消費を削減するための系統的な最適化。以下の複数の改善をカバー:

- **転送前に thinking ブロックを主動削除**: Anthropic の `thinking` / `redacted_thinking` ブロックは OpenAI 互換エンドポイントに拒否される。従来は上流でリクエストが失敗して premium 交互を 1 回消費した後、`thinking_rectifier` によってリトライされていた。新しい主動削除ステップ（Copilot 最適化パイプラインの 3.5 ステップ目、`tool_result` マージ後）により、この無駄な premium 消費を直接解消
- **リクエスト分類の修正**: `tool_result` を含むメッセージをユーザー発起の新規リクエストではなく、エージェント継続として分類。ツール呼び出しが毎回 premium 交互としてカウントされる問題を防止
- **subagent 検出**: `__SUBAGENT_MARKER__` と `metadata._agent_` フォールバックで subagent を識別し、`x-interaction-type=conversation-subagent` を設定
- **決定論的 `x-interaction-id` による課金マージ**: セッション ID から `x-interaction-id` を導出し、同一セッション内の複数リクエストを 1 回の課金交互に統合
- **孤立 `tool_result` のサニタイズ**: 孤立した `tool_result` を整理し、上流エラーによるリトライおよび重複課金を防止
- **Warmup ダウングレードをデフォルトで有効化**: `gpt-5-mini` をデフォルトのダウングレードモデルとして使用
- **最適化パイプラインの並び替え**: classify → sanitize → merge → warmup の順序で、分類が生の `tool_result` セマンティクスを参照可能に
- `CopilotOptimizerConfig` のデフォルト値の不一致を修正（`gpt-5-mini` に統一）

#### 用量スクリプトのイントラネットサポート

- 用量スクリプトからプライベート IP / 不審なホスト名のブロッキングを削除し、エンタープライズイントラネット、Docker、自己ホスト API エンドポイントを解放
- ビルトインテンプレートは引き続き HTTPS（localhost を除く）と同一オリジンチェックを強制。カスタムテンプレートはユーザー制御のまま、リクエスト URL のチェックをスキップ

#### Failover キューの備考表示

- プロバイダーの備考が failover キューセレクターとキュー行に表示され、マルチプロバイダーキューでの識別が容易に (#2138, 感謝 @Coconut-Fish)

### バグ修正

#### 最大化後のツールバー自動折り畳みラッチ

- ウィンドウの最大化 / 復元後、ツールバーが折り畳まれたままになる問題を修正。折り畳み判定はサイズ変更時に再評価される

#### Hermes YAML 汚染と OAuth MCP `auth` 消失

- CC Switch 経由でラウンドトリップしても OAuth MCP `auth` ブロックが消失したり、無関係な YAML キーが汚染されたりしなくなった
- `tests/hermes_roundtrip.rs` をガードテストとして追加

#### Hermes アクティブプロバイダー表示

- Hermes UI がアクティブプロバイダーを正しく表示するようになり、追加 / 有効化 / 削除アクションが正しく動作

#### Hermes プロバイダーの永続化

- プロバイダーは `custom_providers:` の下に永続化され、`api_mode` と `model` が再起動 / 設定再読み込みを生き延びる

#### Hermes ヘルスチェックが OpenClaw のスキーマを流用していた問題

- 以前 Hermes プロバイダーは `check_additive_app_stream`（OpenClaw のディスパッチャー）にルーティングされており、これは camelCase の `baseUrl` / `apiKey` / `api` を読むため、Hermes フィールドをすべて記入しても "OpenClaw provider is missing baseUrl" と表示されていた
- `check_hermes_stream` を導入し、Hermes 専用のエクストラクターで `api_mode`（`chat_completions` / `anthropic_messages` / `codex_responses`）を対応する `check_claude_stream` の `api_format` にマッピング。`bedrock_converse` は非対応として返す
- URL / API キーの抽出前に `api_mode` を解決することで、`bedrock_converse` を選んだユーザーには「missing base_url」という誤解を招くメッセージではなく実際の原因が表示される

#### Hermes / OpenClaw 向け Usage クエリモーダル

- `getProviderCredentials` が Hermes（snake_case の `base_url` / `api_key`）と OpenClaw（camelCase の `baseUrl` / `apiKey`）のフラットな `settingsConfig` フィールドを読むようになり、SiliconFlow などマッチするプロバイダーで「official balance」テンプレートが自動選択される
- BALANCE と TOKEN_PLAN テストパスをリファクタリングし、`env.ANTHROPIC_*` を直接再読するのではなく、事前計算された `providerCredentials` を再利用するように変更。これにより非 Claude アプリでキーが設定されていても「empty key」エラーが出ていた問題を修正

#### Codex `cache_control` 保持

- Codex フォーマット変換中に system prompt をマージする際の `cache_control` を保持 (#1946, 感謝 @yovinchen)

#### Claude プロンプトキャッシュキーのリーク

- Claude chat 変換時にプロンプトキャッシュキーを送信しないように修正 (#2003, 感謝 @yovinchen)

#### プロキシ Hop-by-Hop レスポンスヘッダーの削除

- RFC 7230 に従ってプロキシレスポンスの hop-by-hop ヘッダー（Connection、Keep-Alive、Transfer-Encoding など）を削除 (#2060, 感謝 @yovinchen)

#### プロキシの寛容な CORS レイヤー削除

- プロキシの寛容な CORS レイヤーを削除 (#1915, 感謝 @zerone0x)

#### プロキシトーストでのバックエンドエラー詳細表示

- プロキシ関連のトーストメッセージで、汎用的な失敗文字列ではなくバックエンドのエラーペイロードの詳細を表示

#### Usage ログの重複排除

- プロキシとセッションログの用量レコードを重複排除し、同じリクエストが二重にカウントされないように修正
- リクエストログの時間範囲をダッシュボードの 1d / 7d / 30d セレクターと同期

#### Common Config チェックボックスの永続化

- Claude / Codex / Gemini の common-config トグルのチェック状態が再オープンをまたいで正しく保持されるように修正 (#2191, 感謝 @zxZeng)

#### Claude プラグイン `settings.json` 同期

- 現在のプロバイダーを編集すると、Claude プラグインパスの `settings.json` に同期されるように修正 (#1905, 感謝 @chengww5217)

#### Google Official Gemini の env 保持

- Google Official Gemini プロバイダーを保存しても `env` ブロックが消えないように修正

#### OpenCode の JSON5 による末尾カンマ解析

- OpenCode 設定読み取りが JSON5 パーサーにより末尾カンマを許容するように修正 (#2023, 感謝 @wwminger)

#### プリセットの刷新

- DeepSeek と Claude 1M の古いコンテキストウィンドウを刷新
- 古いモデル ID を刷新。Hermes のモデルリストをバックフィル
- Nous エンドポイントを修正し、Hermes のプレースホルダーアイコンを Nous ブランドのアートワークに置き換え
- 未使用の公式 Hermes プリセットを整理

#### 検索ヒット時の折り畳みメッセージの自動展開

- 隠されたコンテンツ内部で検索マッチが発生した場合、折り畳みメッセージを自動展開してマッチを示す

#### 不明なサブスクリプション配額ティアの非表示

- プロバイダーカードは不明なサブスクリプション配額ティアを表示しないように変更

#### weekly_limit ラベルの統一

- `weekly_limit` ティアラベルを公式の「7 日」命名にロケール間で揃えた

#### ルートレベルの Skill リポジトリインストール

- リポジトリのルート自体が skill の場合のインストール失敗を修正

#### Session ID 解析の clippy 警告

- session ID 解析内の冗長なクロージャを削除（clippy 警告）

#### Stream Check デフォルトモデルの刷新

- Stream Check のデフォルト探索モデルを各ベンダーの現行ラインナップに合わせて更新

#### Skills インポートの同期

- インポートされた Skills はデータベースに記録されるだけでなく、有効化されたアプリディレクトリにも即座に同期されるように変更 (#2101, 感謝 @yaoguohh)
- UI が「インストール済み」と表示しているのに対象アプリディレクトリに skill が存在しない状態を解消

#### Ghostty セッション復元

- Ghostty セッション復元の起動を `--working-directory` 付きのシェル実行に変更 (#1976, 感謝 @Suda202)
- パスにスペースや特殊文字が含まれる場合の `cwd` エスケープ問題を回避

### ドキュメント

#### README スポンサー更新

- SiliconFlow のサインアップボーナスを ¥16 に更新
- SSSAiCode のスポンサー文面を簡潔化
- パートナーロゴを更新
- 新しいスポンサーとして LemonData を追加

#### グローバルプロキシヒントの明確化

- 三言語でグローバルプロキシと Local Routing の関係を明確化

#### Takeover → Routing ドキュメントのリネーム

- テイクオーバー関連ドキュメントを三言語で routing にリネームし、アンカーを同期更新

#### PIPELLM ウェブサイト URL

- PIPELLM スポンサーのウェブサイト URL を `code.pipellm.ai` に更新

### ⚠️ 重要な変更（Breaking）

#### Hermes は明示的な `api_mode` が必須

- `Auto` モードは廃止。インポートまたはディープリンクで取得したプロバイダーはデフォルトで `chat_completions`
- 既存の `Auto` 設定のユーザーはプロトコルを選択するよう促される

#### Claude Quick-Set から `ANTHROPIC_REASONING_MODEL` を削除

- レガシーフィールドは公開されなくなった。既存の設定は自動的にクリーンアップされる

#### プロバイダー単位のプロキシ設定を削除

- グローバル Local Routing 設定に移行
- 既存のプロバイダー単位のプロキシ値は無視される

#### データベーススキーマ v9 → v10

- `mcp_servers` と `skills` に `enabled_hermes` カラムを追加
- `DEFAULT 0` で自動マイグレーション、データ損失なし

#### Pricing テーブルの再シード（v8 → v9）

- 新しいモデルと修正済み価格を取り込むため、初回起動時に `model_pricing` テーブルがクリアされ再シードされる

#### XCodeAPI プリセットの削除

- XCodeAPI プリセットを使用していたユーザーは別のプロバイダーに切り替える必要がある

### ⚠️ リスクに関する注意事項

本リリースは、リバースプロキシ型機能について v3.12.3 / v3.13.0 で提起された既存のリスク注意事項を継承します。

**GitHub Copilot リバースプロキシ**: Copilot のリバースプロキシパスを使用すると、GitHub / Microsoft の利用規約に違反する可能性があります。詳細は [v3.12.3 リリースノート](v3.12.3-ja.md#️-リスクに関する注意事項) を参照してください。

**Codex OAuth リバースプロキシ**: ChatGPT サブスクリプションで Codex OAuth リバースプロキシを使用すると、OpenAI の利用規約に違反する可能性があります。詳細は [v3.13.0 リリースノート](v3.13.0-ja.md#️-リスクに関する注意事項) を参照してください。

これらの機能を有効にすることで、ユーザーは**すべての関連リスクを自己責任で受諾**したものとみなされます。CC Switch はこれらの機能の使用に起因するアカウントの制限、警告、サービス停止について一切の責任を負いません。

### ダウンロード・インストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から対応バージョンをダウンロードしてください。

#### システム要件

| OS      | 最小バージョン               | アーキテクチャ                      |
| ------- | ---------------------------- | ----------------------------------- |
| Windows | Windows 10 以降              | x64                                 |
| macOS   | macOS 12 (Monterey) 以降     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 下表参照                     | x64                                 |

#### Windows

| ファイル                                 | 説明                                        |
| ---------------------------------------- | ------------------------------------------- |
| `CC-Switch-v3.14.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応 |
| `CC-Switch-v3.14.0-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ不要  |

#### macOS

| ファイル                         | 説明                                                     |
| -------------------------------- | -------------------------------------------------------- |
| `CC-Switch-v3.14.0-macOS.dmg`    | **推奨** - DMG インストーラー、Applications にドラッグ   |
| `CC-Switch-v3.14.0-macOS.zip`    | 解凍して Applications にドラッグ、Universal Binary       |
| `CC-Switch-v3.14.0-macOS.tar.gz` | Homebrew インストールと自動更新用                        |

> macOS 版は Apple のコード署名および公証済みで、直接インストールして使用できます。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を付与して実行、または AUR を使用                              |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.13.0] - 2026-04-10

> 軽量モード、クォータ・残高の可視化、プロバイダーモデル自動取得、Codex OAuth リバースプロキシ、トレイのアプリ別サブメニュー

### 概要

CC Switch v3.13.0 は、可観測性、プロバイダーワークフローの使いやすさ、プロキシ互換性を中心とした大型機能リリースです。Claude / Codex / Gemini の公式プロバイダー、Token Plan、Copilot、サードパーティ残高 API にわたる**クォータと残高のインライン表示**を追加し、メインウィンドウなしでシステムトレイから CC Switch を動作させる**軽量モード**を導入しました。OpenAI 互換の `/v1/models` による**自動モデル発見**を 5 つのサポート対象アプリケーションすべてに提供し、ChatGPT サブスクライバー向けの **Codex OAuth リバースプロキシ**を同梱しています。トレイメニューを**アプリ別サブメニュー**に再編成し、プロキシ転送スタックを **Hyper ベースのクライアント**に再構築し、**Skills ワークフロー**を発見、バッチ更新、ストレージ位置切り替え、および組み込みの skills.sh 検索・インストールで刷新しました。さらに、フル URL エンドポイントモード、強化されたトークン用量追跡、Copilot インタラクション最適化、マルチバイト UTF-8 ストリームチャンク境界修正、Linux 起動時の UI 応答性修正、およびよりフレンドリーな新規ユーザーオンボーディングなども含まれます。

### ハイライト

- **軽量モード**: トレイ専用の動作モード。トレイへの終了時にメインウィンドウを破棄し、必要時に再作成することで、アイドル時の CC Switch のデスクトップフットプリントを最小化
- **クォータと残高の可視化**: プロバイダーカードでのインラインクォータ/残高表示 — Claude / Codex / Gemini 公式サブスクリプション、GitHub Copilot premium interactions、Codex OAuth、Token Plan プロバイダー（Kimi / Zhipu GLM / MiniMax）、および DeepSeek / StepFun / SiliconFlow / OpenRouter / Novita AI の公式残高クエリをカバー
- **プロバイダーモデル自動取得**: Claude / Codex / Gemini / OpenCode / OpenClaw のプロバイダーフォームに OpenAI 互換の `/v1/models` 発見機能を追加。グループ化ドロップダウンと失敗時の具体的なエラーメッセージ付き
- **Codex OAuth リバースプロキシ**: ChatGPT の Codex リバースプロキシを新しい Claude プロバイダーカードタイプとして追加。ユーザーは ChatGPT サブスクリプションを Claude Code で利用可能に。マネージド OAuth ログインとサブスクリプションクォータのインライン表示を提供（[⚠️ リスクに関する注意事項](#️-リスクに関する注意事項)）
- **トレイのアプリ別サブメニュー**: トレイメニューをアプリ別サブメニューに再編成し、プロバイダー数が多くてもメニューがオーバーフローせず、バックグラウンドのプロバイダー切り替えが長いリストでもスケール
- **Skills 発見とバッチ更新**: SHA-256 ベースの skill 更新検出、各 skill および「すべて更新」のバッチ更新、`skills.sh` 検索統合、CC Switch ストレージと `~/.agents/skills` の間のストレージ位置切り替え
- **セッションワークフローの改善**: Session Manager でのバッチ削除、Claude ターミナル復元前のディレクトリピッカー、プロキシ傍受なしでの Claude / Codex / Gemini セッションログからの用量インポート、正確な Codex JSONL 解析、アプリ別の用量フィルタリング
- **OpenCode / OpenClaw Stream Check カバレッジ**: OpenCode の npm パッケージマッピング検出、OpenClaw `openai-completions` サポート、および残りの OpenClaw プロトコルバリアント
- **フル URL エンドポイントモード**: `base_url` を完全な上流エンドポイントとして扱うプロバイダーオプションを追加し、非標準 URL レイアウトを要求するベンダーに対応
- **Hyper ベースのプロキシ転送スタック**: プロキシ転送層を Hyper ベースのクライアントに再構築し、透過的なヘッダー転送、改善されたエンドポイントリライト、および動的上流エンドポイントのサポートを強化
- **Copilot インタラクション最適化**: GitHub Copilot premium interaction の不要な消費を削減するリクエスト分類とルーティングロジックを追加
- **UTF-8 ストリームチャンク境界修正**: マルチバイト UTF-8 シーケンスが TCP チャンクを跨いで分割された際の Copilot リバースプロキシ経由での文字化け（U+FFFD 置換文字）を解消するため、すべての 4 つの SSE ストリーミングパスを修正
- **Linux 起動時 UI 修正**: ユーザーが手動でウィンドウを最大化・復元するまでウィンドウ UI がクリックを受け付けない長年の問題を修正
- **初回起動オンボーディング**: 新規インストール時のワンタイムウェルカムダイアログ、Claude / OpenAI / Google 公式プリセットの自動シード、起動時の OpenCode / OpenClaw ライブ設定の自動インポート
- **Claude セッションタイトルと検索ハイライト**: カスタムタイトルメタデータ → 最初のユーザーメッセージ → ディレクトリベースネームの優先チェーンによる Claude セッションの意味のあるタイトル抽出、Session Manager 検索でのキーワードハイライト
- **URL ベースのプロバイダーアイコン**: 大きな SVG とラスター画像（PNG / JPG / WebP）を Vite URL import でロードし、小さな SVG はインライン保持するデュアルレンダリングモード
- **新プロバイダープリセット**: TheRouter、DDSHub、LionCCAPI、Shengsuanyun（胜算云）、PIPELLM、E-FlowCode を対応アプリケーションに追加

### 新機能

#### 軽量モード

CC Switch のアイドル時のデスクトップフットプリントを大幅に削減するトレイ専用動作モード。

- トレイへの終了時にメインウィンドウを隠すのではなく破棄し、UI リソースとメモリを解放
- トレイ、ディープリンク、またはシングルインスタンスアクティベーションからユーザーが CC Switch を再オープンしたときにウィンドウを再作成
- 通常起動、ディープリンク、シングルインスタンス、トレイ `show_main`、軽量モード終了など、すべてのウィンドウ再表示パスに統合

#### クォータと残高の可視化

プロバイダーカードにクォータと残高の表示を追加し、カードから離れずに残容量を確認できるようにしました。

- **公式サブスクリプション**: Claude / Codex / Gemini 公式プロバイダーのサブスクリプションクォータ表示
- **GitHub Copilot**: Copilot プロバイダーカードに premium interactions 残量を表示
- **Codex OAuth**: Codex OAuth カードに ChatGPT サブスクリプションクォータをインライン表示
- **Token Plan プロバイダー**: Kimi、Zhipu GLM、MiniMax の使用量進行表示（混乱を避けるため手動で有効化が必要）
- **サードパーティ残高**: DeepSeek、StepFun、SiliconFlow、OpenRouter、Novita AI に公式残高クエリを追加（混乱を避けるため手動で有効化が必要）
- 公式プロバイダーではヘルスチェックと用量設定ボタンを非表示にし、カードをクリーンに保つ

#### プロバイダーモデル自動取得

すべてのプロバイダーフォームに OpenAI 互換のモデル発見機能を追加し、モデル ID の手動コピー＆ペーストを不要に。

- 設定された API キーを使ってプロバイダーの `/v1/models` エンドポイントをクエリ
- ドロップダウンでモデルをカテゴリ別にグループ化
- ネットワーク / 認証 / エンドポイント未検出 / パース失敗を区別する具体的なエラーメッセージを提供
- 5 つのアプリケーション（Claude / Codex / Gemini / OpenCode / OpenClaw）すべてをサポート

#### Codex OAuth リバースプロキシ

ChatGPT サブスクライバーが ChatGPT サブスクリプションを Claude Code で利用できるリバースプロキシパスを追加。

- ChatGPT 認証を使ったマネージド OAuth ログインフロー
- API キー型プロバイダーと並ぶ新しい Claude プロバイダーカードタイプとして表示
- サブスクリプションクォータのインライン表示
- Auth Center との統合によるトークンの一元管理
- 有効化前に下記の [⚠️ リスクに関する注意事項](#️-リスクに関する注意事項) をご確認ください

#### トレイのアプリ別サブメニュー

トレイメニューを、フラットリストの代わりにアプリケーション別にプロバイダーをグループ化する構造に再編成しました。

- Claude / Codex / Gemini / OpenCode / OpenClaw のアプリ別サブメニュー
- プロバイダーが多い場合にトレイメニューが画面からはみ出すことを防止
- バックグラウンドのプロバイダー切り替えが長いリストでもクリーンにスケール

#### Skills 発見とバッチ更新

Skills 管理パネルを、発見と保守を備えた完全なワークフローにアップグレード。

- **SHA-256 更新検出**: Skill をコンテンツハッシュ化することで、どれが上流で変更されたかを UI が正確に把握
- **各 skill およびバッチ更新**: 個別の「更新」ボタンと、スライドインアニメーション付きの「すべて更新」バッチアクション
- **ストレージ位置切り替え**: CC Switch ストレージと `~/.agents/skills` の間を skill 状態を失わずに切り替え
- **公開レジストリ検索**: `skills.sh` 検索をダイアログに直接統合し、コミュニティ skill を発見しやすく

#### セッションワークフローの改善

Claude / Codex / Gemini セッションでの作業を効率化する複数のセッション管理改善。

- **セッションのバッチ削除**: Session Manager で複数のセッションを選択し、1 つのアクションで削除 (#1693, @Alexlangl に感謝)
- **復元前のディレクトリピッカー**: Claude ターミナルの復元時、事前に作業ディレクトリを選択 (#1752, @yovinchen に感謝)
- **プロキシなしのセッションログ用量**: Claude / Codex / Gemini セッションログから直接用量データをインポート — プロキシ傍受は不要
- **正確な Codex JSONL 解析**: Codex の推定用量を、JSONL セッションログの正確な解析に置き換え。Codex モデル名の正規化により料金ルックアップが一貫
- **Gemini CLI セッションログ統合**: Gemini 用量が Gemini CLI セッションログから正確に同期
- **アプリ別の用量フィルタリング**: 用量ダッシュボードを Claude / Codex / Gemini ごとに独立してフィルタリング可能

#### OpenCode / OpenClaw Stream Check カバレッジ

Stream Check パネルのカバレッジを OpenCode と OpenClaw のサーフェス全体に拡張。

- npm パッケージマッピングによる OpenCode 検出
- OpenClaw `openai-completions` プロトコルのサポート
- 残りの 3 つの OpenClaw プロトコルバリアントのサポート
- カスタムヘッダー透過、OpenClaw カスタム auth-header 検出、Bedrock エラーメッセージ、OpenCode デフォルト `baseURL` フォールバックのエッジケース処理

#### フル URL エンドポイントモード

`base_url` をパス付加を伴わない完全な上流エンドポイントとして扱うプロバイダーオプションを追加 (#1561, @yovinchen に感謝)。

- プロキシ転送と Stream Check の両方がフル URL モードに対応
- 非標準 URL レイアウトを要求するベンダーをアンブロック
- プロバイダーフォームでプロバイダー単位で設定可能

#### OpenCode StepFun Step Plan プリセット

- OpenCode 向けに StepFun Step Plan プロバイダープリセットと適切なデフォルト値を追加 (#1668, @sky-wang-salvation に感謝)

#### Copilot インタラクション最適化

GitHub Copilot premium interaction の不要な消費を削減するリクエスト分類とルーティングロジックを追加。

- 受信リクエストを意図と重要度で分類
- 価値の低いリクエストを premium interaction 消費パスから迂回
- Copilot サブスクリプションの使用可能期間を延長することを目的
- 注意: 消費を最適化しても、Copilot 外で Copilot API を使用する場合、Copilot 内で使用するよりも消費量は多くなります。

#### 初回起動ウェルカムダイアログ

新規インストールのユーザーに CC Switch のワークフローを案内するワンタイムウェルカムダイアログを追加。

- 既存のライブ設定がデフォルトプロバイダーとして保持される仕組みを説明
- 内蔵の公式プリセットによるワンクリックでの公式エンドポイント復帰を紹介
- アップグレードユーザーは空プロバイダーチェックにより自動的にスキップ

#### 公式プロバイダーの自動シード

- 起動時に Claude Official / OpenAI Official / Google Official プロバイダーエントリを自動シードし、すべてのユーザーにワンクリックで公式エンドポイントに戻るパスを提供

#### OpenCode / OpenClaw 自動インポート

- 起動時に OpenCode と OpenClaw のライブプロバイダー設定を自動インポート。Claude / Codex / Gemini で既にある自動インポート動作と同等に

#### Common Config エディタガイダンス

- Claude / Codex / Gemini の Common Config スニペットエディタモーダルに情報ガイドと空状態プロンプトを追加
- ユーザーがプロバイダー追加/編集フォームを初めて開く際、Common Config Snippets を説明するワンタイムダイアログを追加

#### Claude セッションタイトルと検索ハイライト

- Claude セッションの意味のあるタイトル抽出を追加。優先チェーン: カスタムタイトルメタデータ → 最初の実ユーザーメッセージ → ディレクトリベースネームフォールバック
- Session Manager 検索時にセッションタイトルとメッセージ内のキーワードをハイライト

#### URL ベースのプロバイダーアイコン

- アイコンシステムにデュアルレンダリングモードを追加: 小さな SVG は React コンポーネントとしてインライン、大きな SVG とラスター画像（PNG / JPG / WebP）は Vite URL import で `<img>` タグとしてロード

#### Kaku ターミナルサポート

- macOS でセッション起動用の選択可能なターミナルとして Kaku を追加。WezTerm 互換の起動パスを再利用 (#1983, @yovinchen に感謝)

#### OMO Slim Council サポート

- 内蔵 oh-my-opencode-slim エージェントとしての council のファーストクラスサポートを復元。メタデータと UI コピーを更新 (#1982, @yovinchen に感謝)

#### 新プロバイダープリセット

- **TheRouter**: Claude / Codex / Gemini / OpenCode / OpenClaw の 5 アプリに追加 (#1891, #1892, @cmzz に感謝)
- **DDSHub**: Claude のサードパーティパートナープロバイダーとして追加。アイコンとパートナープロモーションテキスト付き
- **LionCCAPI**: 5 アプリすべてに追加。OpenCode / OpenClaw は anthropic-messages プロトコルを使用
- **Shengsuanyun（胜算云）**: アグリゲーターパートナープロバイダーとして 5 アプリすべてに追加。URL ベースのアイコンとローカライズ名をサポート
- **PIPELLM**: Claude / Codex / OpenCode / OpenClaw に追加。完全なモデル定義とアイコン付き
- **E-FlowCode**: 5 アプリすべてに追加。アプリごとに異なるプロトコル設定

### 変更

#### トレイメニュー構成

- トレイメニューをアプリ別サブメニュー（Claude / Codex / Gemini / OpenCode / OpenClaw）に再編成
- オーバーフローを防ぎ、長いプロバイダーリストでもスケール

#### プロキシ転送スタック

プロキシ転送層を Hyper ベースの HTTP クライアント上に再構築 (#1714, @yovinchen に感謝)。

- 透過的なヘッダー転送: ヘッダーをアグレッシブにフィルタせずに転送
- 改善されたエンドポイントリライトロジック
- 動的上流エンドポイントへのより良いサポート
- 新しいフル URL エンドポイントモードと組み合わせ、非標準 URL レイアウトのベンダーをアンブロック

#### OAuth Auth Center UI 調整

- Auth Center のコピー、レイアウト、アイコンの表現を調整し、Codex OAuth ログインフローをよりクリーンに

#### プロバイダーキーライフサイクルと Live 同期

アディティブプロバイダーの作成/名前変更/複製フローを再構築し、OpenCode / OpenClaw およびテイクオーバーシナリオで Live 設定の書き込み、クリーンアップ、ロールバックが一貫するように (#1724, @yovinchen に感謝)。

- アディティブモードのハイライト動作がリフレッシュ後も保持 (#1747, @yovinchen に感謝)
- OpenCode / OpenClaw 全体で Live 設定の書き込みが一貫
- 操作失敗時のロールバック動作を保持

#### Codex OAuth デフォルト

- Codex OAuth プリセットを GPT-5.4 モデルファミリーに更新

### バグ修正

#### Copilot 認証とプロキシ互換性

- GitHub Copilot 認証の回帰を修正 (#1854, @Mason-mengze に感謝)
- エンタープライズおよび動的エンドポイントの処理を修正
- macOS と Linux でのクリップボード検証コードコピーを修復
- Copilot バックの Claude プロバイダーが OpenAI モデルをターゲットとする場合の Responses ルーティングを修正 (#1735, @Mason-mengze に感謝)

#### UTF-8 ストリームチャンク境界

Claude Code で Copilot リバースプロキシ経由時、中国語文字や絵文字などのマルチバイト UTF-8 シーケンスが TCP ストリームチャンクを跨いで分割される際の文字化け（U+FFFD 置換文字）を修正 (#1923, @Cod1ng に感謝)。

- すべての 4 つの SSE ストリーミングパスで `String::from_utf8_lossy` を新しい `append_utf8_safe` ヘルパーに置き換え
- 不完全な末尾バイトを残余バッファで保持し、次のチャンクとマージしてからデコード
- 直接の Copilot 接続では再現しない（フォーマット変換なしで生バイトを通すため）

#### フラグメント System Prompt の正規化

厳格な OpenAI 互換 chat バックエンド（Nvidia、Qwen 系）が変換後の Claude ペイロードに複数の system メッセージを含む場合にリクエストを拒否する問題を修正 (#1942, @yovinchen に感謝)。

- Anthropic → OpenAI chat 変換時に、system コンテンツを単一の先頭 system メッセージに正規化
- メッセージストリームの残りは変更なし

#### ストリーミングパーサー互換性

- オプションのスペースを含むフィールドを受け入れるよう SSE パースを修正し、非厳格なストリーミング実装との互換性を向上 (#1664, @Alexlangl に感謝)

#### プロバイダー切り替え状態の破損

- アプリごとのプロバイダー切り替えを直列化し、並行フェイルオーバーやホットスイッチ操作が `is_current`、設定状態、Live バックアップ状態を不整合状態のままにすることを防止

#### Claude テイクオーバー Live 設定のドリフト

- Claude テイクオーバーが有効な間のプロバイダー編集で、Live 設定が最新のプロバイダー状態と整合を保つようにし、テイクオーバー復元動作を壊さない (#1828, @geekdada に感謝)

#### WebDAV パスワード保持と検証

- 保存済みの WebDAV パスワードがリフレッシュ後も表示されるように修正
- 接続検証時に `MKCOL 405` レスポンスを正しく処理 (#1685, @Alexlangl に感謝)

#### プロバイダーカードのアクション状態

- アディティブモードのハイライト動作を修正 (#1747, @yovinchen に感謝)
- アクションボタンを常にレンダリングすることでプロバイダーカード全体の用量表示レイアウトを整列
- ハードなプロキシ切り替えブロッキングを警告パスに置き換え
- Copilot および Codex OAuth カードでサポートされていないテスト/用量アクションを無効化
- 公式プロバイダーでは用量設定とヘルスチェックのボタンを非表示
- プロバイダーカードのホバープッシュアニメーションを削除

#### 用量精度と料金

- MiniMax クォータの計算と 0% → 100% 進行を修正
- CNY → USD の料金を修正し、不足モデルを追加
- Gemini セッションログ同期の精度を改善
- セッションベースの用量エントリが「不明なプロバイダー」として表示される問題を解決

#### 用量エディタと Skills UI の回帰

- エクストラクタコード編集時に用量クエリフィールドがリセットされる問題を修正 (#1771, @if-nil に感謝)
- 壊れた `skills.sh` リンクと空の説明を修正
- 用量設定の auto-query デフォルト間隔（5 分）と数値入力のクリア問題を修正

#### 中国語 Skills 用語

- zh ロケールの設定パネルで Skills 関連ラベルを統一し、ストレージと同期オプションで一貫した表現を使用

#### 環境とプリセット互換性

- CLI スキャンで Bun グローバル bin 検出を追加 (#1742, @makoMakoGo に感謝)
- oh-my-openagent のリネームに後方互換性を持って対応 (#1746, @yovinchen に感謝)
- OpenCode `kimi-for-coding` プリセットを修正 (#1738, @makoMakoGo に感謝)
- Gemini キーチェーン解析を macOS のみに制限
- 空コレクションで発生する OpenClaw シリアライザのパニックを修正 (#1724, @yovinchen に感謝)

#### Linux 起動時の UI 応答性

ユーザーが手動でウィンドウを最大化・復元するまで、ウィンドウ UI（ネイティブタイトルバーボタンを含む）がクリックを受け付けないという長年の Linux 固有のバグを修正。

- **根本原因**: (1) Tauri webview が Linux の `show()` 後にキーボードフォーカスを取得せず、最初のクリックが X11/Wayland の click-to-activate によって消費される（Tauri #10746、wry #637）; (2) GTK surface の入力領域が、一部の WebKitGTK/コンポジター組み合わせで `visible:false → show()` パスの再交渉に失敗し、ウィンドウ全体が応答しなくなる
- **緩和策**: 起動時に `WEBKIT_DISABLE_COMPOSITING_MODE=1` を設定し、新しい `linux_fix::nudge_main_window` ヘルパーを追加。show から ~200ms 後に `set_focus` + ±1px のノーオペレーションリサイズを実行し、視覚的に見えない「最大化と復元」と同等の動作を実現
- **カバレッジ**: すべてのウィンドウ再表示パス（通常起動、ディープリンク、シングルインスタンス、トレイ `show_main`、軽量モード終了）に統合

#### Linux ヘッダーのドラッグ領域

- Wayland 下で Tauri #13440 の影響を受ける `gtk_window_begin_move_drag` パスのトリガーを回避するため、Linux ではトップヘッダーバーから `data-tauri-drag-region` を削除
- macOS のドラッグ動作は保持

#### OpenCode / OpenClaw Stream Check のエッジケース

- カスタムヘッダー透過を修正
- OpenClaw カスタム auth-header 検出を修正
- Bedrock エラーメッセージを修正
- OpenCode デフォルト `baseURL` のフォールバック処理を修正

#### プロバイダー切り替え時の重複 Toast

- プロキシ未実行時に Copilot / ChatGPT / OpenAI フォーマットプロバイダーに切り替えた際の二重 toast 通知（プロキシ必要警告 + 切り替え成功）を修正

#### セッション検索精度と中国語サポート

- プロバイダーをまたぐセッション検索結果の切り詰めを修正
- FlexSearch トークナイザーを full モードに切り替え、中国語サブストリングマッチングを正しく動作させる

#### 適応的思考の推論エフォート

- `resolve_reasoning_effort()` が適応的思考を `high` ではなく正しく `xhigh` にマッピングするよう修正（OpenAI フォーマット変換時）

#### Thinking モデルフォールバック表示

- Claude プロバイダーフォームでメインモデルのみ保存後に Thinking モデルフィールドが空で表示される問題を修正。ANTHROPIC_MODEL への読み取り専用フォールバックを適用 (#1984, @yovinchen に感謝)

#### Auth タブのローカライゼーション

- 設定の auth タブラベルに不足していた i18n 翻訳キーをすべてのロケールバンドルで修正 (#1985, @yovinchen に感謝)

#### スキーマ移行ガード

- skills または model_pricing テーブルが存在しない場合にデータベース移行が失敗する問題を修正。ALTER および UPDATE 操作の前にテーブル存在チェックを追加

### ドキュメント

#### ユーザーマニュアルの刷新

- EN / ZH / JA ユーザーマニュアルで、トレイサブメニュー、軽量モード、プロバイダーモデル取得、セッション管理、ワークスペースファイル、WebDAV v2 の動作、OpenCode / OpenClaw の有効化、その他のプロバイダーワークフロー改善を更新

#### コミュニティと貢献ドキュメント

- `CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md` を追加
- バイリンガル GitHub issue および PR テンプレートを追加
- Dependabot 設定 (#1829, @bengbengbalabalabeng に感謝) と、非アクティブな issue を自動クローズする stale-bot ワークフローを追加
- PR / push 品質チェック CI ワークフローを追加

#### Release Notes のリスク通知バックポート

- v3.12.3 の release notes に Copilot リバースプロキシのリスク通知とハイライトリンクのアンカーを 3 言語すべてに追加

#### スポンサーパートナー

- README の 3 言語すべてに Shengsuanyun、LionCC、DDS をスポンサーパートナーとして追加

### ⚠️ リスクに関する注意事項

**Codex OAuth リバースプロキシに関する免責事項**

本リリースで追加された Codex OAuth リバースプロキシ機能は、リバースエンジニアリングによる OAuth フローを通じて ChatGPT の Codex サービスにアクセスします。この機能を有効にする前に、以下のリスクをご確認ください：

1. **利用規約違反の可能性**: リバースエンジニアリングされた OAuth フローを使用して OpenAI サービスにアクセスすることは、OpenAI の利用規約に違反する可能性があります。これらの規約では、未承認の自動アクセス、サービス複製、および意図されたアクセスパスの回避が禁止されています。
2. **アカウントリスク**: OpenAI は異常な使用パターンを疑わしい自動化活動としてフラグ付けし、ChatGPT へのアクセスに一時的または永久的な制限を科す可能性があります。
3. **将来の利用保証なし**: OpenAI は認証および検出メカニズムをいつでも更新する可能性があり、現在動作する使用パターンが将来的にフラグ付けされる可能性があります。

v3.12.3 で導入された **GitHub Copilot リバースプロキシ**も、既存のリスク通知の対象となります — 詳細は [v3.12.3 リリースノート](v3.12.3-ja.md#️-リスクに関する注意事項) を参照してください。

これらの機能を有効にすることで、ユーザーは**すべてのリスクを自己責任で負う**ものとします。CC Switch は、これらの機能の使用に起因するアカウント制限、警告、またはサービス停止について一切の責任を負いません。

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 12 (Monterey) 以降         | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                   | 説明                                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.13.0-Windows.msi`            | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.13.0-Windows-Portable.zip`   | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                           | 説明                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.13.0-macOS.dmg`     | **推奨** - DMG インストーラー、ドラッグ＆ドロップでインストール   |
| `CC-Switch-v3.13.0-macOS.zip`     | 解凍して Applications にドラッグ、Universal Binary                |
| `CC-Switch-v3.13.0-macOS.tar.gz`  | Homebrew インストールと自動更新用                                 |

> macOS 版は Apple のコード署名と公証済みで、そのままインストールしてご利用いただけます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.3] - 2026-03-24

> GitHub Copilot リバースプロキシ、macOS コード署名と公証、Reasoning Effort マッピング、Tool Search 環境変数トグル、Skill バックアップ/リストア、OpenCode SQLite バックエンド

### 概要

CC Switch v3.12.3 は、GitHub Copilot リバースプロキシと Copilot Auth Center を追加し、Copilot トークンを使用した Claude/OpenAI API へのアクセスを実現しました。macOS ビルドに Apple コード署名と公証を導入し、「開発元を確認できません」の警告を解消しました。Reasoning Effort マッピングにより、Claude の thinking budget を OpenAI 互換の reasoning_effort パラメータに自動変換します。Tool Search は従来のバイナリパッチ方式から Claude 2.1.76+ ネイティブの `ENABLE_TOOL_SEARCH` 環境変数トグルに移行し、共通設定エディタから切り替え可能になりました。OpenCode バックエンドを JSON から SQLite に移行し、Skill バックアップ/リストアライフサイクル、プロキシ gzip 圧縮、o シリーズモデル互換性の改善も含まれます。

### ハイライト

- **GitHub Copilot リバースプロキシ**: Copilot トークンを使用して Claude/OpenAI API にアクセスするリバースプロキシを追加。Copilot Auth Center でトークンの取得と管理が可能（[⚠️ リスクに関する注意事項](#️-リスクに関する注意事項)）
- **macOS コード署名と公証**: macOS ビルドが Apple のコード署名と公証に対応し、初回起動時の警告なしでインストール可能に。DMG インストーラーを新たに提供
- **Reasoning Effort マッピング**: プロキシ層での自動マッピング — 明示的な `output_config.effort` を優先し、`budget_tokens` 閾値（<4000→low, 4000–16000→medium, ≥16000→high）にフォールバック。o シリーズおよび GPT-5+ モデルに対応
- **Tool Search 環境変数トグル**: バイナリパッチ方式を廃止し、Claude 2.1.76+ ネイティブの `ENABLE_TOOL_SEARCH` 環境変数による切り替えに移行。共通設定エディタから設定可能
- **Skill バックアップ/リストアライフサイクル**: アンインストール前に Skill ファイルを自動バックアップ。バックアップリスト、リストア、削除の管理機能を追加
- **OpenCode SQLite バックエンド**: OpenCode に SQLite セッションストレージを追加（既存の JSON バックエンドと併存）。ID 競合時は SQLite を優先するデュアルバックエンドスキャン
- **Codex 1M コンテキストウィンドウトグル**: 設定エディタでワンクリックで `model_context_window = 1000000` を設定可能。`model_auto_compact_token_limit` も自動設定
- **自動アップグレード無効化トグル**: Claude 共通設定エディタに `DISABLE_AUTOUPDATER` 環境変数のチェックボックスを追加し、Claude Code の自動アップグレードを防止
- **プロキシ Gzip 圧縮**: 非ストリーミングプロキシリクエストが gzip 圧縮を自動ネゴシエーションし、帯域幅消費を削減
- **o シリーズモデル互換性**: Chat Completions プロキシが o1/o3/o4-mini モデルに `max_completion_tokens` を正しく使用。Responses API は正しい `max_output_tokens` フィールドを維持
- **Skills インポートの刷新**: ファイルシステムベースの暗黙的なアプリ推論を明示的な `ImportSkillSelection` に置き換え、複数アプリの誤った有効化を防止
- **Ghostty ターミナルサポート**: Ghostty ターミナルでの Claude セッション復元を修正

### 新機能

#### GitHub Copilot リバースプロキシ

GitHub Copilot トークンを使用して Claude API および OpenAI API にアクセスするリバースプロキシ機能を追加しました。

- Copilot のアクセストークンを利用し、Claude Code や Codex などのクライアントからプロキシ経由で API リクエストを転送
- Copilot 固有のリクエストフィンガープリントとヘッダー処理に対応
- プロバイダープリセットに Copilot 用テンプレートを追加

#### Copilot Auth Center

Copilot トークンの取得と管理を行う認証センターを追加しました。

- GitHub デバイスフローによるトークン取得をサポート
- トークンの有効期限管理と自動リフレッシュ
- フロントエンドから直接トークンステータスの確認と再認証が可能

#### Reasoning Effort マッピング

OpenAI o シリーズおよび GPT-5+ モデル向けのプロキシ層自動マッピング機能を追加しました。

- 二段階の解決ロジック：明示的な `output_config.effort` を優先し、thinking `budget_tokens` 閾値（<4000→low, 4000–16000→medium, ≥16000→high）にフォールバック
- Chat Completions と Responses API の両パスをカバー、17 個のユニットテスト付き

#### Tool Search 環境変数トグル

Claude CLI Tool Search の有効化/無効化を環境変数で制御する設定を追加しました。

- Claude 2.1.76+ で導入されたネイティブの `ENABLE_TOOL_SEARCH` 環境変数を使用
- 共通設定（Common Config）エディタから直接トグル可能
- 従来のバイナリパッチ方式は不要になり、CLI アップデート時の再適用も不要

#### Skill アンインストール時の自動バックアップ

アンインストール前に Skill ファイルを自動バックアップし、意図しないデータ損失を防止します。

- バックアップは `~/.cc-switch/skill-backups/` に保存され、すべての skill ファイルと元のメタデータを含む `meta.json` が含まれます
- 古いバックアップは自動的にプルーニングされ、最大 20 個を保持
- バックアップパスはフロントエンドに返され、成功トーストに表示

#### Skill バックアップのリストアと削除

アンインストール時に作成された Skill バックアップの管理コマンドを追加しました。

- すべての利用可能な skill バックアップをメタデータ付きで一覧表示
- リストアはファイルを SSOT にコピーし、DB レコードを保存し、現在のアプリに同期。失敗時は自動ロールバック
- 削除は確認ダイアログの後にバックアップディレクトリを削除
- ConfirmDialog にネストされたダイアログスタッキングをサポートする設定可能な zIndex プロパティを追加

#### OpenCode SQLite バックエンド

OpenCode に SQLite セッションストレージサポートを追加しました（既存の JSON バックエンドと併存）。

- デュアルバックエンドスキャン、ID 競合時は SQLite を優先
- アトミックなセッション削除とパス検証
- JSON バックエンドは後方互換性のため引き続き機能

#### Codex 1M コンテキストウィンドウトグル

設定エディタに Codex 1M コンテキストウィンドウのワンクリックトグルを追加しました。

- チェックボックスで `config.toml` に `model_context_window = 1000000` を設定
- 有効化時に `model_auto_compact_token_limit = 900000` を自動設定
- 無効化時は両フィールドをクリーンに削除

#### 自動アップグレード無効化トグル

Claude 共通設定エディタに自動アップグレードを無効化するチェックボックスを追加しました。

- 有効化時に `DISABLE_AUTOUPDATER=1` 環境変数を設定し、Claude Code の自動アップグレードを防止
- Teammates モード、Tool Search、高強度思考トグルと同じ行に表示

#### macOS コード署名と公証

macOS ビルドに Apple のコード署名と公証を導入しました。

- Apple Developer ID による署名と Apple 公証サービスによる公証を実施
- 初回起動時の「開発元を確認できません」警告が不要に
- DMG インストーラーを新たに提供し、ドラッグ＆ドロップでのインストールに対応
- CI/CD パイプラインに署名・公証ステップを統合

### 変更

#### Skills キャッシュ戦略の最適化

Skills のキャッシュ戦略を最適化し、パフォーマンスと信頼性を向上しました。

- キャッシュの有効期限管理とインバリデーション戦略を改善
- 不要なキャッシュ再構築を削減し、起動時間を短縮

#### Claude 4.6 コンテキストウィンドウ更新

Claude 4.6 モデルのコンテキストウィンドウサイズを更新しました。

- Claude 4.6 の最新コンテキストウィンドウサイズをプリセットに反映

#### MiniMax M2.7 アップグレード

MiniMax モデルプリセットを M2.7 にアップグレードしました。

- MiniMax プロバイダープリセットのモデル ID とパラメータを M2.7 に更新

#### Xiaomi MiMo アップグレード

Xiaomi MiMo モデルプリセットをアップグレードしました。

- MiMo プロバイダープリセットのモデル ID とパラメータを最新版に更新

#### AddProviderDialog の簡素化

- 冗長な OAuth タブを削除し、ダイアログを 3 タブから 2 タブ（アプリ固有 + ユニバーサル）に簡素化

#### プロバイダーフォームの高度なオプション折りたたみ

- Claude プロバイダーフォームのモデルマッピング、API フォーマットなどの高度なフィールドが未入力時にデフォルトで折りたたまれるように変更
- プリセットが値を入力すると自動展開。手動クリア時は自動折りたたみしない

#### プロキシ Gzip 圧縮

非ストリーミングプロキシリクエストが gzip 圧縮をサポートし、帯域幅消費を削減しました。

- 非ストリーミングリクエストは reqwest が gzip を自動ネゴシエーションし、レスポンスを透過的に解凍
- ストリーミングリクエストは中断された SSE ストリームの解凍エラーを避けるため、保守的に `Accept-Encoding: identity` を維持

#### o1/o3 モデル互換性

プロキシ転送が OpenAI o シリーズモデルのトークンパラメータを正しく処理するようになりました。

- Chat Completions パスが o1/o3/o4-mini モデルに `max_tokens` の代わりに `max_completion_tokens` を使用 (#1451、@Hemilt0n に感謝)
- Responses API パスが正しい `max_output_tokens` フィールドを維持し、`max_completion_tokens` の誤った注入を防止

#### OpenCode モデルバリアント

- OpenCode のモデルバリアントを options 内部ではなくプリセットのトップレベルに配置し、発見しやすさを向上 (#1317)

#### Skills インポートフロー

Skills インポートフローが正確性とクリーンアップのためにリワークされました。

- ファイルシステムベースの暗黙的なアプリ推論を明示的な `ImportSkillSelection` に置き換え、同じ skill ディレクトリが複数アプリパスに存在する場合の複数アプリ誤有効化を防止
- `sync_to_app` に調整ロジックを追加し、無効化/孤立したシンボリックリンクを削除
- MCP `sync_all_enabled` がライブ設定から無効化されたサーバーを削除するように改善
- スキーママイグレーションがレガシーアプリマッピングのスナップショットを保持し、損失のある再構築を回避

### バグ修正

#### WebDAV パスワードの消失

- 無関係な設定保存時に WebDAV パスワードがサイレントにクリアされる問題を修正

#### ツールメッセージのパース

- プロキシのツールメッセージパース処理の不具合を修正し、特定のツール呼び出しパターンでのエラーを解消

#### ダークモードの表示

- ダークモードでの一部 UI コンポーネントの表示不具合を修正

#### Copilot リクエストフィンガープリント

- Copilot リバースプロキシのリクエストフィンガープリント生成の不具合を修正し、認証エラーを解消

#### プロバイダーフォームの二重送信

- プロバイダー追加/編集フォームでの高速連続クリックによる重複送信を防止 (#1352、@Hexi1997 に感謝)

#### Ghostty ターミナルセッション復元

- Ghostty ターミナルでの Claude セッション復元の失敗を修正 (#1506、@canyonsehun に感謝)

#### Skill ZIP インポート拡張子

- ZIP インポートダイアログが `.skill` ファイル拡張子をサポートするように修正 (#1240, #1455、@yovinchen に感謝)

#### Skill ZIP インストール対象アプリ

- ZIP 方式でインストールされた skill が常に Claude をデフォルトにするのではなく、現在アクティブなアプリを使用するように修正

#### OpenClaw アクティブカードのハイライト

- OpenClaw の現在アクティブなプロバイダーカードがハイライト表示されない問題を修正 (#1419、@funnytime75 に感謝)

#### TOC 付きレスポンシブレイアウト

- TOC タイトルが存在する場合のレスポンシブデザインを改善 (#1491、@West-Pavilion に感謝)

#### Skills インポートダイアログの白い画面

- ImportSkillsDialog に不足していた TooltipProvider を追加し、ダイアログを開く際のランタイムクラッシュを防止

#### パネル下部の空白エリア

- すべてのコンテンツパネルのハードコードされた `h-[calc(100vh-8rem)]` を `flex-1 min-h-0` に置き換え、異なるプラットフォーム間のオフセット値の不一致による下部のギャップを解消

### ドキュメント

#### 料金モデル ID の正規化

- 中英日三言語のユーザーマニュアルにモデル ID 正規化ルール（プレフィックス除去、サフィックストリミング、`@`→`-` 置換）の説明セクションを追加 (#1591、@makoMakoGo に感謝)

#### macOS 署名済みメッセージの更新

- README、README_ZH、インストールガイド（EN/ZH/JA）、FAQ ページ（EN/ZH/JA）からすべての `xattr` 回避策と「開発元を確認できません」警告を削除し、「Apple のコード署名と公証済み」メッセージに置換

### ⚠️ リスクに関する注意事項

**GitHub Copilot リバースプロキシに関する免責事項**

本リリースで追加された Copilot リバースプロキシ機能は、リバースエンジニアリングによる非公式 API を通じて GitHub Copilot サービスにアクセスします。この機能を有効にする前に、以下のリスクをご確認ください：

1. **利用規約違反の可能性**：この機能は [GitHub 利用規約](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)および[追加製品の利用条件](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)に違反する可能性があります。これらの規約では、過度な自動一括操作、サービスの無断複製、自動化手段によるサーバーへの過度な負荷が禁止されています。
2. **アカウントリスク**：類似ツールの利用者が GitHub から「スクリプト化されたインタラクション、または意図的に異常もしくは過度な使用」を指摘する警告メールを受け取った事例が報告されています。警告後も使用を継続した場合、Copilot へのアクセスが一時的または永久的に停止される可能性があります。
3. **将来の利用保証なし**：GitHub は検出メカニズムをいつでも更新する可能性があり、現在利用可能な使用パターンが将来的にフラグ付けされる可能性があります。

この機能を有効にすることで、ユーザーは**すべてのリスクを自己責任で負う**ものとします。CC Switch は、この機能の使用に起因するアカウント制限、警告、またはサービス停止について一切の責任を負いません。

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 12 (Monterey) 以降         | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                   | 説明                                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.3-Windows.msi`            | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.12.3-Windows-Portable.zip`   | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                           | 説明                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.12.3-macOS.dmg`     | **推奨** - DMG インストーラー、ドラッグ＆ドロップでインストール   |
| `CC-Switch-v3.12.3-macOS.zip`     | 解凍して Applications にドラッグ、Universal Binary                |
| `CC-Switch-v3.12.3-macOS.tar.gz`  | Homebrew インストールと自動更新用                                 |

> macOS 版は Apple のコード署名と公証済みで、そのままインストールしてご利用いただけます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.2] - 2026-03-12

> プロキシテイクオーバー中の共通設定保護、Snippet ライフサイクルの安定化、Codex TOML セクション対応編集

### 概要

CC Switch v3.12.2 は、信頼性を重視したパッチリリースです。プロキシテイクオーバーモードでの共通設定（Common Config）の消失問題を解決し、Codex TOML 設定の編集精度を改善しました。テイクオーバーのホットスイッチとプロバイダー同期は、ライブ設定ファイルを上書きする代わりにリストアバックアップを更新するようになりました。起動シーケンスを再整理し、テイクオーバー状態を復元する前にクリーンなライブファイルから Snippet を抽出するようにしました。また Codex の `base_url` 編集をセクション対応モデルにリファクタリングし、ファイル末尾への誤追加を防止しました。

### ハイライト

- **空状態ガイダンスの改善**: プロバイダーリストが空の場合に詳細なインポート手順を表示し、Claude/Codex/Gemini には共通設定 Snippet のヒントを条件付きで表示

- **プロキシテイクオーバーリストアフロー刷新**: ホットスイッチとプロバイダー同期がライブ設定ファイルの上書きではなくリストアバックアップの更新を行うようになり、ロールバック時に完全なユーザー設定を保持
- **Snippet ライフサイクルの安定化**: `cleared` フラグを導入し、クリア済み Snippet の自動再抽出を防止。起動順序を調整してクリーンな状態から抽出
- **Codex TOML セクション対応編集**: `base_url` と `model` フィールドの読み書きが正しい `[model_providers.<name>]` セクションを対象にするように改善
- **Codex MCP 設定の保護**: プロバイダーホットスイッチ時にリストアスナップショット内の既存 `mcp_servers` ブロックが保持されるように修正。テーブル全体の置換からサーバー ID ごとのマージに変更し、プロバイダー/共通設定の MCP 定義が競合時に優先

### 新機能

#### 空状態ガイダンスの改善

プロバイダーリストが空の場合の初回利用体験を改善しました。

- 空状態ページにプロバイダーインポートの操作ガイドを表示
- Claude/Codex/Gemini アプリケーションに共通設定 Snippet のヒントを条件付きで表示（OpenCode/OpenClaw には非表示）

### 変更

#### プロキシテイクオーバーリストアフロー

テイクオーバーのホットスイッチとプロバイダー同期ロジックをリファクタリングし、テイクオーバーライフサイクル全体で共通設定を保護します。

- テイクオーバーがアクティブな場合、プロバイダー同期がライブ設定ファイルへの直接書き込みではなくリストアバックアップを更新
- リストアスナップショットの保存前に共通設定を適用した実効プロバイダー設定を再構築し、ロールバックで実際のユーザー設定を復元
- 共通設定の使用が推測されるレガシープロバイダーに `commonConfigEnabled=true` を自動マーク

#### Codex TOML 編集エンジン

Codex `config.toml` の更新ロジックを共有のセクション対応 TOML ヘルパーにリファクタリングしました。

- Rust 側に新モジュール `codex_config.rs` を追加（`update_codex_toml_field` と `remove_codex_toml_base_url_if`）
- フロントエンドにセクション対応ユーティリティ `getTomlSectionRange` / `getCodexProviderSectionName` を追加
- `proxy.rs` に散在していたインライン TOML 編集ロジックを新モジュールに委譲

#### 共通設定初期化ライフサイクル

Snippet の抽出とマイグレーションをより堅牢にするため、起動シーケンスを再整理しました。

- 起動時にプロキシテイクオーバー状態を復元する前に、クリーンなライブファイルから共通設定 Snippet を自動抽出
- Snippet の `cleared` フラグを導入し、ユーザーが意図的にクリアしたかどうかを追跡
- 一回限りのレガシーマイグレーションフラグを永続化し、`commonConfigEnabled` のバックフィルの繰り返しを防止

### バグ修正

#### 共通設定の消失

- プロキシテイクオーバー中に共通設定が消失する複数のシナリオを修正：同期によるライブファイルの上書き、ホットスイッチによる不完全なリストアスナップショット、プロバイダー切り替え時の設定変更の消失

#### Codex リストアスナップショットの保護

- プロバイダーホットスイッチ時に Codex テイクオーバーリストアバックアップが既存の `mcp_servers` ブロックを破棄する問題を修正。MCP バックアップ保持をテーブル全体の置換からサーバー ID ごとのマージに変更し、プロバイダー/共通設定の MCP 更新が競合時に優先され、バックアップのみのサーバーも保持

#### クリア済み Snippet の復活

- 起動時の自動抽出が、ユーザーが意図的にクリアした共通設定 Snippet を再作成する問題を修正

#### Codex `base_url` の配置エラー

- Codex `base_url` の抽出と編集が正しい `[model_providers.<name>]` セクションを対象にせず、ファイル末尾に追加されたり `mcp_servers.*.base_url` をプロバイダーエンドポイントと誤認する問題を修正

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                   | 説明                                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.2-Windows.msi`            | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.12.2-Windows-Portable.zip`   | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                           | 説明                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.12.2-macOS.zip`      | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.12.2-macOS.tar.gz`   | Homebrew インストールと自動更新用                                 |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.1] - 2026-03-12

> 安定性修正、StepFun プリセット、OpenClaw authHeader 対応、新スポンサーパートナー

### 概要

CC Switch v3.12.1 は、安定性の改善とバグ修正に焦点を当てたパッチリリースです。共通設定モーダルの無限再オープンループ、WebDAV 同期時の外部キー制約エラー、複数の i18n 補間問題を修正しました。また、**StepFun（阶跃星辰）** プロバイダープリセットの追加、OpenClaw の**入力タイプ選択**と **authHeader** サポート、デフォルト Gemini モデルの **3.1-pro** へのアップグレード、4 つの新スポンサーパートナーの追加が含まれます。

### ハイライト

- **共通設定モーダル修正**: 共通設定モーダルの無限再オープンループを解決し、下書き編集サポートを追加
- **WebDAV 同期の信頼性向上**: WebDAV 同期で `provider_health` 復元時の外部キー制約エラーを修正
- **StepFun プリセット**: StepFun（阶跃星辰）プロバイダープリセットを追加、step-3.5-flash モデルを含む
- **OpenClaw 強化**: モデル詳細設定に入力タイプ選択を追加、ベンダー固有の認証ヘッダーサポート用 `authHeader` フィールドを追加
- **Gemini モデルアップグレード**: プロバイダープリセットのデフォルト Gemini モデルを 3.1-pro にアップグレード
- **新スポンサー**: Micu API、XCodeAPI、SiliconFlow、CTok をスポンサーパートナーとして追加

### 新機能

#### StepFun プロバイダープリセット

中国の主要 AI モデルプロバイダーである StepFun（阶跃星辰）のプロバイダープリセットを追加しました。

- サポート対象アプリケーション全体に StepFun プリセットエントリーを追加
- step-3.5-flash モデルを含む（#1369、@hengm3467 に感謝）

#### OpenClaw 強化

OpenClaw 設定をより細かく制御でき、ベンダー互換性を向上させました。

- モデル詳細設定に入力タイプ（input type）選択ドロップダウンを追加（#1368、@liuxxxu に感謝）
- `OpenClawProviderConfig` にオプションの `authHeader` ブール値を追加し、ベンダー固有の認証ヘッダー（例: Longcat）をサポート。フォーム状態を共有型の再利用にリファクタリング

#### スポンサーパートナー

- **Micu API**: Micu API をスポンサーパートナーとして追加、アフィリエイトリンク付き
- **XCodeAPI**: XCodeAPI をスポンサーパートナーとして追加
- **SiliconFlow**: SiliconFlow（硅基流动）をスポンサーパートナーとして追加、アフィリエイトリンク付き
- **CTok**: CTok をスポンサーパートナーとして追加

### 変更

- **UCloud → Compshare**: UCloud プロバイダーを Compshare（优云智算）にリネームし、3 言語（EN/ZH/JA）の完全な i18n サポートを追加
- **Compshare リンク**: Compshare スポンサー登録リンクを coding-plan ページに更新
- **Gemini モデルアップグレード**: プロバイダープリセットのデフォルト Gemini モデルを 2.5-pro から 3.1-pro にアップグレード

### バグ修正

#### 共通設定と UI

- 共通設定モーダルの無限再オープンループを修正し、編集中のデータ損失を防ぐための下書き編集サポートを追加
- Windows でツールバーコンパクトモードが左側のオーバーフローにより機能しない問題を修正（#1375、@zuoliangyu に感謝）
- セッション削除後にクエリデータと検索インデックスが同期されず、リストが更新されない問題を修正

#### 同期とデータ

- WebDAV 同期で `provider_health` テーブルを復元する際の外部キー制約エラーを修正

#### プロバイダーとプリセット

- Longcat プロバイダープリセットに欠落していた `authHeader: true` を追加（#1377、@wavever に感謝）
- OpenClaw のツール権限プロファイルをアップストリームスキーマに合わせて修正（#1355、@bigsongeth に感謝）
- X-Code API の URL を `www.x-code.cn` から `x-code.cc` に修正

#### i18n とローカリゼーション

- Stream Check トーストの i18n 補間キーが翻訳プレースホルダーと一致しない問題を修正
- プロキシ起動トーストでアドレスとポート値が補間されない問題を修正（#1399、@Mason-mengze に感謝）
- OpenCode の API フォーマットラベルを「OpenAI」から「OpenAI Responses」にリネームし、正確性を向上

### 謝辞

以下のコントリビューターの皆様、このリリースへの貢献に感謝します！

@hengm3467 @liuxxxu @bigsongeth @zuoliangyu @wavever @Mason-mengze

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                   | 説明                                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.1-Windows.msi`            | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.12.1-Windows-Portable.zip`   | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                           | 説明                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.12.1-macOS.zip`      | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.12.1-macOS.tar.gz`   | Homebrew インストールと自動更新用                                 |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.0] - 2026-03-09

> Stream Check が復活し、OpenAI Responses API に対応、OpenClaw と WebDAV も大幅強化

### 概要

CC Switch v3.12.0 は、プロバイダー互換性、OpenClaw の設定編集、共通設定の使い勝手、同期とデータ保守性を強化する機能リリースです。安定性を強化した **Model Health Check (Stream Check)** UI を復元し、**OpenAI Responses API** 形式変換を追加、**Ucloud**、**Micu**、**X-Code API**、**Novita**、**Bailian For Coding** などのプリセットを拡張し、**WebDAV 同期** に二層バージョニングを導入しました。

### ハイライト

- **Stream Check 復活**: モデルヘルスチェック UI を復元し、初回確認ダイアログを追加、`openai_chat` プロバイダー対応も修正
- **OpenAI Responses API**: `api_format = "openai_responses"` を追加し、双方向変換と共有変換ロジックの整理を実施 — プロバイダー追加時に Responses API フォーマットを選択してプロキシテイクオーバーを有効にするだけで、Claude Code で GPT シリーズモデルが使えます！
- **OpenClaw パネル強化**: JSON5 round-trip 編集、設定ヘルスバナー、改良された Agent Model 選択、User-Agent トグルを導入
- **プリセット拡張**: Ucloud、Micu、X-Code API、Novita、Bailian For Coding を追加・更新し、SiliconFlow partner badge とモデルロールバッジも追加
- **同期と保守の改善**: WebDAV protocol v2 + db-v6、daily rollups、incremental auto-vacuum、sync-aware backup を追加
- **共通設定の使い勝手向上**: 共通設定スニペットを更新すると、プロバイダー切り替え時に自動的に反映されるようになりました。手動でチェックを入れ直す必要はありません

### 主な機能

#### モデルヘルスチェック (Stream Check)

Stream Check パネルを復元し、プロバイダーの可用性をリアルタイムで検証できるようにしました。

- Stream Check UI パネルを復元し、単一またはバッチでのプロバイダー可用性検出をサポート
- 初回使用確認ダイアログを追加、ヘルスチェック非対応プロバイダーの誤検出によるユーザー混乱を防止
- `openai_chat` API フォーマットプロバイダーの検出互換性を修正

#### OpenAI Responses API

新しい `openai_responses` API フォーマットを追加し、OpenAI Responses API を使用するプロバイダーのネイティブサポートを提供します。

- `api_format = "openai_responses"` プロバイダーフォーマットオプションを追加
- Anthropic Messages <-> OpenAI Responses API の双方向フォーマット変換をサポート
- 共有変換ロジックを整理し、重複コードを削減

#### Bedrock リクエストオプティマイザー

AWS Bedrock プロバイダー向けに PRE-SEND フェーズのリクエスト最適化を追加し、互換性とパフォーマンスを向上させました。

- PRE-SEND thinking + cache injection オプティマイザー（#1301、@keithyt06 に感謝）

#### OpenClaw 設定強化

OpenClaw の設定編集体験を全面的にアップグレードし、より豊富な設定管理をサポートします。

- JSON5 round-trip 書き戻し: 編集時にコメントとフォーマットを保持
- EnvPanel の JSON 編集モードと `tools.profile` 選択をサポート
- 設定検証バナーと設定ヘルスステータスチェックを追加
- Agent モデルのドロップダウン改善、プロバイダープリセットから推奨モデルを自動入力
- User-Agent トグル: リクエストに OpenClaw 識別子を付加する機能（デフォルトオフ）
- Legacy timeout 設定の自動マイグレーション

#### プロバイダープリセット

新規および既存のプロバイダープリセットを拡張し、より多くのプロバイダーとユースケースをカバーします。

- **Ucloud**: `endpointCandidates` および OpenClaw デフォルト値を追加、`templateValues` / `suggestedDefaults` を更新
- **Micu**: プリセットデフォルト値および OpenClaw 推奨モデルを追加
- **X-Code API**: Claude プリセットおよび `endpointCandidates` を追加
- **Novita**: プロバイダープリセットを追加（#1192、@Alex-wuhu に感謝）
- **Bailian For Coding**: プロバイダープリセットを追加（#1263、@suki135246 に感謝）
- **SiliconFlow**: partner badge 識別を追加
- **モデルロールバッジ**: プロバイダープリセットでモデルロール badge 表示をサポート

#### WebDAV 同期強化

WebDAV 同期に二層バージョン管理を導入し、同期の信頼性とデータ安全性を向上させました。

- WebDAV protocol v2 + db-v6 二層バージョン管理を追加
- WebDAV auto-sync の切り替え時に確認ダイアログを表示し、誤操作を防止
- sync-aware backup: 同期時にローカル専用テーブルを除外した sync バリアントバックアップを使用

#### 使用量とデータ

使用量統計とデータ保守機能を強化し、より精密なデータ管理を実現、データベースの増加速度を大幅に抑制します。

- Daily rollups: 日次で使用量データを集計し、ストレージ使用量を削減
- Auto-vacuum: インクリメンタルなデータベースクリーンアップ、データベースの健全性を維持
- UsageFooter に追加統計フィールドを追加（#1137、@bugparty に感謝）

#### その他の新機能

- **セッション削除**: プロバイダー単位のクリーンアップとパス安全性検証付きのセッション削除
- **Claude auth field selector 復元**: 認証フィールドセレクターを復元
- **Failover トグルをメインページへ移動**: failover toggle を設定パネルからメインページに独立表示し、初回確認ダイアログを追加
- **共通設定の自動抽出**: 初回起動時に live config から共通設定スニペットを自動抽出
- **新規プロバイダーページの改善**: 新規プロバイダーページの体験を最適化（#1155、@wugeer に感謝）

### アーキテクチャ改善

#### Common Config ランタイムオーバーレイ

共通設定スニペット（Common Config Snippet）をランタイムオーバーレイ方式に変更し、保存済みプロバイダー設定への物理マージを廃止しました。

**変更前**: Common Config の内容は保存時または切り替え時に各プロバイダーの `settings_config` に直接マージされていました。これにより共通設定が各プロバイダーエントリーにコピーされ、変更時には一つずつ同期する必要がありました。

**変更後**: Common Config はプロバイダー切り替え時に live ファイルへ書き込む際のみ runtime overlay として注入され、プロバイダーエントリー自体には共通設定を含みません。つまり Common Config の変更は即座に反映され、各プロバイダーを個別に更新する必要はありません。

#### Common Config 初回自動抽出

初回起動時にデータベースに Common Config Snippet がまだ存在しない場合、現在の live config から自動抽出します。これにより旧バージョンからアップグレードしたユーザーの既存の共通設定が失われないことを保証します。

#### 定期メンテナンスタイマー統合

daily rollups と auto-vacuum を統一の定期メンテナンスタイマーに統合し、複数の独立タイマーによるリソース競合と複雑さを回避しました。

### バグ修正

#### プロキシとストリーミング

- OpenAI ChatCompletion -> Anthropic Messages のストリーミング変換問題を修正
- Codex `/responses/compact` ルーティングをサポート（#1194、@Tsukumi233 に感謝）
- TOML 設定マージロジックを改善し、キー値の欠落を回避
- proxy forwarder の失敗ログを改善し、診断情報を追加

#### プロバイダーとプリセットの修正

- X-Code を X-Code API にリネームし、ブランド名称を統一
- SSSAiCode の `/v1` パス問題を修正
- AICoding URL の誤った `www` プレフィックスを削除
- 新規プロバイダーページの改行削除問題を修正（#1155、@wugeer に感謝）

#### プラットフォーム修正

- cache hit token の統計欠落を修正（#1244、@a1398394385 に感謝）
- 最小化後しばらくすると自動終了する問題を修正（#1245、@YewFence に感謝）

#### i18n 修正

- 69 個の欠落翻訳キーを補完し、残りのハードコード中国語を除去
- model test panel の i18n 問題を修正
- JSON5 slash escaping を正規化し、国際化文字列の解析異常を回避

#### UI 修正

- Skills カウント表示の問題を修正（#1295、@fzzv に感謝）
- endpoint speed test から HTTP ステータスコード表示を削除し、視覚的ノイズを軽減
- outline button のスタイル問題を修正（#1222、@Sube-py に感謝）

### パフォーマンス

- OpenClaw 設定が未変更の場合に不要な書き込みをスキップし、ディスク I/O を削減

### ドキュメント

- ユーザーマニュアルを i18n 対応で再構成し、EN/JA の内容を拡充
- OpenClaw の説明を追加し、設定ドキュメントを補完
- UCloud スポンサー情報を追加
- docs ディレクトリを再編成し、EN/ZH/JA の README 機能説明を同期

### 注意事項

- **Common Config はランタイムオーバーレイに変更**: 共通設定スニペットは各プロバイダー設定への物理マージではなく、切り替え時に動的にオーバーレイされます。Common Config の変更は即座に反映され、各プロバイダーを個別に更新する必要はありません。
- **Stream Check は初回使用時に確認が必要**: 初回使用時にモデルヘルスチェックの確認ダイアログが表示され、確認後に使用可能になります。
- **OpenClaw の User-Agent トグルはデフォルトオフ**: OpenClaw 設定で User-Agent 識別子の付加機能を手動で有効にする必要があります。

### 謝辞

以下のコントリビューターの皆様、このリリースへの貢献に感謝します！

@keithyt06 @bugparty @Alex-wuhu @suki135246 @Tsukumi233 @wugeer @fzzv @Sube-py @a1398394385 @YewFence

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                 | 説明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.12.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.12.0-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                         | 説明                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.12.0-macOS.zip`    | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.12.0-macOS.tar.gz` | Homebrew インストールと自動更新用                                 |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.1] - 2026-02-28

> 部分キーフィールドマージの撤回、共通設定スニペットの復元とバグ修正

### 概要

CC Switch v3.11.1 は修正リリースです。v3.11.0 で導入された**部分キーフィールドマージ**アーキテクチャを撤回し、実績のある「**完全設定上書き + 共通設定スニペット**」メカニズムを復元しました。また、複数の UI とプラットフォーム互換性の問題を修正しています。

### ハイライト

- **完全設定上書き + 共通設定スニペットの復元**: 重大なデータ損失問題のため部分キーフィールドマージを撤回、完全設定スナップショット書き込みと共通設定スニペット UI を復元
- **プロキシパネルの改善**: プロキシトグルをパネル本体に移動し、テイクオーバーオプションの発見性を向上
- **テーマとコンパクトモードの修正**: 「システムに従う」テーマが正しく自動更新、コンパクトモードの終了が正常に動作
- **Windows 互換性**: プロトコルハンドラーの副作用を防ぐため、環境チェックとワンクリックインストールを無効化

### 撤回

#### 完全設定上書き + 共通設定スニペットの復元

v3.11.0 で導入された部分キーフィールドマージリファクタリングを撤回しました（revert 992dda5c）。

**撤回理由**: 部分キーフィールドマージのアプローチには3つの重大な問題がありました：
1. **切り替え時のデータ損失**: ホワイトリストにないカスタムフィールドがプロバイダー切り替え時にサイレントに破棄された
2. **バックフィルによる永続的な剥離**: バックフィル操作がデータベースから非キーフィールドを永続的に削除し、不可逆なデータ損失を引き起こした
3. **メンテナンス負担**: 「キーフィールド」のホワイトリストは新しい設定キーが追加されるたびに継続的なメンテナンスが必要

**復元された内容**:
- プロバイダー切り替え時の完全設定スナップショット書き込み（予測可能な完全上書き）
- 共通設定スニペット UI およびバックエンドコマンド
- 6つのフロントエンドファイル（コンポーネント 3つ + hooks 3つ）

**移行ガイド**:
- v3.11.0 にアップグレードしてプロバイダーのカスタムフィールドが失われた場合は、設定を再インポートするか、欠落したフィールドを手動で追加してください
- 共通設定スニペット機能が再び利用可能です — プロバイダー切り替え時に保持すべき共有設定を定義するために使用してください

### 変更

- **プロキシパネルレイアウト**: プロキシのオン/オフトグルをアコーディオンヘッダーからパネルのコンテンツエリアに移動し、アプリテイクオーバーオプションの直上に配置。プロキシを有効にした後すぐにテイクオーバー設定が見えるようになり、「プロキシだけ有効にしてテイクオーバーを設定しない」というよくある誤操作を防止
- **OpenCode/OpenClaw の手動インポート**: 起動時の自動インポートを削除。空の状態ページに「現在の設定をインポート」ボタンを表示し、Claude/Codex/Gemini と同じ動作に統一

### 修正

- **「システムに従う」テーマが自動更新されない**: Tauri のネイティブテーマ追跡（`set_window_theme(None)`）に委譲し、WebView の `prefers-color-scheme` メディアクエリが OS テーマの変更に同期するように修正
- **コンパクトモードを終了できない**: `toolbarRef` の `flex-1` を復元し、`useAutoCompact` の終了条件がコンテンツ幅ではなく利用可能な幅に基づいて正しくトリガーされるように修正
- **プロキシテイクオーバー Toast に {{app}} が表示される**: プロキシテイクオーバーの有効/無効メッセージの i18next `t()` 呼び出しに欠落していた `app` 補間パラメータを追加
- **Windows プロトコルハンドラーの副作用**: 意図しないプロトコルハンドラー登録を防ぐため、Windows で環境チェックとワンクリックインストールを無効化

### 注意事項

- **共通設定スニペットが復活しました**: v3.10.x 以前でこの機能を使用していた場合、同じ方法で動作します。プロバイダー切り替え時に保持すべき共有設定を定義するために使用してください。
- **v3.11.0 部分キーフィールドマージユーザーの方へ**: v3.11.0 でプロバイダー切り替え後に設定フィールドが欠落していた場合は、設定を再インポートして復元してください。

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                 | 説明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.11.1-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.11.1-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                         | 説明                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.11.1-macOS.zip`    | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.11.1-macOS.tar.gz` | Homebrew インストールと自動更新用                                 |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.0] - 2026-02-26

> OpenClaw サポート、セッションマネージャー、バックアップ管理と 50 以上の改善

### 概要

CC Switch v3.11.0 は大規模なアップデートです。5番目のアプリケーション **OpenClaw** の完全管理サポートを追加し、新しい**セッションマネージャー**と**バックアップ管理**機能を導入しました。さらに、**Oh My OpenCode (OMO) 統合**、プロバイダー切り替えの**部分キーフィールドマージ**アーキテクチャアップグレード、**設定ページのリファクタリング**など、多数の改善により全体的な体験がさらに向上しました。

### ハイライト

- **OpenClaw サポート**: 5番目の管理対象アプリ、13 のプロバイダープリセット、Env/Tools/AgentsDefaults 設定エディター、Workspace ファイル管理
- **セッションマネージャー**: 5つのアプリの会話履歴を閲覧、目次ナビゲーションとセッション内検索
- **バックアップ管理**: 独立バックアップパネル、設定可能なポリシー、定期バックアップ、マイグレーション前自動バックアップ
- **Oh My OpenCode 統合**: 完全な OMO 設定管理、OMO Slim 軽量モードサポート
- **部分キーフィールドマージ（⚠️ 破壊的変更）**: プロバイダー切り替え時にプロバイダー関連フィールドのみ置換し、その他の設定を保持；「共通設定スニペット」機能は削除されました
- **設定ページリファクタリング**: 5タブレイアウト、コード量約 40% 削減
- **6つの新プロバイダープリセット**: AWS Bedrock、SSAI Code、CrazyRouter、AICoding など
- **Thinking Budget Rectifier**: より精密な thinking budget 制御
- **テーマ切り替えアニメーション**: 円形リビール遷移アニメーション
- **WebDAV 自動同期**: 自動同期と大容量ファイル保護

### 主な機能

#### OpenClaw サポート（新しい5番目のアプリ）

Claude Code、Codex、Gemini CLI、OpenCode に続く5番目の管理対象アプリケーションとして OpenClaw の完全管理サポートを追加しました。

- **プロバイダー管理**: OpenClaw プロバイダーの追加、編集、切り替え、削除、13 の内蔵プリセット
- **設定エディター**: Env（環境変数）、Tools（ツール）、AgentsDefaults（エージェントデフォルト）の3つの専用パネル
- **Workspace パネル**: HEARTBEAT/BOOTSTRAP/BOOT ファイル管理とデイリーメモリ
- **Additive オーバーレイモード**: 上書きではなく設定の重ね合わせをサポート
- **デフォルトモデルボタン**: ワンクリックで推奨モデルを入力、プロバイダー追加時に候補モデルを allowlist に自動登録
- **ブランドとインタラクション**: 専用ブランドアイコン、アプリ切り替えフェード遷移アニメーション
- **ディープリンクサポート**: URL 経由で OpenClaw プロバイダー設定をインポート
- **完全な国際化**: 中/英/日 三言語完全対応

#### セッションマネージャー

会話履歴を閲覧・検索できる新しいセッションマネージャーです。

- Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw の5つのアプリの会話履歴を閲覧（#867、@TinsFox に感謝）
- 目次ナビゲーションとセッション内検索
- セッションページに入ると現在のアプリで自動フィルター
- 並列ディレクトリスキャン + ヘッドテール JSONL 読み取りで読み込みパフォーマンスを最適化

#### バックアップ管理

データの安全性を高める独立バックアップ管理パネルです。

- 設定可能なバックアップポリシー: 最大バックアップ数、自動クリーンアップルール
- ランタイム中の1時間ごとの定期自動バックアップ
- データベースマイグレーション前の自動バックアップ、バックフィル警告プロンプト
- バックアップのリネームと削除をサポート（確認ダイアログ付き）
- バックアップファイル名にローカルタイムを使用、より直感的に

#### Oh My OpenCode (OMO) 統合

完全な Oh My OpenCode 設定ファイル管理です。

- エージェントモデル選択、カテゴリ設定、推奨モデル入力（#972、@yovinchen に感謝）
- エージェントモデル選択 UX の改善、lowercase key 問題の修正（#1004、@yovinchen に感謝）
- OMO Slim 軽量モードサポート
- OMO と OMO Slim の相互排他（データベースレベルで一貫性を保証）

#### ワークスペース

- デイリーメモリファイルの全文検索、日付順ソート
- ディレクトリパスがクリック可能に、ファイル位置をすばやく開く

#### ツールバー

- AppSwitcher がウィンドウ幅に応じて自動的にコンパクトモードに折りたたみ
- コンパクトモード切り替えのスムーズ遷移アニメーション

#### 設定

- プロキシと使用量機能に初回使用確認ダイアログを追加、誤操作を防止
- `enableLocalProxy` スイッチを追加、ホーム画面のプロキシ UI 表示を制御
- より詳細なローカル環境チェック: CLI ツールバージョン検出（#870、@kv-chiu に感謝）、Volta パス検出（#969、@myjustify に感謝）

#### プロバイダープリセット

- **AWS Bedrock**: AKSK と API Key の2種類の認証方式をサポート（#1047、@keithyt06 に感謝）
- **SSAI Code**: パートナープリセット、5アプリ対応
- **CrazyRouter**: パートナープリセットと専用アイコン
- **AICoding**: パートナープリセットとプロモーションテキスト
- 国内モデルプロバイダープリセットを最新版に更新
- Qwen Coder を百炼 (Bailian) にリネーム（#965、@zhu-jl18 に感謝）

#### その他の新機能

- **Thinking Budget Rectifier**: より精密な thinking budget 制御（#1005、@yovinchen に感謝）
- **WebDAV 自動同期**: 自動同期設定と大容量ファイル保護（#923、@clx20000410 に感謝；#1043、@SaladDay に感謝）
- **テーマ切り替えアニメーション**: 円形リビール遷移アニメーション（#905、@funnytime75 に感謝）
- **Claude 設定エディタークイックトグル**: よく使う設定項目のクイック切り替え（#1012、@JIA-ss に感謝）
- **動的エンドポイントヒント**: API フォーマット選択に基づく動的ヒントテキスト（#860、@zhu-jl18 に感謝）
- **使用量ダッシュボード強化**: 自動更新、堅牢なフォーマット（#942、@yovinchen に感謝）
- **新しい価格データ**: claude-opus-4-6 と gpt-5.3-codex（#943、@yovinchen に感謝）
- **サイレント起動の最適化**: サイレント起動オプションは自動起動が有効な場合のみ表示

### アーキテクチャ改善

#### 部分キーフィールドマージ（⚠️ 破壊的変更）

プロバイダー切り替えを完全な設定上書きから部分キーフィールドマージ戦略に変更しました（#1098）。

**変更前**: プロバイダーを切り替えると、`settings_config` 全体がライブ設定ファイルに上書きされていました。つまり、ユーザーがライブファイルに手動で追加した非プロバイダー設定（プラグイン設定、MCP 設定、権限設定など）は、切り替えのたびに失われていました。この問題を補うため、以前のバージョンでは「共通設定スニペット」機能を提供し、毎回の切り替え時にマージされる共通設定を定義できました。

**変更後**: プロバイダー切り替え時に、プロバイダー関連のキー値（API キー、エンドポイント、モデルなど）のみが置換され、その他の設定はそのまま保持されます。そのため「共通設定スニペット」機能は不要となり、削除されました。

**影響と移行**:
- 共通設定スニペットを**使用していなかった**場合、この変更は完全に透過的で、切り替え体験が向上するだけです
- カスタム設定（MCP 設定、権限など）を保持するために共通設定スニペットを**使用していた**場合、それらの設定は切り替え時に自動的に保持されるようになり、追加の操作は不要です
- 共通設定スニペットを他の目的（切り替え時に追加設定を注入するなど）で使用していた場合は、アップグレード後にライブ設定ファイルに手動で設定を追加してください

このリファクタリングにより、フロントエンドファイル 6 つ（コンポーネント 3 つ + hooks 3 つ）と約 150 行のバックエンドデッドコードを削除しました。

#### 手動インポートに変更

起動時の自動インポートを廃止し、手動の「現在の設定をインポート」ボタンに変更。意図しないユーザーデータの上書きを防止します。

#### OmoVariant パラメータ化

`OmoVariant` 構造体によるパラメータ化で、OMO モジュールの約250行の重複コードを削除しました。

#### OMO 共通設定の削除

2層マージシステムを削除し、約1,733行のコードを削減、アーキテクチャを簡素化しました。

#### ProviderForm 分割

ProviderForm コンポーネントを2,227行から1,526行に削減し、5つの独立モジュール（opencodeFormUtils、useOmoModelSource、useOpencodeFormState、useOmoDraftState、useOpenclawFormState）に分離。保守性が大幅に向上しました。

#### MCP/Skills 共有コンポーネント

AppCountBar、AppToggleGroup、ListItemRow などの共有コンポーネントを抽出し、MCP と Skills パネルの重複コードを削減（#897、@PeanutSplash に感謝）。

#### 設定ページリファクタリング

設定ページを5タブレイアウト（一般 | プロキシ | 詳細 | 使用量 | 情報）にリファクタリング。SettingsPage のコードを約716行から約426行に削減しました。

#### その他の改善

- ターミナル統一: グローバル設定でターミナル選択を統一、WezTerm サポートを追加
- Claude モデル参照を 4.5 から 4.6 に更新

### バグ修正

#### 重大な修正

- **Windows ホームディレクトリ回帰**: デフォルトのホームディレクトリ解決を復元し、Git/MSYS 環境でのデータベースパス変更によるデータ「消失」を防止
- **Linux 白画面**: AMD GPU の WebKitGTK ハードウェアアクセラレーションを無効化し、一部の Linux システムの起動白画面問題を解決（#986、@ThendCN に感謝）
- **OpenAI Beta パラメータ**: `/v1/chat/completions` に `?beta=true` を追加しないように修正、Nvidia など OpenAI Chat 形式を使用するプロバイダーのリクエスト失敗を修正（#1052、@jnorthrup に感謝）
- **ヘルスチェック認証**: プロバイダーの `auth_mode` 設定を尊重し、Bearer 認証のみをサポートするプロキシサービスのヘルスチェック失敗を回避（#824、@Jassy930 に感謝）

#### プロバイダープリセット修正

- OpenClaw `/v1` プレフィックスの二重パス問題を修正
- Opus 価格修正（$15/$75 → $5/$25）と 4.6 へのアップグレード
- AIGoCode URL を `https://api.aigocode.com` に統一
- Zhipu GLM の古いパートナーステータスを削除
- 新規 Claude プロバイダー作成時の API Key 入力フィールドの表示を復元
- 非アクティブプロバイダーのクイックトグルを非表示、コンテキスト対応の JSON エディターヒントを表示

#### OMO 修正

- omo-slim カテゴリチェックの補完（add/form/mutation パス）
- OMO Slim プロバイダー変更後のクエリキャッシュ無効化を修正
- OMO agent/category 推奨モデルをアップストリームソースと同期
- 「推奨を入力」ボタン失敗時の toast フィードバックを追加
- OMO/OMO Slim の最後のプロバイダー削除制限を撤廃
- OpenCode でモデル未設定時の保存を拒否（#932、@yovinchen に感謝）

#### OpenClaw 修正

- 25個の欠落 i18n キー、key={index} を安定 ID に置換、ディープリンク additive マージなどのコードレビュー問題を修正
- EnvPanel 堅牢性強化（NaN ガード、配列インデックスではなくエントリーキー名を使用）
- i18n 重複キーのマージ、プロバイダーフォーム翻訳を復元

#### プラットフォーム修正

- Windows サイレント起動時のウィンドウフラッシュ（#901、@funnytime75 に感謝）
- タイトルバーのダークモード追従（#903、@funnytime75 に感謝）
- Windows の Skills パスセパレーターマッチング（#868、@stmoonar に感謝）
- WSL ヘルパー関数の条件付きコンパイル

#### UI 修正

- ツールバーの高さクリッピングによる AppSwitcher の遮蔽を修正
- 新バージョンがある場合、緑のチェックマークではなく更新バッジを表示
- セッションマネージャーボタンを Claude/Codex アプリでのみ表示
- SQL インポート/エクスポートカードのダークモードスタイルを統一（#1067、@SaladDay に感謝）

#### その他の修正

- セッションマネージャーのハードコードされた中国語文字列を i18n キーに置換
- Skill ドキュメント URL のブランチとパスを修正（#977、@yovinchen に感謝）
- OpenCode install.sh インストールパス検出の補完（#988、@zhu-jl18 に感謝）
- Skill ZIP シンボリックリンク解決の修正（#1040、@yovinchen に感謝）
- MCP フォームに OpenCode チェックボックスを追加（#1026、@yovinchen に感謝）
- useProvidersQuery の自動インポート副作用を削除

### パフォーマンス最適化

- セッションパネルの並列ディレクトリスキャン + ヘッドテール JSONL 読み取りで、セッションリスト読み込み速度を大幅向上
- Tauri ローカル IPC の不要な query cache を削除し、メモリ使用量を削減

### ドキュメント

- スポンサー更新: SSSAiCode、Crazyrouter、AICoding、Right Code、MiniMax
- ユーザーマニュアルを追加（#979、@yovinchen に感謝）

### 注意事項

- **OpenClaw は新しくサポートされたアプリです**: 関連機能を使用するには、先に OpenClaw CLI をインストールする必要があります。
- **⚠️ 共通設定スニペット機能は削除されました**: プロバイダー切り替えが部分キーフィールドマージ（API キー、エンドポイント、モデルなどのみ置換）に変更されたため、ユーザーのその他の設定は自動的に保持され、共通設定スニペットは不要になりました。移行の詳細は上記「アーキテクチャ改善」セクションを参照してください。
- **自動インポートは手動に変更されました**: 起動時に外部設定を自動インポートしなくなりました。必要に応じて「現在の設定をインポート」を手動でクリックしてください。
- **OMO と OMO Slim は相互排他**: 同時に一つだけ有効にできます。切り替え時にもう一方は自動的に無効になります。
- **バックアップ機能はデフォルトで有効**: ランタイム中に1時間ごとに自動バックアップします。バックアップパネルでポリシーを調整できます。

### 特別な感謝

以下のコントリビューターの皆様、このリリースへの貢献に感謝します！

@TinsFox @keithyt06 @kv-chiu @SaladDay @jnorthrup @JIA-ss @clx20000410 @ThendCN @yovinchen @zhu-jl18 @myjustify @funnytime75 @PeanutSplash @Jassy930 @stmoonar

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                 | 説明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.11.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.11.0-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                         | 説明                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.11.0-macOS.zip`    | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.11.0-macOS.tar.gz` | Homebrew インストールと自動更新用                                 |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.10.0] - 2026-01-21

> OpenCode サポート、グローバルプロキシ、Claude Rectifier とマルチアプリ体験の強化

### 概要

CC Switch v3.10.0 では OpenCode サポートが追加され、4番目の管理対象 CLI アプリケーションとなりました。
また、グローバルプロキシ設定、Claude Rectifier（thinking 署名修正機能）、ヘルスチェックの強化、プロバイダー別設定など、多くの重要な機能が追加され、マルチアプリワークフローとターミナル体験が全面的に改善されました。

### ハイライト

- OpenCode サポート：プロバイダー、MCP サーバー、Skills の完全管理、初回起動時の自動インポート
- グローバルプロキシ：すべての送信ネットワークリクエストに統一プロキシを設定
- Claude Rectifier：thinking 署名修正機能、サードパーティ API との互換性向上
- ヘルスチェック強化：カスタムプロンプト設定、CLI 互換リクエスト形式
- プロバイダー別設定：プロバイダー固有の設定の永続化をサポート
- アプリ表示制御：アプリの表示/非表示を自由に設定、トレイメニューと同期
- ターミナル改善：プロバイダー専用ターミナルボタン、fnm パスサポート、クロスプラットフォーム安全起動
- WSL ツール検出：WSL 環境でのツールバージョン検出とセキュリティ強化

### 主な機能

#### OpenCode サポート（新しい4番目のアプリ）

- 完全な OpenCode プロバイダー管理：追加、編集、切り替え、削除
- MCP サーバー管理：Claude/Codex/Gemini と統一されたアーキテクチャ
- Skills サポート：OpenCode でも Skills 機能を使用可能
- 初回起動時の自動インポート：既存の OpenCode 設定を検出すると自動的にインポート
- 完全な国際化：中国語/英語/日本語サポート (#695)

#### グローバルプロキシ

- すべての送信ネットワークリクエストに統一プロキシを設定 (#596、@yovinchen に感謝)
- HTTP/HTTPS プロキシプロトコルをサポート
- 外部 API へのプロキシアクセスが必要なネットワーク環境に適用

#### Claude Rectifier（Thinking 署名修正機能）

- Claude API の thinking 署名を自動修正 (#595、@yovinchen に感謝)
- 一部のサードパーティ API ゲートウェイが返す互換性のない thinking ブロック形式を解決
- 詳細設定で有効/無効を切り替え可能

#### ヘルスチェック強化

- ストリーミングヘルスチェック用のカスタムプロンプトを設定可能 (#623、@yovinchen に感謝)
- CLI 互換リクエスト形式をサポートし、実際の使用シナリオをより良くシミュレート
- 障害検出の精度を向上

#### プロバイダー別設定

- 各プロバイダーごとに設定を個別に保存可能 (#663、@yovinchen に感謝)
- 設定の永続化：再起動後もプロバイダー固有の設定を保持
- 異なるプロバイダーに異なる設定が必要なシナリオに適用

#### アプリ表示制御

- 任意のアプリを自由に表示/非表示（Gemini はデフォルトで非表示）
- トレイメニューは表示設定と自動的に同期
- 非表示のアプリはメインインターフェースとトレイメニューに表示されない

#### Takeover コンパクトモード

- 3つ以上の表示アプリがある場合、自動的にコンパクトレイアウトを使用
- マルチアプリシナリオでのスペース利用を最適化

#### ターミナル改善

- プロバイダー専用ターミナルボタン：ワンクリックでターミナルで現在のプロバイダーを使用 (#564、@kkkman22 に感謝)
- `fnm` パスサポート：fnm で管理された Node.js パスを自動認識
- クロスプラットフォーム安全起動：Windows/macOS/Linux のターミナル起動ロジックを改善

#### WSL ツール検出

- WSL 環境でツールバージョンを検出 (#627、@yovinchen に感謝)
- コマンドインジェクションリスクを防ぐためのセキュリティ強化を追加

#### Skills プリセット強化

- `baoyu-skills` プリセットリポジトリを追加
- 不足しているデフォルトリポジトリを自動補完し、すぐに使える状態を確保

### 体験の改善

- キーボードショートカット：`ESC` を押してパネルをすばやく戻る/閉じる (#670、@xxk8 に感謝)
- プロキシログの簡素化：より明確で読みやすい出力 (#585、@yovinchen に感謝)
- 価格エディター UX：統一された `FullScreenPanel` スタイル
- 詳細設定レイアウト：Rectifier セクションを Failover の下に移動し、論理的な流れを改善
- OpenRouter 互換モード：デフォルトで無効、UI トグルを非表示（煩雑さを軽減）

### バグ修正

#### プロキシとフェイルオーバー

- 自動フェイルオーバーが有効な場合、すぐに P1 に切り替え（次のリクエストを待たずに）

#### プロバイダー管理

- 保存後にプロバイダー編集ダイアログを再度開いたときにデータが古い問題を修正 (#654、@YangYongAn に感謝)
- プリセット切り替え時に baseUrl と apiKey の状態がリセットされない問題を修正
- エンドポイント自動選択状態が永続化されない問題を修正 (#611、@yovinchen に感謝)
- アイコンカラーが設定されていない場合、デフォルトカラーを自動適用

#### ディープリンク

- マルチエンドポイントインポートをサポート (#597、@yovinchen に感謝)
- `GEMINI_BASE_URL` より `GOOGLE_GEMINI_BASE_URL` を優先

#### MCP

- WSL ターゲットパスの `cmd /c` ラッパーをスキップ (#592、@cxyfer に感謝)

#### 使用量テンプレート

- 変数ヒントを追加、検証の問題を修正 (#628、@YangYongAn に感謝)
- プロバイダー間での設定漏洩を防止
- 使用量ブロックのオフセットがアクションボタンの幅に自動適応 (#613、@yovinchen に感謝)

#### Gemini

- タイムアウトパラメータを Gemini CLI 形式に変換 (#580、@cxyfer に感謝)

#### UI

- `FullScreenPanel` での Select ドロップダウンのレンダリング問題を修正

### 注意事項

- **OpenCode は新しくサポートされたアプリです**：関連機能を使用するには、まず OpenCode CLI をインストールする必要があります。
- **グローバルプロキシはすべての送信リクエストに影響します**：使用量クエリ、ヘルスチェックなどのネットワーク操作を含みます。
- **Rectifier は実験的機能です**：問題が発生した場合は、詳細設定で無効にできます。

### 特別な感謝

@yovinchen @YangYongAn @cxyfer @xxk8 @kkkman22 @Shuimo03 の皆様、このリリースへの貢献に感謝します！
@libukai 様、エレガントなフェイルオーバー関連 UI のデザインに感謝します！

### ダウンロードとインストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から適切なバージョンをダウンロードしてください。

#### システム要件

| システム | 最小バージョン                   | アーキテクチャ                      |
| -------- | -------------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降                  | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降      | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                         | x64                                 |

#### Windows

| ファイル                                 | 説明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.10.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応          |
| `CC-Switch-v3.10.0-Windows-Portable.zip` | ポータブル版、解凍して実行、レジストリ書き込みなし   |

#### macOS

| ファイル                         | 説明                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.10.0-macOS.zip`    | **推奨** - 解凍して Applications にドラッグ、Universal Binary     |
| `CC-Switch-v3.10.0-macOS.tar.gz` | Homebrew インストールと自動更新用                                 |

> **注意**：作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元を確認できません」という警告が表示される場合があります。一度閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、その後は正常に開けます。

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                       |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を追加して直接実行、または AUR を使用                          |
| その他のディストリビューション / 不明   | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.9.0] - 2026-01-07

> ローカル API プロキシ、自動フェイルオーバー、Universal Provider、多アプリ対応の強化

### 概要

CC Switch v3.9.0 は v3.9 ベータ（`3.9.0-1`、`3.9.0-2`、`3.9.0-3`）の安定版です。
ローカル API プロキシ（アプリ別テイクオーバー対応）、自動フェイルオーバー、Universal Provider を追加し、Claude Code / Codex / Gemini CLI の安定性と操作性を大きく改善しました。

### ハイライト

- ローカル API プロキシ：Claude Code / Codex / Gemini CLI を統一的にプロキシ
- 自動フェイルオーバー：サーキットブレーカーとアプリ別のフェイルオーバーキュー
- Universal Provider：1つの設定を複数アプリへ同期（NewAPI などのゲートウェイ向け）
- Skills の改善：マルチアプリ対応、SSOT + React Query による管理の統一
- 共通設定スニペット：エディタ内容または現在のプロバイダから抽出
- MCP インポート：インストール済みアプリから MCP servers を取り込み
- 使用量の改善：自動更新、キャッシュ指標、タイムゾーン修正
- Linux パッケージ：RPM / Flatpak の成果物を追加

### 主要機能

#### ローカル API プロキシ（Local API Proxy）

- ローカルで高性能な HTTP プロキシサーバーを起動（Axum ベース）
- Claude Code / Codex / Gemini CLI の API リクエストを統一的に扱う
- アプリ別テイクオーバー：アプリごとにプロキシ経由にするかを個別に切り替え可能
- Live 設定テイクオーバー：有効化時に CLI の live 設定をバックアップし、ローカルプロキシへリダイレクト
- 監視：リクエストログと使用量統計でデバッグとコスト把握を支援
- エラーリクエストのログ：失敗したプロキシリクエストも詳細に記録してデバッグを容易に（#401、@yovinchen に感謝）

#### 自動フェイルオーバー（Auto Failover / サーキットブレーカー）

- 障害を検知して保護（サーキットブレーカー）を自動で発動
- 現在のプロバイダが不調な場合、バックアッププロバイダへ自動切り替え
- アプリごとに独立したフェイルオーバーキューとヘルス状態を管理
- フェイルオーバーを無効化している場合、タイムアウト/リトライ関連の設定は通常フローに影響しません

#### Skills 管理

- Claude Code と Codex の Skills をマルチアプリで利用可能にし、旧レイアウトからの移行もよりスムーズに（#365、#378、@yovinchen に感謝）
- SSOT + React Query による Skills 管理の統一で、状態の一貫性と更新挙動を改善
- Discovery の体験と性能を改善：
  - スキャン時に隠しディレクトリをスキップ
  - Discoverable skills に長寿命キャッシュを適用して高速化
  - ローディング表示の改善と、インポート/更新などの操作導線を整理
  - Skills リポジトリのブランチ設定を修正（#505、@kjasn に感謝）

#### Universal Provider

- 複数アプリで共有できるプロバイダ設定を追加（Claude/Codex/Gemini へ同期）（#348、@Calcium-Ion に感謝）
- NewAPI のような複数プロトコル対応の API ゲートウェイを想定
- 1つのプロバイダ内でアプリ別にデフォルトモデルを割り当て可能

#### 共通設定スニペット（Claude/Codex/Gemini）

- 「共通設定スニペット」を保持し、有効化したプロバイダへマージ/追記
- 新しい抽出フロー：
  - エディタの現在内容から抽出（編集している内容）
  - エディタ内容がない場合は、現在アクティブなプロバイダから抽出
- Codex の抽出はより安全：
  - `model_provider`、`model`、および `model_providers` テーブル全体など、プロバイダ固有の設定を除去
  - `[mcp_servers.*]` 配下の `base_url` は保持し、MCP 設定を壊しにくくしています

#### MCP 管理

- インストール済みアプリから MCP servers をインポート
- 安定性向上：対象 CLI が未インストールなら同期をスキップし、無効な Codex `config.toml` も適切に扱います（#461、@majiayu000 に感謝）
- Windows 互換性：MCP エクスポート時の npx/npm 呼び出しを `cmd /c` でラップ

#### 使用量と価格データ

- 使用量/価格の改善：自動更新、キャッシュ指標、タイムゾーン修正、内蔵価格テーブル更新（#508、@yovinchen に感謝）
- DeepLink 対応：deeplink から使用量クエリ設定をインポート（#400、@qyinter に感謝）
- 使用量統計からモデル情報を抽出（#455、@yovinchen に感謝）
- 使用量クエリ資格情報はプロバイダ設定へフォールバック可能（#360、@Sirhexs に感謝）

### 使い勝手の改善

- プロバイダ検索フィルター（名前で素早く検索）（#435、@TinsFox に感謝）
- プロバイダのアイコン色：アイコンに任意の色を設定して見分けやすく（#385、@yovinchen に感謝）
- ショートカット：`Cmd/Ctrl + ,` で設定を開く（#436、@TinsFox に感謝）
- Claude Code の初回確認ダイアログをスキップ可能（任意）
- トースト通知のクローズボタン：切り替え通知と成功通知を閉じられるように（#350、@ForteScarlet に感謝）
- 更新バッジをクリックすると About タブへ移動
- 設定ページのタブスタイル改善（#342、@wenyuanw に感謝）
- アプリ/ビュー切り替えのフェードとパネル終了アニメーション
- プロキシテイクオーバー中はエメラルド系テーマを適用して状態を分かりやすく
- ダークモードの視認性改善
- FullScreenPanel のウィンドウドラッグ領域を改善（#525、@zerob13 に感謝）

### プラットフォーム別メモ

#### Windows

- バージョンチェック時にターミナルが表示されないよう改善
- ウィンドウ最小サイズのデフォルトを調整
- 起動時の黒画面を避けるため、システムタイトルバー方式を採用
- 古い WebView 向けに `crypto.randomUUID()` のフォールバックを追加

#### macOS

- 自動起動で `.app` バンドルパスを使用し、ターミナル表示を回避（#462、@majiayu000 に感謝）
- トレイとヘッダー周りの体験を改善

### パッケージ

- Linux：RPM と Flatpak のパッケージングを追加し、リリース成果物の生成に対応

### 注意事項

- セキュリティ強化：JavaScript 実行器と使用量スクリプト実行に関するセキュリティ問題を修正（#151、@luojiyin1987 に感謝）。
- SQL インポートは CC Switch がエクスポートしたバックアップのみに制限されます（安全性のため）。
- プロキシのテイクオーバーは CLI の live 設定を変更します。CC Switch はリダイレクト前に live 設定をバックアップします。元に戻す場合はテイクオーバー無効化/プロキシ停止を行い、必要に応じてバックアップから復元してください。

### 特別な謝辞

@xunyu @deijing @su-fen の皆様のサポートと貢献に特別な感謝を申し上げます。皆様なしではこのリリースは実現しませんでした！

### ダウンロード & インストール

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から該当するバージョンをダウンロードしてください。

#### システム要件

| システム | 最低バージョン                | アーキテクチャ                      |
| -------- | ----------------------------- | ----------------------------------- |
| Windows  | Windows 10 以降               | x64                                 |
| macOS    | macOS 10.15 (Catalina) 以降   | Intel (x64) / Apple Silicon (arm64) |
| Linux    | 下表参照                      | x64                                 |

#### Windows

| ファイル                                | 説明                                         |
| --------------------------------------- | -------------------------------------------- |
| `CC-Switch-v3.9.0-Windows.msi`          | **推奨** - MSI インストーラー、自動更新対応  |
| `CC-Switch-v3.9.0-Windows-Portable.zip` | ポータブル版、インストール不要               |

#### macOS

| ファイル                        | 説明                                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.9.0-macOS.zip`    | **推奨** - 解凍して Applications へドラッグ、Universal Binary     |
| `CC-Switch-v3.9.0-macOS.tar.gz` | Homebrew インストールおよび自動更新用                             |

> **注意**: 作者が Apple Developer アカウントを持っていないため、初回起動時に「開発元が未確認」という警告が表示される場合があります。アプリを閉じてから、「システム設定」→「プライバシーとセキュリティ」→「このまま開く」をクリックすると、正常に開けるようになります。

#### Homebrew (MacOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

アップデート:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| ディストリビューション                  | 推奨形式    | インストール方法                                                               |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` または `sudo apt install ./CC-Switch-*.deb`     |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` または `sudo dnf install ./CC-Switch-*.rpm`      |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                        |
| Arch Linux / Manjaro                    | `.AppImage` | 実行権限を付与して直接実行、または AUR を使用                                  |
| その他 / 不明                           | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`                      |
| サンドボックスで実行したい場合          | `.flatpak`  | `flatpak install CC-Switch-*.flatpak`                                          |

---

## [3.8.0] - 2025-11-28

> 永続化アーキテクチャを刷新し、クラウド同期の土台を構築

### 概要

CC Switch v3.8.0 はデータ永続化レイヤーと UI を大幅に作り替え、今後のクラウド同期やローカルプロキシ機能に向けた基盤を整えたメジャーアップデートです。

### 主要アップデート

#### 永続化アーキテクチャの刷新

単一の JSON 保存から、階層化された SQLite + JSON の二層構造へ移行。

**アーキテクチャ変更**:

```
v3.7.x (旧)                       v3.8.0 (新)
┌─────────────────┐              ┌─────────────────────────────────┐
│  config.json    │              │  SQLite (同期対象データ)         │
│  ┌───────────┐  │              │  ├─ providers     プロバイダ設定 │
│  │ providers │  │              │  ├─ mcp_servers   MCP サーバー   │
│  │ mcp       │  │     ──>      │  ├─ prompts       プロンプト     │
│  │ prompts   │  │              │  ├─ skills        Skills         │
│  │ settings  │  │              │  └─ settings      汎用設定       │
│  └───────────┘  │              ├─────────────────────────────────┤
└─────────────────┘              │  JSON (デバイス固有データ)        │
                                 │  └─ settings.json ローカル設定    │
                                 │     ├─ ウィンドウ位置            │
                                 │     ├─ パスの上書き              │
                                 │     └─ 現在のプロバイダ ID        │
                                 └─────────────────────────────────┘
```

**二層構造の設計**:

| レイヤー | ストレージ | データ種別                          | 同期戦略         |
| -------- | ---------- | ----------------------------------- | ---------------- |
| クラウド | SQLite     | Providers, MCP, Prompts, Skills     | 将来同期対象     |
| デバイス | JSON       | ウィンドウ状態、ローカルパス         | ローカル保持     |

**実装ポイント**:

- **スキーマバージョン管理**: DB 構造のマイグレーションに対応
- **SQL インポート/エクスポート**: `backup.rs` が SQL ダンプをサポート
- **トランザクション対応**: SQLite ネイティブで整合性を確保
- **自動マイグレーション**: 初回起動で `config.json` から自動移行

**モジュール分割**:

```
database/
├── mod.rs              Database 構造体と初期化
├── schema.rs           テーブル定義とスキーマ移行
├── backup.rs           SQL インポート/エクスポートとスナップショット
├── migration.rs        JSON → SQLite 変換エンジン
└── dao/                DAO レイヤー
    ├── providers.rs    プロバイダ CRUD
    ├── mcp.rs          MCP CRUD
    ├── prompts.rs      プロンプト CRUD
    ├── skills.rs       Skills CRUD
    └── settings.rs     設定 Key-Value 保存
```

#### 新しいユーザーインターフェース

よりモダンな見た目と操作感に再設計。

- レイアウト全面刷新、コンポーネントスタイルを統一
- トランジションを滑らかにし、視覚的階層を最適化
- メインビューのオーバースクロールバウンスを無効化
- ブラウザ互換性向上のため Tailwind CSS を v4→v3.4 にダウングレード

#### 日語化

UI が日本語に対応し、国際化が 3 言語（中/英/日）へ拡大。

### 新機能

#### Skills 递帰スキャン

Skills 管理がリポジトリを再帰的に走査し、ネストされた `SKILL.md` を自動検出。

- 複数階層のディレクトリに対応
- すべての `SKILL.md` を自動発見
- パスをキーにした重複排除で同名スキルを許容

#### プロバイダアイコン設定

プリセットがデフォルトアイコンを持ち、複製してもアイコンを保持。カスタム色も設定可能。

#### フォームバリデーション強化

必須項目にリアルタイム検証と分かりやすいエラーメッセージを追加し、トースト通知を統一。

#### 自動起動

Windows/macOS/Linux で自動起動をサポート。

- 設定画面からワンクリックで ON/OFF
- Registry / LaunchAgent / XDG autostart を使用

#### 新プロバイダプリセット

- **MiniMax** - 公式パートナー

### バグ修正

#### 重要修正

**カスタムエンドポイント消失**

- 原因: SQLite の `INSERT OR REPLACE` が内部で `DELETE + INSERT` を実行し、外部キーのカスケード削除が発生
- 対応: 既存プロバイダ更新を `UPDATE` に変更

**Gemini 設定**

- カスタム環境変数が `.env` に正しく書き込まれない問題を修正
- 認証設定が他ファイルに誤って書き込まれる問題を修正

**プロバイダ検証**

- 現在プロバイダ ID が欠落している場合のバリデーションエラーを修正
- 複製時にアイコンフィールドが失われる問題を修正

#### プラットフォーム互換性

**Linux**

- WebKitGTK の DMA-BUF 描画問題を解消
- ユーザーの `.desktop` カスタマイズを保持

#### その他修正

- アプリ切り替え時の不要な使用量クエリを削減
- DMXAPI プリセットの誤ったトークンフィールドを修正
- Deeplink コンポーネントの欠損翻訳キーを補完
- 使用量スクリプトテンプレート初期化を修正

### 技術的改善

#### アーキテクチャ再編

**Provider Service のモジュール化**:

```
services/provider/
├── mod.rs          追加/更新/削除/切替/検証の中核
├── live.rs         ライブ設定ファイル操作
├── gemini_auth.rs  Gemini 認証タイプ検出
├── endpoints.rs    カスタムエンドポイント管理
└── usage.rs        使用量スクリプト実行
```

**Deeplink のモジュール化**:

```
deeplink/
├── mod.rs       エクスポート
├── parser.rs    URL パース
├── provider.rs  プロバイダ取り込み
├── mcp.rs       MCP 取り込み
├── prompt.rs    プロンプト取り込み
├── skill.rs     Skills 取り込み
└── utils.rs     ユーティリティ
```

#### コード品質

- レガシーな JSON 時代のインポート/エクスポート死蔵コードを削除
- 使われていない MCP 型を削除し、エラーハンドリングを統一
- テストを SQLite バックエンドに移行し、MSW ハンドラを最新 API に合わせて更新

### 技術統計

```
全体変更:
- コミット: 51
- 変更ファイル: 207
- 追加: +17,297 行
- 削除: -6,870 行
- 純増: +10,427 行

コミット種別:
- fix: 25
- refactor: 11
- feat: 9
- test: 1
- other: 5

変更箇所:
- フロントエンド: 112 files
- Rust バックエンド: 63 files
- テスト: 20 files
- i18n: 3 files
```

### マイグレーションガイド

#### v3.7.x からのアップグレード

**自動マイグレーション**（初回起動時）:

1. `config.json` の存在を検出
2. 全データをトランザクションで SQLite に移行
3. デバイス設定を `settings.json` へ移行
4. 移行成功の通知を表示

**データ保護**:

- 元の `config.json` は保持（削除しない）
- 失敗時はエラーダイアログを表示し、`config.json` を温存
- Dry-run モードで検証可能

### ダウンロード & インストール

#### システム要件

- **Windows**: Windows 10+
- **macOS**: macOS 10.15 (Catalina)+
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+

#### ダウンロード

[Releases](https://github.com/farion1231/cc-switch/releases/latest) から入手:

- **Windows**: `CC-Switch-v3.8.0-Windows.msi` または `-Portable.zip`
- **macOS**: `CC-Switch-v3.8.0-macOS.tar.gz` または `.zip`
- **Linux**: `CC-Switch-v3.8.0-Linux.AppImage` または `.deb`

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

アップデート:

```bash
brew upgrade --cask cc-switch
```

### 謝辞

#### コントリビューター

- [@YoVinchen](https://github.com/YoVinchen) - UI とデータベースリファクタ
- [@farion1231](https://github.com/farion1231) - バグ修正と機能拡張
- コミュニティの皆さん - テストとフィードバック

#### スポンサー

**Zhipu AI** - GLM CODING PLAN スポンサー  
[10% オフリンク](https://z.ai/subscribe?ic=8JVLJQFSKB)

**PackyCode** - API リレーサービスパートナー  
[登録時に「cc-switch」で 10% オフ](https://www.packyapi.com/register?aff=cc-switch)

**ShandianShuo** - ローカルファースト音声入力  
[Mac/Windows 無料ダウンロード](https://shandianshuo.cn)

**MiniMax** - MiniMax M2 CODING PLAN スポンサー  
[ブラックフライデーセール中、$2 から](https://platform.minimax.io/subscribe/coding-plan)

### フィードバック & サポート

- **Issue**: [GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **ドキュメント**: [README](../README.md)
- **更新履歴**: [CHANGELOG.md](../CHANGELOG.md)

### 今後のロードマップ

**v3.9.0 予告（予定）**:

- ローカルプロキシ機能

続報にご期待ください！

**Happy Coding!**
