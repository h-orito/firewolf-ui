import type { MessagesView, VillageDayView } from '~/lib/api/types'
import type { MessageTypeGroup } from '~/lib/api/message-constants'

/**
 * 発言の取得・管理
 */
export const useMessage = () => {
  // Store
  const filterStore = useVillageMessageFilterStore()

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
   * 発言を取得
   */
  const loadMessages = async (
    villageId: number,
    day: VillageDayView,
    isDispLatestPage: boolean = false,
    pageSize: number | null = null,
    isPaging: boolean = false
  ) => {
    loading.value = true
    error.value = null

    try {
      // クエリパラメータの構築
      const params: Record<
        string,
        string | number | string[] | number[] | boolean
      > = {}

      // フィルタ条件
      if (filterStore.messageTypeFilter.length > 0) {
        params.message_type_list = [...filterStore.messageTypeFilter]
      }
      if (
        filterStore.participantIdFilter &&
        filterStore.participantIdFilter.length > 0
      ) {
        params.participant_id_list = [...filterStore.participantIdFilter]
      }
      if (
        filterStore.toParticipantIdFilter &&
        filterStore.toParticipantIdFilter.length > 0
      ) {
        params.to_participant_id_list = [...filterStore.toParticipantIdFilter]
      }
      if (filterStore.keywordFilter) {
        params.keyword = filterStore.keywordFilter
      }

      // ページング設定
      if (isPaging && pageSize) {
        params.page_size = pageSize
        params.page_num = isDispLatestPage ? 10000 : currentPageNum.value
        params.is_disp_latest = isDispLatest.value
      }

      // URLの構築(配列パラメータはrepeat形式で送信)
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

  /**
   * フィルタ条件を設定
   */
  const setFilter = (filter: {
    messageTypeGroups?: MessageTypeGroup[] | null
    participantIdList?: number[] | null
    toParticipantIdList?: number[] | null
    keyword?: string | null
  }) => {
    filterStore.setMessageFilter(filter)
  }

  /**
   * フィルタ条件をリセット
   */
  const resetFilter = () => {
    filterStore.resetMessageFilter()
  }

  /**
   * ページ番号を設定
   */
  const setPageNum = (pageNum: number) => {
    currentPageNum.value = pageNum
    isDispLatest.value = false
  }

  /**
   * 最新ページを表示する設定に変更
   */
  const setDispLatest = (disp: boolean) => {
    isDispLatest.value = disp
  }

  return {
    // State
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    currentPageNum: readonly(currentPageNum),
    isDispLatest: readonly(isDispLatest),

    // Methods
    loadMessages,
    setFilter,
    resetFilter,
    setPageNum,
    setDispLatest
  }
}
