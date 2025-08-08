import { Card } from '@/components/ui/card'
import { ToggleSlider } from '@/components/ui/toggle-slider'

interface RuleSettingsSectionProps {
  openVote: boolean
  availableSkillRequest: boolean
  availableSpectate: boolean
  availableCommit: boolean
  availableSuddenlyDeath: boolean
  availableGuardSameTarget: boolean
  onOpenVoteChange: (checked: boolean) => void
  onAvailableSkillRequestChange: (checked: boolean) => void
  onAvailableSpectateChange: (checked: boolean) => void
  onAvailableCommitChange: (checked: boolean) => void
  onAvailableSuddenlyDeathChange: (checked: boolean) => void
  onAvailableGuardSameTargetChange: (checked: boolean) => void
}

export function RuleSettingsSection({
  openVote,
  availableSkillRequest,
  availableSpectate,
  availableCommit,
  availableSuddenlyDeath,
  availableGuardSameTarget,
  onOpenVoteChange,
  onAvailableSkillRequestChange,
  onAvailableSpectateChange,
  onAvailableCommitChange,
  onAvailableSuddenlyDeathChange,
  onAvailableGuardSameTargetChange,
}: RuleSettingsSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">ルール設定</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSlider checked={openVote} onChange={onOpenVoteChange} label="記名投票" />

          <ToggleSlider
            checked={availableSkillRequest}
            onChange={onAvailableSkillRequestChange}
            label="役職希望可能"
          />

          <ToggleSlider
            checked={availableSpectate}
            onChange={onAvailableSpectateChange}
            label="見学可能"
          />

          <ToggleSlider
            checked={availableCommit}
            onChange={onAvailableCommitChange}
            label="時短希望可能"
          />

          <ToggleSlider
            checked={availableSuddenlyDeath}
            onChange={onAvailableSuddenlyDeathChange}
            label="突然死あり"
          />

          <ToggleSlider
            checked={availableGuardSameTarget}
            onChange={onAvailableGuardSameTargetChange}
            label="連続護衛可能"
          />
        </div>
      </div>
    </Card>
  )
}
