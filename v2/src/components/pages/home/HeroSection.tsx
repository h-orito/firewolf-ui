'use client'

import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative text-white">
      <h1 className="sr-only">FIREWOLF - 長期人狼が無料で遊べるサービス</h1>
      <div className="relative w-full">
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
        {/* 紹介文 */}
        <div className="absolute bottom-[5%] right-[2%] md:bottom-[8%] md:right-[3%]">
          <p
            className="text-sm md:text-lg lg:text-xl font-bold text-white text-right"
            style={{
              textShadow:
                '2px 2px 5px rgba(133, 97, 69, 1), -2px 2px 5px rgba(133, 97, 69, 1), 2px -2px 5px rgba(133, 97, 69, 1), -2px -2px 5px rgba(133, 97, 69, 1)',
            }}
          >
            FIREWOLFは
            <br />
            長期人狼が無料で遊べるサービスです
          </p>
        </div>
      </div>
    </section>
  )
}
