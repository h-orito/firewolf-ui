import type { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { ClickToReveal } from '@/components/ui/click-to-reveal'
import { SkillList } from '@/components/pages/rule/skill-list'
import { getSkillList } from '@/lib/api/skill'

export const metadata: Metadata = {
  title: 'ルール - FIREWOLF',
  description: 'FIREWOLF（人狼）のルール説明',
}

export default async function RulePage() {
  const skills = await getSkillList()
  return (
    <div className="container mx-auto px-3 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">共通ルール</h1>

        <Card className="mb-6 p-6">
          <div className="space-y-4">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。
                <br />
                他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
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
        </Card>

        <h2 className="text-xl font-bold mb-4">村ごとに明記がない限り以下も守ってください</h2>

        <Card className="mb-6 p-6">
          <ul className="space-y-3 list-disc list-inside">
            <li>参加如何に関わらず、進行中の村の情報を別の場所でやり取りしないでください。</li>
            <li>エピローグを迎えるまでは、自身が希望した役職について言及しないでください。</li>
            <li>勝利を目指してください。</li>
            <li>
              エピローグを迎えるまでは、キャラクターを誰が演じているのか悟られないようにしてください。
              <br />
              また、他人について誰が演じているかわかったとしても、中身推理はしないでください。
              <br />
              例：「この人は狼のときこういう発言はしないから狼ではない」
            </li>
          </ul>
        </Card>

        <h2 className="text-xl font-bold mb-6">仕様</h2>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">村作成</h3>
          <Card className="p-6">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                プレイヤーが村を作成できます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>参加している/作成した村の決着がついていない場合は作成できません。</li>
                </ul>
              </li>
              <li>
                作成する際の設定については省略します。不明点については過去村の「村の設定」を参照するか、管理者にお問い合わせください。
              </li>
              <li>
                作成後もプロローグ中は設定を変更することができます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>ただし、キャラチップとダミーキャラについては後から変更できません。</li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">村建てが行えること</h3>
          <Card className="p-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>村建ては参加有無にかかわらず以下を行えます。</li>
              <li>村建て発言</li>
              <li>村の設定変更（プロローグ中のみ）</li>
              <li>参加者の強制退村（プロローグ中のみ）</li>
              <li>廃村（プロローグ中のみ）</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">流れ</h3>
          <Card className="p-6">
            <ul className="space-y-4 list-disc list-inside">
              <li>
                プロローグ
                <ul className="mt-2 ml-6 space-y-2 list-disc list-inside">
                  <li>プレイヤーはキャラクターを選んで村に参加できます。</li>
                  <li>
                    村の設定で見学可能になっている場合、見物人として参加もできます。
                    <ul className="mt-1 ml-6 space-y-1 list-disc list-inside">
                      <li>見物人は進行中は死亡した人とのみ会話することができます。</li>
                    </ul>
                  </li>
                  <li>プレイヤーは開始2時間前まで退村することができます。</li>
                  <li>開始日時時点で最低開始人数以上の人数がいる場合、1日目に遷移します。</li>
                  <li>開始日時までに最低開始人数が揃わなかった場合、1日ずつ開始が延長されます。</li>
                </ul>
              </li>
              <li>
                1日目
                <ul className="mt-2 ml-6 space-y-2 list-disc list-inside">
                  <li>役職が割り当てられます。</li>
                  <li>投票および処刑はありません。</li>
                  <li>人狼の襲撃対象はダミーキャラ固定になります。</li>
                  <li>占い師は占い対象を選択することができます。</li>
                  <li>狩人は能力行使できません。</li>
                </ul>
              </li>
              <li>
                2日目以降
                <ul className="mt-2 ml-6 space-y-2 list-disc list-inside">
                  <li>処刑するための投票先を選択できるようになります。</li>
                  <li>人狼が襲撃対象を選択できるようになります。</li>
                  <li>狩人が護衛対象を選択できるようになります。</li>
                  <li>
                    日付更新時、いずれかの陣営の勝利条件に当てはまった場合はエピローグに遷移します。
                  </li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4" id="vote">
            投票
          </h3>
          <Card className="p-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                2日目から投票による処刑が始まります。
                <br />
                （最初に処刑死者が出るのは3日目朝）
              </li>
              <li>日付更新時点では自分にセットされています。</li>
              <li>翌朝に集計され、最多票となった人が処刑されます。</li>
              <li>最多票者が複数いる場合はランダムで処刑される人が決まります。</li>
              <li>村の設定で無記名投票となっている場合は被得票数のみが公表されます。</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">発言</h3>
          <Card className="p-6">
            <ul className="space-y-4 list-disc list-inside">
              <li>
                発言種別ごとに1日に発言できる回数と最大文字数が制限されます。
                <br />
                （村の設定で変更できます。以下はデフォルト値です。）
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>通常発言は1日に20回、1回に200文字まで</li>
                  <li>人狼の囁きは1日に40回、1回に200文字まで</li>
                  <li>死者の呻きは1日に40回、1回に200文字まで</li>
                  <li>独り言は1日に100回、1回に200文字まで</li>
                  <li>なお、プロローグ、エピローグは発言回数が制限されません。</li>
                </ul>
              </li>
              <li>
                村の設定で更新後沈黙時間が制限されている村では、進行中のみ、通常発言できない時間帯があります。
              </li>
              <li>
                発言中にアンカー文字列を含めると、クリックすることでその発言を表示することができます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>&gt;&gt;1 通常発言へのアンカー</li>
                  <li>&gt;&gt;*1 人狼の囁きへのアンカー</li>
                  <li>&gt;&gt;=1 共鳴発言へのアンカー</li>
                  <li>&gt;&gt;?1 恋人発言へのアンカー</li>
                  <li>&gt;&gt;+1 死者の呻きへのアンカー</li>
                  <li>&gt;&gt;-1 独り言へのアンカー（エピローグ後のみ）</li>
                  <li>&gt;&gt;s1 秘話へのアンカー（エピローグ後のみ）</li>
                  <li>&gt;&gt;a1 アクションへのアンカー</li>
                  <li>
                    いずれのアンカーも、自分が見られない発言はクリックしても発言が表示されません。
                  </li>
                </ul>
              </li>
            </ul>
          </Card>

          <div className="mt-6 space-y-4">
            <h4 className="font-bold mb-2">発言種別の説明</h4>
            <div className="space-y-3">
              <Card className="p-4 bg-gray-50">
                <h5 className="font-bold mb-1">通常発言</h5>
                <p className="text-sm">参加していない人も含め全員が見ることができます。</p>
              </Card>
              <Card className="p-4 bg-red-50">
                <h5 className="font-bold mb-1">人狼の囁き</h5>
                <p className="text-sm">
                  進行中は一部の役職しか見ることができません。
                  エピローグを迎えると全員が見ることができます。
                </p>
              </Card>
              <Card className="p-4 bg-blue-50">
                <h5 className="font-bold mb-1">共鳴発言</h5>
                <p className="text-sm">
                  進行中は一部の役職しか見ることができません。
                  エピローグを迎えると全員が見ることができます。
                </p>
              </Card>
              <Card className="p-4 bg-pink-50">
                <h5 className="font-bold mb-1">恋人発言</h5>
                <p className="text-sm">
                  進行中は恋絆がついた人しか見ることができません。
                  エピローグを迎えると全員が見ることができます。
                </p>
              </Card>
              <Card className="p-4 bg-purple-50">
                <h5 className="font-bold mb-1">独り言</h5>
                <p className="text-sm">
                  進行中は自分しか見ることができません。
                  エピローグを迎えると全員が見ることができます。
                </p>
              </Card>
              <Card className="p-4 bg-gray-100">
                <h5 className="font-bold mb-1">死者の呻き</h5>
                <p className="text-sm">
                  進行中は死亡した人しか見ることができません。
                  エピローグを迎えると全員が見ることができます。
                </p>
              </Card>
              <Card className="p-4 bg-green-50">
                <h5 className="font-bold mb-1">村建て発言</h5>
                <p className="text-sm">参加していない人も含め全員が見ることができます。</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">役職希望、割り当て</h3>
          <Card className="p-6">
            <ul className="space-y-4 list-disc list-inside">
              <li>
                ダミーキャラの役職割り当てが最初に行われます。
                <ul className="mt-2 ml-6 space-y-2 list-disc list-inside">
                  <li>
                    村の設定でダミー役欠けが「あり」となっている場合、襲撃で死亡する役職のいずれかが割り当てられます。
                    <ul className="mt-1 ml-6 space-y-1 list-disc list-inside">
                      <li>例：編成が「村村村村村村村村村占霊狩狼狼狼狂狐」の場合</li>
                      <li>
                        村人が9/13、占い師、霊能者、狩人、狂人がそれぞれ1/13の確率で割り当てられます。
                      </li>
                      <li>人狼は襲撃できないため割り当てられません。</li>
                      <li>妖狐は襲撃により死亡しないため割り当てられません。</li>
                      <li>猫又は襲撃者を道連れにしてしまうため割り当てられません。</li>
                    </ul>
                  </li>
                  <li>
                    村の設定でダミー役欠けが「なし」となっている場合、必ず村人が割り当てられます。
                  </li>
                </ul>
              </li>
              <li>
                ダミーキャラの割り当て後、以下の順に役職が割り当てられます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>第1希望で役職を指定した人を割り当て</li>
                  <li>第1希望でおまかせ（XX陣営）を指定した人を割り当て</li>
                  <li>第2希望で役職を指定した人を割り当て</li>
                  <li>第2希望でおまかせ（XX陣営）を指定した人を割り当て</li>
                  <li>ここまでで割り当てられなかった人とおまかせの人を割り当て</li>
                </ul>
              </li>
              <li>村の設定で役職希望が無効となっている場合、全員がおまかせ扱いになります。</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">時短希望</h3>
          <Card className="p-6">
            <ul className="space-y-3 list-disc list-inside">
              <li>村の設定で時短希望が可能になっている村では、進行中に時短希望ができます。</li>
              <li>ダミーキャラ以外の生存者全員が時短を希望すると、すぐに次の日に遷移します。</li>
              <li>
                時短により次の日に遷移した場合、次の日が長くなります。（通常の更新時間を迎えた場合と同じ時間になります）
              </li>
              <li>
                沈黙時間が設定されている村で時短により次の日に遷移した場合、更新直後から沈黙時間分の時間が経過するまでは通常発言することができません。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>つまり、発言可能時間がずれます。</li>
                </ul>
              </li>
              <li>何人時短希望しているか知ることはできません。</li>
              <li>時短により次の日に遷移した場合、前日に発言していなくても突然死しません。</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">カミングアウト</h3>
          <Card className="p-6">
            <ul className="space-y-3 list-disc list-inside">
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
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    例：「xxさんもう発言回数がないね。聞きたいことがあるんだけど、XXならYYをカミングアウト、そうでないならZZをカミングアウトして答えてくれない？」
                  </li>
                </ul>
              </li>
              <li>カミングアウトは何回でも変更や取り下げが可能です。</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">アクション</h3>
          <Card className="p-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                村の設定でアクション発言がありになっている場合、アクション発言をすることができます。
              </li>
              <li>
                RP向けの機能であるため、村ごとに明記がない限り、アクション発言を推理発言として利用しない
                / 推理発言として取らないようにしてください。
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">日付更新時の処理順</h3>
          <Card className="p-6">
            <ol className="space-y-1 list-decimal list-inside">
              <li>突然死</li>
              <li>情緒</li>
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
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">突然死</h3>
          <Card className="p-6">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                前日に一度も通常発言をしていなかった生存者は進行中の日付更新のタイミングで突然死します。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
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
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    突然死した方は管理者まで直接ご連絡ください。やむを得ない事情があったと判断した場合、入村制限を解除します。
                  </li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8" id="skill">
          <h3 className="text-lg font-bold mb-4">役職</h3>
          <Card className="p-6">
            <p className="mb-4">
              各役職の詳細は以下の通りです。役職によって所属陣営や能力が異なります。
            </p>

            {skills && skills.length > 0 ? (
              <SkillList skills={skills} />
            ) : (
              <p className="text-gray-500">役職情報を読み込んでいます...</p>
            )}
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">能力</h3>
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">全般</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>日付更新時に、「日付更新時の処理順」の順に能力が行使されます。</li>
                  <li>
                    行使する前に死亡していた場合、能力は行使されません。
                    <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                      <li>例：占い師が処刑された場合、占いは実行されません。</li>
                      <li>ただし、襲撃については他の襲撃能力者が生存していれば行使されます。</li>
                    </ul>
                  </li>
                  <li>対象を選択する能力の場合、日付更新時点でのセット先はランダムです。</li>
                </ul>
              </div>

              <div id="divine">
                <h4 className="font-bold mb-2">占い</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>毎晩生存者1名を選択して占い、人狼かそうでないかを知ることができます。</li>
                  <li>対象が突然死、処刑された場合も知ることができます。</li>
                  <li>
                    妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
                  </li>
                  <li>
                    日付更新時のセット先は生存者の中からランダムで選ばれます。
                    <br />
                    （ダミーキャラも2日目にランダムな占い先に占いを実行します。）
                  </li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-sm font-mono">
                          [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。
                          <br />
                          [転] 転生者 ハルトは人狼ではないようだ。
                        </p>
                      </Card>
                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-sm font-mono">
                          [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。
                          <br />
                          [転] 転生者 ハルトは人狼のようだ。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="wisedivine">
                <h4 className="font-bold mb-2">役職占い</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>毎晩生存者1名を選択して占い、役職を知ることができます。</li>
                  <li>対象が突然死、処刑された場合も知ることができます。</li>
                  <li>
                    妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
                  </li>
                  <li>
                    日付更新時のセット先は生存者の中からランダムで選ばれます。
                    <br />
                    （ダミーキャラも2日目にランダムな占い先に占いを実行します。）
                  </li>
                  <li>
                    メッセージ例
                    <div className="mt-2">
                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-sm font-mono">
                          [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。
                          <br />
                          [転] 転生者 ハルトは導師のようだ。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="psychic">
                <h4 className="font-bold mb-2">霊視</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>突然死、処刑された人が人狼かそうでないかを知ることができます。</li>
                  <li>複数死亡した場合、全員分知ることができます。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-purple-50 border-purple-200">
                        <p className="text-sm font-mono">勇者 アスベルは人狼ではないようだ。</p>
                      </Card>
                      <Card className="p-3 bg-purple-50 border-purple-200">
                        <p className="text-sm font-mono">勇者 アスベルは人狼のようだ。</p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="gurupsychic">
                <h4 className="font-bold mb-2">役職霊視</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>突然死、処刑された人の役職を知ることができます。</li>
                  <li>複数死亡した場合、全員分知ることができます。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2">
                      <Card className="p-3 bg-purple-50 border-purple-200">
                        <p className="text-sm font-mono">勇者 アスベルは狩人のようだ。</p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="autopsy">
                <h4 className="font-bold mb-2">検死</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>無惨な死体となった人物の死因を知ることができます。</li>
                  <li>複数死亡した場合、全員分知ることができます。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2">
                      <Card className="p-3 bg-purple-50 border-purple-200">
                        <p className="text-sm font-mono">勇者 アスベルの死因は呪殺死のようだ。</p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="guard">
                <h4 className="font-bold mb-2">護衛</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
                    <br />
                    （つまり、ダミーキャラの襲撃は防ぐことができません。）
                  </li>
                  <li>
                    護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
                  </li>
                  <li>日付更新時のセット先は生存者の中からランダムで選ばれます。</li>
                  <li>
                    メッセージ例（エピローグまで見えません）
                    <div className="mt-2">
                      <Card className="p-3 bg-gray-50 border-gray-200">
                        <p className="text-sm font-mono">
                          槍使い ヘンリエッタは、僧侶 セシリーを護衛している。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="wanderer_guard">
                <h4 className="font-bold mb-2">風来護衛</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>下記以外は護衛と同じです。</li>
                  <li>成功失敗にかかわらず一度護衛した人を護衛することはできません。</li>
                  <li>護衛なしを選択することができます。</li>
                </ul>
              </div>

              <div id="forcesuicide">
                <h4 className="font-bold mb-2">道連れ</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    処刑死した場合、処刑処理時点で自分へ投票した生存者から1名をランダムで道連れにします。
                  </li>
                  <li>処刑処理前に自身が死亡していた場合は処刑による道連れは発動しません。</li>
                  <li>襲撃死した場合、人狼が設定した襲撃担当者を道連れにします。</li>
                  <li>
                    襲撃処理前に襲撃者が死亡していた場合は、生存している人狼から1名をランダムで道連れにします。
                  </li>
                  <li>道連れになった対象は無惨な死体となって発見されます。（死因は呪殺死扱い）</li>
                  <li>
                    メッセージ例（エピローグまで見えません）
                    <div className="mt-2">
                      <Card className="p-3 bg-gray-50 border-gray-200">
                        <p className="text-sm font-mono">
                          [槍] 槍使い ヘンリエッタは、[僧] 僧侶 セシリーを道連れにした。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="bake">
                <h4 className="font-bold mb-2">パン焼き</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    毎日、朝を迎えた時点で1人でもこの能力を持つ人が生存していると、専用のメッセージが表示されます。
                  </li>
                  <li>この能力を持つ人が全員死亡すると、別の専用のメッセージが表示されます。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-yellow-50 border-yellow-200">
                        <p className="text-sm font-mono">
                          パン屋がおいしいパンを焼いてくれたそうです。
                        </p>
                      </Card>
                      <Card className="p-3 bg-yellow-50 border-yellow-200">
                        <p className="text-sm font-mono">
                          今日からはもうおいしいパンが食べられません。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="attack">
                <h4 className="font-bold mb-2">襲撃</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
                  <li>
                    襲撃担当者や襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
                  </li>
                  <li>1日目はダミーキャラしか襲撃対象として選択できません。</li>
                  <li>2日目以降は襲撃しないこともできます。</li>
                  <li>襲撃に失敗しても、護衛や襲撃耐性など失敗の要因を知ることはできません。</li>
                  <li>日付更新時のセット先は生存者の中からランダムで選ばれます。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-red-50 border-red-200">
                        <p className="text-sm font-mono">
                          巫女 ウズメ達は、僧侶 セシリーを襲撃した。
                        </p>
                      </Card>
                      <Card className="p-3 bg-gray-100 border-gray-300">
                        <p className="text-sm font-mono">
                          次の日の朝、以下の村人が無惨な姿で発見された。
                          <br />
                          僧侶 セシリー
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="wiseattack">
                <h4 className="font-bold mb-2">襲撃占い</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    基本的に襲撃と変わりありませんが、この能力を持つ人が生存している状態で襲撃に成功すると、襲撃対象の役職を知ることができます。
                  </li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-red-50 border-red-200">
                        <p className="text-sm font-mono">
                          巫女 ウズメ達は、僧侶 セシリーを襲撃した。
                        </p>
                      </Card>
                      <Card className="p-3 bg-red-50 border-red-200">
                        <p className="text-sm font-mono">僧侶 セシリーは狩人だったようだ。</p>
                      </Card>
                      <Card className="p-3 bg-gray-100 border-gray-300">
                        <p className="text-sm font-mono">
                          次の日の朝、以下の村人が無惨な姿で発見された。
                          <br />
                          僧侶 セシリー
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="court">
                <h4 className="font-bold mb-2">求愛</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    1日目に1人を指定し、自身と指定した人同士で恋絆を結ぶことができます。（相手にも通知されます）
                  </li>
                  <li>
                    日付更新時のセット先は生存者の中からランダムで選ばれます。
                    <br />
                    （ダミーキャラは求愛者になりえますが、求愛は実行されません。）
                  </li>
                  <li>対象なしはありません。1日目に必ず求愛対象を選択することになります。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2 space-y-2">
                      <Card className="p-3 bg-pink-50 border-pink-200">
                        <p className="text-sm font-mono">
                          [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトに求愛した。
                        </p>
                      </Card>
                      <Card className="p-3 bg-pink-50 border-pink-200">
                        <p className="text-sm font-mono">
                          [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトに求愛された。
                        </p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="hiyasichuka">
                <h4 className="font-bold mb-2">冷やし中華</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>特別な能力はありませんが、1回だけ、始まることができます。</li>
                  <li>自分を対象にセットすると、翌日に始まります。</li>
                  <li>日付更新時のセット先は「なし」です。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2">
                      <Card className="p-3 bg-gray-100 border-gray-300">
                        <p className="text-sm font-mono">[暗] 暗殺者 アシュリーは、始まった。</p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="emotion">
                <h4 className="font-bold mb-2">情緒</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>特別な能力はありませんが、何回でも終わることができます。</li>
                  <li>自分を対象にセットすると、翌日に終わります。</li>
                  <li>日付更新時のセット先は「なし」です。</li>
                  <li>
                    メッセージ例
                    <div className="mt-2">
                      <Card className="p-3 bg-gray-100 border-gray-300">
                        <p className="text-sm font-mono">[暗] 暗殺者 アシュリーは、終わった。</p>
                      </Card>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">ステータス</h3>
          <Card className="p-6">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                恋絆
                <ul className="mt-2 ml-6 space-y-2 list-disc list-inside">
                  <li>恋絆を結んだ先の人が死亡すると、自身も後追死します。</li>
                  <li>恋絆が付与されている人同士にしか聞こえない恋人発言が可能です。</li>
                  <li>
                    Bさんへの恋絆がAさんに付与されていて、Aさんへの恋絆がBさんに付与されていない場合、Bさんは後追死しませんし、Bさんは恋人会話を使用することもできません。（いわゆる片想い状態）
                  </li>
                  <li>自身の役職にかかわらず、勝利条件が恋人陣営に上書きされます。</li>
                  <li className="mt-2">
                    <div className="p-3 border rounded-md bg-gray-50">
                      <div className="font-mono text-sm">
                        村長 ヴァルターは、絆に引きずられるように農夫 ヤコブの後を追った。
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">勝敗判定</h3>
          <div className="mb-4">
            <h4 className="font-bold mb-2">エピローグ遷移条件</h4>
            <Card className="p-6">
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  以下のいずれかを満たすとエピローグを迎え、勝敗判定が行われます。
                  <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                    <li>夜明け時点で生存している人狼カウント数≧生存している人間カウント数</li>
                    <li>
                      夜明け時点で生存している人狼カウント数が0人かつ生存している人間カウント数が1人以上
                    </li>
                  </ul>
                </li>
                <li>
                  「人間」「人狼」どちらにカウントされるかは能力欄の「勝敗判定カウント」を参照してください。
                  <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                    <li>「勝敗判定カウント」が「-」の場合はどちらにもカウントされません。</li>
                  </ul>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mb-4">
            <h4 className="font-bold mb-2">個人ごとの勝敗判定</h4>
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">前提</th>
                      <th className="border border-gray-300 p-2 text-left">勝利条件</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        ステータス「恋絆」が付与されている
                      </td>
                      <td className="border border-gray-300 p-2">恋人陣営の勝利</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">それ以外</td>
                      <td className="border border-gray-300 p-2">役職が属する陣営の勝利</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="mb-4">
            <h4 className="font-bold mb-2">陣営の勝敗判定</h4>
            <Card className="p-6">
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">陣営</th>
                      <th className="border border-gray-300 p-2 text-left">勝利条件</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">恋人陣営</td>
                      <td className="border border-gray-300 p-2">
                        恋人陣営または恋絆がついた人が1名以上生存
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">狐陣営</td>
                      <td className="border border-gray-300 p-2">妖狐系役職が1名以上生存</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">人狼陣営</td>
                      <td className="border border-gray-300 p-2">
                        夜明け時点で生存している人狼カウント数 ≧ 生存している人間カウント数
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">村人陣営</td>
                      <td className="border border-gray-300 p-2">
                        夜明け時点で生存している人狼カウント数が0人かつ生存している人間カウント数が1人以上
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="list-disc list-inside">
                <li>同時に条件を満たした場合、上にあるものが優先されます。</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">文字装飾</h3>
          <Card className="p-6">
            <ul className="space-y-4 list-disc list-inside">
              <li>
                [[#ff0000]]文字列[[/#]]で文字に色をつけられます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[#ff0000]]文字列[[/#]] → <span style={{ color: '#ff0000' }}>文字列</span>
                  </li>
                </ul>
              </li>
              <li>
                [[large]]文字列[[/large]]で文字を大きくできます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[large]]文字列[[/large]] → <span style={{ fontSize: '16px' }}>文字列</span>
                  </li>
                </ul>
              </li>
              <li>
                [[small]]文字列[[/small]]で文字を小さくできます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[small]]文字列[[/small]] → <span style={{ fontSize: '10px' }}>文字列</span>
                  </li>
                </ul>
              </li>
              <li>
                [[b]]文字列[[/b]]で文字を太くできます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[b]]文字列[[/b]] → <strong>文字列</strong>
                  </li>
                </ul>
              </li>
              <li>
                [[s]]文字列[[/s]]で文字に打ち消し線をつけられます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[s]]文字列[[/s]] →{' '}
                    <span style={{ textDecoration: 'line-through' }}>文字列</span>
                  </li>
                </ul>
              </li>
              <li>
                [[ruby]]文字列[[rt]]ルビ[[/rt]][[/ruby]]でルビを振れます。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[ruby]]文字列[[rt]]ルビ[[/rt]][[/ruby]] →{' '}
                    <ruby>
                      文字列<rt>ルビ</rt>
                    </ruby>
                  </li>
                </ul>
              </li>
              <li>
                [[cw]]文字列[[/cw]]で文字を隠せます（クリックで除去できます）。
                <ul className="mt-2 ml-6 space-y-1 list-disc list-inside">
                  <li>
                    [[cw]]文字列[[/cw]] →{' '}
                    <ClickToReveal className="bg-gray-300 cursor-pointer hover:bg-gray-200 px-1 rounded">
                      文字列
                    </ClickToReveal>
                  </li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">その他</h3>
          <Card className="p-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                発言時に「@国主」もしくは「＠国主」をつけて発言すると管理人に通知されます。対応が必要な際にご活用ください。
              </li>
              <li>Twitterでの連絡のほうが反応は早めです。</li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  )
}
