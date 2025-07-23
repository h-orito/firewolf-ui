'use client'

import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto relative">
          <Image
            src="/firewolf/images/top.jpg"
            alt="FIREWOLF - 勝つのは人か狼か"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
          <div className="absolute top-[40%] right-[2%] md:top-[40%] md:right-[2%]">
            <div
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
              style={{
                fontFamily:
                  "'游明朝', YuMincho, 'Hiragino Mincho ProN W3', 'ヒラギノ明朝 ProN W3', 'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝', 'ＭＳ 明朝', serif",
                textShadow:
                  '2px 2px 5px rgba(133, 97, 69, 1), -2px 2px 5px rgba(133, 97, 69, 1), 2px -2px 5px rgba(133, 97, 69, 1), -2px -2px 5px rgba(133, 97, 69, 1)',
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: '#ff0000',
                  textShadow:
                    '2px 2px 5px rgba(180, 180, 180, 1), -2px 2px 5px rgba(180, 180, 180, 1), 2px -2px 5px rgba(180, 180, 180, 1), -2px -2px 5px rgba(180, 180, 180, 1)',
                }}
              >
                F
              </span>
              IRE
              <span
                className="font-bold"
                style={{
                  color: '#ff0000',
                  textShadow:
                    '2px 2px 5px rgba(180, 180, 180, 1), -2px 2px 5px rgba(180, 180, 180, 1), 2px -2px 5px rgba(180, 180, 180, 1), -2px -2px 5px rgba(180, 180, 180, 1)',
                }}
              >
                W
              </span>
              OLF
            </div>
          </div>
        </div>
        <div className="text-center py-10">
          <p className="text-xl md:text-2xl mb-8 text-slate-300">
            FIREWOLFは長期人狼が無料で遊べるサービスです
          </p>
          <div className="max-w-4xl mx-auto text-lg text-slate-400 space-y-4">
            <p>チャット形式で気軽に人狼ゲームを楽しめます。</p>
            <p>初心者からエキスパートまで、誰でも参加できる多彩な村が開催中です。</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </section>
  )
}
