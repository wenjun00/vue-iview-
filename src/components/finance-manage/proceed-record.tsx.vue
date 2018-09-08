<!-- 收款记录 -->
<template>
  <section class="component proceed-record">
    <data-box :columns="columns" :data="dataSet" :height="0" ref="databox"></data-box>
    <i-card title="收款凭证">
      <data-box :columns="voucherColumns" :data="voucherData" :height="0"></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { ImageType } from "~/config/enum.config";
import { Button } from "iview";

@Component({
  components: {
  }
})
export default class ProceedRecord extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() orderId

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private voucherColumns: Array<any> = [];
  private voucherData: Array<any> = [];

  created() {
    this.columns = [
      {
        title: '收款时间',
        align: 'center',
        key: "actualRepayDate",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => h('span', {}, this.$filter.dateFormat(row.actualRepayDate, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        align: 'center',
        title: '费用项',
        key: 'expenseName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '费用状态',
        key: 'repayStatus',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => h('div', {}, this.$dict.getDictName(row.repayStatus))
      },
      {
        align: 'center',
        title: '收款金额',
        key: 'isRepayMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('div', { class: { 'col-decimal': true } }, this.$filter.toThousands(row.isRepayMoney))
      },
      {
        align: 'center',
        title: '操作人',
        key: 'operatorName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: 'center',
        title: '代收渠道',
        key: 'receivableChannel',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => h('div', {}, this.$dict.getDictName(row.receivableChannel))
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
    // 查询收款记录
    this.financialManagementService.findRepayRecord(this.orderId).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
    // 查询收款凭证列表
    this.financialManagementService.findFinanceFileList(this.orderId, this.$enum.OrderVoucherType.Proceeds).subscribe(
      data => this.voucherData = data,
      err => this.$Message.error(err.msg)
    )
  }

}
</script>

<style lang="less">
.component.proceed-record {
  .table {
    padding: 10px 0;
  }
}
</style>