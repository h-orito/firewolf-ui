'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { VillageList } from '@/components/village/village-list'

export default function VillageListSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">開催中の村</h2>

        <div className="mb-8">
          <VillageList initialStatuses={['PROLOGUE', 'PROGRESS']} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated && (
            <Link href="/village/create">
              <Button className="bg-green-600 hover:bg-green-700">村を作成</Button>
            </Link>
          )}
          <Link href="/village-list">
            <Button variant="outline">すべての村を見る</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
