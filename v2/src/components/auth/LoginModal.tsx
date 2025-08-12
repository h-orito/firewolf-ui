'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onGoogleLogin: () => void
  onTwitterLogin: () => void
  isLoading?: boolean
}

export function LoginModal({
  isOpen,
  onClose,
  onGoogleLogin,
  onTwitterLogin,
  isLoading = false,
}: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ログイン">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          村への参加や村の作成を行うためにはログインが必要です。以下のサービスでログインしてください。
        </p>

        <div className="text-yellow-700 text-sm space-y-1 border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
          <p>
            既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。
          </p>
          <p>
            ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            Googleでログイン
          </Button>

          <Button
            onClick={onTwitterLogin}
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white border-0"
          >
            <FontAwesomeIcon icon={faTwitter} className="mr-2" />
            Twitterでログイン
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>※ ログインすることで、利用規約とプライバシーポリシーに同意したものとみなします。</p>
          <p>※ 初回ログイン時に、アカウント情報の一部が自動的に取得されます。</p>
        </div>
      </div>
    </Modal>
  )
}
