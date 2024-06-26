<template>
  <div>
    <action-card title="投票" :id="id" :is-open="isOpen" :exists-footer="false">
      <template v-slot:content>
        <div class="content has-text-left">
          <p>現在のセット先: {{ currentTargetName }}</p>
          <p style="font-weight: 700; margin-bottom: 6px;">対象</p>
          <b-field>
            <b-select
              v-model="participantId"
              :disable="vote.target_list.length === 0"
              expanded
              size="is-small"
            >
              <option
                v-for="participant in vote.target_list"
                :value="participant.id.toString()"
                :key="participant.id.toString()"
                >{{ participant.name }}</option
              >
            </b-select>
          </b-field>
        </div>
        <div class="action-button-area">
          <b-button @click="setVote" type="is-primary" size="is-small">
            投票する
          </b-button>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageVoteSituation from '~/components/type/village-vote-situation'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'

@Component({
  components: { actionCard }
})
export default class Vote extends Vue {
  private submitting: boolean = false
  private participantId: number | null =
    this.vote.target == null ? null : this.vote.target.id

  private id: string = 'vote-aria-id'
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

  private get vote(): VillageVoteSituation {
    return this.situation.vote
  }

  private get currentTargetName(): string {
    if (!this.vote.target) return 'なし'
    return this.vote.target.name
  }

  private get canSubmit(): boolean {
    if (this.submitting) return false
    return this.vote.target_list.length !== 0 && this.participantId != null
  }

  private async setVote(): Promise<void> {
    this.submitting = true
    await api.postVote(this, this.villageId, this.participantId!)
    this.submitting = false
    toast.success(this, 'セットしました')
    this.$emit('reload')
  }

  private resetTarget(): void {
    this.participantId = this.vote.target == null ? null : this.vote.target.id
  }
}
</script>
