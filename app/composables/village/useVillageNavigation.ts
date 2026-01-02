/**
 * 村ページ内のスクロール処理
 */
export const useVillageNavigation = () => {
  /**
   * コンテナ内で要素にスクロール（要素が画面上部に来る）
   */
  const scrollInContainer = (container: HTMLElement, target: HTMLElement) => {
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    // コンテナの現在のスクロール位置 + ターゲットの相対位置
    const scrollTop = container.scrollTop + (targetRect.top - containerRect.top)

    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  }

  /**
   * ページ最上部にスクロール
   */
  const scrollToTop = (
    containerSelector: string = '#village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    container.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * ページ最下部にスクロール
   */
  const scrollToBottom = (
    containerSelector: string = '#village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const element = document.getElementById('message-bottom')
    if (!element) {
      // message-bottomが見つからない場合はコンテナの最下部へ
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
      return
    }

    // message-bottomが画面下部に来るようにスクロール
    const containerRect = container.getBoundingClientRect()
    const targetRect = element.getBoundingClientRect()
    const scrollTop =
      container.scrollTop + (targetRect.bottom - containerRect.bottom)

    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  }

  /**
   * 特定の要素にスクロール
   */
  const scrollToElement = (
    elementId: string,
    containerSelector: string = '.village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const element = document.getElementById(elementId)
    if (!element) return

    scrollInContainer(container as HTMLElement, element)
  }

  return {
    scrollToTop,
    scrollToBottom,
    scrollToElement
  }
}
