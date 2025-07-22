import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VillageDisplaySettings {
  // 文字サイズ設定
  fontSize: 'small' | 'medium' | 'large'
  // 日時表示設定
  showTimestamp: boolean
  // 発言者名表示設定
  showSpeakerName: boolean
  // 発言番号表示設定
  showMessageNumber: boolean
  // メッセージのコンパクト表示
  compactView: boolean
  // 1ページあたりの表示件数
  messagesPerPage: number
}

export interface VillageFilterSettings {
  // 表示する発言種別
  visibleMessageTypes: string[]
  // 特定の参加者のみ表示
  filterByParticipant: string | null
  // 発言者でフィルタリング
  hiddenParticipants: string[]
}

export interface VillageSettings {
  display: VillageDisplaySettings
  filter: VillageFilterSettings
}

interface VillageSettingsStore {
  settings: VillageSettings
  updateDisplaySettings: (settings: Partial<VillageDisplaySettings>) => void
  updateFilterSettings: (settings: Partial<VillageFilterSettings>) => void
  resetSettings: () => void
}

const defaultSettings: VillageSettings = {
  display: {
    fontSize: 'medium',
    showTimestamp: true,
    showSpeakerName: true,
    showMessageNumber: true,
    compactView: false,
    messagesPerPage: 50,
  },
  filter: {
    visibleMessageTypes: ['say', 'werewolf_say', 'grave_say', 'monologue', 'spectate_say'],
    filterByParticipant: null,
    hiddenParticipants: [],
  },
}

export const useVillageSettingsStore = create<VillageSettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateDisplaySettings: (newSettings: Partial<VillageDisplaySettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            display: { ...state.settings.display, ...newSettings },
          },
        }))
      },
      updateFilterSettings: (newSettings: Partial<VillageFilterSettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            filter: { ...state.settings.filter, ...newSettings },
          },
        }))
      },
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'village-settings',
    }
  )
)
