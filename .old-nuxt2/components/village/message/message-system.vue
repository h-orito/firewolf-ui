<template functional>
  <div
    class="card-content m-b-5"
    :class="[
      props.message.message_class,
      props.isDarkTheme ? 'dark-theme' : ''
    ]"
  >
    <div class="content has-text-left">
      <p class="hw-message-text" v-html="props.message.message_text"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { SystemMessage } from '~/components/village/message/message-converter'

@Component({})
export default class SystemMessageV extends Vue {
  @Prop({ type: Object })
  private message!: SystemMessage

  @Prop({ type: Boolean })
  private isDarkTheme!: boolean
}
</script>

<style lang="scss" scoped>
.card-content {
  padding: 10px !important;
  font-family: sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;

  .hw-message-text {
    word-break: break-word;
    white-space: pre-wrap;
  }

  &.dark-theme {
    border: 1px solid $white;
    color: $white;
  }
  &:not(.dark-theme) {
    color: $black;
  }

  &.message-system-private {
    border: 1px solid $private-system-border;
    background-color: $private-system-bg;

    &.dark-theme {
      background-color: $private-system-bg-dark;
    }
  }
  &.message-system-private-ability {
    border: 1px solid $private-system-border;
    background-color: $private-system-bg;

    &.dark-theme {
      background-color: $private-system-bg-dark;
    }
  }
  &.message-system-private-seer {
    border: 1px solid $seer-system-border;
    background-color: $seer-system-bg;

    &.dark-theme {
      background-color: $seer-system-bg-dark;
    }
  }
  &.message-system-private-psychic {
    border: 1px solid $psychic-system-border;
    background-color: $psychic-system-bg;

    &.dark-theme {
      background-color: $psychic-system-bg-dark;
    }
  }
  &.message-system-private-werewolf {
    border: 1px solid $werewolf-system-border;
    background-color: $werewolf-system-bg;

    &.dark-theme {
      background-color: $werewolf-system-bg-dark;
    }
  }
  &.message-system-private-mason {
    border: 1px solid $mason-system-border;
    background-color: $mason-system-bg;

    &.dark-theme {
      background-color: $mason-system-bg-dark;
    }
  }
  &.message-system-private-lovers {
    border: 1px solid $lovers-system-border;
    background-color: $lovers-system-bg;

    &.dark-theme {
      background-color: $lovers-system-bg-dark;
    }
  }
  &.message-system-private-fox {
    border: 1px solid $fox-system-border;
    background-color: $fox-system-bg;

    &.dark-theme {
      border: 1px solid $fox-system-border-dark;
      background-color: $fox-system-bg-dark;
    }
  }
  &.message-system-creator {
    border: 1px solid $creator-say-border;
    background-color: $creator-say-bg;

    &.dark-theme {
      background-color: $creator-say-bg-dark;
    }
  }
}
</style>
