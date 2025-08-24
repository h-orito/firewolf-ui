/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#3991f4',
          dark: 'rgb(20, 180, 255)'
        },

        // Message background colors (人狼ゲーム固有の発言色)
        say: {
          normal: '#ffffff',
          werewolf: '#f2cece',
          'werewolf-dark': '#f2aeae',
          sympathize: '#cef2ce',
          'sympathize-dark': '#aef2ae',
          monologue: '#ddd',
          'monologue-dark': '#aaa',
          grave: '#ceedf2',
          'grave-dark': '#a9edf7',
          spectate: '#f2f2ce',
          'spectate-dark': '#f2f2ae',
          action: '#dfdfc9',
          'action-dark': '#232355',
          secret: '#cecef2',
          'secret-dark': '#a9a'
        },

        // Lovers say colors
        lovers: {
          text: '#cc2222',
          bg: '#f2dede',
          'bg-dark': '#edcece'
        },

        // System message colors (役職専用システムメッセージ)
        system: {
          private: {
            border: '#ccc',
            bg: '#eee',
            'bg-dark': '#404040'
          },
          seer: {
            border: '#0f0',
            bg: '#efe',
            'bg-dark': '#334033'
          },
          psychic: {
            border: '#00f',
            bg: '#eef',
            'bg-dark': '#333340'
          },
          werewolf: {
            border: '#f00',
            bg: '#fee',
            'bg-dark': '#403333'
          },
          mason: {
            border: '#fa0',
            bg: '#fec',
            'bg-dark': '#404033'
          },
          lovers: {
            border: '#f0a',
            bg: '#fef',
            'bg-dark': '#404033'
          },
          fox: {
            border: '#fa0',
            'border-dark': '#ff0',
            bg: '#ffc',
            'bg-dark': '#404033'
          },
          creator: {
            border: '#c0f',
            bg: '#fef',
            'bg-dark': '#403340'
          }
        }
      },

      // Village layout specific heights
      spacing: {
        'village-header': '2rem',
        'village-footer': '2rem'
      }
    }
  },
  plugins: []
}
