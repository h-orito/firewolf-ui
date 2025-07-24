import { VillageList } from '@/components/village/village-list'
import { VILLAGE_STATUS_GROUPS } from '@/types/village-status'

export default function VillageListPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">村一覧</h1>
        </div>

        <VillageList initialStatuses={[...VILLAGE_STATUS_GROUPS.ALL]} showFilter={true} />
      </div>
    </div>
  )
}
