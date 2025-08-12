'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUser, faLink, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/Button'

interface UserMenuProps {
  username: string
  onLogout: () => void
  onOpenAccountLink: () => void
}

export function UserMenu({ username, onLogout, onOpenAccountLink }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 外部クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="relative" ref={menuRef}>
      {/* ユーザー名ボタン */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-gray-800 hover:text-white flex items-center space-x-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="max-w-20 truncate">{username}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/mypage"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3" />
            マイページ
          </Link>

          <button
            onClick={() => {
              onOpenAccountLink()
              closeMenu()
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faLink} className="w-4 h-4 mr-3" />
            アカウント連携
          </button>

          <hr className="my-1 border-gray-200" />

          <button
            onClick={() => {
              onLogout()
              closeMenu()
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}
