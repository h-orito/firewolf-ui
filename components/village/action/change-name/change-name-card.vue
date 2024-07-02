<template>
  <div>
    <action-card
      title="名前変更"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-left">
          <form-input
            rules="required|max:40"
            label-message="名前"
            input-type="text"
            max-length="40"
            place-holder-message="名前"
            :input-value.sync="participantName"
          />
          <form-input
            rules="required|max:1"
            label-message="1文字略称"
            input-type="text"
            max-length="1"
            place-holder-message="1文字略称"
            :input-value.sync="participantShortName"
          />
        </div>
        <div class="action-button-area">
          <b-button
            :disabled="!canSubmit || submitting"
            @click="changeName"
            type="is-primary"
            size="is-small"
            class="button is-primary"
            expanded
          >
            名前変更する
          </b-button>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import actionCard from '~/components/village/action/action-card.vue'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
import formInput from '~/components/common/validation/form-input.vue'

@Component({
  components: { actionCard, formInput }
})
export default class ChangeName extends Vue {
  private participantName: string = this.situation.participate.myself!
    .chara_name.name

  private participantShortName: string = this.situation.participate.myself!
    .chara_name.short_name

  private submitting = false

  private id: string = 'change-name-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  // 変更ボタンを押下できるか
  private get canSubmit(): boolean {
    return this.participantName != null && this.participantShortName != null
  }

  private async changeName(): Promise<void> {
    this.submitting = true
    try {
      await api.postChangeName(
        this,
        this.villageId,
        this.participantName!,
        this.participantShortName!
      )
      toast.success(this, '変更しました')
      this.$emit('reload')
    } catch (error) {}
    this.submitting = false
  }
}
</script>
