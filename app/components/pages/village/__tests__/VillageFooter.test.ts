import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VillageFooter from '../VillageFooter.vue'

// useVillageNavigation のモック
const mockScrollToBottom = vi.fn()

vi.mock('~/composables/village/useVillageNavigation', () => ({
  useVillageNavigation: () => ({
    scrollToBottom: mockScrollToBottom
  })
}))

// useVillageMessageFilter のモック
const mockIsFiltering = ref(false)
const mockResetFilter = vi.fn()

vi.mock('~/composables/village/useVillageMessageFilter', () => ({
  useVillageMessageFilter: () => ({
    isFiltering: mockIsFiltering,
    resetFilter: mockResetFilter
  })
}))

// useVillagePolling のモック
const mockExistsNewMessages = ref(false)

vi.mock('~/composables/village/useVillagePolling', () => ({
  useVillagePolling: () => ({
    existsNewMessages: mockExistsNewMessages
  })
}))

// useVillageSlider のモック
const mockToggle = vi.fn()

vi.mock('~/composables/village/useVillageSlider', () => ({
  useVillageSlider: () => ({
    toggle: mockToggle
  })
}))

// useVillageRefresh のモック
const mockRefresh = vi.fn()

vi.mock('~/composables/village/useVillageRefresh', () => ({
  useVillageRefresh: () => ({
    refresh: mockRefresh
  })
}))

// useVillageTimer のモック
const mockTimerText = ref('残01:30:00')
const mockStartTimer = vi.fn()

vi.mock('~/composables/village/useVillageTimer', () => ({
  useVillageTimer: () => ({
    timerText: mockTimerText,
    startTimer: mockStartTimer
  })
}))

// useWindowResize のモック
const mockIsMobile = ref(false)

vi.mock('~/composables/useWindowResize', () => ({
  useWindowResize: () => ({
    isMobile: mockIsMobile
  })
}))

// useMessage のモック
const mockLoadMessages = vi.fn()

vi.mock('~/composables/village/useMessage', () => ({
  useMessage: () => ({
    loadMessages: mockLoadMessages
  })
}))

// スタブコンポーネント
const UiButtonStub = {
  name: 'UiButton',
  template:
    '<button :aria-label="ariaLabel" @click="$emit(\'click\')"><slot /></button>',
  props: ['color', 'variant', 'icon', 'class', 'ariaLabel']
}

const IconStub = {
  name: 'Icon',
  template: '<span :class="$attrs.class"></span>',
  props: ['name']
}

const ModalFilterStub = {
  name: 'ModalFilter',
  template: '<div v-if="isOpen" class="modal-filter-stub"></div>',
  props: ['isOpen']
}

describe('VillageFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsFiltering.value = false
    mockExistsNewMessages.value = false
    mockTimerText.value = '残01:30:00'
    mockIsMobile.value = false
  })

  const mountComponent = () => {
    return mount(VillageFooter, {
      global: {
        stubs: {
          UiButton: UiButtonStub,
          Icon: IconStub,
          ModalFilter: ModalFilterStub
        }
      }
    })
  }

  describe('レンダリング', () => {
    it('コンポーネントが正しくマウントされる', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('残り時間が表示される', () => {
      mockTimerText.value = '残01:30:00'
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('残01:30:00')
    })

    it('マウント時に startTimer が呼ばれる', () => {
      mountComponent()
      expect(mockStartTimer).toHaveBeenCalledTimes(1)
    })
  })

  describe('モバイル表示', () => {
    it('モバイルでない場合、メニューボタンが表示されない', () => {
      mockIsMobile.value = false
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const hasMenuButton = buttons.some(
        (b) => b.attributes('aria-label') === 'サイドバーを開く'
      )
      expect(hasMenuButton).toBe(false)
    })

    it('モバイルの場合、メニューボタンが表示される', () => {
      mockIsMobile.value = true
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const hasMenuButton = buttons.some(
        (b) => b.attributes('aria-label') === 'サイドバーを開く'
      )
      expect(hasMenuButton).toBe(true)
    })

    it('メニューボタンをクリックすると toggleSlider が呼ばれる', async () => {
      mockIsMobile.value = true
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const menuButton = buttons.find(
        (b) => b.attributes('aria-label') === 'サイドバーを開く'
      )
      await menuButton?.trigger('click')

      expect(mockToggle).toHaveBeenCalled()
    })
  })

  describe('更新ボタン', () => {
    it('更新ボタンをクリックすると refresh が呼ばれる', async () => {
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const refreshButton = buttons.find(
        (b) => b.attributes('aria-label') === '発言を更新'
      )
      await refreshButton?.trigger('click')

      expect(mockRefresh).toHaveBeenCalled()
    })

    it('新しいメッセージがある場合、アイコンがアニメーションする', () => {
      mockExistsNewMessages.value = true
      const wrapper = mountComponent()

      // animate-spin クラスが存在することを確認
      expect(wrapper.html()).toContain('animate-spin')
    })
  })

  describe('最下部スクロールボタン', () => {
    it('最下部スクロールボタンをクリックすると scrollToBottom が呼ばれる', async () => {
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const bottomButton = buttons.find(
        (b) => b.attributes('aria-label') === '最下部にスクロール'
      )
      await bottomButton?.trigger('click')

      expect(mockScrollToBottom).toHaveBeenCalled()
    })
  })

  describe('抽出ボタン', () => {
    it('フィルタリング中でない場合、抽出ボタンをクリックするとモーダルが開く', async () => {
      mockIsFiltering.value = false
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const filterButton = buttons.find(
        (b) => b.attributes('aria-label') === '発言を抽出'
      )
      await filterButton?.trigger('click')

      // モーダルが開いていることを確認
      expect(wrapper.find('.modal-filter-stub').exists()).toBe(true)
    })

    it('フィルタリング中の場合、抽出ボタンをクリックするとフィルタがリセットされる', async () => {
      mockIsFiltering.value = true
      const wrapper = mountComponent()

      const buttons = wrapper.findAll('button')
      const filterButton = buttons.find(
        (b) => b.attributes('aria-label') === '発言を抽出'
      )
      await filterButton?.trigger('click')

      expect(mockResetFilter).toHaveBeenCalled()
      expect(mockLoadMessages).toHaveBeenCalled()
    })

    it('フィルタリング中の場合、解除テキストが表示される', () => {
      mockIsFiltering.value = true
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('解除')
    })

    it('フィルタリング中でない場合、解除テキストが表示されない', () => {
      mockIsFiltering.value = false
      const wrapper = mountComponent()

      expect(wrapper.text()).not.toContain('解除')
    })
  })
})
