import { useMemo } from 'react'
import { useVillageQuery } from '../useVillageQuery'
import type { components } from '@/types/generated/api'

type VillageParticipantView = components['schemas']['VillageParticipantView']

/**
 * 村の参加者一覧を取得するフック
 *
 * 村情報から参加者と見学者の情報を抽出して提供
 * リアルタイム更新は村情報の更新間隔に依存
 */
export const useVillageParticipantsQuery = (villageId: string) => {
  const villageQuery = useVillageQuery(villageId)

  // 参加者と見学者を統合したリスト
  const participants = useMemo(() => {
    if (!villageQuery.data) return []

    const allParticipants: VillageParticipantView[] = []

    // 参加者を追加
    if (villageQuery.data.participant?.member_list) {
      allParticipants.push(...villageQuery.data.participant.member_list)
    }

    // 見学者を追加
    if (villageQuery.data.spectator?.member_list) {
      allParticipants.push(...villageQuery.data.spectator.member_list)
    }

    return allParticipants
  }, [villageQuery.data])

  // 参加者のみ（見学者を除く）
  const activeParticipants = useMemo(() => {
    if (!villageQuery.data?.participant?.member_list) return []
    return villageQuery.data.participant.member_list
  }, [villageQuery.data])

  // 見学者のみ
  const spectators = useMemo(() => {
    if (!villageQuery.data?.spectator?.member_list) return []
    return villageQuery.data.spectator.member_list
  }, [villageQuery.data])

  // 生存者
  const aliveParticipants = useMemo(() => {
    return activeParticipants.filter((p) => !p.dead)
  }, [activeParticipants])

  // 死亡者
  const deadParticipants = useMemo(() => {
    return activeParticipants.filter((p) => p.dead)
  }, [activeParticipants])

  // 参加者をIDで検索するヘルパー
  const getParticipantById = useMemo(() => {
    const participantMap = new Map(participants.map((p) => [p.id, p]))
    return (id: number) => participantMap.get(id)
  }, [participants])

  return {
    // クエリ情報
    isLoading: villageQuery.isLoading,
    isError: villageQuery.isError,
    error: villageQuery.error,
    refetch: villageQuery.refetch,

    // 参加者データ
    participants,
    activeParticipants,
    spectators,
    aliveParticipants,
    deadParticipants,

    // 統計情報
    totalCount: participants.length,
    activeCount: activeParticipants.length,
    spectatorCount: spectators.length,
    aliveCount: aliveParticipants.length,
    deadCount: deadParticipants.length,

    // ヘルパー関数
    getParticipantById,
  }
}

/**
 * 特定の参加者情報を取得するフック
 */
export const useVillageParticipantQuery = (villageId: string, participantId: number) => {
  const { getParticipantById, isLoading, isError, error } = useVillageParticipantsQuery(villageId)

  const participant = useMemo(() => {
    return getParticipantById(participantId)
  }, [getParticipantById, participantId])

  return {
    participant,
    isLoading,
    isError,
    error,
  }
}
