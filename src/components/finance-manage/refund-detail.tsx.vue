<!-- 退款 -->
<template>
  <section class="component refund-detail">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="6">
        <i-button type="text" class="row-command-button" @click="showCustomerInfo({id: orderInfo.customerId})">{{orderInfo.customerName}}</i-button>
      </data-grid-item>
      <data-grid-item label="订单号" :span="6">
        <i-button type="text" class="row-command-button" @click="showOrderInfo({id: orderInfo.id, orderType: orderInfo.orderType})">{{orderInfo.orderNo}}</i-button>
      </data-grid-item>
    </data-grid>
    <refund-fee-list :id="orderInfo.id" v-model="totalMoney"></refund-fee-list>
    <voucher-list v-if="model.result === 10492" :orderId="orderInfo.id" :cardTitle="'支付凭证'" :isView="false" ref="voucher-list"></voucher-list>
    <i-form :model="model" :label-width="120" :rules="rules" ref="form" inline>
      <i-form-item label="合计应退金额(元)">
        <i-input-number :value="totalMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" readonly></i-input-number>
      </i-form-item>
      <i-form-item label="是否退款">
        <i-radio-group v-model="model.result">
          <i-radio :label="10492">同意</i-radio>
          <i-radio :label="10491">拒绝</i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item label="实际退款金额(元)" prop="actualMoney" v-if="model.result === 10492">
        <i-input-number v-model="model.actualMoney" :min="0" :max="totalMoney" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" placeholder="请输入实际退款金额"></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { State, Getter, namespace } from "vuex-class";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import VoucherList from "~/components/finance-manage/voucher-list.tsx.vue";
import RefundFeeList from "~/components/finance-manage/refund-fee-list.tsx.vue";

const CustomerOrderModule = namespace("customerOrderSpace")

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VoucherList,
    RefundFeeList
  }
})
export default class RefundDetail extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;
  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  @Prop() orderInfo

  private dataSet: Array<any> = [];
  private totalMoney: number = 0; // 合计应退金额
  private model = {
    actualMoney: null, // 实际退款金额
    result: 10492, // 是否同意退款
    orderId: this.orderInfo.id,
    receivableChannel: '',
    fileParamList: []
  }

  private rules = {
    actualMoney: [
      { trigger: "blur", message: "请输入实际退款金额", required: true, type: "number" }
    ]
  }

  submit() {
    let form: any = this.$refs.form
    return new Promise(resolve => {
      // 如果同意退款，进行表单验证
      if (this.model.result === 10492) {
        form.validate(v => {
          if (!v) return resolve(false)
          let VoucherList = this.$refs['voucher-list'] as any
          VoucherList.submit().then(v => {
            if (!v) return resolve(false)
            this.model.fileParamList = v.fileList
            this.model.receivableChannel = v.type
            this.financialManagementService.financialRefund(this.model).subscribe(
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
      } else {
        this.financialManagementService.financialRefund(this.model).subscribe(
          data => {
            this.$Message.success('操作成功')
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg)
            resolve(false)
          }
        )
      }
    })
  }
}
</script>

<style lang="less">
.component.refund-detail {
  .table {
    padding: 10px 0;
  }
}
</style>