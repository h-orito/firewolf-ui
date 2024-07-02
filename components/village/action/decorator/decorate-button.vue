<template>
  <b-button type="is-secondary" size="is-small" @click="$emit('click')">
    <slot />
  </b-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class MessageDecorators extends Vue {}
</script>

<style lang="scss" scoped>
.dark-theme {
  .button {
    border: 1px solid $primary-dark;
    background-color: transparent;
    color: $primary-dark;

    &.is-secondary {
      background-color: transparent;
      color: $white;
    }
  }
}
</style>

<style lang="scss"></style>
