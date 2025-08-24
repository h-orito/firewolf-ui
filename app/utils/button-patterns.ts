/**
 * Button共通パターンユーティリティ
 *
 * 旧Buefyボタンから@nuxt/ui Buttonへの移行パターンを定義
 */

// 旧Buefyボタンの一般的なパターンを@nuxt/ui用に変換
export const buttonPatterns = {
  // プライマリアクション（保存、送信、確認）
  primary: {
    color: 'primary' as const,
    variant: 'solid' as const,
    size: 'sm' as const
  },

  // セカンダリアクション（戻る、キャンセル）
  secondary: {
    color: 'neutral' as const,
    variant: 'outline' as const,
    size: 'sm' as const
  },

  // 危険なアクション（削除、離脱）
  danger: {
    color: 'error' as const,
    variant: 'solid' as const,
    size: 'sm' as const
  },

  // 情報・リンクボタン
  info: {
    color: 'primary' as const,
    variant: 'subtle' as const,
    size: 'sm' as const
  },

  // 成功アクション
  success: {
    color: 'success' as const,
    variant: 'solid' as const,
    size: 'sm' as const
  }
} as const

// 共通のボタンセット（モーダル等で使用）
export const commonButtonSets = {
  // モーダルフッター: キャンセル + 確認
  modalFooter: (
    onCancel: () => void,
    onConfirm: () => void,
    confirmLabel: string = '確認'
  ) => ({
    cancel: {
      ...buttonPatterns.secondary,
      label: 'キャンセル',
      onClick: onCancel
    },
    confirm: {
      ...buttonPatterns.primary,
      label: confirmLabel,
      onClick: onConfirm
    }
  }),

  // 保存フォーム: キャンセル + 保存
  saveForm: (onCancel: () => void, onSave: () => void) => ({
    cancel: {
      ...buttonPatterns.secondary,
      label: 'キャンセル',
      onClick: onCancel
    },
    save: {
      ...buttonPatterns.primary,
      label: '保存',
      onClick: onSave
    }
  }),

  // 削除確認: キャンセル + 削除
  deleteConfirm: (onCancel: () => void, onDelete: () => void) => ({
    cancel: {
      ...buttonPatterns.secondary,
      label: 'キャンセル',
      onClick: onCancel
    },
    delete: {
      ...buttonPatterns.danger,
      label: '削除',
      onClick: onDelete
    }
  })
}

// アイコン付きボタンのパターン
export const iconButtonPatterns = {
  copy: {
    ...buttonPatterns.info,
    icon: 'i-lucide-copy',
    label: 'コピー'
  },

  edit: {
    ...buttonPatterns.secondary,
    icon: 'i-lucide-edit',
    label: '編集'
  },

  delete: {
    ...buttonPatterns.danger,
    icon: 'i-lucide-trash-2',
    label: '削除'
  },

  save: {
    ...buttonPatterns.primary,
    icon: 'i-lucide-save',
    label: '保存'
  },

  settings: {
    ...buttonPatterns.secondary,
    icon: 'i-lucide-settings',
    label: '設定'
  },

  close: {
    ...buttonPatterns.secondary,
    icon: 'i-lucide-x',
    label: '閉じる'
  }
}

// サイズパターン
export const sizePatterns = {
  xs: { size: 'xs' as const },
  sm: { size: 'sm' as const }, // Buefy is-small相当
  md: { size: 'md' as const }, // デフォルト
  lg: { size: 'lg' as const },
  xl: { size: 'xl' as const }
}
