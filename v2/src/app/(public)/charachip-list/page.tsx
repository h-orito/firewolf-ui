import { CharachipList } from '@/components/pages/charachip/charachip-list'

export default function CharachipListPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">キャラチップ一覧</h1>
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
