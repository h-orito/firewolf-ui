<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-2xl">キャラチップ一覧</p>
    </div>
    <div class="grid grid-cols-1">
      <SpotlightButton to="/charachip-list">
        <Icon name="fa6-solid:image" class="mt-0.5 mr-2" />
        <strong>キャラチップ一覧</strong>
      </SpotlightButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpotlightButton from './SpotlightButton.vue'
</script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}
</style>
