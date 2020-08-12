<template>
  <div class="content">
    <h4 class="is-7"><strong>全般</strong></h4>
    <div class="content">
      <ul>
        <li>
          日付更新時に、「日付更新時の処理順」の順に能力が行使されます。
        </li>
        <li>
          行使する前に死亡していた場合、能力は行使されません。
          <ul>
            <li>例：占い師が処刑された場合、占いは実行されません。</li>
            <li>
              ただし、襲撃については他の襲撃能力者が生存していれば行使されます。
            </li>
          </ul>
        </li>
        <li>
          対象を選択する能力の場合、日付更新時点でのセット先はランダムです。
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="divine"><strong>占い</strong></h4>
    <div class="content">
      <ul>
        <li>
          毎晩生存者1名を選択して占い、人狼かそうでないかを知ることができます。
        </li>
        <li>対象が突然死、処刑された場合も知ることができます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。<br />（ダミーキャラも2日目にランダムな占い先に占いを実行します。）
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-seer"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは人狼ではないようだ。'
                  "
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-seer"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは人狼のようだ。'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="wisedivine"><strong>役職占い</strong></h4>
    <div class="content">
      <ul>
        <li>
          毎晩生存者1名を選択して占い、役職を知ることができます。
        </li>
        <li>対象が突然死、処刑された場合も知ることができます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。<br />（ダミーキャラも2日目にランダムな占い先に占いを実行します。）
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-seer"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは導師のようだ。'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="psychic"><strong>霊視</strong></h4>
    <div class="content">
      <ul>
        <li>
          突然死、処刑された人が人狼かそうでないかを知ることができます。
        </li>
        <li>
          複数死亡した場合、全員分知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="'勇者 アスベルは人狼ではないようだ。'"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <message-text :message-text="'勇者 アスベルは人狼のようだ。'" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="gurupsychic"><strong>役職霊視</strong></h4>
    <div class="content">
      <ul>
        <li>
          突然死、処刑された人の役職を知ることができます。
        </li>
        <li>
          複数死亡した場合、全員分知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <message-text :message-text="'勇者 アスベルは狩人のようだ。'" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="autopsy"><strong>検死</strong></h4>
    <div class="content">
      <ul>
        <li>
          無惨な死体となった人物の死因を知ることができます。
        </li>
        <li>
          複数死亡した場合、全員分知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="'勇者 アスベルの死因は呪殺死のようだ。'"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="guard"><strong>護衛</strong></h4>
    <div class="content">
      <ul>
        <li>
          初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
          （つまり、ダミーキャラの襲撃は防ぐことができません。）
        </li>
        <li>
          護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '槍使い ヘンリエッタは、僧侶 セシリーを護衛している。'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="forcesuicide"><strong>道連れ</strong></h4>
    <div class="content">
      <ul>
        <li>
          処刑死した場合、処刑処理時点で自分へ投票した生存者から1名をランダムで道連れにします。
        </li>
        <li>
          処刑処理前に自身が死亡していた場合は処刑による道連れは発動しません。
        </li>
        <li>
          襲撃死した場合、襲撃処理時点で生存している襲撃者の中から1名をランダムで道連れにします。
        </li>
        <li>
          襲撃処理前に自身が死亡していた場合は襲撃による道連れは発動しません。
        </li>
        <li>
          道連れになった対象は無惨な死体となって発見されます。（死因は呪殺死扱い）
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '[槍] 槍使い ヘンリエッタは、[僧] 僧侶 セシリーを道連れにした。'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="bake"><strong>パン焼き</strong></h4>
    <div class="content">
      <ul>
        <li>
          毎日、朝を迎えた時点で1人でもこの能力を持つ人が生存していると、専用のメッセージが表示されます。
        </li>
        <li>
          この能力を持つ人が全員死亡すると、別の専用のメッセージが表示されます。
        </li>
        <li>
          <div class="card">
            <div class="card-content p-t-10 p-b-10 m-b-5 message-system">
              <div class="content has-text-left">
                <message-text
                  :message-text="'パン屋がおいしいパンを焼いてくれたそうです。'"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content p-t-10 p-b-10 m-b-5 message-system">
              <div class="content has-text-left">
                <message-text
                  :message-text="'今日からはもうおいしいパンが食べられません。'"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="attack"><strong>襲撃</strong></h4>
    <div class="content">
      <ul>
        <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
        <li>
          襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
        </li>
        <li>
          1日目はダミーキャラしか襲撃対象として選択できません。
        </li>
        <li>2日目以降は襲撃しないこともできます。</li>
        <li>
          襲撃に失敗しても、護衛や襲撃耐性など失敗の要因を知ることはできません。
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-werewolf"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="'巫女 ウズメ達は、僧侶 セシリーを襲撃した。'"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content p-t-10 p-b-10 m-b-5">
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '次の日の朝、以下の村人が無惨な姿で発見された。\n僧侶 セシリー'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="wiseattack"><strong>襲撃占い</strong></h4>
    <div class="content">
      <ul>
        <li>
          基本的に襲撃と変わりありませんが、この能力を持つ人が生存している状態で襲撃に成功すると、襲撃対象の役職を知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-werewolf"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="'巫女 ウズメ達は、僧侶 セシリーを襲撃した。'"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-werewolf"
            >
              <div class="content has-text-left">
                <message-text
                  :message-text="'僧侶 セシリーは狩人だったようだ。'"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content p-t-10 p-b-10 m-b-5">
              <div class="content has-text-left">
                <message-text
                  :message-text="
                    '次の日の朝、以下の村人が無惨な姿で発見された。\n僧侶 セシリー'
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Message from '~/components/type/message'
const messageText = () =>
  import('~/components/village/message/message-text.vue')

@Component({
  components: { messageText }
})
export default class RuleAbility extends Vue {}
</script>

<style lang="scss" scoped>
.message-system-private {
  border-top: 1px solid $private-system-border;
  border-bottom: 1px solid $private-system-border;
  background-color: $private-system-bg !important;
}
.message-system-private-seer {
  border-top: 1px solid $seer-system-border;
  border-bottom: 1px solid $seer-system-border;
  background-color: $seer-system-bg !important;
}
.message-system-private-psychic {
  border-top: 1px solid $psychic-system-border;
  border-bottom: 1px solid $psychic-system-border;
  background-color: $psychic-system-bg !important;
}
.message-system-private-werewolf {
  border-top: 1px solid $werewolf-system-border;
  border-bottom: 1px solid $werewolf-system-border;
  background-color: $werewolf-system-bg !important;
}
</style>
