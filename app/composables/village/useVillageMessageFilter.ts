import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillage } from './useVillage'

/**
 * 発言抽出条件の管理
 */
export const useVillageMessageFilter = () => {
  // Composables
  const { village, allParticipantIds } = useVillage()
  // Store
  const filterStore = useVillageMessageFilterStore()

  /**
   * フィルタ条件を設定して適用
   */
  const applyFilter = (
    messageTypeGroups: MessageTypeGroup[] | null,
    participantIdList: number[] | null,
    toParticipantIdList: number[] | null,
    keywordText: string | null
  ) => {
    filterStore.setMessageFilter({
      messageTypeGroups,
      participantIdList,
      toParticipantIdList,
      keyword: keywordText
    })
  }

  /**
   * フィルタをリセット
   */
  const resetFilter = () => {
    filterStore.resetMessageFilter()
    filterStore.setMessageFilter({
      participantIdList: [...allParticipantIds.value],
      toParticipantIdList: [...allParticipantIds.value]
    })
  }

  /**
   * 特定の発言者のみ抽出
   */
  const filterByParticipant = (participantId: number) => {
    filterStore.resetMessageFilter()
    filterStore.setMessageFilter({
      participantIdList: [participantId]
    })
  }

  /**
   * フィルタリング中かどうか
   */
  const isFiltering = computed(() => {
    if (!village) return false

    const totalParticipantCount = allParticipantIds.value.length

    const messageTypeGroups = filterStore.messageTypeGroups
    const participantIdFilter = filterStore.participantIdFilter
    const toParticipantIdFilter = filterStore.toParticipantIdFilter
    const keywordFilter = filterStore.keywordFilter

    return (
      (messageTypeGroups.length !== 0 &&
        messageTypeGroups.length !== ALL_MESSAGE_TYPE_GROUPS.length) ||
      (participantIdFilter &&
        participantIdFilter.length > 0 &&
        participantIdFilter.length !== totalParticipantCount) ||
      (toParticipantIdFilter &&
        toParticipantIdFilter.length > 0 &&
        toParticipantIdFilter.length !== totalParticipantCount) ||
      !!keywordFilter
    )
  })

  return {
    // State (from store) - computed化してリアクティブに
    messageTypeGroups: computed(() => filterStore.messageTypeGroups),
    participantIds: computed(() => filterStore.participantIdFilter),
    toParticipantIds: computed(() => filterStore.toParticipantIdFilter),
    keyword: computed(() => filterStore.keywordFilter),

    // Computed (from store)
    messageTypes: computed(() => filterStore.messageTypeFilter),
    isFiltering: isFiltering,

    // Methods
    applyFilter,
    resetFilter,
    filterByParticipant
  }
}
