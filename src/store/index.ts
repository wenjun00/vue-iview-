import Vue from 'vue'
import Vuex from 'vuex'

import state from '~/store/state'
import mutations from '~/store/mutations'
import actions from '~/store/actions'
import getters from '~/store/getters'

import workspace from '~/store/modules/workspace'
import purchase from '~/store/modules/purchase'
import mortgage from '~/store/modules/mortgage'
import organization from "~/store/modules/organization";
import cars from "~/store/modules/cars";
import customerAndOrder from "~/store/modules/customer-order";

import injector from 'vue-inject';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const filterList = ['ready']

const store = new Vuex.Store({
  modules: {
    workspace: workspace,
    purchase: purchase,
    mortgage: mortgage,
    orgSpace: organization,
    carSpace: cars,
    customerOrderSpace: customerAndOrder
  },
  state,
  getters,
  mutations,
  actions,
  plugins: [
    // 持久化存储插件
    createPersistedState({
      key: "vuex",
      reducer: (state, paths) => {
        return Object.assign({}, state, { ready: false })
      },
      storage: localStorage,
      filter: ({ type, payload }) => {
        return !filterList.includes(type)
      }
    })
  ]
})

export default store
