import type { SituationAsParticipantView } from '~/lib/api/types'

/**
 * 参加状況の取得・管理
 */
export const useSituation = () => {
  // Store
  const villageStore = useVillageStore()

  // State
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // API
  const { apiCall } = useApi()

  /**
   * 参加状況を取得
   */
  const loadSituation = async (villageId: number) => {
    loading.value = true
    error.value = null

    try {
      const data = await apiCall<SituationAsParticipantView>(
        `/village/${villageId}/situation`
      )
      villageStore.saveSituation(data)
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(`参加状況の取得に失敗しました (村ID: ${villageId})`)
      console.error(`参加状況の取得に失敗しました (村ID: ${villageId}):`, err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State (from store)
    situation: computed(() => villageStore.situation),
    loading: readonly(loading),
    error: readonly(error),

    // Computed

    // Methods
    loadSituation
  }
}
