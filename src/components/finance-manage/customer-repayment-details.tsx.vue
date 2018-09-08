<!--查看客户还款详情-->
<template>
  <section class="component customer-repayment-details">
    <data-box v-if="dataSet.length > 0" :height="400" :columns="columns" :data="dataSet" ref="databox"></data-box>
    <div v-else class="no-data">
      暂无结果...
    </div>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";

@Component({
  components: {}
})
export default class CustomerRepaymentDetails extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;

  @Prop({
    required: true,
    type: Number
  }) orderId: number;

  private dataSet: Array<any> = [];
  private columns: Array<any> = [];

  mounted() {
    this.findOrderRepayScheme(this.orderId);
  }

  /**
   * 创建数据列
   */
  private createClumnItem(data: any) {
    if (!data) return [];
    //  插入期数列
    this.columns.push({
      align: "center",
      title: "期数",
      key: "periods",
      minWidth: this.$common.getColumnWidth(3)
    },
      {
        align: "center",
        title: "应还日期",
        key: "repayDate",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<span>{this.$filter.dateFormat(row.repayDate)}</span>)
      },
      {
        align: "center",
        title: "实际还款日期",
        key: "actualRepayDate",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<span>{this.$filter.dateFormat(row.actualRepayDate)}</span>)
      },
      {
        align: "center",
        title: "还款状态",
        key: "repayStatus",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.repayStatus)}</span>)
      });
    // 获取费用项
    let feeItems = data.feeItems as Array<any>
    if (!feeItems) return
    /**
     * 创建每个费用项的名称以及子数据
     */
    let createItem = feeItem => {
      return {
        align: "center",
        title: `${feeItem.expenseName}`,
        children: [
          {
            align: "center",
            title: "总金额",
            key: "repayMoney",
            minWidth: this.$common.getColumnWidth(2),
            render: (h, { row, column }) => (<div>{this.$filter.toThousands((row.feeItems.find(x => x.expenseCode === feeItem.expenseCode) || {}).repayMoney)}</div>)
          },
          {
            align: "center",
            title: "已还金额",
            key: "isRepayMoney",
            minWidth: this.$common.getColumnWidth(2),
            render: (h, { row }) => (<div>{this.$filter.toThousands((row.feeItems.find(x => x.expenseCode === feeItem.expenseCode) || {}).isRepayMoney)}</div>)
          },
          {
            align: "center",
            title: "待还金额",
            key: "lastMoney",
            minWidth: this.$common.getColumnWidth(2),
            render: (h, { row }) => (<div>{this.$filter.toThousands((row.feeItems.find(x => x.expenseCode === feeItem.expenseCode) || {}).lastMoney)}</div>)
          }
        ]
      }
    }
    // 添加每一项的费用列
    feeItems.forEach(v => {
      this.columns.push(createItem(v))
    })
  }

  /**
   * 查询还款方案
   */
  private findOrderRepayScheme(orderId) {
    this.financialManagementService.findRepayPlanList(orderId).subscribe(
      val => {
        if (JSON.stringify(val) !== '{}') {
          let _len = val.dataList.length - 1
          this.createClumnItem(val.dataList[_len]);
          this.dataSet = val.dataList;
        }
      },
      err => this.$Message.error(err.msg)
    );
  }
}
</script>

<style lang="less" scoped>
.component.customer-repayment-details {
  .no-data {
    text-align: center;
    line-height: 400px;
    height: 400px;
    font-size: 40px;
    color: rgb(176, 178, 182);
  }
}
</style>
