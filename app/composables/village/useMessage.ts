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
  // Store
  const messageStore = useVillageMessageStore()

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

  // API
  const { apiCall } = useApi()

  /**
   * 発言を取得（引数なしで内部の状態を使用）
   */
  const loadMessages = async () => {
    if (!villageId.value || !currentVillageDay.value) return

    messageStore.setLoading(true)
    messageStore.setError(null)

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
      const allParticipantCount = village.value
        ? village.value.participant.member_list.length +
          village.value.spectator.member_list.length
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
        params.page_num = messageStore.isDispLatest
          ? 10000
          : messageStore.currentPageNum
        params.is_disp_latest = messageStore.isDispLatest
      }

      // URLの構築(配列パラメータはrepeat形式で送信)
      const day = currentVillageDay.value
      const url = `/village/${villageId.value}/day/${day.day}/time/${day.noonnight}/message-list`
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
      messageStore.saveMessages(data)

      // ページ番号を更新
      if (data.current_page_num != null) {
        messageStore.setCurrentPageNum(data.current_page_num)
      }
    } catch (err) {
      messageStore.setError(
        err instanceof Error
          ? err
          : new Error(`発言の取得に失敗しました (村ID: ${villageId.value})`)
      )
      console.error(`発言の取得に失敗しました (村ID: ${villageId.value}):`, err)
    } finally {
      messageStore.setLoading(false)
    }
  }

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
    messageStore.setCurrentPageNum(pageNum)
    messageStore.setIsDispLatest(false)
    loadMessages()
  }

  /**
   * 最新ページを表示する設定に変更
   */
  const setDispLatest = (disp: boolean) => {
    messageStore.setIsDispLatest(disp)
    loadMessages()
  }

  /**
   * ページ状態をリセット（日付変更時に使用）
   * @param isLatestDay - 最新日に遷移する場合は true、それ以外は false
   */
  const resetPaging = (isLatestDay: boolean = false) => {
    messageStore.setCurrentPageNum(1)
    messageStore.setIsDispLatest(isLatestDay)
    loadMessages()
  }

  const isViewingLatestMessages = computed(() => {
    return (
      messageStore.isDispLatest ||
      messageStore.messages?.current_page_num ===
        messageStore.messages?.all_page_count
    )
  })

  return {
    // State (from store)
    messages: computed(() => messageStore.messages),
    loading: computed(() => messageStore.loading),
    error: computed(() => messageStore.error),
    currentPageNum: computed(() => messageStore.currentPageNum),
    isDispLatest: computed(() => messageStore.isDispLatest),

    // Computed
    isViewingLatestMessages,

    // Methods
    loadMessages,
    setFilter,
    resetFilter,
    setPageNum,
    setDispLatest,
    resetPaging
  }
}
