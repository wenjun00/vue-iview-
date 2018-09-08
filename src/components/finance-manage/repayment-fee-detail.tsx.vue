<!-- 还款费用项详情 -->
<template>
  <section class="component repayment-fee-detail">
    <data-box :columns="columns" :data="dataSet" :height="0"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { Button } from "iview";

@Component({
  components: {
  }
})
export default class RepaymentFeeDetail extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() orderId
  @Prop() periods

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];

  created() {
    this.columns = [
      {
        align: 'center',
        title: '费用项',
        key: 'expenseName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: 'center',
        title: '应还金额',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, {row})=> <div>{this.$filter.toThousands(row.repayMoney - row.isRepayMoney)}</div>
      }
    ]
  }

  mounted() {
    this.financialManagementService.findRepayExpenseList(this.orderId, this.periods).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  } 
}
</script>

<style lang="less">
</style>