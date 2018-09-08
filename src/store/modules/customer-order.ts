import { InfoCompontentType } from "~/config/enum.config";
import { DialogService } from "~/utils/dialog.service";
const CreateOrderCustomerInfo = () => import("~/components/base-data/order-customer-info.vue")

export default {
  namespaced: true,
  state: {
    currentComponent: "",
    customerId: "",
    orderId: "",
    orderType: "",
    /**
     * 是否开启可以编辑页面数据
     */
    edit: false,
    /**
     * 是否进件页面,会在edit模式下对验证规格进行修改
     */
    isApply: false
  },
  mutations: {
    /**
     * 更新客户信息
     * @param state 
     * @param name 组件名称
     * @param customerId 客户ID
     */
    updateCustomerInfo(state, { name, customerId, enabledEdit, isApply }) {
      state.currentComponent = name
      state.customerId = customerId
      state.edit = enabledEdit
      state.isApply = isApply
    },
    /**
     * 更新订单信息
     * @param state 
     * @param name 组件名称
     * @param customerId 订单ID
     */
    updateOrderInfo(state, { name, orderId, orderType }) {
      state.currentComponent = name
      state.orderId = orderId
      state.orderType = orderType
    },
    /**
     * 重置数据
     * @param state 
     */
    resetData(state) {
      state.currentComponent = ""
      state.customerId = ""
      state.orderId = ""
      state.edit = false
      state.isApply = false
    }
  },
  getters: {
    /**
     * 详情页面可选信息列表
     */
    componentNameList(): Array<{ name: string, title: string, type: InfoCompontentType }> {
      return [
        { name: "CustomerInfo", title: "客户详情", type: InfoCompontentType.CUSTOMER },
        { name: "OrderInfo", title: "订单详情", type: InfoCompontentType.ORDER },
      ]
    }
  },
  actions: {
    /**
     * 显示客户信息页面
     * @param param0 
     * @param customer 客户信息页面配置
     */
    async showCustomerInfo({ state, commit, getters, dispatch }, customer: { id: number, enabledEdit?: boolean, isApply?: boolean, callBack?: () => void }) {
      let current = getters.componentNameList.find(x => x.type === InfoCompontentType.CUSTOMER)
      if (!state.currentComponent) await dispatch('showModalInfo', { callBack: customer.callBack })
      commit('updateCustomerInfo', { name: current.name, customerId: customer.id, enabledEdit: customer.enabledEdit || false, isApply: customer.isApply || false, callBack: customer.callBack })
    },
    /**
     * 显示订单详情信息页面
     * @param param0 
     * @param orderId 
     */
    async showOrderInfo({ state, commit, getters, dispatch }, order: { id: number, orderType: number, callBack?: () => void }) {
      let current = getters.componentNameList.find(x => x.type === InfoCompontentType.ORDER)
      if (!state.currentComponent) await dispatch('showModalInfo', { callBack: order.callBack })
      commit('updateOrderInfo', { name: current.name, orderId: order.id, orderType: order.orderType})
    },
    /**
     * 显示订单 /  客户详情信息
     * Bad idea 功能性操作还是最好再页面控制。公共区域操作会带来很多无赖的判断
     */
    showModalInfo({ commit }, { callBack }) {
      CreateOrderCustomerInfo().then(({ default: component }) => {
        DialogService.show({
          width: 1050,
          onRemove: () => {
            commit('resetData')
            if (callBack) {
              callBack()
            }
          },
          render: h => h(component)
        })
      })
    }
  }
}