import { Card } from '@/components/ui/card'
import { NumberInput } from '@/components/ui/number-input'
import { Alert } from '@/components/ui/alert'

interface MessageRestrictSetting {
  maxCount: number
  maxLength: number
}

interface MessageRestrictSettingsProps {
  normalSay: MessageRestrictSetting
  werewolfSay: MessageRestrictSetting
  sympathizeSay: MessageRestrictSetting
  graveSay: MessageRestrictSetting
  monologueSay: MessageRestrictSetting
  spectateSay: MessageRestrictSetting
  onNormalSayChange: (setting: MessageRestrictSetting) => void
  onWerewolfSayChange: (setting: MessageRestrictSetting) => void
  onSympathizeSayChange: (setting: MessageRestrictSetting) => void
  onGraveSayChange: (setting: MessageRestrictSetting) => void
  onMonologueSayChange: (setting: MessageRestrictSetting) => void
  onSpectateSayChange: (setting: MessageRestrictSetting) => void
}

interface MessageRestrictSettingItemProps {
  label: string
  setting: MessageRestrictSetting
  onChange: (setting: MessageRestrictSetting) => void
  minCount?: number
}

function MessageRestrictSettingItem({
  label,
  setting,
  onChange,
  minCount = 0,
}: MessageRestrictSettingItemProps) {
  const handleCountChange = (count: number) => {
    onChange({ ...setting, maxCount: count })
  }

  const handleLengthChange = (length: number) => {
    onChange({ ...setting, maxLength: length })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
      <div className="flex items-center">
        <span className="font-medium">{label}</span>
      </div>
      <div>
        <NumberInput
          value={setting.maxCount}
          onChange={handleCountChange}
          min={minCount}
          max={1000}
          suffix="回/日"
          label="1日の発言回数"
        />
      </div>
      <div>
        <NumberInput
          value={setting.maxLength}
          onChange={handleLengthChange}
          min={1}
          max={1000}
          suffix="文字/回"
          label="1回の最大文字数"
        />
      </div>
    </div>
  )
}

export function MessageRestrictSettingsSection({
  normalSay,
  werewolfSay,
  sympathizeSay,
  graveSay,
  monologueSay,
  spectateSay,
  onNormalSayChange,
  onWerewolfSayChange,
  onSympathizeSayChange,
  onGraveSayChange,
  onMonologueSayChange,
  onSpectateSayChange,
}: MessageRestrictSettingsProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">発言制限設定</h2>

        <Alert>
          <div className="space-y-1">
            <p>• 回数は 0〜1000（通常発言は 1〜1000）で設定できます。</p>
            <p>• 文字数は 1〜1000 で設定できます。</p>
          </div>
        </Alert>

        <div className="space-y-4">
          <MessageRestrictSettingItem
            label="通常発言"
            setting={normalSay}
            onChange={onNormalSayChange}
            minCount={1}
          />

          <MessageRestrictSettingItem
            label="人狼の囁き"
            setting={werewolfSay}
            onChange={onWerewolfSayChange}
          />

          <MessageRestrictSettingItem
            label="共鳴発言"
            setting={sympathizeSay}
            onChange={onSympathizeSayChange}
          />

          <MessageRestrictSettingItem
            label="死者の呻き"
            setting={graveSay}
            onChange={onGraveSayChange}
          />

          <MessageRestrictSettingItem
            label="独り言"
            setting={monologueSay}
            onChange={onMonologueSayChange}
          />

          <MessageRestrictSettingItem
            label="見学発言"
            setting={spectateSay}
            onChange={onSpectateSayChange}
          />
        </div>
      </div>
    </Card>
  )
}
