# 状態管理仕様

## 概要

村画面の状態管理アーキテクチャです。Zustand を主軸とし、TanStack Query でサーバー状態を管理します。

## アーキテクチャ

### 状態の分類

1. **サーバー状態** - TanStack Query で管理
   - 村情報、参加者情報、発言データ等
2. **クライアント状態** - Zustand で管理
   - UI 状態、フィルタ設定、ユーザー設定等
3. **永続化状態** - Cookie/LocalStorage
   - ユーザー設定、メモ、フィルタ設定等

## Zustand Store 設計

### 1. Village Store（村情報）

```typescript
interface VillageStore {
  // 現在の村ID
  villageId: string | null;
  setVillageId: (id: string) => void;

  // 現在表示中の日
  currentDay: number;
  setCurrentDay: (day: number) => void;

  // 左側メニューの開閉状態（モバイル）
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // 発言抽出モーダルの開閉
  isFilterModalOpen: boolean;
  setFilterModalOpen: (open: boolean) => void;
}
```

### 2. Message Filter Store（発言フィルタ）

```typescript
interface MessageFilterStore {
  // 発言種別フィルタ
  messageTypes: {
    normal: boolean;
    monologue: boolean;
    secret: boolean;
    creator: boolean;
    werewolf: boolean;
    resonance: boolean;
    lover: boolean;
    graveSpectate: boolean;
    action: boolean;
    publicSystem: boolean;
    privateSystem: boolean;
  };

  // 発言者フィルタ（participant_id配列）
  selectedSpeakers: string[];

  // 宛先フィルタ（participant_id配列）
  selectedTargets: string[];

  // キーワードフィルタ
  keywords: string[];

  // フィルタ操作関数
  setMessageType: (type: keyof MessageTypes, enabled: boolean) => void;
  toggleAllMessageTypes: (enabled: boolean) => void;
  invertMessageTypes: () => void;

  setSpeakers: (speakers: string[]) => void;
  toggleSpeaker: (speakerId: string) => void;
  toggleAllSpeakers: (enabled: boolean, allSpeakers: string[]) => void;

  setTargets: (targets: string[]) => void;
  toggleTarget: (targetId: string) => void;
  toggleAllTargets: (enabled: boolean, allTargets: string[]) => void;
  setMyTargetsOnly: (myId: string, allTargets: string[]) => void;

  setKeywords: (keywords: string[]) => void;

  // リセット
  resetFilters: (allParticipants: string[]) => void;
}
```

### 3. User Settings Store（ユーザー設定）

```typescript
interface UserSettingsStore {
  // 表示設定
  displaySettings: {
    pageSize: 10 | 20 | 50 | 100 | 200;
    showPagination: boolean;
    showDate: boolean;
    largeText: boolean;
    largeCharacterImage: boolean;
    darkTheme: boolean;
  };

  // 操作設定
  operationSettings: {
    openPersonalExtractionInNewTab: boolean;
    pasteAnchorOnClick: boolean;
  };

  // Webhook設定
  webhookSettings: {
    url: string;
    notifications: {
      villageStart: boolean;
      dayChange: boolean;
      epilogue: boolean;
      secretTalk: boolean;
      anchorMention: boolean;
      roleWindow: boolean;
    };
    keywords: string[];
  };

  // 設定更新関数
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateOperationSettings: (settings: Partial<OperationSettings>) => void;
  updateWebhookSettings: (settings: Partial<WebhookSettings>) => void;
}
```

### 4. Memo Store（メモ機能）

```typescript
interface MemoStore {
  memos: Memo[];

  addMemo: (memo: Omit<Memo, "id" | "createdAt">) => void;
  updateMemo: (id: string, memo: Partial<Memo>) => void;
  deleteMemo: (id: string) => void;
}

interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## TanStack Query 設計

### 1. Village Queries

```typescript
// 村基本情報
const useVillageQuery = (villageId: string) => {
  return useQuery({
    queryKey: ["village", villageId],
    queryFn: () => fetchVillage(villageId),
    staleTime: 5 * 60 * 1000, // 5分
  });
};

// 発言一覧
const useMessagesQuery = (villageId: string, day: number) => {
  return useInfiniteQuery({
    queryKey: ["messages", villageId, day],
    queryFn: ({ pageParam = 1 }) => fetchMessages(villageId, day, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 30 * 1000, // 30秒
  });
};
```

### 2. Mutations

```typescript
// 発言投稿
const usePostMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMessage,
    onSuccess: (data, variables) => {
      // 発言一覧を無効化して再取得
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.villageId, variables.day],
      });
    },
  });
};

// 設定更新
const useUpdateWebhookMutation = () => {
  return useMutation({
    mutationFn: updateWebhookSettings,
    onSuccess: () => {
      // 成功通知
      toast.success("Webhook設定を更新しました");
    },
    onError: (error) => {
      toast.error("設定の更新に失敗しました");
    },
  });
};
```

## 永続化

### 1. Cookie 保存

```typescript
// ユーザー設定の永続化
const persistUserSettings = (settings: UserSettings) => {
  Cookies.set("village_user_settings", JSON.stringify(settings), {
    expires: 365, // 1年
    sameSite: "strict",
  });
};

// メモの永続化（最大3つ）
const persistMemos = (memos: Memo[]) => {
  const limited = memos.slice(0, 3);
  Cookies.set("village_memos", JSON.stringify(limited), {
    expires: 30, // 30日
  });
};
```

### 2. セッション状態管理

```typescript
// 日付状態・フィルタ状態は永続化せず、各タブで独立して管理
// 理由:
// - 別タブで異なる日付を表示したい場合がある
// - 別タブで異なるフィルタ内容を表示したい場合がある
// - 同一画面内では日付変更時もフィルタ条件を保持する

// メモリ上でのみ状態管理（Zustandストア）
// 新規タブではデフォルト状態から開始
```

## 状態の初期化

### 1. Store Hydration

```typescript
// ページ読み込み時の状態復元
const hydrateStores = (villageId: string) => {
  // ユーザー設定の復元
  const userSettings = Cookies.get("village_user_settings");
  if (userSettings) {
    const settings = JSON.parse(userSettings);
    useUserSettingsStore.getState().initialize(settings);
  }

  // メモの復元
  const memos = Cookies.get("village_memos");
  if (memos) {
    const memoList = JSON.parse(memos);
    useMemoStore.getState().initialize(memoList);
  }

  // フィルタ設定・日付状態は復元しない（別タブ独立のため）
  // URLパラメータで個人抽出や日付が指定された場合のみ初期化
  // 各タブはデフォルト状態（最新日、全フィルタON）から開始
};
```

### 2. URL Parameters

```typescript
// URLパラメータからの初期化
const initializeFromUrl = (searchParams: URLSearchParams) => {
  const filterId = searchParams.get("filterId");
  if (filterId) {
    // 個人抽出モードで初期化
    useMessageFilterStore.getState().setSpeakers([filterId]);
  }
};
```

## リアルタイム更新

### 1. ポーリング

```typescript
// 残り時間の更新
const useVillageTimePolling = (villageId: string) => {
  return useQuery({
    queryKey: ["village", villageId, "time"],
    queryFn: () => fetchVillageTime(villageId),
    refetchInterval: 1000, // 1秒ごと
    enabled: !!villageId,
  });
};

// 新着発言の確認
const useNewMessagesPolling = (villageId: string, day: number) => {
  return useQuery({
    queryKey: ["messages", villageId, day, "check"],
    queryFn: () => checkNewMessages(villageId, day),
    refetchInterval: 30 * 1000, // 30秒ごと（サーバー負荷軽減）
  });
};
```

## パフォーマンス最適化

### 1. Selector 最適化

```typescript
// 必要な部分のみを購読
const messageTypes = useMessageFilterStore(
  (state) => state.messageTypes,
  shallow
);

// 計算プロパティの最適化
const filteredMessages = useMemo(() => {
  return messages.filter(
    (message) =>
      filters.messageTypes[message.type] &&
      filters.selectedSpeakers.includes(message.speakerId)
  );
}, [messages, filters.messageTypes, filters.selectedSpeakers]);
```

### 2. 無効化戦略

```typescript
// 適切なスコープでのクエリ無効化
const invalidateVillageData = (villageId: string) => {
  queryClient.invalidateQueries({
    queryKey: ["village", villageId],
    exact: false,
  });
};

// 部分的な更新
const updateMessageOptimistically = (newMessage: Message) => {
  queryClient.setQueryData(["messages", villageId, currentDay], (old) => ({
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      messages: [...page.messages, newMessage],
    })),
  }));
};
```

## エラーハンドリング

### 1. Network Error

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
    },
  },
});
```

### 2. Store Error Boundary

```typescript
const VillageErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      onError={(error) => {
        // エラーログ送信
        console.error("Village state error:", error);

        // 状態のリセット
        useVillageStore.getState().reset();
        useMessageFilterStore.getState().reset();
      }}
      fallback={<VillageErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
};
```
