import type { VillageView, VillageDayView } from '~/lib/api/types'

/**
 * 村情報の取得・管理
 */
export const useVillage = () => {
  // Store
  const villageStore = useVillageStore()

  // State (UI状態のみ)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // API
  const { apiCall } = useApi()

  /**
   * 村IDを初期化
   */
  const initVillage = (id: number) => {
    villageStore.init(id)
  }

  /**
   * 村情報を取得
   */
  const loadVillage = async () => {
    if (!villageStore.villageId) {
      error.value = new Error('村IDが設定されていません')
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiCall<VillageView>(
        `/village/${villageStore.villageId}`
      )
      villageStore.saveVillage(data)
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(
              `村情報の取得に失敗しました (村ID: ${villageStore.villageId})`
            )
      console.error(
        `村情報の取得に失敗しました (村ID: ${villageStore.villageId}):`,
        err
      )
    } finally {
      loading.value = false
    }
  }

  /**
   * 現在表示中の日付を変更
   */
  const changeCurrentVillageDay = (day: VillageDayView | null) => {
    villageStore.saveCurrentVillageDay(day)
  }

  /**
   * 日付IDで現在表示中の日付を変更
   */
  const changeCurrentVillageDayById = (villageDayId: number) => {
    if (!villageStore.village) return

    const day = villageStore.village.day.day_list.find(
      (d) => d.id === villageDayId
    )
    if (day) {
      villageStore.saveCurrentVillageDay(day)
    }
  }

  // Computed
  /**
   * 全参加者ID（参加者 + 見物人）
   */
  const allParticipantIds = computed(() => {
    if (!villageStore.village) return []
    return [
      ...villageStore.village.participant.member_list.map((p) => p.id),
      ...villageStore.village.spectator.member_list.map((p) => p.id)
    ]
  })

  /**
   * 現在の日付のインデックス
   */
  const currentVillageDayIndex = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return -1
    return villageStore.village.day.day_list.findIndex(
      (day) => day.id === villageStore.currentVillageDay?.id
    )
  })

  /**
   * 前日が存在するか
   */
  const existPrevDay = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return false
    return currentVillageDayIndex.value !== 0
  })

  /**
   * 翌日が存在するか
   */
  const existNextDay = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return false
    return (
      currentVillageDayIndex.value !==
      villageStore.village.day.day_list.length - 1
    )
  })

  /**
   * 前日のID
   */
  const prevDayId = computed(() => {
    if (!existPrevDay.value || !villageStore.village) return null
    return (
      villageStore.village.day.day_list[currentVillageDayIndex.value - 1]?.id ??
      null
    )
  })

  /**
   * 翌日のID
   */
  const nextDayId = computed(() => {
    if (!existNextDay.value || !villageStore.village) return null
    return (
      villageStore.village.day.day_list[currentVillageDayIndex.value + 1]?.id ??
      null
    )
  })

  /**
   * 前日に移動
   */
  const toPrevDay = () => {
    if (prevDayId.value === null) return
    changeCurrentVillageDayById(prevDayId.value)
  }

  /**
   * 翌日に移動
   */
  const toNextDay = () => {
    if (nextDayId.value === null) return
    changeCurrentVillageDayById(nextDayId.value)
  }

  return {
    // State (from store)
    village: computed(() => villageStore.village),
    villageId: computed(() => villageStore.villageId),
    currentVillageDay: computed(() => villageStore.currentVillageDay),
    latestDay: computed(() => villageStore.latestDay),

    // Computed
    allParticipantIds,
    existPrevDay,
    existNextDay,

    // State (UI state)
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    initVillage,
    loadVillage,
    changeCurrentVillageDay,
    changeCurrentVillageDayById,
    toPrevDay,
    toNextDay
  }
}
