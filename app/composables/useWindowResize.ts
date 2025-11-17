import { useWindowSize } from '@vueuse/core'

/**
 * ウィンドウサイズを監視し、モバイル判定を提供
 */
export const useWindowResize = () => {
  // ウィンドウサイズを取得（リアクティブ）
  const { width, height } = useWindowSize()

  // モバイル判定（768px未満）
  const isMobile = computed(() => width.value < 768)

  return {
    width: readonly(width),
    height: readonly(height),
    isMobile: readonly(isMobile)
  }
}
