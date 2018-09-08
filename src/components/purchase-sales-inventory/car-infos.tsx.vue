<!-- 查看车辆详情 -->
<template>
  <section class="component car-infos">
    <i-card title="车辆详情">
      <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="品牌" :span="4">{{carInfo.brandName}}</data-grid-item>
        <data-grid-item label="车系" :span="4">{{carInfo.seriesName}}</data-grid-item>
        <data-grid-item label="车型" :span="4">{{carInfo.modelName}}</data-grid-item>
        <data-grid-item label="颜色" :span="4">{{carInfo.carColor}}</data-grid-item>
        <data-grid-item label="车架号" :span="4">{{carInfo.stockCarNo}}</data-grid-item>
        <data-grid-item label="发动机号" :span="4">{{carInfo.engineNo}}</data-grid-item>
        <data-grid-item label="车牌号" :span="4">{{carInfo.carNo}}</data-grid-item>
        <data-grid-item label="车辆性质" :span="4">{{carInfo.isSecondHand | dictConvert}}</data-grid-item>
        <data-grid-item label="车况" :span="4">{{carInfo.assessmentCarStatus | dictConvert}}</data-grid-item>
        <data-grid-item label="内饰状况" :span="4">{{carInfo.interiorCondition | dictConvert}}</data-grid-item>
        <data-grid-item label="公里数漆面状况" :span="4">{{carInfo.kilometersCondition | dictConvert}}</data-grid-item>
        <data-grid-item label="工况状况" :span="4">{{carInfo.workState  | dictConvert}}</data-grid-item>
        <data-grid-item label="评估状态" :span="4">{{carInfo.assessmentStatus | dictConvert}}</data-grid-item>
        <data-grid-item label="精准估价" :span="4">{{carInfo.assessmentPrice | toThousands}}</data-grid-item>
        <data-grid-item label="注册日期" :span="4">{{carInfo.registerDate | dateFormat}}</data-grid-item>
        <data-grid-item label="发证日期" :span="4">{{carInfo.issueDate | dateFormat}}</data-grid-item>
      </data-grid>
    </i-card>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service'
import { BasicAssessmentCarPriceAnalysisService } from "~/services/manage-service/basic-assessment-car-price-analysis.service";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class CarInfos extends Vue {

  @Prop({ default: () => { } }) callBack: () => void
  @Prop() carId
  @Dependencies(BasicAssessmentCarPriceAnalysisService) private basicAssessmentCarPriceAnalysisService: BasicAssessmentCarPriceAnalysisService;

  private carInfo: any = {};

  private refreshData() {
    this.basicAssessmentCarPriceAnalysisService.queryAssessmentCarInfo(this.carId).subscribe(
      data => {this.carInfo = data},
      err => this.$Message.error(err.msg)
    )
  }
  created() {
  }

  mounted() {
    this.refreshData()
  }
}
</script>

<style lang="less">
</style>
