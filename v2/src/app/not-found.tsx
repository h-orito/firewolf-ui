import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-3 md:px-6 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-xl font-bold text-gray-700 mb-2">ページが見つかりません</h2>
          <p className="text-gray-600">
            お探しのページは削除されたか、URLが変更された可能性があります。
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <p className="textUsm text-gray-600">以下のいずれかをお試しください：</p>
            <ul className="textUsm text-gray-600 space-y-2 textUleft">
              <li>• URLのスペルを確認してください</li>
              <li>• ブラウザの戻るボタンで前のページに戻ってください</li>
              <li>• トップページから目的のページを探してください</li>
            </ul>
            <div className="pt-4">
              <Link href="/">
                <Button>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  トップページに戻る
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
