# コンポーネント設計

## 概要

村画面を構成するReactコンポーネントの設計仕様です。再利用性と保守性を重視した設計を行います。

## コンポーネント構成

### ディレクトリ構造

```
src/components/village/
├── index.tsx                    # VillagePageメインコンポーネント
├── Layout/
│   ├── VillageLayout.tsx       # 村画面専用レイアウト
│   ├── Sidebar.tsx             # 左側メニュー
│   └── MainContent.tsx         # メインコンテンツエリア
├── Sidebar/
│   ├── VillageInfo.tsx         # 村名・設定表示
│   ├── ParticipantList/
│   │   ├── index.tsx
│   │   ├── ParticipantGroup.tsx
│   │   └── ParticipantItem.tsx
│   ├── MemoSection.tsx         # メモ機能
│   ├── UserSettings/
│   │   ├── index.tsx
│   │   ├── DisplaySettings.tsx
│   │   ├── OperationSettings.tsx
│   │   └── WebhookSettings.tsx
│   └── NavigationLinks.tsx     # リンク集
├── MainContent/
│   ├── TopMenu.tsx             # 上部固定メニュー
│   ├── BottomMenu.tsx          # 下部固定メニュー
│   ├── VillageHeader.tsx       # 村名・日付ナビ
│   ├── MessageList/
│   │   ├── index.tsx
│   │   ├── MessageItem.tsx
│   │   ├── MessageContent.tsx
│   │   └── Pagination.tsx
│   └── GameActions.tsx         # ゲームアクション
├── Modal/
│   ├── MessageFilterModal.tsx  # 発言抽出モーダル
│   ├── VillageSettingsModal.tsx # 村設定モーダル
│   └── UserSettingsModal.tsx   # ユーザー設定モーダル
└── Common/
    ├── CharacterIcon.tsx       # キャラアイコン
    ├── MessageTypeIcon.tsx     # 発言種別アイコン
    ├── TimeDisplay.tsx         # 時刻表示
    └── LoadingSpinner.tsx      # ローディング表示
```

## 主要コンポーネント

### 1. VillagePage（メインコンポーネント）

```typescript
interface VillagePageProps {
  villageId: string;
  initialDay?: number;
  filterId?: string; // URL param for individual extraction
}

export const VillagePage: FC<VillagePageProps> = ({
  villageId,
  initialDay,
  filterId
}) => {
  // 初期化処理
  useEffect(() => {
    // ユーザー設定・メモのみ復元
    hydrateStores(villageId);
    
    // URLパラメータからの初期化（各タブ独立）
    if (filterId) {
      initializePersonalFilter(filterId);
    }
    if (initialDay) {
      setCurrentDay(initialDay);
    }
    // フィルタ・日付状態は永続化せず、各タブでデフォルト状態から開始
  }, [villageId, initialDay, filterId]);

  return (
    <VillageErrorBoundary>
      <VillageLayout villageId={villageId}>
        <Sidebar />
        <MainContent />
      </VillageLayout>
    </VillageErrorBoundary>
  );
};
```

### 2. VillageLayout（レイアウト）

```typescript
interface VillageLayoutProps {
  villageId: string;
  children: ReactNode;
}

export const VillageLayout: FC<VillageLayoutProps> = ({
  villageId,
  children
}) => {
  const isSidebarOpen = useVillageStore(state => state.isSidebarOpen);
  const { data: village } = useVillageQuery(villageId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* モバイル用オーバーレイ */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* レイアウト */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>

      {/* モーダル群 */}
      <MessageFilterModal />
      <VillageSettingsModal />
      <UserSettingsModal />
    </div>
  );
};
```

### 3. Sidebar（左側メニュー）

```typescript
export const Sidebar: FC = () => {
  const villageId = useVillageStore(state => state.villageId);
  const isSidebarOpen = useVillageStore(state => state.isSidebarOpen);
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* ヘッダー（モバイル用閉じるボタン） */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold">メニュー</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* メニュー内容 */}
        <div className="flex-1 overflow-y-auto">
          <VillageInfo villageId={villageId} />
          <ParticipantList villageId={villageId} />
          <MemoSection />
          <UserSettings />
          <NavigationLinks villageId={villageId} />
        </div>

        {/* フッター（広告等） */}
        <div className="p-4 border-t">
          <Advertisement type="sidebar" />
        </div>
      </div>
    </aside>
  );
};
```

### 4. ParticipantList（参加者一覧）

```typescript
interface ParticipantListProps {
  villageId: string;
}

export const ParticipantList: FC<ParticipantListProps> = ({ villageId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: participants = [] } = useParticipantsQuery(villageId);
  
  // 参加者をグループ分け
  const grouped = useMemo(() => {
    const alive = participants.filter(p => !p.dead && !p.isSpectator);
    const dead = participants.filter(p => p.dead);
    const spectators = participants.filter(p => p.isSpectator);
    
    return { alive, dead, spectators };
  }, [participants]);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
      >
        <span className="font-medium">参加者</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="pb-4">
          <ParticipantGroup
            title="生存"
            count={grouped.alive.length}
            participants={grouped.alive}
            villageId={villageId}
          />
          <ParticipantGroup
            title="死亡"
            count={grouped.dead.length}
            participants={grouped.dead}
            villageId={villageId}
          />
          <ParticipantGroup
            title="見学"
            count={grouped.spectators.length}
            participants={grouped.spectators}
            villageId={villageId}
          />
        </div>
      )}
    </div>
  );
};
```

### 5. MessageList（発言一覧）

```typescript
interface MessageListProps {
  villageId: string;
  day: number;
}

export const MessageList: FC<MessageListProps> = ({ villageId, day }) => {
  const filters = useMessageFilterStore();
  const displaySettings = useUserSettingsStore(state => state.displaySettings);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMessagesQuery(villageId, day, filters);

  // フィルタリング済みメッセージ
  const filteredMessages = useMemo(() => {
    return data?.pages.flatMap(page => 
      page.list.filter(message => 
        filters.messageTypes[message.content.type.code] &&
        filters.selectedSpeakers.includes(message.sender.participantId) &&
        (!filters.keywords.length || 
         filters.keywords.some(keyword => 
           message.content.text.includes(keyword)
         ))
      )
    ) || [];
  }, [data, filters]);

  return (
    <div className="space-y-4">
      {isLoading && <LoadingSpinner />}
      
      {filteredMessages.map((message, index) => (
        <MessageItem
          key={`${message.id}-${index}`}
          message={message}
          showDate={displaySettings.showDate}
          largeText={displaySettings.largeText}
          largeImage={displaySettings.largeCharacterImage}
        />
      ))}

      {hasNextPage && (
        <div className="text-center py-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingNextPage ? '読み込み中...' : 'もっと読み込む'}
          </button>
        </div>
      )}
    </div>
  );
};
```

### 6. MessageItem（発言アイテム）

```typescript
interface MessageItemProps {
  message: Message;
  showDate: boolean;
  largeText: boolean;
  largeImage: boolean;
}

export const MessageItem: FC<MessageItemProps> = ({
  message,
  showDate,
  largeText,
  largeImage
}) => {
  const currentUser = useAuthStore(state => state.user);
  
  const handleAnchorClick = (messageNum: number) => {
    const settings = useUserSettingsStore.getState().operationSettings;
    if (settings.pasteAnchorOnClick) {
      // 発言欄にアンカーを貼り付け
      insertAnchor(messageNum);
    } else {
      // 該当発言にスクロール
      scrollToMessage(messageNum);
    }
  };

  const handlePersonalExtraction = () => {
    const settings = useUserSettingsStore.getState().operationSettings;
    if (settings.openPersonalExtractionInNewTab) {
      window.open(`/village/${message.villageId}?filterId=${message.sender.participantId}`);
    } else {
      useMessageFilterStore.getState().setSpeakers([message.sender.participantId]);
    }
  };

  return (
    <article className={cn(
      "flex space-x-3 p-3 hover:bg-gray-50 rounded-lg",
      message.sender.participantId === currentUser?.id && "bg-blue-50"
    )}>
      {/* キャラアイコン */}
      <div className="flex-shrink-0">
        <CharacterIcon
          character={message.sender}
          size={largeImage ? "large" : "medium"}
          onClick={handlePersonalExtraction}
          className="cursor-pointer"
        />
      </div>

      {/* 発言内容 */}
      <div className="flex-1 min-w-0">
        {/* 発言者・時刻 */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">
            [{message.sender.shortName}] {message.sender.name}
          </span>
          <MessageTypeIcon type={message.content.type.code} />
          {showDate && (
            <TimeDisplay
              datetime={message.time.datetime}
              className="text-xs text-gray-500"
            />
          )}
        </div>

        {/* 発言テキスト */}
        <MessageContent
          content={message.content.text}
          largeText={largeText}
          onAnchorClick={handleAnchorClick}
        />

        {/* 発言番号・操作 */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            #{message.content.num}
          </span>
          <button
            onClick={() => handleAnchorClick(message.content.num)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            返信
          </button>
        </div>
      </div>
    </article>
  );
};
```

## 共通コンポーネント

### 1. CharacterIcon（キャラアイコン）

```typescript
interface CharacterIconProps {
  character: {
    chara: {
      faceTypeList: FaceType[];
    };
  };
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export const CharacterIcon: FC<CharacterIconProps> = ({
  character,
  size,
  onClick,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  useEffect(() => {
    // 表示用の画像URLを選択（APIのsizeの1/2を使用）
    const faceType = character.chara.faceTypeList[0];
    if (faceType) {
      const targetSize = sizeMap[size];
      setImageUrl(`${faceType.imageUrl}?size=${targetSize}`);
    }
  }, [character, size]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-full bg-gray-200",
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      style={{ 
        width: sizeMap[size], 
        height: sizeMap[size] 
      }}
      onClick={onClick}
    >
      {!imageError && imageUrl ? (
        <img
          src={imageUrl}
          alt={character.chara.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <User size={sizeMap[size] * 0.6} className="text-gray-500" />
        </div>
      )}
    </div>
  );
};
```

### 2. MessageContent（発言内容）

```typescript
interface MessageContentProps {
  content: string;
  largeText: boolean;
  onAnchorClick: (messageNum: number) => void;
}

export const MessageContent: FC<MessageContentProps> = ({
  content,
  largeText,
  onAnchorClick
}) => {
  // アンカーリンクの解析・置換
  const processedContent = useMemo(() => {
    return content.replace(
      />>\d+/g, 
      (match) => {
        const num = parseInt(match.slice(2));
        return `<a href="#" data-anchor="${num}" class="text-blue-500 hover:underline">${match}</a>`;
      }
    );
  }, [content]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.anchor) {
      e.preventDefault();
      onAnchorClick(parseInt(target.dataset.anchor));
    }
  };

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        largeText && "prose-base"
      )}
      dangerouslySetInnerHTML={{ __html: processedContent }}
      onClick={handleClick}
    />
  );
};
```

## パフォーマンス最適化

### 1. メモ化

```typescript
// 重い計算のメモ化
const filteredMessages = useMemo(() => {
  return applyMessageFilters(messages, filters);
}, [messages, filters]);

// コンポーネントのメモ化
export const MessageItem = memo<MessageItemProps>(({ message, ...props }) => {
  // コンポーネント実装
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.showDate === nextProps.showDate &&
    prevProps.largeText === nextProps.largeText
  );
});
```

### 2. 仮想化

```typescript
import { VirtualList } from 'react-window';

export const VirtualizedMessageList: FC<MessageListProps> = ({ messages }) => {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <MessageItem message={messages[index]} />
    </div>
  );

  return (
    <VirtualList
      height={600}
      itemCount={messages.length}
      itemSize={120} // 平均的な発言アイテムの高さ
    >
      {Row}
    </VirtualList>
  );
};
```

### 3. 遅延読み込み

```typescript
import { lazy, Suspense } from 'react';

// 重いモーダルコンポーネントの遅延読み込み
const MessageFilterModal = lazy(() => import('./Modal/MessageFilterModal'));

export const VillageLayout: FC = ({ children }) => {
  return (
    <div>
      {children}
      <Suspense fallback={<div>Loading...</div>}>
        <MessageFilterModal />
      </Suspense>
    </div>
  );
};
```

## テスト戦略

### 1. ユニットテスト

```typescript
// MessageItem.test.tsx
describe('MessageItem', () => {
  test('displays message content correctly', () => {
    const mockMessage = createMockMessage();
    render(<MessageItem message={mockMessage} />);
    
    expect(screen.getByText(mockMessage.content.text)).toBeInTheDocument();
    expect(screen.getByText(mockMessage.sender.name)).toBeInTheDocument();
  });

  test('calls onAnchorClick when anchor is clicked', () => {
    const onAnchorClick = jest.fn();
    const messageWithAnchor = createMockMessage({
      content: { text: 'test >>123 message' }
    });
    
    render(<MessageItem message={messageWithAnchor} onAnchorClick={onAnchorClick} />);
    
    fireEvent.click(screen.getByText('>>123'));
    expect(onAnchorClick).toHaveBeenCalledWith(123);
  });
});
```

### 2. 統合テスト

```typescript
// VillagePage.test.tsx
describe('VillagePage Integration', () => {
  test('renders village page with all components', async () => {
    const { mockApiHandlers } = setupMockApi();
    
    render(<VillagePage villageId="test-village" />);
    
    await waitFor(() => {
      expect(screen.getByText(/village name/i)).toBeInTheDocument();
      expect(screen.getByRole('list', { name: /participants/i })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: /messages/i })).toBeInTheDocument();
    });
  });
});
```