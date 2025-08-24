import { defineStore } from 'pinia'
import type { components } from '~/lib/api/schema'

// API型の定義
type VillageView = components['schemas']['VillageView']
type MessagesView = components['schemas']['MessagesView']
type SituationAsParticipantView =
  components['schemas']['SituationAsParticipantView']
type DebugVillageView = components['schemas']['DebugVillageView']
type VillageMessageRestrict = components['schemas']['VillageMessageRestrict']

export const useVillageStore = defineStore('village', () => {
  const { apiCall } = useApi()

  const villageId = ref<number | null>(null)
  const village = ref<VillageView | null>(null)
  const messages = ref<MessagesView | null>(null)
  const situation = ref<SituationAsParticipantView | null>(null)
  const isFiltering = ref<boolean>(false)
  const debugVillage = ref<DebugVillageView | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Computed properties
  const getVillageId = computed(() => villageId.value)
  const getVillage = computed(() => village.value)
  const getLatestDay = computed(() => {
    const dayList = village.value?.day?.day_list
    if (dayList && dayList.length > 0) {
      return dayList[dayList.length - 1] || null
    }
    return null
  })
  const getRestrictCountMap = computed(() => {
    const messageRestricts =
      village.value?.setting?.rules?.message_restrict?.restrict_list
    if (messageRestricts) {
      return new Map(
        messageRestricts.map((r: VillageMessageRestrict) => [
          r.type?.code || '',
          r.count || 0
        ])
      )
    }
    return null
  })
  const getMessages = computed(() => messages.value)
  const getSituation = computed(() => situation.value)
  const getDebugVillage = computed(() => debugVillage.value)

  // Actions
  const init = (id: number) => {
    villageId.value = id
    village.value = null
    messages.value = null
    situation.value = null
    debugVillage.value = null
    error.value = null
  }

  const saveVillage = (villageData: VillageView) => {
    village.value = villageData
  }

  const saveMessages = (messagesData: MessagesView | null) => {
    messages.value = messagesData
  }

  const saveSituation = (situationData: SituationAsParticipantView) => {
    situation.value = situationData
  }

  const saveFiltering = (filtering: boolean) => {
    isFiltering.value = filtering
  }

  const saveDebugVillage = (debugVillageData: DebugVillageView) => {
    debugVillage.value = debugVillageData
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  // API呼び出し用のアクション
  const loadVillage = async () => {
    if (!villageId.value) return

    try {
      setLoading(true)
      setError(null)

      const villageData = await apiCall<VillageView>(
        `/village/${villageId.value}`
      )
      saveVillage(villageData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load village')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (day?: number, messageTypeCode?: string) => {
    if (!villageId.value) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (day !== undefined) params.append('day', day.toString())
      if (messageTypeCode) params.append('messageTypeCode', messageTypeCode)

      const queryString = params.toString()
      const url = `/village/${villageId.value}/messages${queryString ? `?${queryString}` : ''}`

      const messagesData = await apiCall<MessagesView>(url)
      saveMessages(messagesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loadSituation = async () => {
    if (!villageId.value) return

    try {
      setLoading(true)
      setError(null)

      const situationData = await apiCall<SituationAsParticipantView>(
        `/village/${villageId.value}/participant-situation`
      )
      saveSituation(situationData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load situation')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loadDebugVillage = async () => {
    if (!villageId.value) return

    try {
      setLoading(true)
      setError(null)

      const debugData = await apiCall<DebugVillageView>(
        `/village/${villageId.value}/debug`
      )
      saveDebugVillage(debugData)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load debug village'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    // State (readonly)
    villageId: readonly(villageId),
    village: readonly(village),
    messages: readonly(messages),
    situation: readonly(situation),
    isFiltering: readonly(isFiltering),
    debugVillage: readonly(debugVillage),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    getVillageId,
    getVillage,
    getLatestDay,
    getRestrictCountMap,
    getMessages,
    getSituation,
    getDebugVillage,

    // Actions
    init,
    saveVillage,
    saveMessages,
    saveSituation,
    saveFiltering,
    saveDebugVillage,
    setLoading,
    setError,
    loadVillage,
    loadMessages,
    loadSituation,
    loadDebugVillage
  }
})
