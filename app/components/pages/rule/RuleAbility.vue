<template>
  <div>
    <h4 class="mt-4 mb-2 font-bold"><strong>全般</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>日付更新時に、「日付更新時の処理順」の順に能力が行使されます。</li>
        <li>
          行使する前に死亡していた場合、能力は行使されません。
          <ul class="my-2 ml-6 list-disc">
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

    <h4 id="divine" class="mt-4 mb-2 font-bold"><strong>占い</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
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
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="privateSeerMessage1"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="privateSeerMessage2"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="wisedivine" class="mt-4 mb-2 font-bold">
      <strong>役職占い</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>毎晩生存者1名を選択して占い、役職を知ることができます。</li>
        <li>対象が突然死、処刑された場合も知ることができます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。<br />（ダミーキャラも2日目にランダムな占い先に占いを実行します。）
        </li>
        <li>
          メッセージ例
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="privateWiseSeerMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="psychic" class="mt-4 mb-2 font-bold"><strong>霊視</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>突然死、処刑された人が人狼かそうでないかを知ることができます。</li>
        <li>複数死亡した場合、全員分知ることができます。</li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="privatePsychicMessage1"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="privatePsychicMessage2"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="gurupsychic" class="mt-4 mb-2 font-bold">
      <strong>役職霊視</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>突然死、処刑された人の役職を知ることができます。</li>
        <li>複数死亡した場合、全員分知ることができます。</li>
        <li>
          メッセージ例
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="privateGuruPsychicMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="autopsy" class="mt-4 mb-2 font-bold"><strong>検死</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>無惨な死体となった人物の死因を知ることができます。</li>
        <li>複数死亡した場合、全員分知ることができます。</li>
        <li>
          メッセージ例
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="privateCoronerMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="guard" class="mt-4 mb-2 font-bold"><strong>護衛</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
          （つまり、ダミーキャラの襲撃は防ぐことができません。）
        </li>
        <li>
          護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
        </li>
        <li>日付更新時のセット先は生存者の中からランダムで選ばれます。</li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="privateAbilityMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="wanderer_guard" class="mt-4 mb-2 font-bold">
      <strong>風来護衛</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>下記以外は護衛と同じです。</li>
        <li>成功失敗にかかわらず一度護衛した人を護衛することはできません。</li>
        <li>護衛なしを選択することができます。</li>
      </ul>
    </div>

    <h4 id="forcesuicide" class="mt-4 mb-2 font-bold">
      <strong>道連れ</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          処刑死した場合、処刑処理時点で自分へ投票した生存者から1名をランダムで道連れにします。
        </li>
        <li>
          処刑処理前に自身が死亡していた場合は処刑による道連れは発動しません。
        </li>
        <li>襲撃死した場合、人狼が設定した襲撃担当者を道連れにします。</li>
        <li>
          襲撃処理前に襲撃者が死亡していた場合は、生存している人狼から1名をランダムで道連れにします。
        </li>
        <li>
          道連れになった対象は無惨な死体となって発見されます。（死因は呪殺死扱い）
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="publicSystemForcesuicideMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="bake" class="mt-4 mb-2 font-bold"><strong>パン焼き</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          毎日、朝を迎えた時点で1人でもこの能力を持つ人が生存していると、専用のメッセージが表示されます。
        </li>
        <li>
          この能力を持つ人が全員死亡すると、別の専用のメッセージが表示されます。
        </li>
        <li>
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="publicSystemBakeMessage1"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="publicSystemBakeMessage2"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="attack" class="mt-4 mb-2 font-bold"><strong>襲撃</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
        <li>
          襲撃担当者や襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
        </li>
        <li>1日目はダミーキャラしか襲撃対象として選択できません。</li>
        <li>2日目以降は襲撃しないこともできます。</li>
        <li>
          襲撃に失敗しても、護衛や襲撃耐性など失敗の要因を知ることはできません。
        </li>
        <li>日付更新時のセット先は生存者の中からランダムで選ばれます。</li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="privateWerewolfMessage"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="publicSystemDeadMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="wiseattack" class="mt-4 mb-2 font-bold">
      <strong>襲撃占い</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          基本的に襲撃と変わりありませんが、この能力を持つ人が生存している状態で襲撃に成功すると、襲撃対象の役職を知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="privateWerewolfMessage"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="privateWerewolfWiseMessage"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="publicSystemDeadMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="court" class="mt-4 mb-2 font-bold"><strong>求愛</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          1日目に1人を指定し、自身と指定した人同士で恋絆を結ぶことができます。（相手にも通知されます）
        </li>
        <li>
          日付更新時のセット先は生存者の中からランダムで選ばれます。<br />（ダミーキャラは求愛者になりえますが、求愛は実行されません。）
        </li>
        <li>
          対象なしはありません。1日目に必ず求愛対象を選択することになります。
        </li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <PagesVillageMessageCard
              :message="privateLoversMessage1"
              :is-progress="false"
              :village-participants="[]"
            />
            <PagesVillageMessageCard
              :message="privateLoversMessage2"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="hiyasichuka" class="mt-4 mb-2 font-bold">
      <strong>冷やし中華</strong>
    </h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>特別な能力はありませんが、1回だけ、始まることができます。</li>
        <li>自分を対象にセットすると、翌日に始まります。</li>
        <li>日付更新時のセット先は「なし」です。</li>
        <li>
          メッセージ例
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="publicSystemHiyasichukaMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>

    <h4 id="emotion" class="mt-4 mb-2 font-bold"><strong>情緒</strong></h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>特別な能力はありませんが、何回でも終わることができます。</li>
        <li>自分を対象にセットすると、翌日に終わります。</li>
        <li>日付更新時のセット先は「なし」です。</li>
        <li>
          メッセージ例
          <div class="mt-2">
            <PagesVillageMessageCard
              :message="publicSystemEmotionMessage"
              :is-progress="false"
              :village-participants="[]"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// 占いメッセージ例
const privateSeerMessage1: MessageView = {
  time: {
    village_day_id: 1,
    day: 1,
    datetime: '2024-01-01 00:00:00',
    unix_time_milli: 1704067200000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_SEER,
      name: '白黒占い結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは人狼ではないようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

const privateSeerMessage2: MessageView = {
  time: {
    village_day_id: 1,
    day: 1,
    datetime: '2024-01-01 00:00:00',
    unix_time_milli: 1704067200000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_SEER,
      name: '白黒占い結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは人狼のようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 役職占いメッセージ例
const privateWiseSeerMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 1,
    datetime: '2024-01-01 00:00:00',
    unix_time_milli: 1704067200000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_WISE,
      name: '役職占い結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。\n[転] 転生者 ハルトは導師のようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 役職霊視メッセージ例
const privateGuruPsychicMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_GURU,
      name: '役職霊視結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '勇者 アスベルは狩人のようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 検死メッセージ例
const privateCoronerMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_CORONER,
      name: '検死結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '勇者 アスベルの死因は呪殺死のようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 霊視メッセージ例
const privatePsychicMessage1: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_PSYCHIC,
      name: '白黒霊視結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '勇者 アスベルは人狼ではないようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

const privatePsychicMessage2: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_PSYCHIC,
      name: '白黒霊視結果',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '勇者 アスベルは人狼のようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 護衛メッセージ例
const privateAbilityMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_ABILITY,
      name: '能力行使',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '槍使い ヘンリエッタは、僧侶 セシリーを護衛している。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 道連れメッセージ例
const publicSystemForcesuicideMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[槍] 槍使い ヘンリエッタは、[僧] 僧侶 セシリーを道連れにした。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 襲撃メッセージ例
const privateWerewolfMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_WEREWOLF,
      name: '人狼の囁き',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '巫女 ウズメ達は、僧侶 セシリーを襲撃した。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

const publicSystemDeadMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 3,
    datetime: '2024-01-03 00:00:00',
    unix_time_milli: 1704240000000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '次の日の朝、以下の村人が無惨な姿で発見された。\n僧侶 セシリー',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// パン焼きメッセージ例
const publicSystemBakeMessage1: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: 'パン屋がおいしいパンを焼いてくれたそうです。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

const publicSystemBakeMessage2: MessageView = {
  time: {
    village_day_id: 1,
    day: 3,
    datetime: '2024-01-03 00:00:00',
    unix_time_milli: 1704240000000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '今日からはもうおいしいパンが食べられません。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 襲撃占いメッセージ例
const privateWerewolfWiseMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_WEREWOLF,
      name: '人狼の囁き',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '僧侶 セシリーは狩人だったようだ。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 冷やし中華メッセージ例
const publicSystemHiyasichukaMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、始まった。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 情緒メッセージ例
const publicSystemEmotionMessage: MessageView = {
  time: {
    village_day_id: 1,
    day: 2,
    datetime: '2024-01-02 00:00:00',
    unix_time_milli: 1704153600000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PUBLIC_SYSTEM,
      name: '公開システムメッセージ',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、終わった。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

// 求愛メッセージ例
const privateLoversMessage1: MessageView = {
  time: {
    village_day_id: 1,
    day: 1,
    datetime: '2024-01-01 00:00:00',
    unix_time_milli: 1704067200000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_LOVERS,
      name: '恋人の囁き',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトに求愛した。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}

const privateLoversMessage2: MessageView = {
  time: {
    village_day_id: 1,
    day: 1,
    datetime: '2024-01-01 00:00:00',
    unix_time_milli: 1704067200000
  },
  content: {
    type: {
      code: MESSAGE_TYPE.PRIVATE_LOVERS,
      name: '恋人の囁き',
      is_say_type: false,
      is_owl_viewable_type: false
    },
    text: '[暗] 暗殺者 アシュリーは、[転] 転生者 ハルトに求愛された。',
    num: 0,
    count: undefined,
    face_code: undefined
  }
}
</script>
