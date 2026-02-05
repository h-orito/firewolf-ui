import { defineStore } from 'pinia'
import type { MessageView } from '~/lib/api/types'

/**
 * 切り抜き機能の状態管理Store
 */
export const useScrapStore = defineStore('scrap', () => {
  // State
  const messages = ref<MessageView[]>([])
  const loading = ref<boolean>(false)

  // Actions
  /**
   * メッセージを追加
   */
  const addMessage = (message: MessageView) => {
    messages.value.push(message)
  }

  /**
   * 全てのメッセージをクリア
   */
  const clearMessages = () => {
    messages.value = []
  }

  /**
   * ローディング状態を設定
   */
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  /**
   * 状態をリセット
   */
  const reset = () => {
    messages.value = []
    loading.value = false
  }

  return {
    // State
    messages: readonly(messages),
    loading: readonly(loading),
    // Actions
    addMessage,
    clearMessages,
    setLoading,
    reset
  }
})
