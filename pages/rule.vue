<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">共通ルール</h1>
      <div class="content">
        <ul>
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
            <ul>
              <li>
                人狼は他者（キャラクター）を疑うゲームですが、プレイヤー自身を否定したり貶したりしないようご注意ください。
              </li>
            </ul>
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
        </ul>
      </div>
      <h2 class="title is-6">村ごとに明記がない限り以下も守ってください</h2>
      <div class="content">
        <ul>
          <li>
            参加如何に関わらず、進行中の村の情報を別の場所でやり取りしないでください。
          </li>
          <li>
            エピローグを迎えるまでは、自身が希望した役職について言及しないでください。
          </li>
          <li>
            勝利を目指してください。
          </li>
          <li>
            エピローグを迎えるまでは、キャラクターを誰が演じているのか悟られないようにしてください。<br />
            また、他人について誰が演じているかわかったとしても、中身推理はしないでください。<br />
            例. 「この人は狼のときこういう発言はしないから狼ではない」
          </li>
        </ul>
      </div>
      <h2 class="title is-5">仕様</h2>
      <h3 class="title is-6">村作成</h3>
      <div class="content">
        <ul>
          <li>
            プレイヤーが村を作成できます。
            <ul>
              <li>
                参加している/作成した村の決着がついていない場合は作成できません。
              </li>
            </ul>
          </li>
          <li>
            作成する際の設定については省略します。不明点については過去村の「村の設定」を参照するか、管理者にお問い合わせください。
          </li>
          <li>
            作成後もプロローグ中は設定を変更することができます。
            <ul>
              <li>
                ただし、キャラチップとダミーキャラについては後から変更できません。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">村建てが行えること</h3>
      <div class="content">
        <ul>
          <li>村建ては参加有無にかかわらず以下を行えます。</li>
          <li>村建て発言</li>
          <li>村の設定変更（プロローグ中のみ）</li>
          <li>参加者の強制退村（プロローグ中のみ）</li>
          <li>廃村（プロローグ中のみ）</li>
        </ul>
      </div>

      <h3 class="title is-6">流れ</h3>
      <div class="content">
        <ul>
          <li>
            プロローグ
            <ul>
              <li>プレイヤーはキャラクターを選んで村に参加できます。</li>
              <li>
                村の設定で見学可能になっている場合、見物人として参加もできます。
                <ul>
                  <li>
                    見物人は進行中は死亡した人とのみ会話することができます。
                  </li>
                </ul>
              </li>
              <li>プレイヤーは開始2時間前まで退村することができます。</li>
              <li>
                開始日時時点で最低開始人数以上の人数がいる場合、1日目に遷移します。
              </li>
              <li>
                開始日時までに最低開始人数が揃わなかった場合、1日ずつ開始が延長されます。
              </li>
            </ul>
          </li>
          <li>
            1日目
            <ul>
              <li>役職が割り当てられます。</li>
              <li>投票および処刑はありません。</li>
              <li>
                人狼の襲撃対象はダミーキャラ固定になります。
              </li>
              <li>占い師は占い対象を選択することができます。</li>
              <li>狩人は能力行使できません。</li>
            </ul>
          </li>
          <li>
            2日目以降
            <ul>
              <li>処刑するための投票先を選択できるようになります。</li>
              <li>人狼が襲撃対象を選択できるようになります。</li>
              <li>狩人が護衛対象を選択できるようになります。</li>
              <li>
                日付更新時、いずれかの陣営の勝利条件に当てはまった場合はエピローグに遷移します。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6" id="vote">投票</h3>
      <div class="content">
        <ul>
          <li>
            2日目から投票による処刑が始まります。<br />（最初に処刑死者が出るのは3日目朝）
          </li>
          <li>日付更新時点では自分にセットされています。</li>
          <li>翌朝に集計され、最多票となった人が処刑されます。</li>
          <li>
            最多票者が複数いる場合はランダムで処刑される人が決まります。
          </li>
          <li>
            村の設定で無記名投票となっている場合は被得票数のみが公表されます。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">発言</h3>
      <message />
      <h3 class="title is-6">役職希望、割り当て</h3>
      <div class="content">
        <ul>
          <li>
            ダミーキャラの役職割り当てが最初に行われます。
            <ul>
              <li>
                村の設定でダミー役欠けが「あり」となっている場合、襲撃で死亡する役職のいずれかが割り当てられます。
                <ul>
                  <li>
                    例. 編成が「村村村村村村村村村占霊狩狼狼狼狂狐」の場合
                  </li>
                  <li>
                    村人が9/13、占い師、霊能者、狩人、狂人がそれぞれ1/13の確率で割り当てられます。
                  </li>
                  <li>
                    人狼は襲撃できないため割り当てられません。
                  </li>
                  <li>
                    妖狐は襲撃により死亡しないため割り当てられません。
                  </li>
                  <li>
                    猫又は襲撃者を道連れにしてしまうため割り当てられません。
                  </li>
                </ul>
              </li>
              <li>
                村の設定でダミー役欠けが「なし」となっている場合、必ず村人が割り当てられます。
              </li>
            </ul>
          </li>
          <li>
            ダミーキャラの割り当て後、以下の順に役職が割り当てられます。
            <ul>
              <li>第1希望で役職を指定した人を割り当て</li>
              <li>第1希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>第2希望で役職を指定した人を割り当て</li>
              <li>第2希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>
                ここまでで割り当てられなかった人とおまかせの人を割り当て
              </li>
            </ul>
          </li>
          <li>
            村の設定で役職希望が無効となっている場合、全員がおまかせ扱いになります。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">時短希望</h3>
      <div class="content">
        <ul>
          <li>
            村の設定で時短希望が可能になっている村では、進行中に時短希望ができます。
          </li>
          <li>
            ダミーキャラ以外の生存者全員が時短を希望すると、すぐに次の日に遷移します。
          </li>
          <li>
            時短により次の日に遷移した場合、次の日が長くなります。（通常の更新時間を迎えた場合と同じ時間になります）
          </li>
          <li>
            沈黙時間が設定されている村で時短により次の日に遷移した場合、更新直後から沈黙時間分の時間が経過するまでは通常発言することができません。
            <ul>
              <li>つまり、発言可能時間がずれます。</li>
            </ul>
          </li>
          <li>何人時短希望しているか知ることはできません。</li>
          <li>
            時短により次の日に遷移した場合、前日に発言していなくても突然死しません。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">カミングアウト</h3>
      <div class="content">
        <ul>
          <li>
            進行中の通常発言ができる時間帯に生存者は役職カミングアウトをすることができます。
          </li>
          <li>
            カミングアウトすると、発言の名前の横と、参加者一覧の名前の横に役職カミングアウト内容が表示されます。
          </li>
          <li>
            表示上わかりやすくするための補助機能で、必ずカミングアウトしなければいけないわけではありません。
          </li>
          <li>
            このカミングアウトに自身の役職を主張する以外の目的をもたせること、またそれを促すことは禁止します。
            <ul>
              <li>
                例.
                「xxさんもう発言回数がないね。聞きたいことがあるんだけど、XXならYYをカミングアウト、そうでないならZZをカミングアウトして答えてくれない？」
              </li>
            </ul>
          </li>
          <li>カミングアウトは何回でも変更や取り下げが可能です。</li>
        </ul>
      </div>
      <h3 class="title is-6">アクション</h3>
      <div class="content">
        <ul>
          <li>
            村の設定でアクション発言がありになっている場合、アクション発言をすることができます。
          </li>
          <li>
            RP向けの機能であるため、村ごとに明記がない限り、アクション発言を推理発言として利用しない
            / 推理発言として取らないようにしてください。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">日付更新時の処理順</h3>
      <div class="content">
        <ol>
          <li>突然死</li>
          <li>冷やし中華</li>
          <li>求愛</li>
          <li>処刑</li>
          <li>道連れ（処刑）</li>
          <li>霊視</li>
          <li>占い</li>
          <li>護衛</li>
          <li>襲撃</li>
          <li>道連れ（襲撃）</li>
          <li>恋絆、背徳者の後追い</li>
          <li>勝敗判定</li>
        </ol>
      </div>
      <h3 class="title is-6">突然死</h3>
      <div class="content">
        <ul>
          <li>
            前日に一度も通常発言をしていなかった生存者は進行中の日付更新のタイミングで突然死します。
            <ul>
              <li>
                ただし、時短機能により日付更新された場合は発言していなくても突然死しません。
              </li>
            </ul>
          </li>
          <li>突然死者の投票は無効票となり、集計されません。</li>
          <li>突然死者の能力は、人狼の襲撃以外は無効となります。</li>
          <li>突然死者はエピローグ以外で一切の発言ができなくなります。</li>
          <li>突然死者は自陣営が勝利していても敗北となります。</li>
          <li>
            突然死者は以降の村に参加することができなくなります。
            <ul>
              <li>
                突然死した方は管理者まで直接ご連絡ください。やむを得ない事情があったと判断した場合、入村制限を解除します。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">役職</h3>
      <skill :skill-list="skillList" @scroll="scrollAbility($event)" />
      <h3 class="title is-6">能力</h3>
      <ability />
      <h3 class="title is-6">ステータス</h3>
      <div class="content">
        <ul>
          <li>
            恋絆
            <ul>
              <li>恋絆を結んだ先の人が死亡すると、自身も後追死します。</li>
              <li>
                恋絆が付与されている人同士にしか聞こえない恋人発言が可能です。
              </li>
              <li>
                Bさんへの恋絆がAさんに付与されていて、Aさんへの恋絆がBさんに付与されていない場合、Bさんは後追死しませんし、Bさんは恋人会話を使用することもできません。（いわゆる片想い状態）
              </li>
              <li>
                自身の役職にかかわらず、勝利条件が恋人陣営に上書きされます。
              </li>
              <li>
                <div class="card">
                  <div class="card-content p-t-10 p-b-10 m-b-5 message-system">
                    <div class="content has-text-left">
                      <p class="hw-message-text">
                        村長 ヴァルターは、絆に引きずられるように農夫
                        ヤコブの後を追った。
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">勝敗判定</h3>
      <strong>エピローグ遷移条件</strong>
      <div class="m-t-10 m-b-20 content">
        <ul>
          <li>
            以下のいずれかを満たすとエピローグを迎え、勝敗判定が行われます。
            <ul>
              <li>
                夜明け時点で生存している人狼カウント数≧生存している人間カウント数
              </li>
              <li>
                夜明け時点で生存している人狼カウント数が0人かつ生存している人間カウント数が1人以上
              </li>
            </ul>
          </li>
          <li>
            「人間」「人狼」どちらにカウントされるかは能力欄の「勝敗判定カウント」を参照してください。
            <ul>
              <li>
                「勝敗判定カウント」が「-」の場合はどちらにもカウントされません。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <strong>個人ごとの勝敗判定</strong>
      <div class="m-t-10 m-b-20 content">
        <b-table
          :data="personalWinConditions"
          ref="table"
          striped
          narrowed
          :show-detail-icon="false"
          :mobile-cards="false"
          id="win-personal-table"
        >
          <template slot-scope="props">
            <b-table-column field="condition" label="前提">
              <template>
                {{ props.row.condition }}
              </template>
            </b-table-column>
            <b-table-column field="result" label="勝利条件">
              <template>
                {{ props.row.result }}
              </template>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <strong>陣営の勝敗判定</strong>
      <div class="m-t-10 m-b-20 content">
        <b-table
          :data="camps"
          ref="table"
          striped
          narrowed
          :show-detail-icon="false"
          :mobile-cards="false"
          id="camp-table"
        >
          <template slot-scope="props">
            <b-table-column field="name" label="陣営">
              <template>
                {{ props.row.name }}
              </template>
            </b-table-column>
            <b-table-column field="win_condition" label="勝利条件">
              <template>
                {{ props.row.win_condition }}
              </template>
            </b-table-column>
          </template>
        </b-table>
        <ul>
          <li>同時に条件を満たした場合、上にあるものが優先されます。</li>
        </ul>
      </div>
      <h3 class="title is-6">文字装飾</h3>
      <div class="content">
        <ul>
          <li>
            &#091;&#091;#ff0000&#093;&#093;文字列&#091;&#091;/#&#093;&#093;で文字に色をつけられます。
            <ul>
              <li>
                &#091;&#091;#ff0000&#093;&#093;文字列&#091;&#091;/#&#093;&#093;
                → <span style="color: #ff0000;">文字列</span>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;large&#093;&#093;文字列&#091;&#091;/large&#093;&#093;で文字を大きくできます。
            <ul>
              <li>
                &#091;&#091;large&#093;&#093;文字列&#091;&#091;/large&#093;&#093;
                → <span style="font-size: 16px;">文字列</span>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;small&#093;&#093;文字列&#091;&#091;/small&#093;&#093;で文字を小さくできます。
            <ul>
              <li>
                &#091;&#091;small&#093;&#093;文字列&#091;&#091;/small&#093;&#093;
                → <span style="font-size: 10px;">文字列</span>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;b&#093;&#093;文字列&#091;&#091;/b&#093;&#093;で文字を太くできます。
            <ul>
              <li>
                &#091;&#091;b&#093;&#093;文字列&#091;&#091;/b&#093;&#093; →
                <strong>文字列</strong>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;s&#093;&#093;文字列&#091;&#091;/s&#093;&#093;で文字に打ち消し線をつけられます。
            <ul>
              <li>
                &#091;&#091;s&#093;&#093;文字列&#091;&#091;/s&#093;&#093; →
                <span style="text-decoration: line-through;">文字列</span>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;ruby&#093;&#093;文字列&#091;&#091;rt&#093;&#093;ルビ&#091;&#091;/rt&#093;&#093;&#091;&#091;/ruby&#093;&#093;でルビを振れます。
            <ul>
              <li>
                &#091;&#091;ruby&#093;&#093;文字列&#091;&#091;rt&#093;&#093;ルビ&#091;&#091;/rt&#093;&#093;&#091;&#091;/ruby&#093;&#093;
                → <ruby>文字列<rt>ルビ</rt></ruby>
              </li>
            </ul>
          </li>
          <li>
            &#091;&#091;cw&#093;&#093;文字列&#091;&#091;/cw&#093;&#093;で文字を隠せます（クリックで除去できます）。
            <ul>
              <li>
                &#091;&#091;cw&#093;&#093;文字列&#091;&#091;/cw&#093;&#093; →
                <span
                  class="netabare"
                  onclick="this.classList.remove('netabare')"
                  >文字列</span
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">その他</h3>
      <div class="content">
        <ul>
          <li>
            発言時に「@国主」もしくは「＠国主」をつけて発言すると管理人に通知されます。対応が必要な際にご活用ください。
          </li>
          <li>Twitterでの連絡のほうが反応は早めです。</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type
import Skill from '~/components/type/skill'
import Skills from '~/components/type/skills'
const message = () => import('~/components/rule/message.vue')
const skill = () => import('~/components/rule/skill.vue')
const ability = () => import('~/components/rule/ability.vue')

interface Camp {
  name: string
  win_condition: string
}

@Component({
  components: { skill, ability, message }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | ルール' }
  }

  /** data */
  private skillList: Skill[] = []

  /** computed */
  private get personalWinConditions(): { condition: string; result: string }[] {
    return [
      {
        condition: 'ステータス「恋絆」が付与されている',
        result: '恋人陣営の勝利'
      },
      {
        condition: 'それ以外',
        result: '役職が属する陣営の勝利'
      }
    ]
  }

  private get camps(): Camp[] {
    return [
      {
        name: '恋人陣営',
        win_condition: '恋人陣営または恋絆がついた人が1名以上生存'
      },
      {
        name: '狐陣営',
        win_condition: '妖狐系役職が1名以上生存'
      },
      {
        name: '人狼陣営',
        win_condition:
          '夜明け時点で生存している人狼カウント数 ≧ 生存している人間カウント数'
      },
      {
        name: '村人陣営',
        win_condition:
          '夜明け時点で生存している人狼カウント数が0人かつ生存している人間カウント数が1人以上'
      }
    ]
  }

  /** created */
  private async created(): Promise<void> {
    const skills: Skills = await this.$axios.$get('/skill/list')
    this.skillList = skills.list
  }

  /** method */
}
</script>

<style lang="scss" scoped>
.b-table {
  overflow: auto;
  white-space: nowrap;
}
.card-content {
  padding: 10px !important;
  font-family: sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:not(.dark-theme) {
    color: $black;
  }

  &.message-system-private {
    border: 1px solid $private-system-border;
    background-color: $private-system-bg;
  }
  &.message-system-private-seer {
    border: 1px solid $seer-system-border;
    background-color: $seer-system-bg;
  }
  &.message-system-private-psychic {
    border: 1px solid $psychic-system-border;
    background-color: $psychic-system-bg;
  }
  &.message-system-private-werewolf {
    border: 1px solid $werewolf-system-border;
    background-color: $werewolf-system-bg;
  }
  &.message-system-private-mason {
    border: 1px solid $mason-system-border;
    background-color: $mason-system-bg;
  }
  &.message-system-private-lovers {
    border: 1px solid $lovers-system-border;
    background-color: $lovers-system-bg;
  }
}
</style>
