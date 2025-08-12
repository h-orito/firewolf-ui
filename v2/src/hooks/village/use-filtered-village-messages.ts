/**
 * フィルタリング機能付き村メッセージ取得フック
 */

import { useMemo } from 'react'
import { useMessageFilterStore } from '@/stores/village/message-filter-store'
import { useVillageMessagesFlat } from './use-village-messages-infinite-query'
import type { components } from '@/types/generated/api'
import type { MessageFilterState } from '@/types/village'

type VillageStatus = components['schemas']['VillageStatus']
type VillageMessageForm = components['schemas']['VillageMessageForm']

/**
 * フィルタ状態をAPIフォームに変換
 */
const convertFilterStateToForm = (filterState: MessageFilterState): VillageMessageForm => {
  const form: VillageMessageForm = {}

  // メッセージタイプフィルタの変換
  const messageTypeCodes: string[] = []

  if (filterState.messageTypes.normalSay) {
    messageTypeCodes.push('NORMAL_SAY')
  }
  if (filterState.messageTypes.werewolfSay) {
    messageTypeCodes.push('WEREWOLF_SAY')
  }
  if (filterState.messageTypes.sympathizeSay) {
    messageTypeCodes.push('SYMPATHIZE_SAY')
  }
  if (filterState.messageTypes.graveSay) {
    messageTypeCodes.push('GRAVE_SAY')
  }
  if (filterState.messageTypes.monologueSay) {
    messageTypeCodes.push('MONOLOGUE_SAY')
  }
  if (filterState.messageTypes.spectateSay) {
    messageTypeCodes.push('SPECTATE_SAY')
  }
  if (filterState.messageTypes.systemMessage) {
    messageTypeCodes.push('PUBLIC_SYSTEM', 'SECRET_SAY', 'ACTION')
  }
  if (filterState.messageTypes.privateSystem) {
    messageTypeCodes.push(
      'PRIVATE_SEER',
      'PRIVATE_PSYCHIC',
      'PRIVATE_CORONER',
      'PRIVATE_GURU',
      'PRIVATE_WISE'
    )
  }
  if (filterState.messageTypes.participantMessage) {
    messageTypeCodes.push('PARTICIPANTS')
  }
  if (filterState.messageTypes.psychicMessage && !messageTypeCodes.includes('PRIVATE_PSYCHIC')) {
    messageTypeCodes.push('PRIVATE_PSYCHIC')
  }
  if (filterState.messageTypes.hunterMessage && !messageTypeCodes.includes('PRIVATE_WISE')) {
    messageTypeCodes.push('PRIVATE_WISE')
  }

  // 重複を除去
  const uniqueMessageTypeCodes = Array.from(new Set(messageTypeCodes))

  if (uniqueMessageTypeCodes.length > 0) {
    form.message_type_list = uniqueMessageTypeCodes
  }

  // 参加者フィルタの変換
  if (
    filterState.participants.isPersonalExtraction &&
    filterState.participants.personalExtractionTargetId
  ) {
    // 個人抽出モード
    form.participant_id_list = [filterState.participants.personalExtractionTargetId]
  } else if (filterState.participants.selectedParticipantIds.length > 0) {
    // 参加者選択モード
    form.participant_id_list = filterState.participants.selectedParticipantIds
  }

  // 私宛のみフィルタの変換
  // TODO: 現在のユーザーの参加者IDを取得して設定する必要がある
  // if (filterState.target.onlyToMe && currentParticipantId) {
  //   form.to_participant_id_list = [currentParticipantId]
  // }

  // キーワードフィルタはAPIでサポートされていない場合はクライアント側でフィルタリング
  // TODO: APIがキーワード検索をサポートしているか確認

  return form
}

interface UseFilteredVillageMessagesOptions {
  villageId: string
  day: number
  noonnight: string
  villageStatus?: VillageStatus
  enabled?: boolean
}

/**
 * フィルタリング機能付きの村メッセージ取得フック
 *
 * フィルタ状態を自動的にAPIリクエストに反映
 */
export const useFilteredVillageMessages = ({
  villageId,
  day,
  noonnight,
  villageStatus,
  enabled = true,
}: UseFilteredVillageMessagesOptions) => {
  // フィルタ状態を取得
  const filterState = useMessageFilterStore()

  // フィルタ状態をAPIフォームに変換
  const form = useMemo(() => {
    return convertFilterStateToForm(filterState)
  }, [filterState])

  // メッセージを取得
  const query = useVillageMessagesFlat({
    villageId,
    day,
    noonnight,
    form,
    villageStatus,
    enabled,
  })

  return {
    ...query,
    filterForm: form,
    isFiltered: Object.keys(form).length > 0,
  }
}
