<!--还款凭证列表-->
<template>
  <section class="component repay-voucher-list">
    <data-box :columns="columns" :data="dataSet" :height="400" ref="databox"></data-box>
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
export default class RepayVoucherList extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() orderId
  @Prop() voucherType

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
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
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        title: '文件名',
        align: 'center',
        key: "fileName",
        minWidth: this.$common.getColumnWidth(3)
      }
    ]
  }

  mounted() {
    // 查询收款凭证列表
    this.financialManagementService.findFinanceFileList(this.orderId, this.voucherType).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

}
</script>

<style lang="less">
</style>