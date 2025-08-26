export const DEFAULT_SITE_NAME = 'FIREWOLF'
export const DEFAULT_SITE_DESCRIPTION =
  'FIREWOLFはオンラインで長期人狼が無料で遊べるWebサービスです。誰でも自分で好きな設定の村を作成することができます。'
export const DEFAULT_SITE_URL = 'https://firewolf.netlify.app'
export const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`

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

  const fullTitle = title
    ? `${title} | ${DEFAULT_SITE_NAME}`
    : DEFAULT_SITE_NAME

  const meta: Record<string, string> = {
    title: fullTitle,
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
