import Vue from 'vue'
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from 'vee-validate'
import { required, max, min } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'
import * as CustomRules from '~/components/create-village/form/organization-rules'

// 必要なルールのみインポート
extend('required', required)
extend('max', max)
extend('min', min)

for (const rule in CustomRules) {
  extend(rule, CustomRules[rule])
}

// メッセージを設定
localize('ja', ja)

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
