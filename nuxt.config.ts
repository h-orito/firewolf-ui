import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const isAnalyze = process.env.ANALYZE === 'true'
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-24',
  devtools: { enabled: true },
  devServer: {
    port: 3011
  },

  // head設定（SEO、パフォーマンス最適化）
  app: {
    head: {
      titleTemplate: '%s | FIREWOLF',
      htmlAttrs: {
        lang: 'ja'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0a0a1a' }
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          href: '/image/icons/apple-touch-icon.png'
        },
        // Preconnect（外部リソースへの事前接続）
        { rel: 'preconnect', href: 'https://apis.google.com' },
        { rel: 'preconnect', href: 'https://www.googleapis.com' },
        { rel: 'preconnect', href: 'https://identitytoolkit.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://pagead2.googlesyndication.com',
          crossorigin: ''
        },
        // DNS Prefetch（追加の外部ドメイン）
        {
          rel: 'dns-prefetch',
          href: 'https://www.googletagmanager.com'
        },
        { rel: 'dns-prefetch', href: 'https://wolfort.net' }
      ]
    }
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint', 'nuxt-vuefire', '@vite-pwa/nuxt'],

  // PWA設定
  pwa: {
    registerType: 'autoUpdate',
    // 開発環境ではService Workerを無効にする（オプション）
    disable: isDev,
    manifest: {
      name: 'FIREWOLF - 人狼ゲーム',
      short_name: 'FIREWOLF',
      description:
        'FIREWOLFは人狼ゲームが無料で遊べるWebサービスです。カスタマイズ性の高い村建てが可能で、豊富な役職や演出を楽しめます。',
      theme_color: '#0a0a1a',
      background_color: '#0a0a1a',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      lang: 'ja',
      categories: ['games', 'entertainment'],
      icons: [
        {
          src: '/image/icons/icon.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/image/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/image/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/image/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'apple touch icon'
        }
      ]
    },
    workbox: {
      // オフラインフォールバック
      navigateFallback: '/',
      // キャッシュするファイルパターン
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2}'],
      // globPatternsでマッチしないファイルを除外
      globIgnores: ['**/node_modules/**'],
      // ランタイムキャッシュ設定
      runtimeCaching: [
        // 静的アセット（CacheFirst）
        {
          urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30日
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // フォント（CacheFirst）
        {
          urlPattern: /^https:\/\/.*\.(woff|woff2|ttf|eot)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // Google Fonts（StaleWhileRevalidate）
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // API呼び出し（NetworkFirst）
        {
          urlPattern: /^https:\/\/.*\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5 // 5分
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // wolfort.net の画像（CacheFirst）
        {
          urlPattern: /^https:\/\/wolfort\.net\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'external-images-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7日
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ],
      // クリーンアップ設定
      cleanupOutdatedCaches: true,
      // Service Workerの即時アクティベーション
      skipWaiting: true,
      clientsClaim: true
    },
    // PWA開発オプション
    devOptions: {
      enabled: false, // 開発環境でもテストしたい場合はtrueに
      type: 'module'
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'stats.html',
              open: false,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap'
            })
          ]
        : [])
    ],
    build: {
      // minify設定（本番環境用）
      minify: 'esbuild',
      // ターゲットブラウザ設定
      target: 'esnext',
      // チャンク分割の最適化
      rollupOptions: {
        output: {
          // 手動チャンク分割（関数ベースで安全に実装）
          manualChunks(id: string) {
            // Firebase関連を分離（大きいため）
            if (id.includes('node_modules/firebase')) {
              return 'firebase'
            }
            // VeeValidate関連
            if (
              id.includes('node_modules/vee-validate') ||
              id.includes('node_modules/yup') ||
              id.includes('node_modules/@vee-validate')
            ) {
              return 'validation'
            }
            // VueUse
            if (id.includes('node_modules/@vueuse')) {
              return 'vueuse'
            }
            // heroicons
            if (id.includes('node_modules/@heroicons')) {
              return 'icons'
            }
          }
        }
      },
      // チャンクサイズ警告の閾値（500KB）
      chunkSizeWarningLimit: 500
    }
  },
  typescript: {
    typeCheck: true
  },
  pages: true,
  ssr: false,
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false
    },
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      databaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL || ''
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    }
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    // 静的アセットのキャッシュヘッダー設定
    routeRules: {
      // ハッシュ付きアセット（JS、CSS）は長期キャッシュ（1年）
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      // 画像は中期キャッシュ（1週間）
      '/img/**': {
        headers: {
          'cache-control':
            'public, max-age=604800, stale-while-revalidate=86400'
        }
      },
      // フォントは長期キャッシュ（1年）
      '/fonts/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      // HTMLページはキャッシュなし（常に最新を取得）
      '/**': {
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate'
        }
      }
    }
  }
})
