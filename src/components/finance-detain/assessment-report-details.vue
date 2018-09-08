<!-- 评估详情 -->
<template>
  <section class="component assessment-report-details">
    <i-card title="车辆信息" style="margin-bottom:20px;">
      <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="品牌" :span="6">{{assessmentReportInfo.brandName}}</data-grid-item>
        <data-grid-item label="车型" :span="6">{{assessmentReportInfo.modelName}}</data-grid-item>
        <data-grid-item label="车系" :span="6">{{assessmentReportInfo.seriesName}}</data-grid-item> 
        <data-grid-item label="车辆颜色" :span="6">{{assessmentReportInfo.color}}</data-grid-item>
        <data-grid-item label="城市" :span="6">{{assessmentReportInfo.areaName}}</data-grid-item>
        <data-grid-item label="过户次数" :span="6">{{assessmentReportInfo.transferTimes}}</data-grid-item>
        <data-grid-item label="行驶里程" :span="6">{{assessmentReportInfo.mile}}</data-grid-item>
        <data-grid-item label="车牌号" :span="6">{{assessmentReportInfo.carNo}}</data-grid-item>
        <data-grid-item label="车架号" :span="6">{{assessmentReportInfo.stockCarNo}}</data-grid-item>
        <data-grid-item label="内饰状况" :span="6">{{assessmentReportInfo.interior | dictConvert}}</data-grid-item>
        <data-grid-item label="公里数漆面状况" :span="6">{{assessmentReportInfo.surface | dictConvert}}</data-grid-item>
        <data-grid-item label="工况状况" :span="6">{{assessmentReportInfo.workState | dictConvert}}</data-grid-item>
        <data-grid-item label="出厂时间" :span="6">{{assessmentReportInfo.makeDate | dateFormat}}</data-grid-item>
        <data-grid-item label="上牌日期" :span="6">{{assessmentReportInfo.regDate | dateFormat}}</data-grid-item>
      </data-grid>
    </i-card>
    <i-card title="参考估价">
      <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="最高估价" :span="6">{{assessmentReportInfo.highAssessmentPrice  | toThousands }}</data-grid-item>
        <data-grid-item label="最低估价" :span="6">{{ assessmentReportInfo.lowAssessmentPrice  | toThousands }}</data-grid-item>
      </data-grid>
    </i-card>
     <i-card title="精准价格">
      <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="精准估价" :span="12">{{assessmentReportInfo.assessmentPrice | toThousands }}</data-grid-item>
      </data-grid>
    </i-card>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class AssessmentReportDetails extends Vue {
  @Dependencies(BasicCustomerAssessmentCarService)
  private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;

  @Prop({
    default: 0,
    type: Number
  })
  assessmentReportId: number;

  private assessmentReportInfo: any = {};

  mounted() {
    if (this.assessmentReportId) {
      this.basicCustomerAssessmentCarService
        .findAssessmentReportInfo(this.assessmentReportId)
        .subscribe(
          data => this.assessmentReportInfo = data,
          err => this.$Message.error(err.msg)
        );
    }
  }
}
</script>

<style lang="less">
</style>