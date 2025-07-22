/**
 * APIエラーハンドリングユーティリティ
 */

export interface ApiError {
  status?: number
  message: string
  code?: string
}

/**
 * APIエラーを解析して、ユーザーフレンドリーなエラーメッセージに変換する
 */
export function parseApiError(error: any): ApiError {
  // openapi-fetchのエラー形式を想定
  if (error?.response) {
    const status = error.response.status
    const data = error.response.data

    // サーバーからのエラーメッセージがある場合
    if (data?.message) {
      return {
        status,
        message: data.message,
        code: data.code,
      }
    }

    // HTTPステータスコードに基づいたメッセージ
    return {
      status,
      message: getStatusMessage(status),
    }
  }

  // ネットワークエラーなどの場合
  if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
    return {
      message: 'ネットワークエラーが発生しました。接続を確認してください。',
    }
  }

  // その他のエラー
  return {
    message: error?.message || '予期しないエラーが発生しました',
  }
}

/**
 * HTTPステータスコードに基づいたエラーメッセージを取得
 */
function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'リクエストが正しくありません'
    case 401:
      return 'ログインが必要です'
    case 403:
      return 'この操作を行う権限がありません'
    case 404:
      return 'リソースが見つかりません'
    case 409:
      return '既に処理されているか、競合する操作があります'
    case 422:
      return '入力データに問題があります'
    case 429:
      return 'リクエストが多すぎます。しばらく待ってから再試行してください'
    case 500:
      return 'サーバーエラーが発生しました'
    case 502:
    case 503:
    case 504:
      return 'サーバーが一時的に利用できません'
    default:
      return `エラーが発生しました（ステータス: ${status}）`
  }
}

/**
 * 投票関連のエラーメッセージをカスタマイズ
 */
export function parseVoteError(error: any): string {
  const apiError = parseApiError(error)

  // 投票固有のエラーハンドリング
  if (apiError.code === 'VOTE_ALREADY_SET') {
    return '投票は既に設定されています'
  }

  if (apiError.code === 'VOTE_NOT_AVAILABLE') {
    return '現在投票することはできません'
  }

  if (apiError.code === 'INVALID_VOTE_TARGET') {
    return '投票対象が無効です'
  }

  return apiError.message
}

/**
 * 能力実行関連のエラーメッセージをカスタマイズ
 */
export function parseAbilityError(error: any): string {
  const apiError = parseApiError(error)

  // 能力実行固有のエラーハンドリング
  if (apiError.code === 'ABILITY_ALREADY_SET') {
    return '能力は既に設定されています'
  }

  if (apiError.code === 'ABILITY_NOT_AVAILABLE') {
    return '現在この能力を使用することはできません'
  }

  if (apiError.code === 'INVALID_ABILITY_TARGET') {
    return '能力対象が無効です'
  }

  if (apiError.code === 'ABILITY_NOT_USABLE') {
    return 'この能力は使用できません'
  }

  return apiError.message
}

/**
 * コミット関連のエラーメッセージをカスタマイズ
 */
export function parseCommitError(error: any): string {
  const apiError = parseApiError(error)

  // コミット固有のエラーハンドリング
  if (apiError.code === 'COMMIT_NOT_AVAILABLE') {
    return '現在コミット操作はできません'
  }

  return apiError.message
}

/**
 * 参加関連のエラーメッセージをカスタマイズ
 */
export function parseParticipateError(error: any): string {
  const apiError = parseApiError(error)

  // 参加固有のエラーハンドリング
  if (apiError.code === 'PARTICIPATE_NOT_AVAILABLE') {
    return '現在参加することはできません'
  }

  if (apiError.code === 'CHARA_ALREADY_SELECTED') {
    return '選択されたキャラクターは既に使用されています'
  }

  if (apiError.code === 'INVALID_JOIN_PASSWORD') {
    return '入村パスワードが正しくありません'
  }

  if (apiError.code === 'VILLAGE_FULL') {
    return '村の定員に達しています'
  }

  if (apiError.code === 'INVALID_CHARA_NAME') {
    return 'キャラクター名が不適切です'
  }

  return apiError.message
}

/**
 * APIエラーを処理する汎用ハンドラー
 */
export function handleApiError(error: any): void {
  const apiError = parseApiError(error)
  console.error('API Error:', apiError)

  // ここでトースト通知やアラートを表示することも可能
  // 今回は基本的なエラーログのみ
  alert(apiError.message)
}
