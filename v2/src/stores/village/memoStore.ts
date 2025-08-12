import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { MemoState, Memo } from '@/types/village'

interface MemoStoreState extends MemoState {
  // Actions
  createMemo: (title: string, content: string) => string
  updateMemo: (id: string, updates: Partial<Pick<Memo, 'title' | 'content'>>) => void
  deleteMemo: (id: string) => void
  clearAllMemos: () => void

  // Getters
  getMemo: (id: string) => Memo | undefined
  getMemoCount: () => number
  canCreateMemo: () => boolean

  // Utility
  generateId: () => string
}

/**
 * メモの状態を管理するストア
 *
 * 重要な設計方針：
 * - Cookie に永続化（ユーザーのメモは永続化が必要）
 * - 最大3個まで保存可能
 * - 古いメモから自動的に削除される
 * - IDは一意性を保証
 */
export const useMemoStore = create<MemoStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        memos: [],

        // Actions
        createMemo: (title, content) => {
          const { memos, generateId } = get()
          const id = generateId()
          const now = new Date()

          const newMemo: Memo = {
            id,
            title: title.trim() || '無題のメモ',
            content: content.trim(),
            createdAt: now,
            updatedAt: now,
          }

          let updatedMemos = [...memos, newMemo]

          // 最大3個を超える場合は、最も古いメモを削除
          if (updatedMemos.length > 3) {
            updatedMemos = updatedMemos
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .slice(-3) // 最新の3個を保持
          }

          set({ memos: updatedMemos }, false, 'memo/createMemo')

          return id
        },

        updateMemo: (id, updates) => {
          set(
            (state) => ({
              memos: state.memos.map((memo) =>
                memo.id === id
                  ? {
                      ...memo,
                      ...updates,
                      title: updates.title?.trim() || memo.title,
                      content: updates.content?.trim() ?? memo.content,
                      updatedAt: new Date(),
                    }
                  : memo
              ),
            }),
            false,
            'memo/updateMemo'
          )
        },

        deleteMemo: (id) => {
          set(
            (state) => ({
              memos: state.memos.filter((memo) => memo.id !== id),
            }),
            false,
            'memo/deleteMemo'
          )
        },

        clearAllMemos: () => {
          set({ memos: [] }, false, 'memo/clearAllMemos')
        },

        // Getters
        getMemo: (id) => {
          const { memos } = get()
          return memos.find((memo) => memo.id === id)
        },

        getMemoCount: () => {
          const { memos } = get()
          return memos.length
        },

        canCreateMemo: () => {
          const { memos } = get()
          return memos.length < 3
        },

        // Utility
        generateId: () => {
          return `memo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
      }),
      {
        name: 'firewolf-village-memos',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          memos: state.memos.map((memo) => ({
            ...memo,
            // 日付オブジェクトを文字列として保存
            createdAt: memo.createdAt.toISOString(),
            updatedAt: memo.updatedAt.toISOString(),
          })),
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // 文字列から日付オブジェクトに復元
            state.memos = state.memos.map((memo: any) => ({
              ...memo,
              createdAt: new Date(memo.createdAt),
              updatedAt: new Date(memo.updatedAt),
            }))
          }
        },
        version: 1,
        // マイグレーション関数
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // 初期バージョンからのマイグレーション
            return {
              memos: [],
              ...persistedState,
            }
          }
          return persistedState as MemoStoreState
        },
      }
    ),
    {
      name: 'memo-store',
    }
  )
)

/**
 * メモを作成する（最大数チェック付き）
 */
export const createMemoSafe = (
  title: string,
  content: string
): { success: boolean; id?: string; error?: string } => {
  const { canCreateMemo, createMemo } = useMemoStore.getState()

  if (!canCreateMemo()) {
    return {
      success: false,
      error: 'メモは最大3個まで作成できます。既存のメモを削除してから再度お試しください。',
    }
  }

  if (!title.trim() && !content.trim()) {
    return {
      success: false,
      error: 'タイトルまたは内容を入力してください。',
    }
  }

  const id = createMemo(title, content)
  return {
    success: true,
    id,
  }
}

/**
 * メモを更新する（存在チェック付き）
 */
export const updateMemoSafe = (
  id: string,
  updates: Partial<Pick<Memo, 'title' | 'content'>>
): { success: boolean; error?: string } => {
  const { getMemo, updateMemo } = useMemoStore.getState()

  const memo = getMemo(id)
  if (!memo) {
    return {
      success: false,
      error: '指定されたメモが見つかりません。',
    }
  }

  if (
    updates.title !== undefined &&
    !updates.title.trim() &&
    !updates.content?.trim() &&
    !memo.content
  ) {
    return {
      success: false,
      error: 'タイトルまたは内容を入力してください。',
    }
  }

  updateMemo(id, updates)
  return { success: true }
}

/**
 * メモを削除する（存在チェック付き）
 */
export const deleteMemoSafe = (id: string): { success: boolean; error?: string } => {
  const { getMemo, deleteMemo } = useMemoStore.getState()

  const memo = getMemo(id)
  if (!memo) {
    return {
      success: false,
      error: '指定されたメモが見つかりません。',
    }
  }

  deleteMemo(id)
  return { success: true }
}

/**
 * メモをエクスポート用のJSONに変換
 */
export const exportMemos = (): string => {
  const { memos } = useMemoStore.getState()
  const exportData = {
    memos: memos.map((memo) => ({
      title: memo.title,
      content: memo.content,
      createdAt: memo.createdAt.toISOString(),
      updatedAt: memo.updatedAt.toISOString(),
    })),
    exportedAt: new Date().toISOString(),
    version: 1,
  }
  return JSON.stringify(exportData, null, 2)
}

/**
 * エクスポートしたJSONからメモをインポート
 */
export const importMemos = (
  jsonString: string
): { success: boolean; imported: number; error?: string } => {
  try {
    const importData = JSON.parse(jsonString)

    if (!importData || !Array.isArray(importData.memos)) {
      return {
        success: false,
        imported: 0,
        error: '無効なデータ形式です。',
      }
    }

    const { clearAllMemos, createMemo } = useMemoStore.getState()

    // 既存のメモをクリア（確認ダイアログは呼び出し側で実装）
    clearAllMemos()

    let imported = 0
    const maxImport = Math.min(importData.memos.length, 3) // 最大3個まで

    for (let i = 0; i < maxImport; i++) {
      const memoData = importData.memos[i]
      if (memoData.title || memoData.content) {
        createMemo(memoData.title || '無題のメモ', memoData.content || '')
        imported++
      }
    }

    return {
      success: true,
      imported,
      error: importData.memos.length > 3 ? '3個を超えるメモは無視されました。' : undefined,
    }
  } catch (error) {
    return {
      success: false,
      imported: 0,
      error: 'データの読み込みに失敗しました。',
    }
  }
}

/**
 * メモの並び順を取得（作成日時の新しい順）
 */
export const getSortedMemos = (): Memo[] => {
  const { memos } = useMemoStore.getState()
  return [...memos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * メモの検索
 */
export const searchMemos = (query: string): Memo[] => {
  if (!query.trim()) {
    return getSortedMemos()
  }

  const { memos } = useMemoStore.getState()
  const lowerQuery = query.toLowerCase()

  return memos
    .filter(
      (memo) =>
        memo.title.toLowerCase().includes(lowerQuery) ||
        memo.content.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}
