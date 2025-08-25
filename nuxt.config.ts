export default defineNuxtConfig({
  compatibilityDate: '2025-08-24',
  devtools: { enabled: true },
  devServer: {
    port: 3011
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint', 'nuxt-vuefire'],
  css: ['~/assets/css/main.css'],
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
  }
})
