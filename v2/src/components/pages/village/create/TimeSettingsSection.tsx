import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'

interface TimeSettingsSectionProps {
  startDateTime: string
  silentHours: number
  onStartDateTimeChange: (datetime: string) => void
  onSilentHoursChange: (hours: number) => void
  isStartDateTimeValid?: boolean
  startDateTimeError?: string
}

export function TimeSettingsSection({
  startDateTime,
  silentHours,
  onStartDateTimeChange,
  onSilentHoursChange,
  isStartDateTimeValid = true,
  startDateTimeError,
}: TimeSettingsSectionProps) {
  // 現在時刻を取得（最小値として使用）
  const now = new Date()
  const minDateTime = now.toISOString().slice(0, 16)

  // 14日後の日時を取得（最大値として使用）
  const maxDate = new Date(now)
  maxDate.setDate(maxDate.getDate() + 14)
  const maxDateTime = maxDate.toISOString().slice(0, 16)

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">時間</h2>

        <Alert>
          <div>
            <p>1日の長さは24時間固定です</p>
            <p className="mt-1">開始日時は今日から14日後まで設定できます</p>
          </div>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">開始日時</label>
          <input
            type="datetime-local"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isStartDateTimeValid
                ? 'border-gray-300 focus:ring-blue-500'
                : 'border-red-500 focus:ring-red-500'
            }`}
            value={startDateTime}
            onChange={(e) => onStartDateTimeChange(e.target.value)}
            min={minDateTime}
            max={maxDateTime}
            required
          />
          {!isStartDateTimeValid && startDateTimeError && (
            <p className="text-sm text-red-600">{startDateTimeError}</p>
          )}
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
