/**
 * APIから返ってくる日時文字列をDateオブジェクトに変換
 * @param dateTimeStr "yyyy/MM/dd HH:mm:ss" 形式の日時文字列
 * @returns Dateオブジェクト
 */
export function parseApiDateTime(dateTimeStr: string | undefined): Date {
  if (!dateTimeStr) {
    return new Date('invalid')
  }
  // "yyyy/MM/dd HH:mm:ss" 形式を "yyyy-MM-dd HH:mm:ss" に変換してパース
  return new Date(dateTimeStr.replace(/\//g, '-'))
}

/**
 * 日時を日本語形式でフォーマット
 * @param dateTimeStr APIから返ってくる日時文字列
 * @returns フォーマットされた日時文字列（例: "12月25日 19:00"）
 */
export function formatDateTime(dateTimeStr: string | undefined): string {
  const date = parseApiDateTime(dateTimeStr)
  if (isNaN(date.getTime())) {
    return '未定'
  }
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 日時を日本語形式（年付き）でフォーマット
 * @param dateTimeStr APIから返ってくる日時文字列
 * @returns フォーマットされた日時文字列（例: "2024年12月25日 19:00"）
 */
export function formatDateTimeWithYear(dateTimeStr: string | undefined): string {
  const date = parseApiDateTime(dateTimeStr)
  if (isNaN(date.getTime())) {
    return '未定'
  }
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 日付のみを日本語形式でフォーマット
 * @param dateTimeStr APIから返ってくる日時文字列
 * @returns フォーマットされた日付文字列（例: "12月25日"）
 */
export function formatDate(dateTimeStr: string | undefined): string {
  const date = parseApiDateTime(dateTimeStr)
  if (isNaN(date.getTime())) {
    return '未定'
  }
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  })
}

/**
 * 時刻のみを日本語形式でフォーマット
 * @param dateTimeStr APIから返ってくる日時文字列
 * @returns フォーマットされた時刻文字列（例: "19:00"）
 */
export function formatTime(dateTimeStr: string | undefined): string {
  const date = parseApiDateTime(dateTimeStr)
  if (isNaN(date.getTime())) {
    return '未定'
  }
  return date.toLocaleString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
