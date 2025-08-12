# API 連携仕様

## 概要

村画面で使用する API エンドポイントとデータフェッチングの仕様です。v2 では openapi-fetch と自動生成された型定義を使用します。

## 使用 API エンドポイント

### 1. 村情報取得

#### `GET /village/{villageId}`

村の基本情報を取得します。

**レスポンス型**: `components["schemas"]["VillageView"]`

#### データフェッチング戦略

- **初回取得**: ページ読み込み時
- **更新頻度**: `GET /village/{villageId}/latest` の polling で最新の日付が更新された時
- **キャッシュ**: 30 秒間有効

### 2. 最新情報取得

#### `GET /village/{villageId}/latest`

村の最新状態を確認します。

**レスポンス型**: `components["schemas"]["VillageLatestView"]`

#### データフェッチング戦略

- **更新頻度**: 村の状態に応じて変更
  - 進行中、プロローグ、エピローグ: 30 秒ごと
  - 終了・廃村: ポーリングなし

### 3. 発言一覧取得

#### `GET /village/{villageId}/day/{day}/time/{noonnight}/message-list`

指定日の発言一覧を取得します。

**パラメータ**:

- `villageId`: 村 ID
- `day`: 日付（0 からスタート、0=プロローグ）
- `noonnight`: 昼夜区分（"NOON" 固定）
- `form`: フィルタ条件（VillageMessageForm）
  - `page_size`: 1 ページあたりの発言数
  - `page_num`: ページ番号（1 から開始）
  - `message_type_list`: 発言種別フィルタ
  - `participant_id_list`: 発言者フィルタ
  - `to_participant_id_list`: 宛先フィルタ
  - `keyword`: キーワードフィルタ
  - `is_paging`: ページング有無
  - `is_disp_latest`: 最新発言を表示するか

**レスポンス型**: `components["schemas"]["MessagesView"]`

```typescript
interface MessagesView {
  messages: MessageView[];
  all_page_count: number;
  current_page_num: number | null;
  exist_pre_page: boolean;
  exist_next_page: boolean;
  is_latest: boolean;
}

interface MessageView {
  message_type: string;
  message_number: number;
  message_datetime: number; // Unix timestamp
  message_unixtimestamp_milli: number;
  message_content: string;
  from_participant_id: number;
  from_participant_name: string;
  from_participant_short_name: string;
  from_participant_face_image_url: string;
  to_participant_id: number | null;
  to_participant_name: string | null;
  to_participant_short_name: string | null;
  participant_name_list: string[];
  player: SimplePlayerView | null;
  face_type_code: string;
  is_convert_disable: boolean;
}
```

#### データフェッチング戦略

- **初回取得**: 日付選択時
- **更新頻度**: `GET /village/{villageId}/latest` の polling で最新発言の unix time が更新され、かつ以下のいずれの状態でもないとき
  - 現在開いているのが最新の日付でない
  - 発言入力中
- **キャッシュ**: 10 秒間有効（過去日は長期キャッシュ）
- **ページネーション**: サーバーサイドページネーション

### 4. 参加状況取得

#### `GET /village/{villageId}/situation`

現在のユーザーの参加状況を取得します。

**レスポンス型**: `components["schemas"]["SituationAsParticipantView"]`

### 6. 発言投稿

#### `POST /village/{villageId}/say`

発言を投稿します。

**リクエスト型**: `components["schemas"]["VillageSayForm"]`

```typescript
interface VillageSayForm {
  message_type: string;
  message: string;
  face_type: string;
  target_id: number | null;
}
```

### 7. 発言確認（プレビュー）

#### `POST /village/{villageId}/say-confirm`

発言のプレビューを取得します。実際には投稿されません。

**リクエスト型**: `components["schemas"]["VillageSayForm"]`

**レスポンス型**: `components["schemas"]["MessageView"]`

### 8. 村への参加

#### `POST /village/{villageId}/participate`

村に参加します。

**リクエスト型**: `components["schemas"]["VillageParticipateForm"]`

```typescript
interface VillageParticipateForm {
  chara_id: number;
  chara_name: string;
  chara_short_name: string;
  join_message: string;
  join_password: string | null;
  first_request_skill: string;
  second_request_skill: string;
  spectator: boolean;
}
```

### 9. 参加確認（プレビュー）

#### `POST /village/{villageId}/participate-confirm`

参加時のメッセージプレビューを取得します。

**リクエスト型**: `components["schemas"]["VillageParticipateForm"]`

**レスポンス型**: `components["schemas"]["MessageView"]`

### 10. 通知設定

#### `POST /village/{villageId}/notification-setting`

Webhook 通知設定を更新します。

**リクエスト型**: `components["schemas"]["NotificationSettingForm"]`

```typescript
interface NotificationSettingForm {
  webhook_url: string;
  village_start: boolean;
  village_daychange_start: boolean;
  village_epilogue_start: boolean;
  secret_say: boolean;
  say_by_me: boolean;
  anchor_say_to_me: boolean;
  skill_say: boolean;
  keyword: string;
}
```

### 11. その他のアクション

#### 投票

- `POST /village/{villageId}/vote`
- リクエスト型: `components["schemas"]["VillageVoteForm"]`

#### 能力使用

- `POST /village/{villageId}/ability`
- リクエスト型: `components["schemas"]["VillageAbilityForm"]`

#### コミット

- `POST /village/{villageId}/commit`
- リクエスト型: `components["schemas"]["VillageCommitForm"]`

#### カミングアウト

- `POST /village/{villageId}/comingout`
- リクエスト型: `components["schemas"]["VillageComingOutForm"]`

#### 退村

- `POST /village/{villageId}/leave`

## TanStack Query 実装

### 1. Query Keys

```typescript
export const queryKeys = {
  village: (id: string) => ["village", id] as const,
  villageLatest: (id: string) => ["village", id, "latest"] as const,
  messages: (id: string, day: number, noonnight: string, form?: any) =>
    ["villageMessages", id, day, noonnight, form] as const,
  situation: (id: string) => ["village", id, "situation"] as const,
} as const;
```

### 2. Query Hooks（実装例）

```typescript
// 村情報取得
export const useVillageQuery = (villageId: string) => {
  return useQuery<components["schemas"]["VillageView"]>({
    queryKey: queryKeys.village(villageId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/village/{villageId}", {
        params: { path: { villageId: Number(villageId) } },
      });
      if (error) throw new Error("Failed to fetch village");
      return data;
    },
    staleTime: 30 * 1000,
    enabled: !!villageId,
  });
};

// 発言一覧取得（実際の実装: useVillageMessagesQuery.ts）
export const useVillageMessagesQuery = (
  villageId: string,
  day: number,
  noonnight: string,
  form?: VillageMessageForm,
  villageStatus?: VillageStatus
) => {
  const getRefetchInterval = () => {
    if (!villageStatus) return false;
    if (villageStatus.is_finished || villageStatus.is_canceled) return false;
    if (villageStatus.is_prologue) return 60000; // 60秒
    if (villageStatus.is_progress) return 20000; // 20秒
    if (villageStatus.is_epilogue) return 30000; // 30秒
    return false;
  };

  return useQuery<MessagesView>({
    queryKey: queryKeys.messages(villageId, day, noonnight, form),
    queryFn: async () => {
      const { data, error } = await apiClient.GET(
        "/village/{villageId}/day/{day}/time/{noonnight}/message-list",
        {
          params: {
            path: { villageId: Number(villageId), day, noonnight },
            query: { form: form ?? {} },
          },
        }
      );
      if (error) throw new Error("Failed to fetch messages");
      return data;
    },
    staleTime: 10 * 1000,
    refetchInterval: getRefetchInterval(),
    refetchIntervalInBackground: false,
  });
};
```

### 3. Mutation Hooks

```typescript
// 発言投稿
export const usePostMessageMutation = (villageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VillageSayForm) => {
      const { error } = await apiClient.POST("/village/{villageId}/say", {
        params: { path: { villageId: Number(villageId) } },
        body: data,
      });
      if (error) throw new Error("Failed to post message");
    },
    onSuccess: () => {
      // 発言一覧を再取得
      queryClient.invalidateQueries({
        queryKey: ["villageMessages", villageId],
      });
      toast.success("発言を投稿しました");
    },
    onError: () => {
      toast.error("発言の投稿に失敗しました");
    },
  });
};

// 通知設定更新
export const useUpdateNotificationMutation = (villageId: string) => {
  return useMutation({
    mutationFn: async (data: NotificationSettingForm) => {
      const { error } = await apiClient.POST(
        "/village/{villageId}/notification-setting",
        {
          params: { path: { villageId: Number(villageId) } },
          body: data,
        }
      );
      if (error) throw new Error("Failed to update notification settings");
    },
    onSuccess: () => {
      toast.success("通知設定を更新しました");
    },
    onError: () => {
      toast.error("設定の更新に失敗しました");
    },
  });
};
```

## エラーハンドリング

### 1. openapi-fetch のエラーハンドリング

```typescript
// lib/api/error-handler.ts で実装
export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("予期しないエラーが発生しました");
}

// ビジネスエラーの処理
export function handleBusinessError(response: any) {
  if (response.error) {
    const errorMessage = response.error.message || "エラーが発生しました";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}
```

### 2. TanStack Query のエラーハンドリング

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // 404の場合はリトライしない
        if (error?.status === 404) return false;
        // ビジネスエラー（499）の場合もリトライしない
        if (error?.status === 499) return false;
        // 最大3回まで
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

## パフォーマンス最適化

### 1. データ前処理

```typescript
// 発言データの前処理
const preprocessMessages = (messages: MessageView[]): ProcessedMessage[] => {
  return messages.map((message) => ({
    ...message,
    // アンカーリンクの解析
    anchors: extractAnchors(message.message_content),
    // 表示用の時刻フォーマット（既にUnixタイムスタンプで提供）
    displayTime: new Date(message.message_datetime * 1000).toLocaleString(),
  }));
};
```

### 2. キャッシュ戦略

```typescript
// 村の状態に応じたキャッシュ時間
const getStaleTime = (villageStatus: VillageStatus) => {
  if (villageStatus.is_finished || villageStatus.is_canceled) {
    // 終了した村は無期限キャッシュ
    return Infinity;
  }
  if (villageStatus.is_progress) {
    // 進行中は10秒
    return 10 * 1000;
  }
  // その他は30秒
  return 30 * 1000;
};
```

### 3. パラメータシリアライゼーション

v1 と同様に配列パラメータの処理が必要な場合：

```typescript
// lib/api/query-serializer.ts
export function serializeQueryParams(params: Record<string, any>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // 配列の場合は repeat 形式で追加
      value.forEach((v) => searchParams.append(key, String(v)));
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
```

## 認証

村画面では Firebase Authentication の JWT トークンが必要です：

```typescript
// lib/api/client.ts で設定
import createClient from "openapi-fetch";
import { getAuth } from "firebase/auth";

export const apiClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // リクエストごとに認証トークンを付与
  async onRequest(req) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      req.headers.set("Authorization", `Bearer ${token}`);
    }
  },
});
```
