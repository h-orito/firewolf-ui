import { useState, useMemo } from 'react'

export interface UseClientSidePaginationOptions<T> {
  items: T[]
  itemsPerPage?: number
  initialPage?: number
}

export interface UseClientSidePaginationResult<T> {
  currentItems: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  setPage: (page: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function useClientSidePagination<T>({
  items,
  itemsPerPage = 10,
  initialPage = 1,
}: UseClientSidePaginationOptions<T>): UseClientSidePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // ページが変更されたときに有効なページ番号に調整
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1
    return Math.min(Math.max(1, currentPage), totalPages)
  }, [currentPage, totalPages])

  // 現在のページのアイテムを計算
  const currentItems = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, validCurrentPage, itemsPerPage])

  // ページ変更ハンドラー
  const setPage = (page: number) => {
    const newPage = Math.min(Math.max(1, page), totalPages)
    setCurrentPage(newPage)
    // スムーズスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToNextPage = () => {
    if (validCurrentPage < totalPages) {
      setPage(validCurrentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (validCurrentPage > 1) {
      setPage(validCurrentPage - 1)
    }
  }

  const hasNextPage = validCurrentPage < totalPages
  const hasPrevPage = validCurrentPage > 1

  return {
    currentItems,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setPage,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  }
}
