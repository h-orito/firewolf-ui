import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type MessagesView = components['schemas']['MessagesView']
type VillageMessageForm = components['schemas']['VillageMessageForm']
type VillageStatus = components['schemas']['VillageStatus']

interface UseVillageMessagesInfiniteQueryOptions {
  villageId: string
  day: number
  noonnight: string
  form?: VillageMessageForm
  villageStatus?: VillageStatus
  enabled?: boolean
}

/**
 * 村のメッセージ一覧を無限スクロール対応で取得するフック
 *
 * 特徴：
 * - 無限スクロールによる段階的なデータ取得
 * - 村の状態に応じた適切なポーリング間隔
 * - フィルタリング機能との統合
 * - パフォーマンス最適化（仮想化対応）
 */
export const useVillageMessagesInfiniteQuery = ({
  villageId,
  day,
  noonnight,
  form,
  villageStatus,
  enabled = true,
}: UseVillageMessagesInfiniteQueryOptions) => {
  // 村の状態に応じてポーリング間隔を調整
  const getRefetchInterval = () => {
    if (!villageStatus) return false
    if (villageStatus.is_finished || villageStatus.is_canceled) return false
    if (villageStatus.is_prologue) return 60000 // プロローグ中は60秒
    if (villageStatus.is_progress) return 30000 // 進行中は30秒（仕様：新着発言確認30秒）
    if (villageStatus.is_epilogue) return 30000 // エピローグ中は30秒
    return false
  }

  return useInfiniteQuery<MessagesView | undefined>({
    queryKey: ['villageMessagesInfinite', villageId, day, noonnight, form],
    queryFn: async ({ pageParam = 1 }) => {
      const { data, error } = await apiClient.GET(
        '/village/{villageId}/day/{day}/time/{noonnight}/message-list',
        {
          params: {
            path: {
              villageId: Number(villageId),
              day: Number(day),
              noonnight: noonnight,
            },
            query: {
              form: {
                ...form,
                page_num: pageParam as number,
              },
            },
          },
        }
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (error) {
        throw new Error('Failed to fetch messages')
      }

      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      // lastPageがundefinedの場合は次のページなし
      if (!lastPage || !lastPage.exist_next_page) {
        return undefined
      }

      // 現在のページ番号 + 1を返す
      const currentPage = lastPage.current_page_num ?? allPages.length
      return currentPage + 1
    },
    getPreviousPageParam: (firstPage) => {
      // firstPageがundefinedの場合は前のページなし
      if (!firstPage || !firstPage.exist_pre_page) {
        return undefined
      }

      // 現在のページ番号 - 1を返す
      const currentPage = firstPage.current_page_num ?? 1
      return currentPage > 1 ? currentPage - 1 : undefined
    },
    initialPageParam: 1,
    enabled,
    staleTime: 1000 * 10, // 10秒間はキャッシュを利用
    refetchInterval: getRefetchInterval(),
    refetchIntervalInBackground: false, // バックグラウンドでは更新しない
    // パフォーマンス最適化のため、最大ページ数を制限（必要に応じて調整）
    maxPages: 10,
  })
}

/**
 * 全メッセージを統合した配列を取得するヘルパーフック
 */
export const useVillageMessagesFlat = (options: UseVillageMessagesInfiniteQueryOptions) => {
  const query = useVillageMessagesInfiniteQuery(options)

  // 全ページのメッセージを統合
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const allMessages = query.data ? query.data.pages.flatMap((page) => page?.list ?? []) : []

  // 総メッセージ数（最初のページから取得）
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const totalCount = query.data ? (query.data.pages[0]?.all_record_count ?? 0) : 0

  // 今日のメッセージ数マップ（最新ページから取得）
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const todayMessageCountMap = query.data
    ? (query.data.pages[0]?.today_message_count_map ?? {})
    : {}

  // 最新ページかどうか（最初のページから取得）
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isLatest = query.data ? (query.data.pages[0]?.is_latest ?? false) : false

  return {
    ...query,
    allMessages,
    totalCount,
    todayMessageCountMap,
    isLatest,
  }
}

/**
 * 最新メッセージのみを取得するフック（リアルタイム更新用）
 */
export const useVillageLatestMessagesQuery = ({
  villageId,
  day,
  noonnight,
  form,
  villageStatus,
  enabled = true,
}: UseVillageMessagesInfiniteQueryOptions) => {
  const getRefetchInterval = () => {
    if (!villageStatus) return false
    if (villageStatus.is_finished || villageStatus.is_canceled) return false
    if (villageStatus.is_prologue) return 60000
    if (villageStatus.is_progress) return 30000 // 新着確認30秒間隔
    if (villageStatus.is_epilogue) return 30000
    return false
  }

  return useInfiniteQuery<MessagesView | undefined>({
    queryKey: ['villageLatestMessages', villageId, day, noonnight, form],
    queryFn: async () => {
      // 最新ページ（1ページ目）のみ取得
      const { data, error } = await apiClient.GET(
        '/village/{villageId}/day/{day}/time/{noonnight}/message-list',
        {
          params: {
            path: {
              villageId: Number(villageId),
              day: Number(day),
              noonnight: noonnight,
            },
            query: {
              form: {
                ...form,
                page_num: 1,
              },
            },
          },
        }
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (error) {
        throw new Error('Failed to fetch latest messages')
      }

      return data
    },
    getNextPageParam: () => undefined, // 最新ページのみなので次ページなし
    initialPageParam: 1,
    enabled,
    staleTime: 1000 * 5, // 5秒間はキャッシュを利用（短めに設定）
    refetchInterval: getRefetchInterval(),
    refetchIntervalInBackground: false,
    maxPages: 1, // 最新ページのみ
  })
}
