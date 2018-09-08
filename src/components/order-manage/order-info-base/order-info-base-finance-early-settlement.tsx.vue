<!--提前结清-->
<template>
  <section class="component order-info-base-finance-early-settlement">
    <data-box :columns="columns" :data="dataSet" :height="300" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import RepayVoucherList from "~/components/finance-manage/repay-voucher-list.tsx.vue";
import { Button } from "iview";

@Component({
  components: {}
})
export default class OrderInfoBaseFinanceEarlySettlement extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService
  @Prop() id: Number

  private dataSet: Array<any> = []
  private columns: Array<any> = []

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        align: "center",
        render: (h, { row }) => <i-button type="text" class="row-command-button" onClick={() => this.viewVoucher()}>查看凭证</i-button>
      },
      {
        align: "center",
        title: "序号",
        type: "index",
        width: 60
      },
      {
        align: "center",
        title: "结清时间",
        key: 'settleDate',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.dateFormat(row.settleDate, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        align: "center",
        title: "操作人",
        key: 'operatorName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: '结清金额',
        key: 'settleMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.toThousands(row.settleMoney))
      },
      {
        align: "center",
        title: '提前结清手续费',
        key: 'settleProcessMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.toThousands(row.settleProcessMoney))
      },
      {
        align: "center",
        title: "代收渠道",
        key: 'receivableChannel',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.receivableChannel))
      }
    ]
  }

  mounted() {
    this.financialManagementService.findOderSettleRecord(this.id).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查看凭证
   */
  private viewVoucher() {
    this.$dialog.show({
      title: "查看凭证",
      width: 700,
      render: h => <RepayVoucherList orderId={this.id} voucherType={this.$enum.OrderVoucherType.EarlySettlement}></RepayVoucherList>
    })
  }

}
</script>
<style lang="less" scoped>
</style>
