import { useVillageSayStatusStore } from '~/stores/village-say-status'

/**
 * 発言入力状態を管理するcomposable
 * Say.vueで状態を更新し、useVillageRefreshで参照する
 */
export const useVillageSayStatus = () => {
  const store = useVillageSayStatusStore()

  return {
    // Computed (from store)
    isInputting: computed(() => store.isInputting),

    // Methods
    setHasInputText: store.setHasInputText,
    setConfirmModalOpen: store.setConfirmModalOpen,
    setSubmitting: store.setSubmitting,
    reset: store.reset
  }
}
