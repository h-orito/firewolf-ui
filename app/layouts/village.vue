<template>
  <div class="site min-h-screen">
    <!-- Google Ads -->
    <GoogleAds />
    
    <!-- Site Content (no navbar in village layout) -->
    <div class="siteContent text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Dynamic imports for components
const GoogleAds = defineAsyncComponent(() => import('../components/layout/GoogleAds.vue'))
</script>