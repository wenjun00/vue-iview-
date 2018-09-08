<!--选择产品方案-->
<template>
  <section class="component choose-product">
    <data-box :columns="columns" :data="dataSet" highlightRow ref="databox"></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import DataBox from "~/components/common/data-box.vue";
import { productInfo } from "~/interfaces/work.interface";
import ProductBase from "~/components/base-data/product-manage/product-base.tsx.vue";
import { Button } from "iview";

@Component({
  components: {}
})
export default class ChooseProduct extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService

  @Prop() businessId: number;
  @Prop() modelId: number
  @Prop() schemeId: number;




  private dataSet: Array<any> = [];
  private columns: Array<any> = null;

  created() {
    this.columns = [
      {
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        title: "产品名称",
        align: "center",
        minWidth: this.$common.getColumnWidth(4),
        key: "schemeName",
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.showProductDetail(row.id)}>{row.schemeName}</i-button>)
      },
      // {
      //   title: "资金渠道",
      //   align: "center",
      //   minWidth: this.$common.getColumnWidth(4),
      //   key: "fundsChannel"
      // },
      {
        title: "还款方式",
        align: "center",
        minWidth: this.$common.getColumnWidth(4),
        key: "repayType",
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.repayType));
        }
      },
      {
        title: "期数",
        align: "center",
        minWidth: this.$common.getColumnWidth(2),
        key: "periods"
      },
      {
        title: "利率",
        align: "center",
        minWidth: this.$common.getColumnWidth(2),
        key: "interestRate",
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.decimalToPrecent(row.interestRate, 4));
        }
      }
    ];
  }

  mounted() {
    this.refreshData()
  }

  /**
   * 刷新数据
   */
  private refreshData() {
    this.basicCustomerOrderService.findSuitableScheme(this.businessId, this.modelId).subscribe(
      data => {
        data.forEach(v => { v._highlight = v.schemeId === this.schemeId })
        this.dataSet = data
      },
      err => this.$Message.error(err.msg)
    )
  }

  get productInfo(): productInfo {
    let product: productInfo = null;
    let data = (this.$refs.databox as DataBox).currentRow
    if (data.id) {
      product = {
        id: data.id,
        schemeName: data.schemeName,
        fundsChannel: data.fundsChannel,
        repayType: data.repayType,
        periods: data.periods,
        interestRate: data.interestRate
      }
    }
    return product
  }

  private showProductDetail(schemeId: number) {
    this.$dialog.show({
      title: '查看产品基本信息',
      isView: true,
      footer: true,
      width: 700,
      render: h => (<ProductBase productId={schemeId}></ProductBase>)
    })
  }

}
</script>

<style lang="less" scoped>
</style>
