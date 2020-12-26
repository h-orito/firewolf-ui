<template>
  <div class="has-text-left">
    <p class="m-b-10">
      {{
        isCommitting
          ? 'あなたは時短希望しています。'
          : 'あなたは時短希望していません。'
      }}
    </p>
    <b-button
      @click="commit"
      type="is-primary"
      size="is-small"
      :disabled="submitting"
      expanded
    >
      {{ isCommitting ? '時短希望を取り消す' : '時短希望する' }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'

@Component({
  components: {}
})
export default class Vote extends Vue {
  private submitting: boolean = false

  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get isCommitting(): boolean {
    return this.situation.commit.committing
  }

  private async commit(): Promise<void> {
    this.submitting = true
    await api.postCommit(
      this,
      this.villageId,
      !this.situation.commit.committing
    )
    this.submitting = false
    toast.success(
      this,
      this.isCommitting ? '時短希望を取り消しました' : '時短希望しました'
    )
    this.$emit('reload')
  }
}
</script>
