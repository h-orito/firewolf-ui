'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      // スクロール防止
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalElement = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* モーダルコンテンツ */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </Button>
        </header>

        {/* ボディ */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalElement, document.body)
}
