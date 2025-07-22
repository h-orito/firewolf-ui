import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">FIREWOLF</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              人狼ゲームが無料で遊べるWebサービスです。
              <br />
              オンラインで手軽に人狼ゲームを楽しむことができます。
            </p>
          </div>

          {/* リンク集 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">ゲーム</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/village-list"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  村一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/rule"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ルール説明
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          {/* その他のリンク */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">サイト情報</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  このサイトについて
                </Link>
              </li>
              <li>
                <a
                  href="https://twitter.com/firewolf_bbs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/h-orito/firewolf-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">© 2025 FIREWOLF. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                href="/document"
                className="text-gray-400 hover:text-white transition-colors text-xs"
              >
                利用規約
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/document"
                className="text-gray-400 hover:text-white transition-colors text-xs"
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
