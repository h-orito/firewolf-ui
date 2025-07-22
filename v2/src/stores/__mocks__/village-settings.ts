import { create } from 'zustand'

export const useVillageSettingsStore = create(() => ({
  settings: {
    display: {
      fontSize: 'medium' as const,
      compactView: false,
      showMessageNumber: true,
      showTimestamp: true,
      showSpeakerName: true,
    },
  },
  updateSettings: jest.fn(),
  resetSettings: jest.fn(),
}))
