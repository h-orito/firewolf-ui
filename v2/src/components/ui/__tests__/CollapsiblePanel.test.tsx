/**
 * CollapsiblePanel コンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { CollapsiblePanel } from '../CollapsiblePanel'

// Font Awesomeのモック
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => <span data-testid="icon">{icon.iconName}</span>,
}))

describe('CollapsiblePanel', () => {
  it('should render with title and children', () => {
    render(
      <CollapsiblePanel title="テストパネル">
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    expect(screen.getByText('テストパネル')).toBeInTheDocument()
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
  })

  it('should start collapsed by default', () => {
    render(
      <CollapsiblePanel title="テストパネル">
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    const button = screen.getByRole('button', { name: /テストパネル/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    // 右向き矢印が表示されている
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveTextContent('chevron-right')
  })

  it('should start expanded when defaultOpen is true', () => {
    render(
      <CollapsiblePanel title="テストパネル" defaultOpen>
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    const button = screen.getByRole('button', { name: /テストパネル/ })
    expect(button).toHaveAttribute('aria-expanded', 'true')

    // 下向き矢印が表示されている
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveTextContent('chevron-down')
  })

  it('should toggle expansion on button click', () => {
    const onToggle = jest.fn()

    render(
      <CollapsiblePanel title="テストパネル" onToggle={onToggle}>
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    const button = screen.getByRole('button', { name: /テストパネル/ })
    const icon = screen.getByTestId('icon')

    // 初期状態: 縮小
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(icon).toHaveTextContent('chevron-right')

    // クリックして展開
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(icon).toHaveTextContent('chevron-down')
    expect(onToggle).toHaveBeenCalledWith(true)

    // もう一度クリックして縮小
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(icon).toHaveTextContent('chevron-right')
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('should apply custom className props', () => {
    render(
      <CollapsiblePanel
        title="テストパネル"
        className="custom-panel"
        titleClassName="custom-title"
        contentClassName="custom-content"
      >
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    // パネル全体にカスタムクラスが適用されている
    const panel = screen.getByText('テストパネル').closest('div')
    expect(panel).toHaveClass('custom-panel')

    // タイトルボタンにカスタムクラスが適用されている
    const button = screen.getByRole('button', { name: /テストパネル/ })
    expect(button).toHaveClass('custom-title')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <CollapsiblePanel title="アクセシビリティテスト">
        <p>テストコンテンツ</p>
      </CollapsiblePanel>
    )

    const button = screen.getByRole('button', { name: /アクセシビリティテスト/ })

    // ARIA属性が正しく設定されている
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'collapsible-content-アクセシビリティテスト')

    // コンテンツエリアの属性も確認
    const content = screen.getByText('テストコンテンツ').closest('[aria-hidden]')
    expect(content).toHaveAttribute('aria-hidden', 'true')
    expect(content).toHaveAttribute('id', 'collapsible-content-アクセシビリティテスト')

    // 展開した場合
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(content).toHaveAttribute('aria-hidden', 'false')
  })
})
