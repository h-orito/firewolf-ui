<template>
  <section class="section px-6 py-12 md:px-12">
    <div class="container mx-auto">
      <h1 class="mb-4 text-xl font-bold">FAQ</h1>
      <ul class="content text-left text-sm">
        <li class="question">入村できないのですが</li>
        <li class="answer">
          以下のいずれかに当てはまると入村できません
          <ul class="mt-1 ml-6 list-inside list-disc">
            <li>ログインしていない</li>
            <li>すでに参加人数が上限に達している</li>
            <li>決着のついていない村に参加中である</li>
            <li>突然死したことがあり、入村制限が解除されていない</li>
            <li>その他入村を制限されている</li>
          </ul>
        </li>
        <li class="question">
          無残な死体が複数いる場合、表示順序に決まりはありますか
        </li>
        <li class="answer">
          ランダムに並び替えて表示するため、順序により死因は特定できません
        </li>
        <li class="question">発言から絵文字が消える</li>
        <li class="answer">
          仕様です。使用できない絵文字は自動的に削除されます
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { createSeoMeta, createStructuredData } from '~/utils/seo'

// SEO設定
useSeoMeta(
  createSeoMeta({
    title: 'FAQ',
    description:
      'FIREWOLFの人狼ゲームに関するよくある質問と回答をまとめています。基本的な遊び方から発展的な内容まで。',
    keywords: 'FIREWOLF,人狼,FAQ,よくある質問,Q&A,使い方,ヘルプ',
    ogType: 'article'
  })
)

// 構造化データ (FAQページ用)
useHead({
  script: [
    createStructuredData('FAQPage', {
      mainEntity: [
        {
          '@type': 'Question',
          name: '初心者です。それでも参加していいのでしょうか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'もちろんです。マナーを守って一生懸命に推理をすればきっと楽しめるはずです。初心者向けの村や初心者歓迎の村に参加されると良いでしょう。'
          }
        },
        {
          '@type': 'Question',
          name: '国主、管理人にはどのような方法で連絡すればいいですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '発言時に@国主もしくは＠国主をつけて発言すると管理人に通知されます。問題が起きていて対応が必要な場合等にご活用ください。Twitterでの連絡のほうが反応は早めです。'
          }
        },
        {
          '@type': 'Question',
          name: '村建てとは何ですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '村を作成したプレイヤーを村建て（むらだて）と呼びます。村の設定を決めたり、プロローグ中に参加者を強制退村させることができます。'
          }
        }
      ]
    })
  ]
})
</script>

<style scoped>
ul li.question,
ul li.answer {
  position: relative;
  padding-left: 2em;
  line-height: 20px;
}

ul li.question::before {
  content: 'Q';
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: #209cee; /* Bulma info color */
  width: 20px;
  height: 20px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

ul li.answer {
  margin-bottom: 20px;
}

ul li.answer::before {
  content: 'A';
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: #ff3860; /* Bulma danger color */
  width: 20px;
  height: 20px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
