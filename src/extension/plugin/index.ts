import Vue from 'vue'

import cityPlugin from '~/extension/plugin/city.plugin'
import dictPlugin from '~/extension/plugin/dict.plugin'
import filterPlugin from '~/extension/plugin/filter.plugin'
import commonPlugin from '~/extension/plugin/common.plugin'
import validatorPlugin from '~/extension/plugin/validator.plugin'
import dialogPlugin from '~/extension/plugin/dialog.plugin'
import enumPlugin from '~/extension/plugin/enum.plugin'

export default ({ store }) => ({
  cityPlugin,
  dictPlugin,
  filterPlugin,
  commonPlugin,
  validatorPlugin,
  dialogPlugin,
  enumPlugin
})
