export default defineNuxtConfig({
  compatibilityDate: '2025-08-24',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  typescript: {
    typeCheck: true
  },
  pages: false
})
