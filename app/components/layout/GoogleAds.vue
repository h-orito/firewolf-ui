<template>
  <div />
</template>

<script setup lang="ts">
// Environment check
const isProduction = computed(() => {
  return process.env.NODE_ENV === 'production'
})

// Load Google Ads script when component mounts in production
onMounted(() => {
  if (isProduction.value && import.meta.client) {
    const script = document.createElement('script')
    script.async = true
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    script.setAttribute('data-ad-client', 'ca-pub-0917187897820609')
    document.head.appendChild(script)
  }
})
</script>
