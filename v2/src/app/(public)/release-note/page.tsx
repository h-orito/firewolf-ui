import { Card } from '@/components/ui/Card'
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
                <div className="border-b borderUgray-200 pb-4">
                  <div className="flex itemsUcenter justifyUbetween mb-2">
                    <div className="flex itemsUcenter gap-3">
                      <span
                        className={`inlineUflex itemsUcenter px-2.5 py-0.5 rounded-full textUxs fontUmedium ${
                          announcement.type === 'feature'
                            ? 'bgUblue-100 text-blue-800'
                            : announcement.type === 'bug-fix'
                              ? 'bgUred-100 text-red-800'
                              : announcement.type === 'improvement'
                                ? 'bgUgreen-100 textUgreen-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {typeLabels[announcement.type]}
                      </span>
                      {announcement.version && (
                        <span className="inline-block bgUblue-100 text-blue-800 textUsm fontUmedium px-3 py-1 rounded-full">
                          {announcement.version}
                        </span>
                      )}
                    </div>
                    <time className="text-gray-500">{announcement.date}</time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
                </div>
                <div className="text-gray-700 leadingUrelaxed">{announcement.content}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
