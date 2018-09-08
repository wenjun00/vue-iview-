<!-- 客户当期还款 -->
<template>
  <section class="component customer-repayment-current-period">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="6">
        <i-button type="text" class="row-command-button" @click="showCustomerInfo({id:orderInfo.customerId})">{{orderInfo.customerName}}</i-button>
      </data-grid-item>
      <data-grid-item label="订单号" :span="6">
        <i-button type="text" class="row-command-button" @click="showOrderInfo({id: orderId, orderType: orderInfo.orderType})">{{orderInfo.orderNumber}}</i-button>
      </data-grid-item>
    </data-grid>
    <div v-if="dataSet.length">
      <data-box :columns="columns" :data="dataSet" :height="200" ref="databox"></data-box>
      <voucher-list :orderId="orderId" :cardTitle="'支付凭证'" ref="voucher-list"></voucher-list>
      <i-form :model="model" :rules="rules" :label-width="110" ref="form" inline>
        <i-form-item label="剩余应还金额(元)">
          <i-input-number v-model="model.shouldRepayMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" readonly></i-input-number>
        </i-form-item>
        <i-form-item label="还款金额(元)" prop="payMoney">
          <i-input-number v-model="model.payMoney" :min="0" :max="model.shouldRepayMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" placeholder="请输入还款金额"></i-input-number>
        </i-form-item>
      </i-form>
    </div>
    <div v-else class="no-data">
      本期已还
    </div>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { namespace } from "vuex-class";
import VoucherList from "~/components/finance-manage/voucher-list.tsx.vue";
import { Button } from "iview";
import CustomerRepaymentDetail from "~/components/finance-manage/repayment-fee-detail.tsx.vue";

const CustomerOrderModule = namespace("customerOrderSpace")

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VoucherList
  }
})
export default class CustomerRepaymentCurrentPeriod extends Vue {
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
  private isShow: Boolean = false;

  private model: any = {
    shouldRepayMoney: null,
    payMoney: null,
    fileParamList: [],
    receivableChannel: ''
  }
  private rules: any = {
    payMoney: { required: true, message: "请输入要还款的金额", trigger: "blur", type: "number" }
  }

  get orderId() {
    return this.orderInfo.orderId
  }

  created() {
    this.columns = [
      {
        align: 'center',
        title: '所属期数',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<span>{row.periods}/{this.orderInfo.orderPeriods}</span>)
      },
      {
        align: 'center',
        title: '还租金状态',
        key: 'repayStatus',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.repayStatus)}</span>)
      },
      {
        align: 'center',
        title: '逾期天数',
        key: 'overdueDays',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: 'center',
        title: '应还金额',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showRepayDetail(row)}>{this.$filter.toThousands(row.shouldRepayMoney)}</i-button>)
      }
    ]
  }

  mounted() {
    // 查询要还款的期数的详情
    this.financialManagementService.findRepayList(this.orderId).subscribe(
      data => {
        this.dataSet = data
        // 计算剩余应还金额
        data.map(v => {
          this.model.shouldRepayMoney += v.shouldRepayMoney
        })
        this.model.payMoney = this.model.shouldRepayMoney
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查看应还金额详情
   */
  private showRepayDetail(rowData) {
    this.$dialog.show({
      title: "详情",
      width: 700,
      render: h => <CustomerRepaymentDetail orderId={this.orderId} periods={rowData.periods}></CustomerRepaymentDetail>
    })
  }

  submit() {
    let form = this.$refs.form as any;
    return new Promise((resolve) => {
      if (this.dataSet.length) {
        form.validate(v => {
          if (!v) return resolve(false)
          let VoucherList = this.$refs['voucher-list'] as any
          VoucherList.submit().then(v => {
            if (!v) return resolve(false)
            this.model.fileParamList = v.fileList
            this.model.receivableChannel = v.type
            this.financialManagementService.saveCustomerRepayment(this.model, this.orderId).subscribe(
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
      } else{
        return resolve(true)
      }
      
    })

  }
}
</script>

<style lang="less">
.component.customer-repayment-current-period {
  .table {
    padding: 10px 0;
  }
}
</style>
<style lang="less" scoped>
.component.customer-repayment-current-period {
  .current-period {
    margin: 10px 0;
  }
  .overdue-period {
    margin-bottom: 10px;
  }
  .no-data {
    text-align: center;
    line-height: 400px;
    height: 400px;
    font-size: 20px;
    color: rgb(176, 178, 182);
  }
}
</style>