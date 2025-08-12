'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { VillagePage } from '@/components/village/VillagePage'

export default function VillagePageRoute() {
  const params = useParams()
  const searchParams = useSearchParams()

  const villageId = parseInt(params.id as string, 10)
  const initialDay = searchParams.get('day') ? parseInt(searchParams.get('day')!, 10) : undefined
  const participantId = searchParams.get('participant')
    ? parseInt(searchParams.get('participant')!, 10)
    : undefined
  const keyword = searchParams.get('keyword') || undefined
  const onlyToMe = searchParams.get('onlyToMe') === 'true'

  return (
    <VillagePage
      villageId={villageId}
      initialDay={initialDay}
      participantId={participantId}
      keyword={keyword}
      onlyToMe={onlyToMe}
    />
  )
}
