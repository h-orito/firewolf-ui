import { renderHook, act } from '@testing-library/react'
import { useClientSidePagination } from '../useClientSidePagination'

// window.scrollTo をモック
const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

describe('useClientSidePagination', () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `アイテム${i + 1}`,
  }))

  beforeEach(() => {
    mockScrollTo.mockClear()
  })

  test('初期状態が正しく設定される', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.totalItems).toBe(25)
    expect(result.current.itemsPerPage).toBe(10)
    expect(result.current.currentItems).toHaveLength(10)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPrevPage).toBe(false)
  })

  test('現在のアイテムが正しく取得される', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    expect(result.current.currentItems[0].name).toBe('アイテム1')
    expect(result.current.currentItems[9].name).toBe('アイテム10')
  })

  test('次のページに移動できる', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    act(() => {
      result.current.goToNextPage()
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.currentItems[0].name).toBe('アイテム11')
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPrevPage).toBe(true)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('前のページに移動できる', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 2,
      })
    )

    act(() => {
      result.current.goToPrevPage()
    })

    expect(result.current.currentPage).toBe(1)
    expect(result.current.currentItems[0].name).toBe('アイテム1')
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPrevPage).toBe(false)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('特定のページに移動できる', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    act(() => {
      result.current.setPage(3)
    })

    expect(result.current.currentPage).toBe(3)
    expect(result.current.currentItems[0].name).toBe('アイテム21')
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.hasPrevPage).toBe(true)
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('最後のページで次のページに移動しようとしても変更されない', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 3,
      })
    )

    act(() => {
      result.current.goToNextPage()
    })

    expect(result.current.currentPage).toBe(3)
    expect(mockScrollTo).not.toHaveBeenCalled()
  })

  test('最初のページで前のページに移動しようとしても変更されない', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    act(() => {
      result.current.goToPrevPage()
    })

    expect(result.current.currentPage).toBe(1)
    expect(mockScrollTo).not.toHaveBeenCalled()
  })

  test('範囲外のページ番号を設定しても有効な範囲に調整される', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    act(() => {
      result.current.setPage(10)
    })

    expect(result.current.currentPage).toBe(3)

    act(() => {
      result.current.setPage(-1)
    })

    expect(result.current.currentPage).toBe(1)
  })

  test('アイテムが空の場合も正しく動作する', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: [],
        itemsPerPage: 10,
        initialPage: 1,
      })
    )

    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.currentItems).toHaveLength(0)
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.hasPrevPage).toBe(false)
  })

  test('itemsPerPageのデフォルト値が適用される', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
      })
    )

    expect(result.current.itemsPerPage).toBe(10)
  })

  test('initialPageのデフォルト値が適用される', () => {
    const { result } = renderHook(() =>
      useClientSidePagination({
        items: mockItems,
        itemsPerPage: 10,
      })
    )

    expect(result.current.currentPage).toBe(1)
  })
})
