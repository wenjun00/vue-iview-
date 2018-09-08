<!-- 费用项列表 -->
<template>
  <section class="component fee-list">
    <div v-if="!isView" class="add">
      <i-button type="primary" @click="onAddFeeItemClick">添加费用项</i-button>
    </div>
    <data-box :columns="columns" :data="dataSet" highlightRow></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { Button } from "iview";
import { BasicExpenseService } from "~/services/manage-service/basic-expense.service";
import FeeItem from "./fee-item.vue";


@Component({
  components: {}
})
export default class FeeList extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(BasicExpenseService) private basicExpenseService: BasicExpenseService;
  @Prop({
    required: true
  }) productId: number;

  @Prop({
    type: Boolean,
    default: false
  }) isView: boolean;

  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 机构数据
  private model: any = null;

  private feeNameList: any[] = null;

  created() {
    this.model = {
      name: "",
      fCompany: "",
      store: "",
      type: ""
    }
    let operateColumn = {
      title: "操作",
      width: this.$common.getOperateWidth(2),
      fixed: "left",
      align: "center",
      render: (h, { row, column, index }) => {
        return (<div>
          <i-button type="text" class="row-command-button" onClick={() => this.onEditClick(row.id)} >编辑</i-button>
          <i-button type="text" class="row-command-button" onClick={() => this.onDeleteClick(row.id, row.expenseName)}>删除</i-button>
        </div>
        )
      }
    }
    this.columns = [
      {
        align: "center",
        title: "费用项名称",
        key: "expenseName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "费用项类型",
        key: "costType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span title={this.$dict.getDictNameForAppendStr(row.costType)}>{this.$dict.getDictNameForAppendStr(row.costType)}</span>)
      },
      {
        align: "center",
        title: "固定费用",
        key: "fixedCost",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.fixedCost)}</div>)
      },
      {
        align: "center",
        title: "利率",
        key: "repayProportion",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.decimalToPrecent(row.repayProportion, 4)}</div>)
      },
      {
        align: "center",
        title: "支付方式",
        key: "repayType",
        ellipsis: true,
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span title={this.$dict.getDictNameForAppendStr(row.repayType)}>{this.$dict.getDictNameForAppendStr(row.repayType)}</span>)
      },
      {
        align: "center",
        title: "收取方式",
        key: "paymentType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.paymentType)}</span>)
      },
      {
        align: "center",
        title: "是否退款",
        key: "isRefund",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.isRefund)}</span>)
      }
    ]

    if (!this.isView) this.columns.unshift(operateColumn)
  }

  private onAddFeeItemClick() {
    this.$dialog.show({
      title: "新增费用项",
      footer: true,
      onOk: (add: FeeItem) => {
        return add.submit().then(v => {
          if (v) this.refreshData()
          return v
        })
      },
      render: h => (<FeeItem FeeNameList={this.feeNameList} productId={this.productId}></FeeItem>)
    })
  }

  private onEditClick(feeItemId: number) {
    this.$dialog.show({
      title: "修改费用项",
      footer: true,
      onOk: (modify: FeeItem) => {
        return modify.submit().then(v => {
          if (v) this.refreshData()
          return v
        })
      },
      render: h => (<FeeItem FeeNameList={this.feeNameList} feeItemId={feeItemId}></FeeItem>)
    })
  }


  private onDeleteClick(feeItemId: number, name: string) {
    this.$Modal.confirm({
      content: `是否费用项: <b>${name}</b>`,
      onOk: () => {
        this.repaySchemeService.deleteRepaySchemeExpense(feeItemId).subscribe(
          data => {
            this.$Message.success("操作成功")
            this.refreshData()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
  }

  private refreshData() {
    this.repaySchemeService.findSchemeExpenseBySchemeId(this.productId)
      .subscribe(
        data => this.dataSet = data,
        err => this.$Message.error(err.msg)
      )
  }

  /**
   * 获取可供选择的费用项
   */
  private GetAllFeeNames() {
    this.basicExpenseService.findBasicExpenseByOrg().subscribe(
      data => this.feeNameList = data.map(v => ({ label: v.expenseName, value: v.id }))
    )
  }

  mounted() {
    if (!this.productId) return
    // 添加费用项可能是多次
    // 所以在前一个页面提前加载好，直接传递可选值进去。以优化网络请求数量
    if (!this.isView) this.GetAllFeeNames()
    this.refreshData()
  }

}
</script>

<style lang="less" scoped>
.component.fee-list {
  .add {
    text-align: right;
    padding-right: 30px;
    margin: 5px 0;
  }
}
</style>
