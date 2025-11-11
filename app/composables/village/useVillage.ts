import type { VillageView } from '~/lib/api/types'

/**
 * 村情報の取得・管理
 */
export const useVillage = () => {
  // State
  const village = ref<VillageView | null>(null)
  const villageId = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // API
  const { apiCall } = useApi()

  /**
   * 村IDを初期化
   */
  const initVillage = (id: number) => {
    villageId.value = id
  }

  /**
   * 村情報を取得
   */
  const loadVillage = async () => {
    if (!villageId.value) {
      error.value = new Error('村IDが設定されていません')
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiCall<VillageView>(`/village/${villageId.value}`)
      village.value = data
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(`村情報の取得に失敗しました (村ID: ${villageId.value})`)
      console.error(
        `村情報の取得に失敗しました (村ID: ${villageId.value}):`,
        err
      )
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    village: readonly(village),
    villageId: readonly(villageId),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    initVillage,
    loadVillage
  }
}
