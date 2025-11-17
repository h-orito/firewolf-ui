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
import type { Chara, CharaFace, CharaSize, CharaName } from '~/lib/api/types'

// APIから返却される deep readonly な Chara 型も受け入れる
type ReadonlyDeepChara = {
  readonly id: number
  readonly chara_name: Readonly<CharaName>
  readonly charachip_id: number
  readonly default_message: {
    readonly join_message?: string
    readonly first_day_message?: string
  }
  readonly display: Readonly<CharaSize>
  readonly face_list: readonly Readonly<CharaFace>[]
}

interface Props {
  chara: Chara | ReadonlyDeepChara
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
  const face = (props.chara.face_list as readonly CharaFace[]).find(
    (face: CharaFace) => face.type === props.faceType
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
