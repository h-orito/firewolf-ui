<template>
  <div class="container mx-auto max-w-4xl p-4">
    <h1 class="mb-6 text-2xl font-bold">MessageCard コンポーネントテスト</h1>

    <!-- ダークモード切り替え -->
    <div class="mb-6">
      <UiButton variant="outline" @click="toggleDarkMode">
        {{ isDark ? 'ライトモード' : 'ダークモード' }}に切り替え
      </UiButton>
    </div>

    <!-- FormRadioGroup テスト -->
    <div
      class="mb-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <h2 class="mb-4 text-xl font-bold">FormRadioGroup テスト</h2>

      <!-- 通常 -->
      <div class="mb-4">
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
          通常 - 選択値: {{ radioValue1 }}
        </p>
        <FormRadioGroup v-model="radioValue1" :options="radioOptions" />
      </div>

      <!-- 無効状態 -->
      <div class="mb-4">
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
          無効状態 - 選択値: {{ radioValue2 }}
        </p>
        <FormRadioGroup
          v-model="radioValue2"
          :options="radioOptions"
          disabled
        />
      </div>
    </div>

    <!-- メッセージカード表示 -->
    <div class="space-y-4">
      <div v-for="(message, index) in sampleMessages" :key="index">
        <h3 class="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          {{ message.content.type.name }}
        </h3>
        <MessageCard
          :message="message"
          :participants="sampleParticipants as any"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageCard from '~/components/pages/village/MessageCard.vue'
import UiButton from '~/components/ui/button/index.vue'
import FormRadioGroup from '~/components/ui/form/FormRadioGroup.vue'

const isDark = ref(true)

// FormRadioGroup テスト用データ
const radioValue1 = ref('NORMAL_SAY')
const radioValue2 = ref('NORMAL_SAY')
const radioOptions = [
  { value: 'NORMAL_SAY', label: '通常発言' },
  { value: 'WEREWOLF_SAY', label: '人狼の囁き' },
  { value: 'SPECTATE_SAY', label: '見学者発言' },
  { value: 'SECRET_SAY', label: '秘話' }
]

// サンプル参加者データ
const sampleParticipants = [
  {
    id: 1,
    name: 'アルフレッド',
    chara_name: {
      name: 'アルフレッド',
      short_name: 'ア',
      full_name: 'アルフレッド'
    },
    chara: {
      id: 1,
      chara_name: {
        name: 'アルフレッド',
        short_name: 'ア',
        full_name: 'アルフレッド'
      },
      charachip_id: 1,
      face_list: [
        {
          type: 'NORMAL',
          name: '通常',
          image_url: 'https://wolfort.net/wmansion/6/000_A.png'
        }
      ],
      display: { width: 50, height: 77 },
      default_message: {
        join_message: '参加しました',
        first_day_message: 'よろしくお願いします'
      }
    },
    player: { id: 1, nickname: 'プレイヤー1', twitter_user_name: 'player1' },
    spectator: false,
    status: { lover_id_list: [] },
    skill: { code: 'VILLAGER', name: '村人' },
    skill_request: {
      first: { code: 'SEER', name: '占い師' },
      second: { code: 'HUNTER', name: '狩人' }
    },
    win: true,
    comming_outs: { list: [] }
  },
  {
    id: 2,
    name: 'ベアトリス',
    chara_name: {
      name: 'ベアトリス',
      short_name: 'ベ',
      full_name: 'ベアトリス'
    },
    chara: {
      id: 2,
      chara_name: {
        name: 'ベアトリス',
        short_name: 'ベ',
        full_name: 'ベアトリス'
      },
      charachip_id: 1,
      face_list: [
        {
          type: 'NORMAL',
          name: '通常',
          image_url: 'https://wolfort.net/wmansion/6/001_A.png'
        }
      ],
      display: { width: 50, height: 77 },
      default_message: {
        join_message: '参加しました',
        first_day_message: 'よろしくお願いします'
      }
    },
    player: { id: 2, nickname: 'プレイヤー2', twitter_user_name: 'player2' },
    spectator: false,
    status: { lover_id_list: [3] },
    skill: { code: 'WEREWOLF', name: '人狼' },
    skill_request: {
      first: { code: 'WEREWOLF', name: '人狼' },
      second: { code: 'VILLAGER', name: '村人' }
    },
    win: false,
    dead: {
      village_day: { id: 3, day: 3, noonnight: 'NOON' },
      code: 'EXECUTE',
      reason: '処刑'
    },
    comming_outs: { list: [] }
  },
  {
    id: 3,
    name: 'カルロス',
    chara_name: { name: 'カルロス', short_name: 'カ', full_name: 'カルロス' },
    chara: {
      id: 3,
      chara_name: { name: 'カルロス', short_name: 'カ', full_name: 'カルロス' },
      charachip_id: 1,
      face_list: [
        {
          type: 'NORMAL',
          name: '通常',
          image_url: 'https://wolfort.net/wmansion/6/002_A.png'
        }
      ],
      display: { width: 50, height: 77 },
      default_message: {
        join_message: '参加しました',
        first_day_message: 'よろしくお願いします'
      }
    },
    player: { id: 3, nickname: 'プレイヤー3' },
    spectator: false,
    status: { lover_id_list: [2] },
    skill: { code: 'VILLAGER', name: '村人' },
    skill_request: {
      first: { code: 'SEER', name: '占い師' },
      second: { code: 'PSYCHIC', name: '霊能者' }
    },
    win: false,
    dead: {
      village_day: { id: 3, day: 3, noonnight: 'NIGHT' },
      code: 'SUICIDE',
      reason: '後追'
    },
    comming_outs: { list: [] }
  },
  {
    id: 4,
    name: 'ディアナ',
    chara_name: { name: 'ディアナ', short_name: 'デ', full_name: 'ディアナ' },
    chara: {
      id: 4,
      chara_name: { name: 'ディアナ', short_name: 'デ', full_name: 'ディアナ' },
      charachip_id: 1,
      face_list: [
        {
          type: 'NORMAL',
          name: '通常',
          image_url: 'https://wolfort.net/wmansion/6/003_A.png'
        }
      ],
      display: { width: 50, height: 77 },
      default_message: {
        join_message: '参加しました',
        first_day_message: 'よろしくお願いします'
      }
    },
    player: { id: 4, nickname: 'プレイヤー4', twitter_user_name: 'player4' },
    spectator: true,
    status: { lover_id_list: [] },
    comming_outs: { list: [] }
  }
]

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 簡略化されたサンプルメッセージデータ
const sampleMessages = [
  // 通常発言
  {
    from: {
      id: 1,
      name: 'アルフレッド',
      chara_name: {
        name: 'アルフレッド',
        short_name: 'ア',
        full_name: 'アルフレッド'
      },
      chara: {
        id: 1,
        chara_name: {
          name: 'アルフレッド',
          short_name: 'ア',
          full_name: 'アルフレッド'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/000_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 1,
        nickname: 'プレイヤー1',
        twitter_user_name: 'player1'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'アルフレッド',
      short_name: 'ア',
      full_name: 'アルフレッド'
    },
    time: {
      unix_time_milli: 1609459200000,
      datetime: '2025/08/25 09:00:00',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'NORMAL_SAY',
        name: '通常発言',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: 'おはようございます。\n今日はいい天気ですね。',
      num: 1,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 人狼の囁き
  {
    from: {
      id: 2,
      name: 'ベアトリス',
      chara_name: {
        name: 'ベアトリス',
        short_name: 'ベ',
        full_name: 'ベアトリス'
      },
      chara: {
        id: 2,
        chara_name: {
          name: 'ベアトリス',
          short_name: 'ベ',
          full_name: 'ベアトリス'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/001_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 2,
        nickname: 'プレイヤー2',
        twitter_user_name: 'player2'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'ベアトリス',
      short_name: 'ベ',
      full_name: 'ベアトリス'
    },
    time: {
      unix_time_milli: 1609459210000,
      datetime: '2025/08/25 09:00:10',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'WEREWOLF_SAY',
        name: '人狼の囁き',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: '今夜は誰を襲いましょうか？',
      num: 2,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 墓下発言
  {
    from: {
      id: 3,
      name: 'カルロス',
      chara_name: {
        name: 'カルロス',
        short_name: 'カ',
        full_name: 'カルロス'
      },
      chara: {
        id: 3,
        chara_name: {
          name: 'カルロス',
          short_name: 'カ',
          full_name: 'カルロス'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/002_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 3,
        nickname: 'プレイヤー3',
        twitter_user_name: 'player3'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] },
      dead: {
        village_day: {
          id: 2,
          day: 2,
          noonnight: 'NOON',
          start_datetime: '2021-01-02T00:00:00Z',
          day_change_datetime: '2021-01-02T12:00:00Z'
        },
        code: 'EXECUTE',
        reason: '処刑'
      }
    },
    from_character_name: {
      name: 'カルロス',
      short_name: 'カ',
      full_name: 'カルロス'
    },
    time: {
      unix_time_milli: 1609459220000,
      datetime: '2025/08/25 09:00:20',
      village_day_id: 2,
      day: 2
    },
    content: {
      type: {
        code: 'GRAVE_SAY',
        name: '死者の呻き',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: 'なぜ私が処刑されなければならなかったのか...',
      num: 3,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 見学者発言
  {
    from: {
      id: 4,
      name: 'ディアナ',
      chara_name: {
        name: 'ディアナ',
        short_name: 'デ',
        full_name: 'ディアナ'
      },
      chara: {
        id: 4,
        chara_name: {
          name: 'ディアナ',
          short_name: 'デ',
          full_name: 'ディアナ'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/003_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 4,
        nickname: 'プレイヤー4',
        twitter_user_name: 'player4'
      },
      spectator: true,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'ディアナ',
      short_name: 'デ',
      full_name: 'ディアナ'
    },
    time: {
      unix_time_milli: 1609459230000,
      datetime: '2025/08/25 09:00:30',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'SPECTATE_SAY',
        name: '見学者発言',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: '面白い展開になってきましたね！',
      num: 4,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 独り言
  {
    from: {
      id: 5,
      name: 'エマニュエル',
      chara_name: {
        name: 'エマニュエル',
        short_name: 'エ',
        full_name: 'エマニュエル'
      },
      chara: {
        id: 5,
        chara_name: {
          name: 'エマニュエル',
          short_name: 'エ',
          full_name: 'エマニュエル'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/004_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 5,
        nickname: 'プレイヤー5',
        twitter_user_name: 'player5'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'エマニュエル',
      short_name: 'エ',
      full_name: 'エマニュエル'
    },
    time: {
      unix_time_milli: 1609459240000,
      datetime: '2025/08/25 09:00:40',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'MONOLOGUE_SAY',
        name: '独り言',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: '本当は私が占い師なんだけど、COするタイミングが難しい...',
      num: 5,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 共鳴発言
  {
    from: {
      id: 6,
      name: 'フランシス',
      chara_name: {
        name: 'フランシス',
        short_name: 'フ',
        full_name: 'フランシス'
      },
      chara: {
        id: 6,
        chara_name: {
          name: 'フランシス',
          short_name: 'フ',
          full_name: 'フランシス'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/005_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 6,
        nickname: 'プレイヤー6',
        twitter_user_name: 'player6'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'フランシス',
      short_name: 'フ',
      full_name: 'フランシス'
    },
    time: {
      unix_time_milli: 1609459250000,
      datetime: '2025/08/25 09:00:50',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'SYMPATHIZE_SAY',
        name: '共鳴発言',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: '共有者同士で相談しましょう。',
      num: 6,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 恋人発言
  {
    from: {
      id: 7,
      name: 'ジゼル',
      chara_name: {
        name: 'ジゼル',
        short_name: 'ジ',
        full_name: 'ジゼル'
      },
      chara: {
        id: 7,
        chara_name: {
          name: 'ジゼル',
          short_name: 'ジ',
          full_name: 'ジゼル'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/006_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 7,
        nickname: 'プレイヤー7',
        twitter_user_name: 'player7'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'ジゼル',
      short_name: 'ジ',
      full_name: 'ジゼル'
    },
    time: {
      unix_time_milli: 1609459260000,
      datetime: '2025/08/25 09:01:00',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'LOVERS_SAY',
        name: '恋人の囁き',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: '二人で生き延びましょう❤',
      num: 7,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // 秘話
  {
    from: {
      id: 8,
      name: 'ヘンリー',
      chara_name: {
        name: 'ヘンリー',
        short_name: 'ヘ',
        full_name: 'ヘンリー'
      },
      chara: {
        id: 8,
        chara_name: {
          name: 'ヘンリー',
          short_name: 'ヘ',
          full_name: 'ヘンリー'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/007_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 8,
        nickname: 'プレイヤー8',
        twitter_user_name: 'player8'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'ヘンリー',
      short_name: 'ヘ',
      full_name: 'ヘンリー'
    },
    to_character_name: {
      name: 'アルフレッド',
      short_name: 'ア',
      full_name: 'アルフレッド'
    },
    time: {
      unix_time_milli: 1609459270000,
      datetime: '2025/08/25 09:01:10',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'SECRET_SAY',
        name: '秘話',
        is_say_type: true,
        is_owl_viewable_type: false
      },
      text: 'あなたを信じています。',
      num: 8,
      count: 1,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // アクション
  {
    from: {
      id: 9,
      name: 'イザベラ',
      chara_name: {
        name: 'イザベラ',
        short_name: 'イ',
        full_name: 'イザベラ'
      },
      chara: {
        id: 9,
        chara_name: {
          name: 'イザベラ',
          short_name: 'イ',
          full_name: 'イザベラ'
        },
        charachip_id: 1,
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://wolfort.net/wmansion/6/008_A.png'
          }
        ],
        display: {
          width: 50,
          height: 77
        },
        default_message: {
          join_message: '参加しました',
          first_day_message: 'よろしくお願いします'
        }
      },
      player: {
        id: 9,
        nickname: 'プレイヤー9',
        twitter_user_name: 'player9'
      },
      spectator: false,
      status: { lover_id_list: [] },
      comming_outs: { list: [] }
    },
    from_character_name: {
      name: 'イザベラ',
      short_name: 'イ',
      full_name: 'イザベラ'
    },
    time: {
      unix_time_milli: 1609459280000,
      datetime: '2025/08/25 09:01:20',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'ACTION',
        name: 'アクション',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'は考え込んでいる。',
      num: 9,
      face_code: 'NORMAL',
      is_convert_disable: false
    }
  },
  // システムメッセージ（公開）
  {
    time: {
      unix_time_milli: 1609459290000,
      datetime: '2025/08/25 09:01:30',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PUBLIC_SYSTEM',
        name: '公開システムメッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '1日目が開始しました。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（非公開）
  {
    time: {
      unix_time_milli: 1609459300000,
      datetime: '2025/08/25 09:01:40',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_SYSTEM',
        name: '非公開システムメッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'あなたは村人です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（能力系）
  {
    time: {
      unix_time_milli: 1609459310000,
      datetime: '2025/08/25 09:01:50',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_ABILITY',
        name: '能力行使メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'あなたは占いを行いました。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（占い師）
  {
    time: {
      unix_time_milli: 1609459320000,
      datetime: '2025/08/25 09:02:00',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_SEER',
        name: '占い師メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'アルフレッドは人間です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（賢者）
  {
    time: {
      unix_time_milli: 1609459330000,
      datetime: '2025/08/25 09:02:10',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_WISE',
        name: '賢者メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'ベアトリスは人狼です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（霊能者）
  {
    time: {
      unix_time_milli: 1609459340000,
      datetime: '2025/08/25 09:02:20',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_PSYCHIC',
        name: '霊能者メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'カタリナは人狼でした。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（導師）
  {
    time: {
      unix_time_milli: 1609459350000,
      datetime: '2025/08/25 09:02:30',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_GURU',
        name: '導師メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'ディーターは妖狐でした。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（検死官）
  {
    time: {
      unix_time_milli: 1609459360000,
      datetime: '2025/08/25 09:02:40',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_CORONER',
        name: '検死官メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'エルナは人狼に襲撃されました。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（人狼）
  {
    time: {
      unix_time_milli: 1609459370000,
      datetime: '2025/08/25 09:02:50',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_WEREWOLF',
        name: '人狼メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '今夜の襲撃対象を決めてください。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（狂信者）
  {
    time: {
      unix_time_milli: 1609459380000,
      datetime: '2025/08/25 09:03:00',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_FANATIC',
        name: '狂信者メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '人狼はフリーデルです。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（共鳴者）
  {
    time: {
      unix_time_milli: 1609459390000,
      datetime: '2025/08/25 09:03:10',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_MASON',
        name: '共鳴者メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'ゲルトも共鳴者です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（恋人）
  {
    time: {
      unix_time_milli: 1609459400000,
      datetime: '2025/08/25 09:03:20',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_LOVERS',
        name: '恋人メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'ハンナがあなたの恋人です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（妖狐）
  {
    time: {
      unix_time_milli: 1609459410000,
      datetime: '2025/08/25 09:03:30',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_FOX',
        name: '妖狐メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '人狼の襲撃を受けましたが無効化されました。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（共鳴者）
  {
    time: {
      unix_time_milli: 1609459420000,
      datetime: '2025/08/25 09:03:40',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PRIVATE_SYMPATHIZER',
        name: '共鳴者メッセージ',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: 'イルゼも共鳴者です。',
      is_convert_disable: false
    }
  },
  // システムメッセージ（村建て発言）
  {
    time: {
      unix_time_milli: 1609459430000,
      datetime: '2025/08/25 09:03:50',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'CREATOR_SAY',
        name: '村建て発言',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '皆さん、楽しいゲームにしましょう！',
      is_convert_disable: false
    }
  },
  // 参加者一覧
  {
    time: {
      unix_time_milli: 1609459340000,
      datetime: '2025/08/25 09:02:20',
      village_day_id: 1,
      day: 1
    },
    content: {
      type: {
        code: 'PARTICIPANTS',
        name: '参加者一覧',
        is_say_type: false,
        is_owl_viewable_type: false
      },
      text: '',
      is_convert_disable: false
    }
  }
]

onMounted(() => {
  // 初期状態でダークモードを有効化
  document.documentElement.classList.add('dark')
})
</script>
