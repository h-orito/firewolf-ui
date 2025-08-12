import { render, screen, fireEvent } from '@testing-library/react'
import { ClientSidePagination } from '../client-side-pagination'

const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

describe('ClientSidePagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    mockScrollTo.mockClear()
    mockOnPageChange.mockClear()
  })

  test('ページネーション情報が正しく表示される', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('11-20 件 / 全 50 件 (2 / 5 ページ)')).toBeInTheDocument()
  })

  test('前へボタンが正しく動作する', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('前のページ')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  test('次へボタンが正しく動作する', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('次のページ')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  test('最初のページで前へボタンが無効になる', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('前のページ')
    expect(prevButton).toBeDisabled()
  })

  test('最後のページで次へボタンが無効になる', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('次のページ')
    expect(nextButton).toBeDisabled()
  })

  test('ページ数が1以下の場合、ページネーションが表示されない', () => {
    const { container } = render(
      <ClientSidePagination
        totalItems={0}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('ページ数が1の場合、ページネーションが表示されない', () => {
    const { container } = render(
      <ClientSidePagination
        totalItems={5}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('数字ページボタンが表示され、正しく動作する', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    )

    // 1ページ目のボタンをクリック
    const page1Button = screen.getByText('1')
    fireEvent.click(page1Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  test('現在のページボタンが正しくハイライトされる', () => {
    render(
      <ClientSidePagination
        totalItems={50}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    )

    const currentPageButton = screen.getByText('3')
    // defaultバリアントのボタンスタイルを確認
    expect(currentPageButton).toHaveClass('bg-primary')
  })
})
