import { Card } from '@/components/ui/card'
import { ToggleSlider } from '@/components/ui/toggle-slider'
import { Info, ExternalLink } from 'lucide-react'

interface OrganizationSectionProps {
  organization: string
  minParticipants: number
  maxParticipants: number
  isDummySkillMissing: boolean
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
  onOrganizationChange,
  onMinParticipantsChange,
  onMaxParticipantsChange,
  onIsDummySkillMissingChange,
}: OrganizationSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">構成</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={organization}
            onChange={(e) => onOrganizationChange(e.target.value)}
            required
          >
            <option value="8人村">8人村</option>
            <option value="11人村">11人村</option>
            <option value="15人村">15人村</option>
            <option value="17人村">17人村</option>
            <option value="22人村">22人村</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">最小人数</label>
            <input
              type="number"
              min="5"
              max="999"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={minParticipants}
              onChange={(e) => onMinParticipantsChange(parseInt(e.target.value) || 5)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">定員</label>
            <input
              type="number"
              min={minParticipants}
              max="999"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={maxParticipants}
              onChange={(e) => onMaxParticipantsChange(parseInt(e.target.value) || minParticipants)}
              required
            />
          </div>
        </div>

        <ToggleSlider
          checked={isDummySkillMissing}
          onChange={onIsDummySkillMissingChange}
          label="役欠け設定"
        />
      </div>
    </Card>
  )
}
