export const DEFAULT_SITE_NAME = 'FIREWOLF'
export const DEFAULT_SITE_DESCRIPTION =
  'FIREWOLFはオンラインで長期人狼が無料で遊べるWebサービスです。誰でも自分で好きな設定の村を作成することができます。'
export const DEFAULT_SITE_URL = 'https://firewolf.netlify.app'
export const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/image/ogp/top.jpg`

export interface SeoConfig {
  title?: string
  description?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  keywords?: string
  noIndex?: boolean
}

export function createSeoMeta(config: SeoConfig = {}) {
  const {
    title = '',
    description = DEFAULT_SITE_DESCRIPTION,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    twitterCard = 'summary_large_image',
    keywords = '',
    noIndex = false
  } = config

  // OGメタ用のフルタイトル（OGメタにはtitleTemplateが適用されないため）
  const fullTitle = title
    ? `${title} | ${DEFAULT_SITE_NAME}`
    : DEFAULT_SITE_NAME

  const meta: Record<string, string> = {
    // titleはnuxt.config.tsのtitleTemplateで自動的に「| FIREWOLF」が付与される
    // titleが空の場合はuseHeadで別途設定する（titleTemplateの上書きが必要なため）
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType,
    ogImage,
    ogSiteName: DEFAULT_SITE_NAME,
    twitterCard,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage
  }

  // titleが指定されている場合のみtitleを設定（titleTemplateが適用される）
  if (title) {
    meta.title = title
  }

  if (keywords) {
    meta.keywords = keywords
  }

  if (noIndex) {
    meta.robots = 'noindex,nofollow'
  }

  return meta
}

export function createStructuredData(
  type: string,
  data: Record<string, unknown>
) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    })
  }
}

/**
 * canonical URLを生成するヘルパー関数
 * @param path - URLのパス部分（例: '/about', '/village-list'）
 * @returns 完全なcanonical URL
 */
export function createCanonicalUrl(path: string): string {
  // パスが '/' で始まっていない場合は追加
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  // 末尾のスラッシュを削除（ルート以外）
  const cleanPath =
    normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/$/, '')
  return `${DEFAULT_SITE_URL}${cleanPath}`
}

/**
 * canonical linkタグを作成するヘルパー関数
 * useHead()で使用する形式で返す
 * @param path - URLのパス部分
 */
export function createCanonicalLink(path: string) {
  return {
    link: [
      {
        rel: 'canonical',
        href: createCanonicalUrl(path)
      }
    ]
  }
}
