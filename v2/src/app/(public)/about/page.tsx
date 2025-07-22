import type { Metadata } from 'next'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'このサイトは - FIREWOLF',
  description: 'FIREWOLF（人狼）について',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">このサイトは</h1>

        <Card className="mb-8 p-6">
          <ul className="space-y-3 list-disc list-inside">
            <li>FIREWOLFは、オンラインで長期人狼が遊べるサイトです。</li>
            <li>ユーザが自分で好きな設定の村を作成することができます。</li>
          </ul>
        </Card>

        <h2 className="text-2xl font-bold mb-6">注意事項</h2>

        <Card className="mb-8 p-6">
          <ul className="space-y-4 list-disc list-inside">
            <li>
              同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。
              <br />
              他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
            </li>
            <li>
              正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
            </li>
            <li>
              キャラチップについて
              <ul className="mt-3 ml-6 space-y-2 list-disc list-inside">
                <li>
                  村で各プレイヤーが使用するキャラクターの画像については、著作権は作者様にあります。
                </li>
                <li>
                  スクリーンショットのSNSアップロードやキャラ画像のアイコン利用などについては著作権者である作者様の意向に従ってください。
                </li>
                <li>
                  「実装国の規約に準ずる」とある場合は、村ログのスクリーンショットのSNSアップロードはOK、キャラ画像のみを利用するのはNGとします。
                </li>
              </ul>
            </li>
          </ul>
        </Card>

        <h2 className="text-2xl font-bold mb-6">姉妹サイト</h2>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                <a
                  href="https://howling-wolf.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  HOWLING WOLF
                </a>
              </h3>
              <ul className="ml-6 space-y-1 list-disc list-inside text-sm">
                <li>長期人狼が遊べるサイトです。</li>
                <li>当サイトと似たようなUIで、知らない方と自動生成村で遊ぶことができます。</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                <a
                  href="https://wolfort.net/wolf-mansion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  WOLF MANSION
                </a>
              </h3>
              <ul className="ml-6 space-y-1 list-disc list-inside text-sm">
                <li>特殊ルール人狼「人狼館の事件簿村」が遊べるサイトです。</li>
                <li>対話がないため時間がない人でもパズル感覚で楽しめます。</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                <a
                  href="https://lastwolf.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  LASTWOLF
                </a>
              </h3>
              <ul className="ml-6 space-y-1 list-disc list-inside text-sm">
                <li>短期人狼が遊べるサイトです。</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="mt-12">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">お問い合わせ</h2>
            <p className="text-sm text-gray-600 mb-2">
              サイトに関するご質問やお問い合わせがある場合は、以下の方法でご連絡ください。
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
