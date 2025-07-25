import { Card } from '@/components/ui/card'
import { ToggleSlider } from '@/components/ui/toggle-slider'
import { NumberInput } from '@/components/ui/number-input'
import { SkillCompositionInput } from './skill-composition-input'
import { ExternalLink, Info } from 'lucide-react'
import type { Skill } from '@/types/skill'

interface OrganizationSectionProps {
  organization: string
  minParticipants: number
  maxParticipants: number
  isDummySkillMissing: boolean
  skills?: Skill[]
  onOrganizationChange: (organization: string) => void
  onMinParticipantsChange: (min: number) => void
  onMaxParticipantsChange: (max: number) => void
  onIsDummySkillMissingChange: (isDummySkillMissing: boolean) => void
}

export function OrganizationSection({
  organization,
  minParticipants,
  maxParticipants,
  isDummySkillMissing,
  skills,
  onOrganizationChange,
  onMinParticipantsChange,
  onMaxParticipantsChange,
  onIsDummySkillMissingChange,
}: OrganizationSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">編成</h2>

        {/* 編成設定時の注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-2 mb-3">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <h3 className="text-sm font-medium text-blue-800">編成設定時の注意事項</h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-1 ml-6">
            <li>
              • 役職1文字略称は
              <a
                href="/firewolf/rule#skill"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline ml-1"
              >
                ルール
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              を参照してください
            </li>
            <li>
              •{' '}
              {isDummySkillMissing
                ? 'ダミー役欠けありの場合、噛まれて死亡する役職を1名以上含めてください'
                : 'ダミー役欠けなしの場合、村人を1名以上含めてください'}
            </li>
            <li>• 狼系役職を1名以上含めてください</li>
            <li>• 狼系役職が過半数を超えないようにしてください</li>
            <li>• 最小で5人、最大で999人設定することができます</li>
          </ul>
        </div>

        {/* 人数設定 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="最小人数"
            value={minParticipants}
            onChange={onMinParticipantsChange}
            min={5}
            max={999}
            suffix="人"
          />
          <NumberInput
            label="定員"
            value={maxParticipants}
            onChange={onMaxParticipantsChange}
            min={minParticipants}
            max={999}
            suffix="人"
          />
        </div>

        {/* 役欠け設定 */}
        <ToggleSlider
          checked={isDummySkillMissing}
          onChange={onIsDummySkillMissingChange}
          label="役欠けあり"
        />

        {/* 編成入力 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">役職編成</h3>
          <SkillCompositionInput
            value={organization}
            onChange={onOrganizationChange}
            skills={skills}
            isDummySkillMissing={isDummySkillMissing}
            minParticipants={minParticipants}
            maxParticipants={maxParticipants}
          />
        </div>
      </div>
    </Card>
  )
}
