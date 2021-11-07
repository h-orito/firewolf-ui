<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">村作成確認</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="param">
        <div class="content">
          <b-table
            :data="settings"
            ref="table"
            detailed
            :show-detail-icon="false"
            :mobile-cards="false"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="設定">
                <template>
                  {{ props.row.name }}
                  <a v-if="props.row.description" @click="toggle(props.row)">
                    <b-icon
                      pack="fas"
                      icon="question-circle"
                      size="is-small"
                    ></b-icon>
                  </a>
                </template>
              </b-table-column>

              <b-table-column
                field="value"
                label=""
                v-html="props.row.value.replace(/\n/g, '<br />')"
              />
            </template>

            <template slot="detail" slot-scope="props">
              <p v-html="props.row.description.replace(/\n/g, '<br />')"></p>
            </template>
          </b-table>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          戻る
        </b-button>
        <b-button
          type="is-primary"
          size="is-small"
          @click="create"
          :disabled="submitting"
        >
          {{ saveLabel }}
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import VillageTime from '~/components/type/village-time'
import Chara from '~/components/type/chara'
import { VILLAGE_STATUS, MESSAGE_TYPE } from '~/components/const/consts'

interface Settings {
  name: string
  value: string
  description?: string | null
}

@Component({
  components: {}
})
export default class ModalVillageInfo extends Vue {
  @Prop({ type: Object })
  private param!: any

  @Prop({ type: String })
  private charachipName!: string

  @Prop({ type: String })
  private dummyCharaName!: string

  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: String })
  private saveLabel!: string

  private submitting: boolean = false

  private messageNameMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, '通常発言'],
    [MESSAGE_TYPE.WEREWOLF_SAY, '人狼の囁き'],
    [MESSAGE_TYPE.SYMPATHIZE_SAY, '共鳴発言'],
    [MESSAGE_TYPE.MONOLOGUE_SAY, '独り言'],
    [MESSAGE_TYPE.GRAVE_SAY, '死者の呻き'],
    [MESSAGE_TYPE.SPECTATE_SAY, '見学発言'],
    [MESSAGE_TYPE.ACTION, 'アクション']
  ])

  private get settings(): Settings[] {
    if (!this.param) return []
    const settings: Settings[] = []

    settings.push({
      name: '村名',
      value: this.param.village_name
    })
    this.addCapacitySetting(settings)
    this.addTimeSetting(settings)
    this.addCharachipSetting(settings)
    this.addOrganizationSetting(settings)
    this.addRuleSetting(settings)
    this.addPasswordSetting(settings)
    this.addRpSetting(settings)

    return settings
  }

  private toggle(row: any): void {
    ;(this.$refs as any).table.toggleDetails(row)
  }

  private close(): void {
    this.$emit('close')
  }

  // 設定用
  private addCapacitySetting(settings: Settings[]): void {
    if (!this.param) return
    const org = this.param.setting.organization.organization
    const min = org
      .split('\n')
      .map(o => o.length)
      .reduce((a, b) => (a < b ? a : b))
    const max = org
      .split('\n')
      .map(o => o.length)
      .reduce((a, b) => (a > b ? a : b))
    settings.push({
      name: '最低人数',
      value: `${min}人`,
      description:
        '開始予定日時時点でこの人数が集まると進行中に遷移します（集まらなければ廃村となります）。\nダミーを含む人数です。'
    })
    settings.push({
      name: '最大人数',
      value: `${max}人`,
      description:
        'この人数まで参加することができます。\nダミーを含む人数です。'
    })
  }

  private addTimeSetting(settings: Settings[]): void {
    if (!this.param) return
    // @ts-ignore
    const start = this.$dayjs(
      this.param.setting.time.start_datetime.replace('T', ' ')
    ).format('YYYY-MM-DD HH:mm')
    settings.push({
      name: '開始日時',
      value: start
    })
    settings.push({
      name: '更新間隔',
      value: '24時間',
      description: '実際にこの時間が経過すると村の1日が進行します。'
    })
    const silentHoursStr = this.param.setting.time.silent_hours
    const silentHours =
      !silentHoursStr || parseInt(silentHoursStr) === 0
        ? 'なし'
        : `${parseInt(silentHoursStr)}時間`
    settings.push({
      name: '更新後沈黙時間',
      value: silentHours,
      description:
        '進行中の更新後に通常発言が不可能になる時間です。\nなしの場合はいつでも発言できます。\n通常発言以外（独り言や死者の呻き、人狼の囁き等）はいつでも発言できます。'
    })
  }

  private addCharachipSetting(settings: Settings[]): void {
    if (!this.charachipName || this.charachipName === '') {
      return
    }
    settings.push({
      name: 'キャラチップ',
      value: this.charachipName
    })
    settings.push({
      name: 'ダミーキャラ',
      value: this.dummyCharaName,
      description:
        '最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。'
    })
  }

  private addOrganizationSetting(settings: Settings[]): void {
    const org = this.param.setting.organization.organization
      .split('\n')
      .map(line => {
        return `${line.length}人：${line}`
      })
      .join('\n')
    settings.push({
      name: '編成',
      value: org,
      description: '人数に応じた配役です。役職詳細は仕様ページを参照ください。'
    })
  }

  private addRuleSetting(settings: Settings[]): void {
    const rules = this.param.setting.rule
    // 投票
    settings.push({
      name: '投票',
      value: rules.open_vote ? '記名投票' : '無記名投票',
      description:
        '「記名投票」の場合、処刑の投票結果について、誰が誰に投票したかがわかります。\n「無記名投票」の場合、誰に何票入ったかのみがわかります。'
    })
    // 役職希望
    settings.push({
      name: '役職希望',
      value: rules.available_skill_request ? '有効' : '無効',
      description:
        '「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。'
    })
    // 見学
    settings.push({
      name: '見学',
      value: rules.available_spectate ? '可能' : '不可',
      description:
        '「可能」の場合、見学者として参加できます。\n見学者は死亡した人とのみ会話することができます（プロローグとエピローグでは全員と会話できます）。'
    })
    // 突然死
    settings.push({
      name: '突然死',
      value: rules.available_suddenly_death ? 'あり' : 'なし',
      description:
        '「あり」の場合、日付更新のタイミングで、前日に一度も通常発言をしなかった生存者が突然死します。'
    })
    // 時短希望
    settings.push({
      name: '時短希望',
      value: rules.available_commit ? 'あり' : 'なし',
      description:
        '「あり」の場合、生存者全員が時短を希望すると、日付が更新されます。\n時短により余った時間は翌日に繰り越されます。'
    })
    // 発言制限
    const restricts = rules.restrict_list
      .map(restrict => {
        return `${this.messageNameMap.get(restrict.type)}: 1発言ごとに${
          restrict.length
        }文字、1日に${restrict.count}回まで`
      })
      .join('\n')
    settings.push({
      name: '発言制限',
      value: restricts,
      description:
        '発言文字数や発言回数の制限です。\n記載がない発言種別は1発言ごとに200文字20行で、1日の回数は無制限となります。'
    })
    // ダミー役欠け
    settings.push({
      name: 'ダミー役欠け',
      value: rules.available_dummy_skill ? 'あり' : 'なし',
      description:
        '「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。'
    })
  }

  private addPasswordSetting(settings: Settings[]): void {
    settings.push({
      name: '入村パスワード',
      value:
        this.param.setting.rule.join_password != null &&
        this.param.setting.rule.join_password.length > 0
          ? this.param.setting.rule.join_password
          : 'なし',
      description:
        '「あり」の場合、参加する際にパスワード入力が必要になります。'
    })
  }

  private addRpSetting(settings: Settings[]): void {
    const rules = this.param.setting.rule
    // アクション
    settings.push({
      name: 'アクション',
      value: rules.available_action ? 'あり' : 'なし',
      description: '「あり」の場合、アクション発言が可能です。'
    })
  }

  private async create(): Promise<void> {
    this.submitting = true
    await this.$emit('create')
    this.submitting = false
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
  font-family: sans-serif;
}
</style>
