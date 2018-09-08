<!-- 还款记录 -->
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
import RepayVoucherList from "~/components/finance-manage/repay-voucher-list.tsx.vue";
import RepayDeatil from "~/components/finance-manage/repay-detail.tsx.vue";

@Component({
  components: {
  }
})
export default class RepayRecord extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() orderId
  @Prop() orderPeriods

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
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if (row.receivableChannel === 10478) { // 10478:线下支付
            return (<i-button type="text" class="row-command-button" onClick={() => this.viewVoucher(row.orderId)}>查看凭证</i-button>)
          }
        }
      },
      {
        title: '操作时间',
        align: 'center',
        key: "receivableDate",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => h('span', {}, this.$filter.dateFormat(row.receivableDate, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        align: 'center',
        title: '操作人',
        key: 'operatorName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: 'center',
        title: '还款金额',
        key: 'receivableDetialMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => <i-button type="text" class="row-command-button" onClick={() => this.viewRepayDetail(row.id)}>{this.$filter.toThousands(row.receivableDetialMoney)}</i-button>
      },
      {
        align: 'center',
        title: '代扣渠道',
        key: 'receivableChannel',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => h('div', {}, this.$dict.getDictName(row.receivableChannel))
      }
    ]
  }

  mounted() {
    // 查询还款记录
    this.financialManagementService.findRepayRecordList(this.orderId).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查看还款明细
   */
  private viewRepayDetail(receivableId) {
    this.$dialog.show({
      title: "还款明细",
      width: 700,
      render: h => <RepayDeatil receivableId={receivableId} orderPeriods={this.orderPeriods}></RepayDeatil>
    })
  }

  /**
   * 查看还款凭证
   */
  private viewVoucher(orderId) {
    this.$dialog.show({
      title: "查看凭证",
      width: 700,
      render: h => <RepayVoucherList orderId={orderId} voucherType={this.$enum.OrderVoucherType.Repay}></RepayVoucherList>
    })
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