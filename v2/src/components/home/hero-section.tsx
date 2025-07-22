'use client'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
          FIREWOLF
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-slate-300">
          人狼ゲームが無料で遊べるWebサービス
        </p>
        <div className="max-w-4xl mx-auto text-lg text-slate-400 space-y-4">
          <p>チャット形式で気軽に人狼ゲームを楽しめます。</p>
          <p>初心者からエキスパートまで、誰でも参加できる多彩な村が開催中です。</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </section>
  )
}
