<!--退款费用项列表-->
<template>
  <section class="component refund-fee-list">
    <data-box :columns="columns" :height="0" :data="dataSet"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Model, Emit } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";

@Component({
  components: {
  }
})
export default class RefundFeeList extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService
  @Prop() id: Number
  @Model("total-money-change") totalMoney: number;
  @Emit("total-money-change")
  private emitTotalMoneyChange(val) { }

  private dataSet: Array<any> = [];
  private columns: Array<any> = [];
  private refundMoney: number = 0;

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
        title: '金额',
        key: 'repayMoney',
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.repayMoney)}</div>)
      }
    ]
  }

  mounted() {
    this.financialManagementService.findRefundList(this.id).subscribe(
      data => {
        this.dataSet = data
        // 计算退款合计
        data.map(v => {
          this.refundMoney += v.repayMoney
        })
        this.emitTotalMoneyChange(this.refundMoney)
      },
      err => this.$Message.error(err.message)
    )
  }

}
</script>
<style lang="less" scoped>
</style>
