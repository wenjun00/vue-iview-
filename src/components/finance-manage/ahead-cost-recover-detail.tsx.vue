<!--提前收回-->
<template>
  <section class="component ahead-cost-recover-detail">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="6">
        <i-button type="text" class="row-command-button" @click="showCustomerInfo({id: orderInfo.customerId})">{{orderInfo.customerName}}</i-button>
      </data-grid-item>
      <data-grid-item label="订单号" :span="6">
        <i-button type="text" class="row-command-button" @click="showOrderInfo({id: orderInfo.id, orderType: orderInfo.orderType})">{{orderInfo.orderNo}}</i-button>
      </data-grid-item>
    </data-grid>
    <data-box :columns="columns" :height="0" :data="dataSet"></data-box>
    <voucher-list :orderId="orderInfo.id" :cardTitle="'支付凭证'" ref="voucher-list"></voucher-list>
    <i-form :model="model" :label-width="150" :rules="rules" ref="form">
      <i-form-item label="提前收回金额(元)" prop="takebackMoney">
        <i-input-number v-model="model.takebackMoney" :min="0" :max="totalLastRepayMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" placeholder="请输入提前收回金额"></i-input-number>
      </i-form-item>
      <i-form-item label="合计剩余应还金额(元)">
        <i-input-number :value="totalLastRepayMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" readonly></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { namespace } from "vuex-class";
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
export default class AheadCostRecoverDetail extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;
  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  @Prop() orderInfo;

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private totalLastRepayMoney: Number = 0; // 剩余应还金额合计

  private model = {
    orderId: this.orderInfo.id,
    takebackMoney: null, // 提前收回金额
    fileParamList: [],
    receivableChannel: ''
  }

  private rules = {
    takebackMoney: [
      { trigger: "blur", message: "请输入提前收回金额", required: true, type: "number" }
    ]
  }

  created() {
    this.columns = [
      {
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        align: 'center',
        title: '费用项',
        key: 'expenseName',
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: 'center',
        title: '应还金额',
        key: 'repayMoney',
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.repayMoney)}</div>)
      },
      {
        align: 'center',
        title: '已还金额',
        key: 'isRepayMoney',
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.isRepayMoney)}</div>)
      },
      {
        align: 'center',
        title: '剩余应还金额',
        key: 'lastRepayMoney',
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.lastRepayMoney)}</div>)
      }
    ]
  }

  mounted() {
    // 查询订单详情
    this.financialManagementService.findEarlyExpenseList(this.orderInfo.id).subscribe(
      data => {
        this.dataSet = data
        // 计算合计
        data.map(v => {
          this.totalLastRepayMoney += v.lastRepayMoney
        })
      },
      err => this.$Message.error(err.message)
    )
  }

  /**
   * 提前收回
   */
  private submit() {
    let form: any = this.$refs.form
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false)
        let VoucherList = this.$refs['voucher-list'] as any
        VoucherList.submit().then(v => {
          if (!v) return resolve(false)
          this.model.fileParamList = v.fileList
          this.model.receivableChannel = v.type
          this.financialManagementService.earlyRecycle(this.model).subscribe(
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
    })
  }
}
</script>

<style lang="less">
.component.ahead-cost-recover-detail {
  .table {
    padding: 10px 0;
  }
}
</style>