<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">更新情報</h1>
      <div class="content">
        <ul class="has-text-left is-size-7">
          <li>
            2025/03/15 村設定：連続護衛を追加
          </li>
          <li>
            2025/01/20 村建て発言の抽出を追加
          </li>
          <li>
            2024/12/27 役職：情緒を追加
          </li>
          <li>
            2024/10/19 参加時点でキャラ名と略称を設定可能になるよう機能追加
          </li>
          <li>
            2024/10/19
            村作成/設定変更でダミーキャラ名、略称、プロローグ発言、1日目発言を設定できるよう機能追加
          </li>
          <li>
            2024/10/18 村設定に年齢制限の項目を追加
          </li>
          <li>
            2024/10/10 切り抜き機能を追加
          </li>
          <li>
            2024/10/09
            ログイン方法をリダイレクトからポップアップ形式に変更（PWAでうまく動かなくなる可能性あり、仕様とします）
          </li>
          <li>2024/10/09 発言装飾にcwを追加</li>
          <li>2024/08/19 役職：冷やし中華を追加</li>
          <li>2024/08/19 役職：求愛者を追加</li>
          <li>2024/04/13 名前変更機能を追加</li>
          <li>2024/03/18 各発言に返信と秘話ボタンを追加</li>
          <li>2024/03/17 発言装飾補助ボタンを追加</li>
          <li>2024/03/17 Discord通知機能追加</li>
          <li>2024/02/24 秘話先を画像で選択できるよう機能追加</li>
          <li>2024/02/24 発言抽出に宛先を追加</li>
          <li>2023/12/22 表情差分を自由に選択できるよう変更</li>
          <li>
            2023/06/13
            猫又噛みの際に襲撃者が死亡していた場合、生存している人狼からランダムで1名を道連れにするよう変更
          </li>
          <li>
            2023/04/02
            Googleログインを追加、既存のTwitterアカウントとの紐付けも追加
          </li>
          <li>2023/04/02 アクションは生存者も参照できる旨注意文追加</li>
          <li>2022/05/05 キャラチップを複数使用できるよう変更</li>
          <li>2022/05/05 文字数制限を最大1000文字までに変更</li>
          <li>2022/05/05 発言回数制限を最大1000回までに変更</li>
          <li>2022/05/05 文字装飾機能を追加</li>
          <li>2022/05/03 時短で日付更新した場合突然死しないよう変更</li>
          <li>
            2022/05/03
            時短で日付更新した場合、更新直後から沈黙時間分のみが発言できない時間となるよう仕様変更
          </li>
          <li>2021/11/17 「最新」発言表示機能を追加（ページ分割時のみ）</li>
          <li>2021/11/10 猫又の道連れとなる襲撃担当者を選択できるように変更</li>
          <li>2021/11/09 役職：背徳者を追加</li>
          <li>2021/11/07 村設定：秘話を追加</li>
          <li>2021/11/07 村設定：墓下見学会話公開を追加</li>
          <li>2021/11/07 1発言400文字まで可能に変更</li>
          <li>2021/11/07 アクション発言を追加</li>
          <li>2021/06/05 UI変更</li>
          <li>2021/05/01 役職：強運者を追加</li>
          <li>2021/05/01 役職：風来狩人を追加</li>
          <li>2021/02/21 内部処理改善</li>
          <li>2021/02/21 発言抽出を別窓で開くよう変更</li>
          <li>2021/02/21 ダークモード実装</li>
          <li>2021/02/13 メモ機能を追加</li>
          <li>2021/02/13 村建て発言を400文字40行まで入力可能に変更</li>
          <li>2021/02/13 エピローグ延長機能を追加</li>
          <li>2020/12/27 HOWLING WOLFの変更点をこちらにも反映</li>
          <li>2020/08/13 役職：賢者を追加</li>
          <li>2020/08/13 役職：導師を追加</li>
          <li>2020/08/13 役職：検死官を追加</li>
          <li>2020/08/13 役職：パン屋を追加</li>
          <li>2020/08/13 役職：呪狼を追加</li>
          <li>2020/08/13 役職：智狼を追加</li>
          <li>2020/08/13 役職：共鳴者を追加</li>
          <li>2020/08/13 役職：狂信者を追加</li>
          <li>
            2020/08/11
            発言時にサーバーエラーが起きた際発言内容が消失する不具合を修正
          </li>
          <li>2020/08/11 囁きのアンカーコピーはキャラ略称をつけないよう変更</li>
          <li>2020/08/11 役職：聖痕者を追加</li>
          <li>2020/08/11 役職：猫又を追加</li>
          <li>2020/08/09 発言誤爆防止機能を追加</li>
          <li>2020/08/09 カミングアウト機能を追加</li>
          <li>2020/08/06 プレイヤーによる村作成機能を追加</li>
          <li>2020/07/12 村設定：ダミー役欠けを追加</li>
          <li>2020/07/11 参加者一覧から個別抽出できるよう変更</li>
          <li>2020/07/11 発言抽出のシステムメッセージを公開と非公開に分離</li>
          <li>2020/07/11 下部メニューのタブや大きさを記憶するよう変更</li>
          <li>2020/07/11 アンカーコピーにキャラ略称を追加</li>
          <li>2020/07/11 突然死した場合陣営勝利しても敗北扱いとするよう変更</li>
          <li>2020/06/08 役職：妖狐を追加</li>
          <li>2020/06/03 役職：共有者を追加</li>
          <li>2020/06/02 役職：C国狂人を追加</li>
          <li>2020/06/02 本番サーバ公開</li>
          <li>2020/02/10 テストサーバ公開</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 更新情報' }
  }
}
</script>
