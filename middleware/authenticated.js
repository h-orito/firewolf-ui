import { firebaseAuth, onAuthStateChanged } from '~/plugins/firebase'

export default function({ store, route }) {
  const currentPath = route.path
  // 認証を待つ必要があるページは個別で行なっているのでここでは何もしない
  if (currentPath === '/' || currentPath === '/village') {
    return
  }
  onAuthStateChanged(firebaseAuth, user => {
    store.dispatch('LOGINOUT', {
      user
    })
  })
}
