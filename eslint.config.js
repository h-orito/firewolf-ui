import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '.old-nuxt2/**/*',
      'components/**/*',
      'pages/**/*',
      'layouts/**/*',
      'middleware/**/*',
      'plugins/**/*',
      'store/**/*',
      '.nuxt/**/*',
      'dist/**/*',
      'node_modules/**/*',
      'static/**/*'
    ]
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off'
    }
  }
]
