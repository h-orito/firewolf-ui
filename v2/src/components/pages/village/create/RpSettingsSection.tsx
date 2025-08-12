import { Card } from '@/components/ui/Card'
import { ToggleSlider } from '@/components/ui/ToggleSlider'
import { NumberInput } from '@/components/ui/NumberInput'
import { RadioGroup, type RadioOption } from '@/components/ui/RadioGroup'

export interface RPSettings {
  ageRestriction: '' | 'R15' | 'R18'
  isOpenGraveSpectateMessage: boolean
  isAvailableActionMessage: boolean
  actionMessageRestrict: {
    maxCount: number
    maxLength: number
  }
}

interface RPSettingsSectionProps {
  settings: RPSettings
  onChange: (settings: RPSettings) => void
}

export function RPSettingsSection({ settings, onChange }: RPSettingsSectionProps) {
  const ageRestrictionOptions: RadioOption<'' | 'R15' | 'R18'>[] = [
    { value: '', label: '全年齢' },
    { value: 'R15', label: 'R15' },
    { value: 'R18', label: 'R18' },
  ]

  const handleAgeRestrictionChange = (ageRestriction: '' | 'R15' | 'R18') => {
    onChange({ ...settings, ageRestriction })
  }

  const handleBooleanChange =
    (key: keyof Pick<RPSettings, 'isOpenGraveSpectateMessage' | 'isAvailableActionMessage'>) =>
    (value: boolean) => {
      onChange({ ...settings, [key]: value })
    }

  const handleActionMessageRestrictChange =
    (field: 'maxCount' | 'maxLength') => (value: number) => {
      onChange({
        ...settings,
        actionMessageRestrict: {
          ...settings.actionMessageRestrict,
          [field]: value,
        },
      })
    }

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">RP設定</h2>

        {/* 年齢制限 */}
        <div>
          <label className="block text-sm font-medium mb-2">年齢制限</label>
          <RadioGroup
            name="ageRestriction"
            value={settings.ageRestriction}
            options={ageRestrictionOptions}
            onChange={handleAgeRestrictionChange}
          />
        </div>

        {/* 墓下見学会話公開 */}
        <ToggleSlider
          checked={settings.isOpenGraveSpectateMessage}
          onChange={handleBooleanChange('isOpenGraveSpectateMessage')}
          label="墓下見学会話公開"
        />

        {/* アクション発言可能 */}
        <ToggleSlider
          checked={settings.isAvailableActionMessage}
          onChange={handleBooleanChange('isAvailableActionMessage')}
          label="アクション発言可能"
        />

        {/* アクション発言制限 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">アクション発言制限</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="回数"
              value={settings.actionMessageRestrict.maxCount}
              onChange={handleActionMessageRestrictChange('maxCount')}
              min={1}
              max={1000}
              suffix="回/日"
            />
            <NumberInput
              label="文字数"
              value={settings.actionMessageRestrict.maxLength}
              onChange={handleActionMessageRestrictChange('maxLength')}
              min={1}
              max={1000}
              suffix="文字/回"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
