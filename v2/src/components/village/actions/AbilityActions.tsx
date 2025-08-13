/**
 * 能力行使アクションコンポーネント
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface AbilityActionsProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

// 能力の種類定義
const abilityTypes = [
  { value: 'DIVINE', label: '占い', icon: '🔮', description: '対象の正体を知ることができます' },
  { value: 'GUARD', label: '護衛', icon: '🛡️', description: '対象を人狼の襲撃から守ります' },
  { value: 'ATTACK', label: '襲撃', icon: '🗡️', description: '対象を襲撃します（人狼のみ）' },
  {
    value: 'PSYCHIC',
    label: '霊能',
    icon: '👻',
    description: '処刑された人の正体を知ることができます',
  },
  { value: 'INVESTIGATE', label: '捜査', icon: '🔍', description: '対象を調査します（探偵のみ）' },
  { value: 'TRAP', label: '罠設置', icon: '🪤', description: '罠を設置します（狩人系のみ）' },
]

/**
 * 能力行使アクション
 *
 * 役職別の能力行使機能を提供
 */
export const AbilityActions: React.FC<AbilityActionsProps> = ({ village, user }) => {
  const [selectedAbility, setSelectedAbility] = useState('')
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null)
  const [attackAssignee, setAttackAssignee] = useState<number | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeathAlert, setShowDeathAlert] = useState(false)

  // 現在のユーザーの参加情報を取得
  const currentParticipant = village.participant?.member_list?.find(
    (p) => p.player?.id === user?.uid
  )

  // 生存している参加者のリストを取得
  const aliveParticipants = village.participant?.member_list?.filter((p) => !p.dead) || []

  // 死亡している参加者のリストを取得（霊能用）
  const deadParticipants = village.participant?.member_list?.filter((p) => p.dead) || []

  // 人狼メンバーの取得（襲撃担当者設定用）
  const werewolfMembers =
    village.participant?.member_list?.filter((p) => {
      if (!p.skill) return false
      const skillCode = typeof p.skill === 'string' ? p.skill : p.skill.code
      return ['WEREWOLF', 'WISE_WEREWOLF'].includes(skillCode)
    }) || []

  // 利用可能な能力を取得（現在のユーザーの役職に基づく）
  const getAvailableAbilities = () => {
    if (!currentParticipant?.skill) return []

    const skillCode =
      typeof currentParticipant.skill === 'string'
        ? currentParticipant.skill
        : currentParticipant.skill.code

    switch (skillCode) {
      case 'SEER':
      case 'WISE_WOLF':
        return abilityTypes.filter((a) => a.value === 'DIVINE')

      case 'HUNTER':
      case 'GUARD':
        return abilityTypes.filter((a) => a.value === 'GUARD')

      case 'WEREWOLF':
      case 'WISE_WEREWOLF':
        return abilityTypes.filter((a) => a.value === 'ATTACK')

      case 'MEDIUM':
        return abilityTypes.filter((a) => a.value === 'PSYCHIC')

      case 'DETECTIVE':
        return abilityTypes.filter((a) => a.value === 'INVESTIGATE')

      default:
        return []
    }
  }

  // 対象選択可能な参加者を取得
  const getValidTargets = () => {
    if (!selectedAbility) return []

    switch (selectedAbility) {
      case 'DIVINE':
      case 'GUARD':
      case 'ATTACK':
      case 'INVESTIGATE':
        // 自分以外の生存者
        return aliveParticipants.filter((p) => p.player?.id !== user?.uid)

      case 'PSYCHIC':
        // 死亡者（処刑された人）
        return deadParticipants

      default:
        return []
    }
  }

  const handleAbilitySubmit = () => {
    if (!selectedAbility || (!selectedTarget && selectedAbility !== 'TRAP')) {
      return
    }

    setShowConfirmDialog(true)
  }

  const executeAbility = async () => {
    try {
      const abilityData = {
        villageId: village.id,
        abilityType: selectedAbility,
        targetId: selectedTarget,
        attackAssigneeId: attackAssignee,
      }

      // 能力行使API呼び出し（実際の実装では適切なAPIを呼び出し）
      console.log('能力行使:', abilityData)

      // 襲撃の場合は死亡アラートを表示
      if (selectedAbility === 'ATTACK') {
        setShowDeathAlert(true)
      }

      // フォームリセット
      setSelectedAbility('')
      setSelectedTarget(null)
      setAttackAssignee(null)
    } catch (error) {
      console.error('能力行使エラー:', error)
      alert('能力行使に失敗しました')
    } finally {
      setShowConfirmDialog(false)
    }
  }

  const getConfirmMessage = () => {
    const ability = abilityTypes.find((a) => a.value === selectedAbility)
    const target = getValidTargets().find((p) => p.player?.id === selectedTarget)
    const assignee = werewolfMembers.find((p) => p.player?.id === attackAssignee)

    if (!ability || !target) return ''

    let message = `${ability.label}を実行しますか？\n\n`
    message += `対象: ${target.chara?.chara_name?.name} (${target.player?.nickname})`

    if (selectedAbility === 'ATTACK' && assignee) {
      message += `\n襲撃担当: ${assignee.chara?.chara_name?.name} (${assignee.player?.nickname})`
    }

    return message
  }

  // 参加者でない場合は表示しない
  if (!currentParticipant) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">村に参加していません</p>
      </div>
    )
  }

  // 死亡している場合は表示しない
  if (currentParticipant.dead) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">死亡者は能力を使用できません</p>
      </div>
    )
  }

  const availableAbilities = getAvailableAbilities()

  // 利用可能な能力がない場合
  if (availableAbilities.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">
          {typeof currentParticipant.skill === 'string'
            ? currentParticipant.skill
            : currentParticipant.skill?.name || '村人'}
          は特殊能力を持ちません
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 役職情報 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center">
          <span className="text-blue-600 mr-2">ℹ️</span>
          <span className="text-sm text-blue-800 font-medium">
            あなたの役職:{' '}
            {typeof currentParticipant.skill === 'string'
              ? currentParticipant.skill
              : currentParticipant.skill?.name || '村人'}
          </span>
        </div>
      </div>

      {/* 能力選択 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">能力選択</h4>
        <RadioGroup
          name="ability"
          value={selectedAbility}
          onChange={setSelectedAbility}
          options={availableAbilities.map((ability) => ({
            value: ability.value,
            label: `${ability.icon} ${ability.label} - ${ability.description}`,
          }))}
        />
      </div>

      {/* 対象選択 */}
      {selectedAbility && getValidTargets().length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">対象選択</h4>
          <div className="space-y-2">
            {getValidTargets().map((participant) => (
              <label
                key={participant.id}
                className={`flex items-center space-x-3 p-2 rounded border cursor-pointer ${
                  selectedTarget === participant.player?.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="target"
                  value={participant.player?.id}
                  checked={selectedTarget === participant.player?.id}
                  onChange={(e) => setSelectedTarget(Number(e.target.value))}
                  className="text-blue-600"
                />
                <CharacterIcon participant={participant} size="sm" />
                <div>
                  <div className="text-sm font-medium">{participant.chara?.chara_name?.name}</div>
                  <div className="text-xs text-gray-500">{participant.player?.nickname}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 襲撃担当者設定（人狼の襲撃時のみ） */}
      {selectedAbility === 'ATTACK' && werewolfMembers.length > 1 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">襲撃担当者</h4>
          <Select
            value={attackAssignee?.toString() || ''}
            onChange={(e) => setAttackAssignee(Number(e.target.value) || null)}
          >
            <option value="">襲撃担当者を選択...</option>
            {werewolfMembers.map((member) => (
              <option key={member.id} value={member.player?.id}>
                {member.chara?.chara_name?.name} ({member.player?.nickname})
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* 実行ボタン */}
      <Button
        onClick={handleAbilitySubmit}
        disabled={
          !selectedAbility ||
          (!selectedTarget && selectedAbility !== 'TRAP') ||
          (selectedAbility === 'ATTACK' && werewolfMembers.length > 1 && !attackAssignee)
        }
        className="w-full"
      >
        能力を実行
      </Button>

      {/* 確認ダイアログ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>能力行使確認</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 whitespace-pre-line">{getConfirmMessage()}</p>
            <div className="flex space-x-2 justify-end">
              <Button onClick={() => setShowConfirmDialog(false)} variant="outline">
                キャンセル
              </Button>
              <Button onClick={executeAbility}>実行</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 死亡アラート */}
      <Dialog open={showDeathAlert} onOpenChange={setShowDeathAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ 重要な確認</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              襲撃を実行しました。対象が死亡する可能性があります。
            </p>
            <p className="text-xs text-gray-500">
              ※ 護衛や特殊能力により、襲撃が失敗する場合があります。
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowDeathAlert(false)}>確認</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
