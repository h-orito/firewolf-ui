import { Card } from '@/components/ui/Card'

interface BasicSettingsSectionProps {
  villageName: string
  onVillageNameChange: (name: string) => void
}

export function BasicSettingsSection({
  villageName,
  onVillageNameChange,
}: BasicSettingsSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">基本設定</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">村名</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={villageName}
            onChange={(e) => onVillageNameChange(e.target.value)}
            maxLength={40}
            required
          />
          <p className="text-xs text-gray-500">{villageName.length}/40文字</p>
        </div>
      </div>
    </Card>
  )
}
