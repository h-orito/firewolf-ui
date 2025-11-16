import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'

/**
 * 発言抽出条件の管理
 */
export const useVillageMessageFilter = () => {
  // Store
  const filterStore = useVillageMessageFilterStore()
  const villageStore = useVillageStore()

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
  const resetFilter = (allParticipantIds: number[]) => {
    filterStore.resetMessageFilter()
    filterStore.setMessageFilter({
      participantIdList: [...allParticipantIds],
      toParticipantIdList: [...allParticipantIds]
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
   * 特定の宛先のみ抽出
   */
  const filterByToParticipant = (participantId: number) => {
    filterStore.resetMessageFilter()
    filterStore.setMessageFilter({
      toParticipantIdList: [participantId]
    })
  }

  /**
   * フィルタリング中かどうか
   */
  const isFiltering = () => {
    const village = villageStore.village
    if (!village) return false

    const totalParticipantCount =
      village.participant.count + village.spectator.count

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
  }

  /**
   * 全発言種別を選択
   */
  const selectAllMessageTypes = () => {
    // storeのresetが全タイプを選択する
    filterStore.resetMessageFilter()
  }

  /**
   * 全発言種別の選択を解除
   */
  const deselectAllMessageTypes = () => {
    filterStore.setMessageFilter({
      messageTypeGroups: []
    })
  }

  /**
   * 発言種別の選択を反転
   */
  const reverseMessageTypeSelection = () => {
    const currentGroups = filterStore.messageTypeGroups ?? []
    const reversedGroups = ALL_MESSAGE_TYPE_GROUPS.filter(
      (group) => !currentGroups.includes(group)
    )
    filterStore.setMessageFilter({
      messageTypeGroups: reversedGroups
    })
  }

  /**
   * 全参加者を選択
   */
  const selectAllParticipants = (allParticipantIds: number[]) => {
    filterStore.setMessageFilter({
      participantIdList: [...allParticipantIds]
    })
  }

  /**
   * 全参加者の選択を解除
   */
  const deselectAllParticipants = () => {
    filterStore.setMessageFilter({
      participantIdList: []
    })
  }

  /**
   * 参加者の選択を反転
   */
  const reverseParticipantSelection = (allParticipantIds: number[]) => {
    const currentIds = filterStore.participantIdFilter ?? []
    const reversedIds = allParticipantIds.filter(
      (id) => !currentIds.includes(id)
    )
    filterStore.setMessageFilter({
      participantIdList: reversedIds
    })
  }

  /**
   * 全宛先を選択
   */
  const selectAllToParticipants = (allParticipantIds: number[]) => {
    filterStore.setMessageFilter({
      toParticipantIdList: [...allParticipantIds]
    })
  }

  /**
   * 全宛先の選択を解除
   */
  const deselectAllToParticipants = () => {
    filterStore.setMessageFilter({
      toParticipantIdList: []
    })
  }

  /**
   * 宛先の選択を反転
   */
  const reverseToParticipantSelection = (allParticipantIds: number[]) => {
    const currentIds = filterStore.toParticipantIdFilter ?? []
    const reversedIds = allParticipantIds.filter(
      (id) => !currentIds.includes(id)
    )
    filterStore.setMessageFilter({
      toParticipantIdList: reversedIds
    })
  }

  /**
   * 自分宛のみ選択
   */
  const selectToMyself = (myselfId: number) => {
    filterStore.setMessageFilter({
      toParticipantIdList: [myselfId]
    })
  }

  return {
    // State (from store)
    messageTypeGroups: computed(() => filterStore.messageTypeGroups),
    participantIds: computed(() => filterStore.participantIdFilter),
    toParticipantIds: computed(() => filterStore.toParticipantIdFilter),
    keyword: computed(() => filterStore.keywordFilter),

    // Computed (from store)
    getMessageTypeList: computed(() => filterStore.messageTypeFilter),
    isFiltering: computed(() => isFiltering()),

    // Methods
    applyFilter,
    resetFilter,
    filterByParticipant,
    filterByToParticipant,
    selectAllMessageTypes,
    deselectAllMessageTypes,
    reverseMessageTypeSelection,
    selectAllParticipants,
    deselectAllParticipants,
    reverseParticipantSelection,
    selectAllToParticipants,
    deselectAllToParticipants,
    reverseToParticipantSelection,
    selectToMyself
  }
}
