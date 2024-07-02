<!-- eslint-disable vue/valid-template-root -->
<template>
  <slot></slot>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class VFragment extends Vue {}
</script>
