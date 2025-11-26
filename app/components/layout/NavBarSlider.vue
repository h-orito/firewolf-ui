<template>
  <div>
    <!-- Side menu -->
    <div class="navbar-side-menu" :class="{ 'is-active': isMenuExpanded }">
      <!-- Menu items -->
      <div class="mt-10 space-y-1">
        <NuxtLink
          to="/"
          class="navbar-item block rounded px-3 py-2 text-white transition-colors hover:bg-gray-700"
          @click="$emit('hide-menu')"
        >
          トップページ
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="navbar-item block rounded px-3 py-2 text-white transition-colors hover:bg-gray-700"
          @click="$emit('hide-menu')"
        >
          このサイトは
        </NuxtLink>
        <NuxtLink
          to="/rule"
          class="navbar-item block rounded px-3 py-2 text-white transition-colors hover:bg-gray-700"
          @click="$emit('hide-menu')"
        >
          ルール
        </NuxtLink>
        <NuxtLink
          to="/faq"
          class="navbar-item block rounded px-3 py-2 text-white transition-colors hover:bg-gray-700"
          @click="$emit('hide-menu')"
        >
          よくある質問
        </NuxtLink>
        <NuxtLink
          to="/release-note"
          class="navbar-item block rounded px-3 py-2 text-white transition-colors hover:bg-gray-700"
          @click="$emit('hide-menu')"
        >
          更新情報
        </NuxtLink>
      </div>

      <!-- Close button -->
      <div class="close-icon">
        <UiButton
          color="secondary"
          variant="solid"
          icon="i-lucide-x"
          size="sm"
          @click="$emit('hide-menu')"
        />
      </div>
    </div>

    <!-- Backdrop overlay -->
    <div
      class="navbar-side-menu-outside"
      :class="{ 'is-active': isMenuExpanded }"
      @click="$emit('hide-menu')"
    />
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  isMenuExpanded: boolean
}

defineProps<Props>()

defineEmits<{
  'hide-menu': []
}>()
</script>

<style scoped>
.navbar-side-menu {
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgb(54, 54, 54); /* $dark equivalent */
  height: 100vh;
  width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 200ms ease;
  z-index: 1000;
}

.navbar-side-menu.is-active {
  width: 300px;
  padding: 10px;
}

.navbar-item {
  color: white;
  text-decoration: none;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}

.navbar-side-menu-outside {
  display: none;
  position: fixed;
  right: 0;
  top: 0;
  background-color: rgba(54, 54, 54, 0.4);
  height: 100vh;
  width: calc(100% - 300px);
  z-index: 999;
}

.navbar-side-menu-outside.is-active {
  display: block;
}
</style>
