import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'

interface TimeSettingsSectionProps {
  startDateTime: string
  silentHours: number
  onStartDateTimeChange: (datetime: string) => void
  onSilentHoursChange: (hours: number) => void
}

export function TimeSettingsSection({
  startDateTime,
  silentHours,
  onStartDateTimeChange,
  onSilentHoursChange,
}: TimeSettingsSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">時間</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">1日の長さは24時間固定です</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">開始日時</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDateTime}
            onChange={(e) => onStartDateTimeChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">沈黙時間（時間）</label>
          <input
            type="number"
            min="0"
            max="24"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={silentHours}
            onChange={(e) => onSilentHoursChange(parseInt(e.target.value))}
          />
          <p className="text-xs text-gray-500">0を指定すると沈黙時間なしになります</p>
        </div>
      </div>
    </Card>
  )
}
