import { VillageList } from '@/components/village/village-list'
import { VILLAGE_STATUS_GROUPS } from '@/types/village-status'
import { H1 } from '@/components/ui/heading'

export default function VillageListPage() {
  return (
    <div className="container mx-auto px-3 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <H1 center>村一覧</H1>
        </div>

        <VillageList initialStatuses={[...VILLAGE_STATUS_GROUPS.ALL]} showFilter={true} />
      </div>
    </div>
  )
}
