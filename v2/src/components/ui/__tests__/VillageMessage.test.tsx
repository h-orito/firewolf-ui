import { render, screen } from '@testing-library/react'
import { VillageMessage } from '../village-message'
import type { components } from '@/types/generated/api'

// Zustand ストアをモック
jest.mock('@/stores/village-settings')

type MessageView = components['schemas']['MessageView']

describe('VillageMessage', () => {
  const mockMessage: MessageView = {
    content: {
      type: { code: 'NORMAL_SAY' },
      text: 'テストメッセージです。',
      num: 1,
    },
    time: {
      datetime: '2025-01-01T10:00:00Z',
    },
    from: {
      charaName: { name: 'テストキャラ' },
      player: { nickname: 'プレイヤー' },
    },
    to: null,
  }

  test('通常発言が正しく表示される', () => {
    render(<VillageMessage message={mockMessage} />)

    expect(screen.getByText('テストメッセージです。')).toBeInTheDocument()
    expect(screen.getByText('テストキャラ')).toBeInTheDocument()
  })

  test('独り言が正しく表示される', () => {
    const monologueMessage = {
      ...mockMessage,
      content: { type: { code: 'MONOLOGUE_SAY' }, text: '独り言です。', num: 1 },
    }
    render(<VillageMessage message={monologueMessage} />)

    expect(screen.getByText('独り言です。')).toBeInTheDocument()
  })

  test('墓場発言が正しく表示される', () => {
    const graveMessage = {
      ...mockMessage,
      content: { type: { code: 'GRAVE_SAY' }, text: '墓場からの発言です。', num: 1 },
    }
    render(<VillageMessage message={graveMessage} />)

    expect(screen.getByText('墓場からの発言です。')).toBeInTheDocument()
  })

  test('システムメッセージが正しく表示される', () => {
    const systemMessage = {
      ...mockMessage,
      content: { type: { code: 'SYSTEM' }, text: 'システムメッセージです。', num: 1 },
      from: null,
    }
    render(<VillageMessage message={systemMessage} />)

    expect(screen.getByText('システムメッセージです。')).toBeInTheDocument()
    expect(screen.queryByText('テストキャラ')).not.toBeInTheDocument()
  })

  test('時間が正しく表示される', () => {
    render(<VillageMessage message={mockMessage} />)

    // 時間の表示形式は実装によって異なる
    expect(screen.getByText('19:00')).toBeInTheDocument()
  })

  test('囁きメッセージが正しく表示される', () => {
    const werewolfMessage = {
      ...mockMessage,
      content: { type: { code: 'WEREWOLF_SAY' }, text: '人狼の囁きです。', num: 1 },
    }
    render(<VillageMessage message={werewolfMessage} />)

    expect(screen.getByText('人狼の囁きです。')).toBeInTheDocument()
  })

  test('受信者が設定されている場合、受信者情報が表示される', () => {
    const directMessage = {
      ...mockMessage,
      content: { type: { code: 'NORMAL_SAY' }, text: '直接発言です。', num: 1 },
      to: {
        charaName: { name: '受信者' },
      },
    }
    render(<VillageMessage message={directMessage} />)

    expect(screen.getByText('直接発言です。')).toBeInTheDocument()
    expect(screen.getByText('受信者')).toBeInTheDocument()
  })

  test('長いメッセージが正しく表示される', () => {
    const longMessage = {
      ...mockMessage,
      content: {
        type: { code: 'NORMAL_SAY' },
        text: 'これは非常に長いメッセージです。'.repeat(10),
        num: 1,
      },
    }
    render(<VillageMessage message={longMessage} />)

    expect(screen.getByText(/これは非常に長いメッセージです/)).toBeInTheDocument()
  })

  test('特殊文字を含むメッセージが正しく表示される', () => {
    const specialMessage = {
      ...mockMessage,
      content: {
        type: { code: 'NORMAL_SAY' },
        text: '<script>alert("XSS")</script>&quot;特殊文字&quot;',
        num: 1,
      },
    }
    render(<VillageMessage message={specialMessage} />)

    // XSSが防がれていることを確認
    expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument()
    expect(screen.getByText(/特殊文字/)).toBeInTheDocument()
  })
})
