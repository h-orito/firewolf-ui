import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageCard from '../MessageCard.vue'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'
import type { MessageView } from '~/lib/api/types'

// 子コンポーネントをスタブ化
vi.mock('../SayMessage.vue', () => ({
  default: {
    name: 'SayMessage',
    template: '<div class="say-message-stub"></div>',
    props: [
      'message',
      'isImgLarge',
      'isDispDate',
      'isLargeText',
      'isAnchorMessage',
      'isProgress',
      'canReply',
      'canSecret'
    ]
  }
}))

vi.mock('../SystemMessage.vue', () => ({
  default: {
    name: 'SystemMessage',
    template: '<div class="system-message-stub"></div>',
    props: ['message', 'isLargeText']
  }
}))

vi.mock('../ActionMessage.vue', () => ({
  default: {
    name: 'ActionMessage',
    template: '<div class="action-message-stub"></div>',
    props: [
      'message',
      'isDispDate',
      'isLargeText',
      'isAnchorMessage',
      'isProgress'
    ]
  }
}))

vi.mock('../ParticipantsMessage.vue', () => ({
  default: {
    name: 'ParticipantsMessage',
    template: '<div class="participants-message-stub"></div>',
    props: ['message', 'isLargeText']
  }
}))

// テスト用のメッセージデータを生成するヘルパー
const createMockMessage = (
  typeCode: string,
  overrides: Partial<MessageView> = {}
): MessageView => {
  return {
    from: {
      chara: {
        id: 1,
        name: 'テストキャラ',
        short_name: 'テスト',
        chara_group: { id: 1, name: 'テストグループ' },
        default_message: { join_message: '', first_day_message: '' },
        display: { width: 60, height: 60 },
        face_list: [
          {
            type: 'NORMAL',
            name: '通常',
            image_url: 'https://example.com/face.png'
          }
        ]
      },
      participant_id: 1,
      comming_outs: { list: [] },
      skill: null,
      dead: null
    },
    to: null,
    time: {
      village_day_id: 1,
      day: 1,
      datetime: '2024-01-01 12:00:00',
      unix_time_milli: 1704088800000
    },
    content: {
      type: { code: typeCode, name: 'テスト' },
      num: 1,
      count: null,
      text: 'テストメッセージ',
      face_code: 'NORMAL'
    },
    ...overrides
  } as MessageView
}

describe('MessageCard', () => {
  describe('メッセージタイプによるコンポーネント切り替え', () => {
    it('NORMAL_SAY タイプで SayMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.NORMAL_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.say-message-stub').exists()).toBe(true)
      expect(wrapper.find('.system-message-stub').exists()).toBe(false)
      expect(wrapper.find('.action-message-stub').exists()).toBe(false)
      expect(wrapper.find('.participants-message-stub').exists()).toBe(false)
    })

    it('WEREWOLF_SAY タイプで SayMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.WEREWOLF_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.say-message-stub').exists()).toBe(true)
    })

    it('GRAVE_SAY タイプで SayMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.GRAVE_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.say-message-stub').exists()).toBe(true)
    })

    it('MONOLOGUE_SAY タイプで SayMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.MONOLOGUE_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.say-message-stub').exists()).toBe(true)
    })

    it('PUBLIC_SYSTEM タイプで SystemMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.PUBLIC_SYSTEM, {
        from: undefined
      })
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.system-message-stub').exists()).toBe(true)
      expect(wrapper.find('.say-message-stub').exists()).toBe(false)
    })

    it('ACTION タイプで ActionMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.ACTION)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.action-message-stub').exists()).toBe(true)
      expect(wrapper.find('.say-message-stub').exists()).toBe(false)
    })

    it('PARTICIPANTS タイプで ParticipantsMessage が表示される', () => {
      const message = createMockMessage(MESSAGE_TYPE.PARTICIPANTS, {
        from: undefined
      })
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.find('.participants-message-stub').exists()).toBe(true)
      expect(wrapper.find('.say-message-stub').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('デフォルトの props が正しく設定される', () => {
      const message = createMockMessage(MESSAGE_TYPE.NORMAL_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('要素の属性', () => {
    it('正しい id 属性が設定される', () => {
      const message = createMockMessage(MESSAGE_TYPE.NORMAL_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      const expectedId = `mc-${message.time.unix_time_milli}`
      expect(wrapper.attributes('id')).toBe(expectedId)
    })

    it('font-normal クラスが適用される', () => {
      const message = createMockMessage(MESSAGE_TYPE.NORMAL_SAY)
      const wrapper = mount(MessageCard, { props: { message } })

      expect(wrapper.classes()).toContain('font-normal')
    })
  })
})
