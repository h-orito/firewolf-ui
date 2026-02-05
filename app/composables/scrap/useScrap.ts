import {
  getAnchorType,
  getAnchorNum
} from '~/components/pages/village/message/message-converter'
import { parseAnchorsFromUrl, appendAnchorToUrl } from './useScrapAnchor'
import { useAnchorMessage } from '~/composables/village/useAnchorMessage'

/**
 * 切り抜き機能のメインロジック
 */
export const useScrap = () => {
  // Store
  const scrapStore = useScrapStore()
  const villageStore = useVillageStore()

  // Router
  const router = useRouter()
  const route = useRoute()

  // Anchor message
  const { loadAnchorMessage } = useAnchorMessage()

  // State
  const loadingMessage = ref(false)

  /**
   * URLからアンカーを読み込んでメッセージを取得
   */
  const loadFromUrl = async () => {
    const anchorsStr = route.query.anchors as string | undefined
    if (!anchorsStr) return

    const anchors = parseAnchorsFromUrl(anchorsStr)
    if (anchors.length === 0) return

    for (const anchor of anchors) {
      await addMessageFromAnchor(anchor.typeCode, anchor.number)
    }
  }

  /**
   * アンカー文字列からメッセージを追加（例: ">>1", ">>*5"）
   */
  const addScrap = async (anchorString: string): Promise<boolean> => {
    let typeCode: string | null = null
    let number: number = 0

    try {
      typeCode = getAnchorType(anchorString)
      number = getAnchorNum(anchorString)
    } catch {
      return false
    }

    if (!typeCode) {
      return false
    }

    // URLに追加
    const currentAnchors = (route.query.anchors as string) || ''
    const newAnchors = appendAnchorToUrl(currentAnchors, typeCode, number)
    if (!newAnchors) {
      return false
    }

    await router.replace({
      query: {
        id: villageStore.villageId?.toString(),
        anchors: newAnchors
      }
    })

    // メッセージを取得して追加
    return await addMessageFromAnchor(typeCode, number)
  }

  /**
   * アンカー情報からメッセージを取得して追加
   */
  const addMessageFromAnchor = async (
    typeCode: string,
    number: number
  ): Promise<boolean> => {
    loadingMessage.value = true
    scrapStore.setLoading(true)

    try {
      const message = await loadAnchorMessage(typeCode, number)
      if (!message) {
        return false
      }

      scrapStore.addMessage(message)
      return true
    } finally {
      loadingMessage.value = false
      scrapStore.setLoading(false)
    }
  }

  /**
   * 全てのスクラップを削除
   */
  const deleteAllScrap = async (): Promise<void> => {
    if (!window.confirm('全て削除してよろしいですか？')) return

    scrapStore.clearMessages()

    await router.replace({
      query: {
        id: villageStore.villageId?.toString()
      }
    })
  }

  /**
   * リセット
   */
  const reset = () => {
    scrapStore.reset()
  }

  return {
    // State
    messages: computed(() => scrapStore.messages),
    loadingMessage: readonly(loadingMessage),
    loading: computed(() => scrapStore.loading),
    // Actions
    loadFromUrl,
    addScrap,
    deleteAllScrap,
    reset
  }
}
