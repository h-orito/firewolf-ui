/**
 * VillageInfoModal コンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { VillageInfoModal } from '../VillageInfoModal'
import type { components } from '@/types/generated/api'

// Modalのモック
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid="modal" onClick={onClose}>
        <h1>{title}</h1>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

// useCharachipListQueryのモック
jest.mock('@/hooks/use-charachip-list-query', () => ({
  useCharachipListQuery: () => ({
    data: {
      data: [
        {
          id: 1,
          name: 'テストキャラチップ',
        },
      ],
    },
  }),
}))

// テスト用の村データ
const mockVillage: components['schemas']['VillageView'] = {
  id: 1,
  name: 'テスト村',
  status: {
    code: 'IN_PROGRESS',
    name: '進行中',
  },
  creator_player: {
    id: 1,
    nickname: 'テスト村建て',
    introduction: null,
    twitter_user_name: null,
    uid: 'test-uid-creator',
  },
  participant: {
    count: 8,
    member_list: [],
  },
  spectator: {
    count: 2,
    member_list: [],
  },
  setting: {
    capacity: {
      min: 4,
      max: 16,
    },
    password: {
      join_password_required: true,
    },
    charachip: {
      dummy_chara_id: 1,
      dummy_chara_short_name: 'ダミー',
      dummy_chara_name: 'ダミーキャラ',
      dummy_chara_day0_message: 'よろしく',
      charachip_ids: [1],
    },
    rules: {
      open_vote: false,
      available_skill_request: true,
      available_spectate: true,
      open_skill_in_grave: false,
      visible_grave_message: false,
      available_suddenly_death: true,
      available_commit: true,
      auto_generated: false,
      available_dummy_skill: false,
      available_action: true,
      available_secret_say: false,
      available_guard_same_target: false,
      message_restrict: {
        exist_restricts: true,
        restrict_list: [
          {
            type: {
              code: 'NORMAL_SAY',
              name: '通常発言',
              is_say_type: true,
              is_owl_viewable_type: true,
            },
            count: 20,
            length: 400,
            line: 5,
          },
          {
            type: {
              code: 'WEREWOLF_SAY',
              name: '人狼の囁き',
              is_say_type: true,
              is_owl_viewable_type: false,
            },
            count: 10,
            length: 200,
            line: 3,
          },
        ],
      },
    },
    organizations: {
      organization: {
        standard: '標準',
      },
    },
    tags: {
      list: ['テストタグ'],
      is_r15: false,
      is_r18: false,
    },
    time: {} as any,
  },
  day: {} as any,
  silent_time: false,
} as any

describe('VillageInfoModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    village: mockVillage,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when isOpen is true', () => {
    render(<VillageInfoModal {...defaultProps} />)

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('村情報')).toBeInTheDocument()
  })

  it('should not render modal when isOpen is false', () => {
    render(<VillageInfoModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should display basic village information', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // 基本設定の表示確認
    expect(screen.getByText('基本設定')).toBeInTheDocument()
    expect(screen.getByText('テスト村')).toBeInTheDocument()
    expect(screen.getByText('テスト村建て')).toBeInTheDocument()
    expect(screen.getByText('進行中')).toBeInTheDocument()
    expect(screen.getByText('4〜16名')).toBeInTheDocument()
    expect(screen.getByText('8/16名')).toBeInTheDocument()
    expect(screen.getByText('2名')).toBeInTheDocument()
  })

  it('should display participation restrictions', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // 参加パスワードの表示確認
    expect(screen.getByText('参加パスワード')).toBeInTheDocument()
    expect(screen.getByText('設定済み')).toBeInTheDocument()
  })

  it('should display rules settings', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // ルール設定の表示確認
    expect(screen.getByText('ルール設定')).toBeInTheDocument()
    expect(screen.getByText('記名投票:')).toBeInTheDocument()
    expect(screen.getByText('見学可能:')).toBeInTheDocument()
    expect(screen.getByText('突然死あり:')).toBeInTheDocument()
    expect(screen.getByText('時短希望可能:')).toBeInTheDocument()
    expect(screen.getByText('連続護衛:')).toBeInTheDocument()

    // 複数の「あり」「なし」があるため、getAllByTextを使用
    const positiveRules = screen.getAllByText('あり')
    expect(positiveRules.length).toBeGreaterThan(0)
    const negativeRules = screen.getAllByText('なし')
    expect(negativeRules.length).toBeGreaterThan(0)
  })

  it('should display message restrictions', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // 発言制限の表示確認
    expect(screen.getByText('発言制限設定')).toBeInTheDocument()
    expect(screen.getByText('通常発言:')).toBeInTheDocument()
    expect(screen.getByText('人狼の囁き:')).toBeInTheDocument()

    // 制限数の表示確認（複数あるため、正規表現でチェック）
    expect(screen.getByText(/20回\/日 • 400文字\/回/)).toBeInTheDocument()
    expect(screen.getByText(/10回\/日 • 200文字\/回/)).toBeInTheDocument()
  })

  it('should display organization information', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // 編成設定の表示確認
    expect(screen.getByText('編成設定')).toBeInTheDocument()
    expect(screen.getByText('標準')).toBeInTheDocument()
  })

  it('should call onClose when modal is closed', () => {
    const onCloseMock = jest.fn()
    render(<VillageInfoModal {...defaultProps} onClose={onCloseMock} />)

    const modal = screen.getByTestId('modal')
    fireEvent.click(modal)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should handle missing optional data gracefully', () => {
    const minimalVillage = {
      ...mockVillage,
      charachip: null,
      spectator: { count: 0, member_list: [] },
      setting: {
        ...mockVillage.setting,
        restrict: null,
        organizations: null,
      },
    }

    render(<VillageInfoModal {...defaultProps} village={minimalVillage as any} />)

    // 基本情報は表示される
    expect(screen.getByText('テスト村')).toBeInTheDocument()

    // 未設定の項目は適切に表示される
    expect(screen.getByText('設定なし')).toBeInTheDocument()

    // オプショナルなセクションは表示されない
    expect(screen.queryByText('発言制限設定')).not.toBeInTheDocument()
    expect(screen.queryByText('編成設定')).not.toBeInTheDocument()
  })

  it('should display character chip information', () => {
    render(<VillageInfoModal {...defaultProps} />)

    // キャラチップ設定の表示確認
    expect(screen.getByText('キャラチップ設定')).toBeInTheDocument()
    expect(screen.getByText('キャラチップ:')).toBeInTheDocument()
    expect(screen.getByText('テストキャラチップ')).toBeInTheDocument()
  })
})
