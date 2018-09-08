<!--退款记录-->
<template>
  <section class="component order-info-base-finance-refund">
    <data-box :columns="columns" :data="dataSet" :height="440" ref="databox"></data-box>
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
import RefundFeeList from "~/components/finance-manage/refund-fee-list.tsx.vue";

@Component({
  components: {
  }
})
export default class OrderInfoBaseFinanceRefund extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService
  @Prop() id: Number

  private dataSet: Array<any> = [];
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
        title: "操作时间",
        key: 'refundDate',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.dateFormat(row.refundDate, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        align: "center",
        title: "操作人",
        key: 'operatorName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "是否退款",
        key: 'refundResult',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.refundResult))
      },
      {
        align: "center",
        title: '费用金额',
        key: 'refundMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => <i-button type="text" class="row-command-button" onClick={() => this.viewFeeList()}>{this.$filter.toThousands(row.refundMoney)}</i-button>
      },
      {
        align: "center",
        title: '退款金额',
        key: 'isRefundMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.toThousands(row.isRefundMoney))
      },
      {
        align: "center",
        title: "代收渠道",
        key: 'refundChannel',
        minWidth: this.$common.getColumnWidth(2)
      }
    ]

  }

  mounted() {
    this.financialManagementService.findOderRefundRecord(this.id).subscribe(
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
      render: h => <RepayVoucherList orderId={this.id} voucherType={this.$enum.OrderVoucherType.AheadRecover}></RepayVoucherList>
    })
  }

  /**
   * 查看退款费用项
   */
  private viewFeeList() {
    this.$dialog.show({
      title: "退款费用项",
      width: 700,
      render: h => <RefundFeeList id={this.id}></RefundFeeList>
    })
  }

}
</script>
<style lang="less" scoped>
</style>
