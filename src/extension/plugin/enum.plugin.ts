import Vue from 'vue'
import * as enumConfig from '~/config/enum.config'

export default {
  install() {
    Vue.prototype.$enum = enumConfig
  }
}
