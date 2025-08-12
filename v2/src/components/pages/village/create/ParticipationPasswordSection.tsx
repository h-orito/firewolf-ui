import { Card } from '@/components/ui/Card'

interface ParticipationPasswordSectionProps {
  password: string
  onChange: (password: string) => void
}

export function ParticipationPasswordSection({
  password,
  onChange,
}: ParticipationPasswordSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">参加パスワード</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">入村パスワード（任意）</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => onChange(e.target.value)}
            maxLength={50}
            placeholder="パスワードを入力（50文字以内）"
          />
          <p className="text-xs text-gray-500">設定すると、入村にパスワードが必要になります</p>
        </div>
      </div>
    </Card>
  )
}
