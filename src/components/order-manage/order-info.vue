<!--订单详情-->
<template>
  <section class="component order-info">
    <div class="left">
      <data-tree :data="orderGroupTreeData" @on-select-change="data => currentNode = data"></data-tree>
    </div>
    <div class="right">
      <div class="component-title" v-show="currentNode.component">{{currentNode.title}}</div>
      <component :is="currentNode.component" :id="orderId" :orderType="orderType"></component>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import DataTree from "~/components/common/data-tree.vue";
import { Getter } from "vuex-class";
// 页面基础组件
import BaseComponents from "./order-info-base/";

const ORDER_BASE_COMPONENT = [
  // 一级目录
  { id: 1, pid: 0, title: "基本资料", component: "OrderInfoBasedata", default: true },
  { id: 2, pid: 0, title: "客户资料", component: "OrderInfoCustomerList" },
  { id: 3, pid: 0, title: "附件资料", component: "OrderInfoMaterials" },
  { id: 4, pid: 0, title: "操作记录", component: "OrderInfoRecord" },
  { id: 5, pid: 0, title: "租金方案", component: "OrderInfoView" },
  { id: 6, pid: 0, title: "还款记录", component: "OrderInfoBaseFinanceRepay" },
  { id: 7, pid: 0, title: "收款记录", component: "OrderInfoBaseFinanceReceipt" },
  { id: 8, pid: 0, title: "放款记录", component: "OrderInfoBaseFinanceLoan" },
  { id: 9, pid: 0, title: "提前收回记录", component: "OrderInfoBaseFinanceEarlyRecoveryCost" },
  { id: 10, pid: 0, title: "提前结清记录", component: "OrderInfoBaseFinanceEarlySettlement" },
  { id: 11, pid: 0, title: "退款记录", component: "OrderInfoBaseFinanceRefund" },
]


@Component({
  components: {
    DataTree,
    ...BaseComponents
  }
})
export default class OrderInfo extends Vue {
  /**
   * 订单ID
   */
  @Prop({
    required: true,
    type: Number
  }) orderId
  /**
   * 业务类型
   */
  @Prop({
    required: true,
    type: Number
  }) orderType

  /**
   * 生成树数据
   */
  get orderGroupTreeData() {
    return this.$common.generateTreeData(ORDER_BASE_COMPONENT)
  }

  private currentNode: any = {}

  mounted() {
    // 设置默认显示基本信息
    this.currentNode = ORDER_BASE_COMPONENT.find(x => x.default)
  }
}
</script>
<style lang="less" scoped>
.component.order-info {
  display: inline-flex;
  .left {
    width: 150px;
  }
  .right {
    width: 850px;
    min-height: 500px;
    border-left: solid 1px #ddd;
    padding-left: 10px;
  }
  .component-title {
    text-align: right;
    padding-right: 20px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
</style>
