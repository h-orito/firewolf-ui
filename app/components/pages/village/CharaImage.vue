<template>
  <img
    :src="charaImageUrl"
    :alt="`${chara.chara_name.name}の表情: ${faceType}`"
    :width="imageWidth"
    :height="imageHeight"
    class="rounded-md align-bottom"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import type { CharaView } from '~/lib/api/types'

interface Props {
  chara: CharaView
  faceType?: string
  isSmall?: boolean
  isLarge?: boolean
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  faceType: 'NORMAL',
  isSmall: false,
  isLarge: false,
  width: undefined,
  height: undefined
})

const charaImageUrl = computed(() => {
  const face = props.chara.face_list.find(
    (face) => face.type === props.faceType
  )
  return face?.image_url || ''
})

const imageWidth = computed(() => {
  // propsで直接指定されていればそれを使用
  if (props.width) return props.width

  const baseWidth = props.chara.display.width
  const multiplier = props.isLarge ? 1.5 : 1
  const divider = props.isSmall ? 2 : 1
  return Math.round((baseWidth * multiplier) / divider)
})

const imageHeight = computed(() => {
  // propsで直接指定されていればそれを使用
  if (props.height) return props.height

  const baseHeight = props.chara.display.height
  const multiplier = props.isLarge ? 1.5 : 1
  const divider = props.isSmall ? 2 : 1
  return Math.round((baseHeight * multiplier) / divider)
})
</script>
