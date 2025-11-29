<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-xl md:text-2xl">
        FIREWOLFは<br />長期人狼が無料で遊べるサービスです
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <SpotlightButton to="/about">
        <Icon name="book" class="mt-0.5 mr-2" />
        <strong>このサイトは</strong>
      </SpotlightButton>
      <SpotlightButton to="/rule">
        <Icon name="book" class="mt-0.5 mr-2" />
        <strong>ルール</strong>
      </SpotlightButton>
      <SpotlightButton to="/faq">
        <Icon name="circle-question" class="mt-0.5 mr-2" />
        <strong>よくある質問</strong>
      </SpotlightButton>
      <SpotlightButton to="/release-note">
        <Icon name="wrench" class="mt-0.5 mr-2" />
        <strong>更新情報</strong>
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
