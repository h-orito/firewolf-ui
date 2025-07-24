'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faList } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'
import { H2 } from '@/components/ui/heading'
import { useAuth } from '@/hooks/useAuth'
import { VillageList } from '@/components/village/village-list'
import { VILLAGE_STATUS_GROUPS } from '@/types/village-status'

export default function VillageListSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <H2 center>開催中の村</H2>

        <div className="mb-8">
          <VillageList initialStatuses={[...VILLAGE_STATUS_GROUPS.ACTIVE]} showFilter={false} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated && (
            <Link href="/village/create">
              <Button variant="primary">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                村を作成
              </Button>
            </Link>
          )}
          <Link href="/village-list">
            <Button variant="outline">
              <FontAwesomeIcon icon={faList} className="mr-2" />
              すべての村を見る
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
