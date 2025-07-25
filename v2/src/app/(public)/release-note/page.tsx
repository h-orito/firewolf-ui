import { Card } from '@/components/ui/card'
import { getAllAnnouncements } from '@/data/announcements'

const typeLabels = {
  feature: '新機能',
  'bug-fix': 'バグ修正',
  improvement: '改善',
  announcement: 'お知らせ',
} as const

export default function ReleaseNotePage() {
  const announcements = getAllAnnouncements()

  return (
    <div className="container mx-auto px-3 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">リリースノート</h1>
        <p className="text-gray-600 mb-8">FIREWOLFの更新履歴とお知らせをご確認いただけます。</p>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="p-6">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          announcement.type === 'feature'
                            ? 'bg-blue-100 text-blue-800'
                            : announcement.type === 'bug-fix'
                              ? 'bg-red-100 text-red-800'
                              : announcement.type === 'improvement'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {typeLabels[announcement.type]}
                      </span>
                      {announcement.version && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {announcement.version}
                        </span>
                      )}
                    </div>
                    <time className="text-gray-500">{announcement.date}</time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
                </div>
                <div className="text-gray-700 leading-relaxed">{announcement.content}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
