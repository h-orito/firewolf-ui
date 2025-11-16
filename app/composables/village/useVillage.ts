import type { VillageView } from '~/lib/api/types'

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

  return {
    // State (from store)
    village: computed(() => villageStore.village),
    villageId: computed(() => villageStore.villageId),

    // State (UI state)
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    initVillage,
    loadVillage
  }
}
