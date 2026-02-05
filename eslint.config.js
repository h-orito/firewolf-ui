import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // First config: ignore patterns (must be separate)
  {
    ignores: ['.old-nuxt2/**/*']
  },
  // Second config: rules
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/html-self-closing': 'off'
    }
  }
)
