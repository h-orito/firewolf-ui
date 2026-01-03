import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VillageHeader from '../VillageHeader.vue'

// useVillage のモック
const mockToPrevDay = vi.fn()
const mockToNextDay = vi.fn()
const mockExistPrevDay = ref(true)
const mockExistNextDay = ref(true)
const mockNextDayId = ref(2)
const mockLatestDay = ref({ id: 3 })

vi.mock('~/composables/village/useVillage', () => ({
  useVillage: () => ({
    existPrevDay: mockExistPrevDay,
    existNextDay: mockExistNextDay,
    toPrevDay: mockToPrevDay,
    toNextDay: mockToNextDay,
    nextDayId: mockNextDayId,
    latestDay: mockLatestDay
  })
}))

// useMessage のモック
const mockResetPaging = vi.fn()

vi.mock('~/composables/village/useMessage', () => ({
  useMessage: () => ({
    resetPaging: mockResetPaging
  })
}))

// useVillageNavigation のモック
const mockScrollToTop = vi.fn()

vi.mock('~/composables/village/useVillageNavigation', () => ({
  useVillageNavigation: () => ({
    scrollToTop: mockScrollToTop
  })
}))

// UiButton コンポーネントをスタブ化
const UiButtonStub = {
  name: 'UiButton',
  template:
    '<button :disabled="disabled" :aria-label="ariaLabel" @click="$emit(\'click\')"><slot /></button>',
  props: ['disabled', 'ariaLabel', 'color', 'variant', 'icon', 'trailing']
}

describe('VillageHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExistPrevDay.value = true
    mockExistNextDay.value = true
    mockNextDayId.value = 2
    mockLatestDay.value = { id: 3 }
  })

  const mountComponent = () => {
    return mount(VillageHeader, {
      global: {
        stubs: {
          UiButton: UiButtonStub
        }
      }
    })
  }

  describe('レンダリング', () => {
    it('コンポーネントが正しくマウントされる', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('3つのボタンが表示される', () => {
      const wrapper = mountComponent()
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(3)
    })

    it('前日ボタンに正しいテキストが表示される', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('前日')
    })

    it('翌日ボタンに正しいテキストが表示される', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('翌日')
    })
  })

  describe('前日ボタン', () => {
    it('existPrevDay が false の場合、前日ボタンが無効になる', () => {
      mockExistPrevDay.value = false
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const prevButton = buttons.at(0)!
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('existPrevDay が true の場合、前日ボタンが有効になる', () => {
      mockExistPrevDay.value = true
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const prevButton = buttons.at(0)!
      expect(prevButton.attributes('disabled')).toBeUndefined()
    })

    it('前日ボタンをクリックすると toPrevDay と resetPaging が呼ばれる', async () => {
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const prevButton = buttons.at(0)!
      await prevButton.trigger('click')

      expect(mockToPrevDay).toHaveBeenCalled()
      expect(mockResetPaging).toHaveBeenCalledWith(false)
    })
  })

  describe('翌日ボタン', () => {
    it('existNextDay が false の場合、翌日ボタンが無効になる', () => {
      mockExistNextDay.value = false
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(2)!
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('existNextDay が true の場合、翌日ボタンが有効になる', () => {
      mockExistNextDay.value = true
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(2)!
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('翌日ボタンをクリックすると toNextDay と resetPaging が呼ばれる', async () => {
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(2)!
      await nextButton.trigger('click')

      expect(mockToNextDay).toHaveBeenCalled()
      expect(mockResetPaging).toHaveBeenCalled()
    })

    it('遷移先が最新日の場合、resetPaging に true が渡される', async () => {
      mockNextDayId.value = 3
      mockLatestDay.value = { id: 3 }
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(2)!
      await nextButton.trigger('click')

      expect(mockResetPaging).toHaveBeenCalledWith(true)
    })

    it('遷移先が最新日でない場合、resetPaging に false が渡される', async () => {
      mockNextDayId.value = 2
      mockLatestDay.value = { id: 3 }
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(2)!
      await nextButton.trigger('click')

      expect(mockResetPaging).toHaveBeenCalledWith(false)
    })
  })

  describe('最上部スクロールボタン', () => {
    it('最上部スクロールボタンをクリックすると scrollToTop が呼ばれる', async () => {
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const topButton = buttons.at(1)!
      await topButton.trigger('click')

      expect(mockScrollToTop).toHaveBeenCalled()
    })
  })
})
