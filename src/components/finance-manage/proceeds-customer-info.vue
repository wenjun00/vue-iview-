<!-- 客户收款 首付款 -->
<template>
  <section class="component proceeds-customer-info">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="6">
        <i-button type="text" class="row-command-button" @click="showCustomerInfo({id:orderInfo.customerId})">{{orderInfo.customerName}}</i-button>
      </data-grid-item>
      <data-grid-item label="订单号" :span="6">
        <i-button type="text" class="row-command-button" @click="showOrderInfo({id: orderId, orderType: orderInfo.orderType})">{{orderInfo.orderNumber}}</i-button>
      </data-grid-item>
    </data-grid>
    <data-box :columns="columns" :data="dataSet" :height="0" ref="databox" @on-selection-change="selectRowClick"></data-box>
    <voucher-list :orderId="orderId" :cardTitle="'收款凭证'" :isView="false" ref="voucher-list"></voucher-list>
    <div class="sum-amt">
      合计金额：
      <b>{{sumAmt}}</b> 元
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import VoucherList from "~/components/finance-manage/voucher-list.tsx.vue";

const CustomerOrderModule = namespace("customerOrderSpace")

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VoucherList
  }
})
export default class ProceedsCustomerInfo extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;
  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;
  /**
   * 订单数据
   */
  @Prop({
    required: true,
    type: Object
  }) orderInfo: any;


  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private sumAmt: Number = 0; // 合计金额
  private expenseArr: Array<any> = [];
  private model = {
    fileList: [],
    orderId: this.orderId,
    planIds: [],
    type: ''
  }


  get orderId() {
    return this.orderInfo.orderId
  }

  created() {
    this.columns = [
      {
        align: "center",
        type: "selection",
        fixed: "left",
        width: 40
      },
      {
        title: '序号',
        align: 'center',
        type: "index",
        minWidth: this.$common.getColumnWidth(1)
      },
      {
        align: 'center',
        title: '费用项',
        key: 'expenseName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '费用状态',
        key: 'repayStatus',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('div', {}, this.$dict.getDictName(row.repayStatus))
      },
      {
        align: 'center',
        title: '收款金额',
        key: 'repayMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('div', { class: { 'col-decimal': true } }, this.$filter.toThousands(row.repayMoney))
      }
    ]
  }

  mounted() {
    // 查询收款费用项
    this.financialManagementService.findOrderFirstPayList(this.orderId).subscribe(
      data => {
        // 如果状态为已收或收款处理中，则禁用选择
        data.map(v => {
          if (v.repayStatus === 10496) v._disabled = true
        })
        this.dataSet = data
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 提交收款
   */
  submit() {
    return new Promise((resolve) => {
      if (!this.expenseArr.length) {
        this.$Message.warning('未选择要收款的费用项！')
        return resolve(false)
      }
      let VoucherList = this.$refs['voucher-list'] as any
      VoucherList.submit().then(v => {
        if (!v) return resolve(false)
        this.model.fileList = v.fileList
        this.model.type = v.type
        this.financialManagementService.financialAffirm(this.model).subscribe(
          data => {
            this.$Message.success('操作成功')
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg)
            resolve(false)
          }
        )
      })
    })
  }

  /**
   * 选择费用项时
   */
  private selectRowClick(selections) {
    // 清除数据
    this.expenseArr = [];
    this.model.planIds = [];
    let totalAmount = 0;
    // 添加当前选择的数据
    selections.map(v => {
      this.expenseArr.push(v)
      this.model.planIds.push(v.id)
      totalAmount += v.repayMoney
    })
    // 计算合计金额高端写法
    // totalAmount = selections.reduce((s, c) => s + c.repayMoney, 0)
    this.sumAmt = Math.round(totalAmount * 100) / 100
  }

}
</script>

<style lang="less">
.component.proceeds-customer-info {
  .table {
    padding: 10px 0;
  }
}
</style>
<style lang="less" scoped>
.component.proceeds-customer-info {
  .sum-amt {
    text-align: right;
    padding-right: 50px;
  }
}
</style>