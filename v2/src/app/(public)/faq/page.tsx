import type { Metadata } from 'next'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'FAQ - FIREWOLF',
  description: 'FIREWOLF（人狼）のよくある質問',
}

interface FAQItem {
  question: string
  answer: string | string[]
}

const faqData: FAQItem[] = [
  {
    question: '入村できないのですが',
    answer: [
      '以下のいずれかに当てはまると入村できません',
      '• ログインしていない',
      '• すでに参加人数が上限に達している',
      '• 決着のついていない村に参加中である',
      '• 突然死したことがあり、入村制限が解除されていない',
      '• その他入村を制限されている',
    ],
  },
  {
    question: '無残な死体が複数いる場合、表示順序に決まりはありますか',
    answer: 'ランダムに並び替えて表示するため、順序により死因は特定できません',
  },
  {
    question: '発言から絵文字が消える',
    answer: '仕様です。使用できない絵文字は自動的に削除されます',
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">FAQ</h1>

        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    Q
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{faq.question}</h2>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <div className="flex-1">
                    {Array.isArray(faq.answer) ? (
                      <div className="space-y-1 text-gray-700">
                        {faq.answer.map((line, lineIndex) => (
                          <div key={lineIndex} className="text-sm">
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm">{faq.answer}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">その他のお問い合わせ</h2>
            <p className="text-sm text-gray-600 mb-2">
              上記で解決しない問題がある場合は、以下の方法でお問い合わせください。
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 発言時に「@国主」または「＠国主」をつけて発言（管理者に通知されます）</li>
              <li>• Twitter での連絡（反応が早めです）</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
