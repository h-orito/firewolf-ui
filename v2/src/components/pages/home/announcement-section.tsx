import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { H2 } from '@/components/ui/heading'
import { getLatestAnnouncements } from '@/data/announcements'

const typeLabels = {
  feature: '新機能',
  'bug-fix': 'バグ修正',
  improvement: '改善',
  announcement: 'お知らせ',
} as const

export default function AnnouncementSection() {
  const announcements = getLatestAnnouncements(2)

  if (announcements.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-6">
        <H2 center>お知らせ</H2>

        <div className="space-y-4 max-w-4xl mx-auto">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
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
                  </div>
                  <div className="text-right">
                    <time className="text-sm text-gray-500">{announcement.date}</time>
                    {announcement.version && (
                      <div className="text-xs text-gray-400">{announcement.version}</div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
              </div>
            </Card>
          ))}

          <div className="text-center mt-6">
            <Button asChild variant="outline">
              <Link href="/release-note">
                <FontAwesomeIcon icon={faBullhorn} className="mr-2" />
                すべてのお知らせを見る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
