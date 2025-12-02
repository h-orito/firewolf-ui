import type { MessagesView } from '~/lib/api/types'
import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillage } from './useVillage'
import { useUserSettings } from './useUserSettings'
import { useVillageMessageFilter } from './useVillageMessageFilter'

/**
 * 発言の取得・管理
 */
export const useMessage = () => {
  // Composables
  const { villageId, currentVillageDay, village } = useVillage()
  const { getPaging } = useUserSettings()
  const {
    messageTypeGroups,
    messageTypes,
    participantIds,
    toParticipantIds,
    keyword
  } = useVillageMessageFilter()

  // State
  const messages = ref<MessagesView | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Paging state
  const currentPageNum = ref<number>(1)
  const isDispLatest = ref<boolean>(true)

  // API
  const { apiCall } = useApi()

  /**
   * 発言を取得（引数なしで内部の状態を使用）
   */
  const loadMessages = async () => {
    if (!villageId || !currentVillageDay) return

    loading.value = true
    error.value = null

    try {
      // ページング設定を取得
      const pagingSettings = getPaging()

      // クエリパラメータの構築
      const params: Record<
        string,
        string | number | string[] | number[] | boolean
      > = {}

      // フィルタ条件（全て選択されている場合はパラメータ不要）
      if (
        messageTypes &&
        messageTypes.length > 0 &&
        messageTypeGroups.length < ALL_MESSAGE_TYPE_GROUPS.length
      ) {
        params.message_type_list = [...messageTypes]
      }
      // 参加者フィルタ（全員選択されている場合はパラメータ不要）
      const allParticipantCount = village
        ? village.participant.member_list.length +
          village.spectator.member_list.length
        : 0
      if (
        participantIds &&
        participantIds.length > 0 &&
        participantIds.length < allParticipantCount
      ) {
        params.participant_id_list = [...participantIds]
      }
      if (
        toParticipantIds &&
        toParticipantIds.length > 0 &&
        toParticipantIds.length < allParticipantCount
      ) {
        params.to_participant_id_list = [...toParticipantIds]
      }
      if (keyword) {
        params.keyword = keyword
      }

      // ページング設定
      if (pagingSettings.isPaging && pagingSettings.messagePerPage) {
        params.page_size = pagingSettings.messagePerPage
        params.page_num = isDispLatest.value ? 10000 : currentPageNum.value
        params.is_disp_latest = isDispLatest.value
      }

      // URLの構築(配列パラメータはrepeat形式で送信)
      const day = currentVillageDay
      const url = `/village/${villageId}/day/${day.day}/time/${day.noonnight}/message-list`
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, String(v)))
        } else {
          query.append(key, String(value))
        }
      })

      const fullUrl = query.toString() ? `${url}?${query.toString()}` : url

      const data = await apiCall<MessagesView>(fullUrl)
      messages.value = data

      // ページ番号を更新
      if (data.current_page_num != null) {
        currentPageNum.value = data.current_page_num
      }
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(`発言の取得に失敗しました (村ID: ${villageId})`)
      console.error(`発言の取得に失敗しました (村ID: ${villageId}):`, err)
    } finally {
      loading.value = false
    }
  }

  // 監視: 表示日が変更されたら発言を取得
  // immediate: true により初期表示時にも発言を取得する
  watch(
    () => currentVillageDay,
    (newDay) => {
      if (newDay) {
        // 日付が変更されたらページ番号をリセットして最新を表示
        currentPageNum.value = 1
        isDispLatest.value = true
        loadMessages()
      }
    },
    { immediate: true }
  )

  /**
   * フィルタ条件を設定
   */
  const setFilter = (filter: {
    messageTypeGroups?: MessageTypeGroup[] | null
    participantIdList?: number[] | null
    toParticipantIdList?: number[] | null
    keyword?: string | null
  }) => {
    const { applyFilter } = useVillageMessageFilter()
    applyFilter(
      filter.messageTypeGroups ?? null,
      filter.participantIdList ?? null,
      filter.toParticipantIdList ?? null,
      filter.keyword ?? null
    )
  }

  /**
   * フィルタ条件をリセット
   */
  const resetFilter = () => {
    const { resetFilter: filterReset } = useVillageMessageFilter()
    filterReset()
  }

  /**
   * ページ番号を設定
   */
  const setPageNum = (pageNum: number) => {
    currentPageNum.value = pageNum
    isDispLatest.value = false
    loadMessages()
  }

  /**
   * 最新ページを表示する設定に変更
   */
  const setDispLatest = (disp: boolean) => {
    isDispLatest.value = disp
    loadMessages()
  }

  const isViewingLatestMessages = computed(() => {
    return (
      isDispLatest.value ||
      messages.value?.current_page_num === messages.value?.all_page_count
    )
  })

  return {
    // State
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    currentPageNum: readonly(currentPageNum),
    isDispLatest: readonly(isDispLatest),

    // Computed
    isViewingLatestMessages,

    // Methods
    loadMessages,
    setFilter,
    resetFilter,
    setPageNum,
    setDispLatest
  }
}
