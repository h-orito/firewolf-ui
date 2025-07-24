'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

interface AccountLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onLinkGoogle: () => void
  onLinkTwitter: () => void
  linkedProviders: string[]
  isLoading?: boolean
}

export function AccountLinkModal({
  isOpen,
  onClose,
  onLinkGoogle,
  onLinkTwitter,
  linkedProviders,
  isLoading = false,
}: AccountLinkModalProps) {
  const isGoogleLinked = linkedProviders.includes('google.com')
  const isTwitterLinked = linkedProviders.includes('twitter.com')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="アカウント連携">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          複数のソーシャルアカウントを連携することで、どちらからでもログインできるようになります。
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faGoogle} className="text-blue-600 w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </div>
            {isGoogleLinked ? (
              <div className="flex items-center space-x-2 text-green-600">
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                <span className="text-sm">連携済み</span>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={onLinkGoogle}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                連携する
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faTwitter} className="text-sky-500 w-5 h-5" />
              <span className="text-sm font-medium">Twitter</span>
            </div>
            {isTwitterLinked ? (
              <div className="flex items-center space-x-2 text-green-600">
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                <span className="text-sm">連携済み</span>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={onLinkTwitter}
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 text-white border-0"
              >
                連携する
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>※ 既に連携済みのアカウントについては、設定の変更はできません。</p>
          <p>※ アカウント連携を解除したい場合は、お問い合わせください。</p>
        </div>
      </div>
    </Modal>
  )
}
