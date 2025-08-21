import type { Metadata } from 'next'
import { VillagePageClient } from './[id]/VillagePageClient'
import { getVillageData } from '@/lib/api/village'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  try {
    const villageId = resolvedSearchParams.id
      ? parseInt(resolvedSearchParams.id as string, 10)
      : NaN
    if (isNaN(villageId)) {
      return { title: 'FIREWOLF' }
    }

    const village = await getVillageData(villageId)

    return {
      title: village?.name ? `FIREWOLF | ${village.name}` : 'FIREWOLF',
    }
  } catch (error) {
    console.error('Failed to generate metadata for village page:', error)
    return { title: 'FIREWOLF' }
  }
}

export default async function VillagePageRoute({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams

  const villageId = resolvedSearchParams.id ? parseInt(resolvedSearchParams.id as string, 10) : NaN
  if (isNaN(villageId)) {
    throw new Error('Invalid village ID')
  }

  // サーバーサイドで村データを取得
  const village = await getVillageData(villageId)
  if (!village) {
    throw new Error('Village not found')
  }

  const initialDay = resolvedSearchParams.day
    ? parseInt(resolvedSearchParams.day as string, 10)
    : undefined
  const participantId = resolvedSearchParams.participant
    ? parseInt(resolvedSearchParams.participant as string, 10)
    : undefined
  const keyword = (resolvedSearchParams.keyword as string) || undefined
  const onlyToMe = resolvedSearchParams.onlyToMe === 'true'

  return (
    <VillagePageClient
      village={village}
      initialDay={initialDay}
      participantId={participantId}
      keyword={keyword}
      onlyToMe={onlyToMe}
    />
  )
}
