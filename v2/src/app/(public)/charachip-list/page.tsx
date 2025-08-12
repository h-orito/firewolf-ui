import { CharachipList } from '@/components/pages/charachip/CharachipList'
import { H1 } from '@/components/ui/Heading'

export default function CharachipListPage() {
  return (
    <div className="container mx-auto px-3 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <H1 center>キャラチップ一覧</H1>
          <p className="text-gray-600">
            FIREWOLFで使用できるキャラクター素材集です。
            <br />
            各キャラチップの詳細をクリックすると、含まれるキャラクターを確認できます。
          </p>
        </div>

        <CharachipList />
      </div>
    </div>
  )
}
