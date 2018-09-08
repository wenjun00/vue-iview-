<!--放款记录-->
<template>
  <section class="component order-info-base-finance-loan">
    <data-box :columns="columns" :data="dataSet" :height="0" ref="databox"></data-box>
    <i-card title="放款凭证">
      <data-box :columns="voucherColumns" :data="voucherData" :height="0"></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import RepayVoucherList from "~/components/finance-manage/repay-voucher-list.tsx.vue";
import { ImageType } from "~/config/enum.config";
import { Button } from "iview";

@Component({
  components: {
  }
})
export default class OrderInfoBaseFinanceLoan extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService
  @Prop() id: Number
  @Prop() orderType: Number

  private dataSet: Array<any> = [];
  private columns: Array<any> = [];
  private voucherColumns: Array<any> = [];
  private voucherData: Array<any> = [];
  
  created() {
    this.columns = [
      {
        align: "center",
        title: "序号",
        type: "index",
        width: 60
      },
      {
        align: "center",
        title: "操作时间",
        key: 'loanDate',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.dateFormat(row.loanDate, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        align: "center",
        title: '操作人',
        key: 'operatorName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "资金渠道",
        key: "fundsChannelName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.fundsChannelName))
      }
    ]
    this.voucherColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        render: (h, { row }) => {
          if (ImageType[row.fileType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}>预览</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      },
      {
        title: '凭证名称',
        align: 'center',
        key: 'fileName',
        minWidth: this.$common.getColumnWidth(4)
      }
    ]
  }

  mounted() {
    this.financialManagementService.findOderLoanRecord(this.id).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
    // 查询收款凭证列表
    let voucherType: Number = this.orderType === this.$enum.BusinessType.CASH_BACK ? this.$enum.OrderVoucherType.CustomerLoan : this.$enum.OrderVoucherType.SupplierLoan
    this.financialManagementService.findFinanceFileList(this.id, voucherType).subscribe(
      data => this.voucherData = data,
      err => this.$Message.error(err.msg)
    )
  }

}
</script>
<style lang="less">
.component.order-info-base-finance-loan {
  .table {
    padding: 10px 0;
  }
}
</style>
