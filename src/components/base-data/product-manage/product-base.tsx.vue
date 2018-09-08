<!-- 产品基本信息详情 -->
<template>
  <section class="component product-base">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="产品名称" :span="6">{{productBase.schemeName}}</data-grid-item>
      <data-grid-item label="审核流程" :span="6">{{ productBase.workFlowKey}}</data-grid-item>
      <data-grid-item label="还款方式" :span="6">{{productBase.repayType | dictConvert}}</data-grid-item>
      <data-grid-item label="冲抵策略" :span="6">{{productBase.offsetName}}</data-grid-item>
      <data-grid-item label="逾期宽限天数" :span="6">{{productBase.overdueDays}}</data-grid-item>
      <data-grid-item label="月利率" :span="6">{{productBase.interestRate | decimalToPrecent(4)}}</data-grid-item>
      <data-grid-item label="期数类型" :span="6">{{productBase.cycleType | dictConvert}}</data-grid-item>
      <data-grid-item label="期数" :span="6">{{productBase.periods}}</data-grid-item>
      <data-grid-item label="还款日类型" :span="6">{{ productBase.accountPeriodType | dictConvert }}</data-grid-item>
      <data-grid-item label="还款日" :span="6">{{productBase.accountDay}}</data-grid-item>
      <data-grid-item label="融资最小金额" :span="6">{{productBase.moneyMin | toThousands}}</data-grid-item>
      <data-grid-item label="融资最大金额" :span="6">{{productBase.moneyMax | toThousands}}</data-grid-item>
      <data-grid-item label="资金渠道" :span="6">
        <i-button type="text" class="row-command-button" @click="viewChannels">查看资金渠道</i-button>
      </data-grid-item>
      <data-grid-item label="首付比例" :span="6">{{productBase.downPayment | decimalToPrecent(4)}}</data-grid-item>
    </data-grid>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import SelectFundChannel from "~/components/base-data/product-manage/select-fund-channel.tsx.vue";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class ProductBase extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Prop({
    type: Number
  }) productId: Number;

  @Watch('productId', { immediate: true })
  onProductIdChange() {
    if (this.productId) {
      this.repaySchemeService.findSchemeById(this.productId).subscribe(
        data => this.productBase = data,
        err => this.$Message.error(err.msg)
      )
    }
  }

  private productBase: any = {};

  /**
   * 查看资金渠道
   */
  private viewChannels() {
    this.$dialog.show({
      title: "查看资金渠道",
      width: 1000,
      render: h => <SelectFundChannel isEdit={false} productId={this.productId} ref='select-fund-channel'></SelectFundChannel>
    })
  }
}
</script>

<style lang="less">
</style>
