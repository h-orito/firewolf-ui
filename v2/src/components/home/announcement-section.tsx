'use client'

import { Card } from '@/components/ui/card'

export default function AnnouncementSection() {
  // TODO: 実際のお知らせデータを取得する
  const announcements = [
    {
      id: 1,
      title: 'FIREWOLF v2 リリース',
      content:
        'Next.js版のFIREWOLFをリリースしました。新機能や改善点についてはリリースノートをご確認ください。',
      date: '2025-01-22',
    },
  ]

  if (announcements.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">お知らせ</h2>

        <div className="space-y-4 max-w-4xl mx-auto">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <time className="text-sm text-gray-500">{announcement.date}</time>
                </div>
                <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
