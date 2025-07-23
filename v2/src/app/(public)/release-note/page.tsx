import { Card } from '@/components/ui/card'

export default function ReleaseNotePage() {
  // TODO: 実際のリリースノートデータを取得する
  const releaseNotes = [
    {
      id: 1,
      version: 'v2.0.0',
      title: 'FIREWOLF v2 リリース',
      date: '2025-01-22',
      content: `
        Next.js版のFIREWOLFをリリースしました。

        ## 主な変更点
        - Next.js 15 + React 19 への移行
        - TypeScript による型安全性の向上
        - パフォーマンスの改善
        - モダンなUI/UXの実装
        - PWA対応

        ## 新機能
        - リアルタイム更新の改善
        - レスポンシブデザイン対応
        - ダークモード（今後実装予定）

        ## 技術的な変更
        - Zustand による状態管理
        - TanStack Query によるデータ取得
        - Tailwind CSS によるスタイリング
      `,
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">リリースノート</h1>

        <div className="space-y-8">
          {releaseNotes.map((note) => (
            <Card key={note.id} className="p-8">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {note.version}
                    </span>
                    <time className="text-gray-500">{note.date}</time>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{note.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {note.content.trim()}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
