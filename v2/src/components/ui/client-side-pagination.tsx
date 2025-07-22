import * as React from 'react'
import { Button } from '@/components/ui/button'

export interface ClientSidePaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function ClientSidePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className = '',
}: ClientSidePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // ページが1ページ以下の場合は表示しない
  if (totalPages <= 1) {
    return null
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  // 表示するページ番号を計算
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    const current = currentPage

    // 表示するページ番号の範囲を計算
    let startPage = Math.max(1, current - 2)
    let endPage = Math.min(totalPages, current + 2)

    // 最初のページを必ず表示
    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start') // 省略記号のプレースホルダー
      }
    }

    // 中央のページ番号
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // 最後のページを必ず表示
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end') // 省略記号のプレースホルダー
      }
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 件数情報 */}
      <div className="text-sm text-gray-600">
        {startItem}-{endItem} 件 / 全 {totalItems} 件 ({currentPage} / {totalPages} ページ)
      </div>

      {/* ページネーションボタン */}
      <div className="flex gap-2 flex-wrap justify-center">
        {/* 前のページ */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          前のページ
        </Button>

        {/* ページ番号 */}
        {getPageNumbers().map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span key={page} className="px-3 py-2 text-gray-500">
                ...
              </span>
            )
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          )
        })}

        {/* 次のページ */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          次のページ
        </Button>
      </div>
    </div>
  )
}
