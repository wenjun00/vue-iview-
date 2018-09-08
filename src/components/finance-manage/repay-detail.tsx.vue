<!--还款明细-->
<template>
  <section class="component repay-record">
    <data-box :columns="columns" :data="dataSet" :height="400" ref="databox"></data-box>
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
export default class RepayRecord extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() receivableId // 还款记录id
  // @Prop() orderPeriods // 总期数

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];

  created() {
    this.columns = [
      {
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        title: '费用项',
        align: 'center',
        key: "expenseName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: 'center',
        title: '所属期数',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<span>{row.periods}/{row.orderPeriods}</span>)
      },
      {
        align: 'center',
        title: '应款金额',
        key: 'receivableRepayMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => <span>{this.$filter.toThousands(row.receivableRepayMoney)}</span>
      },
      {
        align: 'center',
        title: '还款金额',
        key: 'receivableDetailMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => <span>{this.$filter.toThousands(row.receivableDetailMoney)}</span>
      }
    ]
  }

  mounted() {
    // 查询还款明细
    this.financialManagementService.findRepayRecordDetailList(this.receivableId).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }
}
</script>

<style lang="less">
.component.repay-record {
  .table {
    padding: 10px 0;
  }
}
</style>