import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { VillageState } from '@/types/village'

interface VillageStoreState extends VillageState {
  // Actions
  setVillageId: (villageId: number) => void
  setCurrentDay: (day: number) => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleSidebar: () => void
  reset: () => void
}

/**
 * 村画面の基本状態を管理するストア
 *
 * 重要な設計方針：
 * - 永続化は行わない（別タブ独立性のため）
 * - 各タブはデフォルト状態から開始
 * - URLパラメータでの初期化をサポート
 */
export const useVillageStore = create<VillageStoreState>()(
  devtools(
    (set, get) => ({
      // State
      villageId: 0,
      currentDay: 1, // デフォルトは最新日（実際は API から取得した値で更新）
      isSidebarOpen: false, // モバイルでは閉じた状態から開始

      // Actions
      setVillageId: (villageId) => {
        set({ villageId }, false, 'village/setVillageId')
      },

      setCurrentDay: (currentDay) => {
        set({ currentDay }, false, 'village/setCurrentDay')
      },

      setSidebarOpen: (isSidebarOpen) => {
        set({ isSidebarOpen }, false, 'village/setSidebarOpen')
      },

      toggleSidebar: () => {
        const { isSidebarOpen } = get()
        set({ isSidebarOpen: !isSidebarOpen }, false, 'village/toggleSidebar')
      },

      reset: () => {
        set(
          {
            villageId: 0,
            currentDay: 1,
            isSidebarOpen: false,
          },
          false,
          'village/reset'
        )
      },
    }),
    {
      name: 'village-store',
    }
  )
)

/**
 * 村の基本情報を初期化するヘルパー関数
 * ページロード時やURLパラメータの変更時に使用
 */
export const initializeVillageState = (villageId: number, initialDay?: number) => {
  const { setVillageId, setCurrentDay } = useVillageStore.getState()

  setVillageId(villageId)

  if (initialDay !== undefined) {
    setCurrentDay(initialDay)
  }
}

/**
 * 村画面から離れる際の状態リセット
 * 他の村に移動する際やページを離れる際に使用
 */
export const resetVillageState = () => {
  const { reset } = useVillageStore.getState()
  reset()
}
