import type { InjectionKey } from 'vue'
import type { MessageView } from '~/lib/api/types'

/**
 * 発言入力欄へのアンカー挿入・秘話切替機能
 *
 * 使用方法:
 * 1. village.vue で useSayInputProvider() を呼び出す（provide側）
 * 2. Say.vue で useSayInputRegister() を呼び出してハンドラを登録
 * 3. SayMessage.vue で useSayInput() を呼び出してinsertAnchor/switchToSecretを使用
 */

export interface SayInputContext {
  /** 発言入力欄にアンカー文字列を挿入 */
  insertAnchor: (anchorString: string) => void
  /** 秘話モードに切り替え、対象を設定 */
  switchToSecret: (targetParticipantId: number) => void
  /** 返信・秘話対象のメッセージを設定 */
  setReplyTarget: (message: MessageView | null) => void
}

export interface SayInputRegisterContext {
  /** Say.vueからハンドラを登録 */
  registerHandlers: (handlers: {
    insertAnchor: (anchor: string) => void
    switchToSecret: (targetId: number) => void
    setReplyTarget: (message: MessageView | null) => void
  }) => void
  /** ハンドラの登録を解除 */
  unregisterHandlers: () => void
}

export const SAY_INPUT_KEY = Symbol() as InjectionKey<SayInputContext>
export const SAY_INPUT_REGISTER_KEY =
  Symbol() as InjectionKey<SayInputRegisterContext>

/**
 * 発言入力のProvider（village.vueで使用）
 * Say.vueからハンドラを登録し、SayMessage.vueから呼び出せるようにする
 */
export const useSayInputProvider = () => {
  const callbacks = ref<{
    insertAnchor?: (anchor: string) => void
    switchToSecret?: (targetId: number) => void
    setReplyTarget?: (message: MessageView | null) => void
  }>({})

  /**
   * Say.vueからハンドラを登録
   */
  const registerHandlers = (handlers: {
    insertAnchor: (anchor: string) => void
    switchToSecret: (targetId: number) => void
    setReplyTarget: (message: MessageView | null) => void
  }) => {
    callbacks.value = handlers
  }

  /**
   * ハンドラの登録を解除
   */
  const unregisterHandlers = () => {
    callbacks.value = {}
  }

  /**
   * 発言入力欄にアンカー文字列を挿入
   */
  const insertAnchor = (anchorString: string) => {
    callbacks.value.insertAnchor?.(anchorString)
  }

  /**
   * 秘話モードに切り替え、対象を設定
   */
  const switchToSecret = (targetParticipantId: number) => {
    callbacks.value.switchToSecret?.(targetParticipantId)
  }

  /**
   * 返信・秘話対象のメッセージを設定
   */
  const setReplyTarget = (message: MessageView | null) => {
    callbacks.value.setReplyTarget?.(message)
  }

  // 子コンポーネントで inject できるように provide
  provide(SAY_INPUT_KEY, { insertAnchor, switchToSecret, setReplyTarget })
  provide(SAY_INPUT_REGISTER_KEY, { registerHandlers, unregisterHandlers })
}

/**
 * 発言入力のConsumer（SayMessage.vueで使用）
 * insertAnchor/switchToSecretを呼び出せる
 */
export const useSayInput = () => {
  return inject(SAY_INPUT_KEY)
}

/**
 * 発言入力のハンドラ登録（Say.vueで使用）
 * registerHandlers/unregisterHandlersを呼び出せる
 */
export const useSayInputRegister = () => {
  return inject(SAY_INPUT_REGISTER_KEY)
}
