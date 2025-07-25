import { Card } from '@/components/ui/card'
import { ToggleSlider } from '@/components/ui/toggle-slider'

interface RuleSettingsSectionProps {
  openVote: boolean
  availableSkillRequest: boolean
  availableSpectate: boolean
  visibleGraveMessage: boolean
  availableCommit: boolean
  availableSecretSay: boolean
  joinPassword: string
  onOpenVoteChange: (checked: boolean) => void
  onAvailableSkillRequestChange: (checked: boolean) => void
  onAvailableSpectateChange: (checked: boolean) => void
  onVisibleGraveMessageChange: (checked: boolean) => void
  onAvailableCommitChange: (checked: boolean) => void
  onAvailableSecretSayChange: (checked: boolean) => void
  onJoinPasswordChange: (password: string) => void
}

export function RuleSettingsSection({
  openVote,
  availableSkillRequest,
  availableSpectate,
  visibleGraveMessage,
  availableCommit,
  availableSecretSay,
  joinPassword,
  onOpenVoteChange,
  onAvailableSkillRequestChange,
  onAvailableSpectateChange,
  onVisibleGraveMessageChange,
  onAvailableCommitChange,
  onAvailableSecretSayChange,
  onJoinPasswordChange,
}: RuleSettingsSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">ルール設定</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSlider checked={openVote} onChange={onOpenVoteChange} label="投票公開" />

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
            checked={visibleGraveMessage}
            onChange={onVisibleGraveMessageChange}
            label="墓下発言表示"
          />

          <ToggleSlider
            checked={availableCommit}
            onChange={onAvailableCommitChange}
            label="コミット可能"
          />

          <ToggleSlider
            checked={availableSecretSay}
            onChange={onAvailableSecretSayChange}
            label="独り言可能"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">入村パスワード（任意）</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={joinPassword}
            onChange={(e) => onJoinPasswordChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">設定すると、入村にパスワードが必要になります</p>
        </div>
      </div>
    </Card>
  )
}
