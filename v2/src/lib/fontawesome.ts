// Font Awesome アイコンライブラリの設定
import { library } from '@fortawesome/fontawesome-svg-core'
import { config } from '@fortawesome/fontawesome-svg-core'

// CSS の自動挿入を無効化（Next.js では手動で CSS を import）
config.autoAddCss = false

// よく使用するアイコンをライブラリに追加
import {
  faUser,
  faHome,
  faList,
  faSignInAlt,
  faSignOutAlt,
  faCog,
  faInfoCircle,
  faQuestionCircle,
  faEnvelope,
  faCalendarAlt,
  faClock,
  faUsers,
  faSearch,
  faFilter,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt,
  faBars,
  faTimes,
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
  faPlus,
  faMinus,
  faCheck,
  faExclamationTriangle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'

import { faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons'

// ライブラリにアイコンを追加
library.add(
  // Solid icons
  faUser,
  faHome,
  faList,
  faSignInAlt,
  faSignOutAlt,
  faCog,
  faInfoCircle,
  faQuestionCircle,
  faEnvelope,
  faCalendarAlt,
  faClock,
  faUsers,
  faSearch,
  faFilter,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt,
  faBars,
  faTimes,
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
  faPlus,
  faMinus,
  faCheck,
  faExclamationTriangle,
  faSpinner,

  // Brand icons
  faTwitter,
  faGoogle
)
