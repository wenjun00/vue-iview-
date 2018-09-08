<!-- 车辆详情 -->
<template>
  <section class="component vehicle-details">
    <i-card title="车辆详情">
        <a slot="extra" v-if="edit" @click="editCarInfo()">
            <i-icon type="edit"></i-icon>
            编辑
        </a>
        <a slot="extra" v-if="isView" @click="modifyMileage()">
            <i-icon type="edit"></i-icon>
            修改里程表值
        </a>
      <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="品牌" :span="4">{{carInfo.brandName}}</data-grid-item>
        <data-grid-item label="车系" :span="4">{{carInfo.seriesName}}</data-grid-item>
        <data-grid-item label="车型" :span="4">{{carInfo.modelName}}</data-grid-item>
        <data-grid-item label="颜色" :span="4">{{carInfo.stockCarColor}}</data-grid-item>
        <data-grid-item label="车架号" :span="4">{{carInfo.stockCarNo}}</data-grid-item>
        <data-grid-item label="发动机号" :span="4">{{carInfo.stockEngineNo}}</data-grid-item>
        <data-grid-item label="上牌日期" :span="4">{{carInfo.licensingDate | dateFormat}}</data-grid-item>
        <data-grid-item label="车牌号" :span="4">{{carInfo.plateNo}}</data-grid-item>
        <data-grid-item label="合格证号" :span="4">{{carInfo.certificateNo}}</data-grid-item>
        <data-grid-item label="车辆性质" :span="4">{{carInfo.stockCarType | dictConvert}}</data-grid-item>
        <data-grid-item label="车况" :span="4">{{carInfo.carCondition | dictConvert}}</data-grid-item>
        <data-grid-item label="里程表值" :span="4">{{carInfo.carMileage}}</data-grid-item>
        <data-grid-item label="所属机构" :span="4">{{carInfo.orgName}}</data-grid-item>
        <data-grid-item label="入库日期" :span="4">{{carInfo.stockInDate | dateFormat}}</data-grid-item>
        <data-grid-item label="出厂日期" :span="4">{{carInfo.makeDate | dateFormat}}</data-grid-item>
        <data-grid-item label="车辆状态" :span="4">{{carInfo.stockStatus | dictConvert}}</data-grid-item>
      </data-grid>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { Button } from "iview";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class VehicleDetails extends Vue {

  @Prop() stockId;
  @Prop() carInfo;
  @Prop() editCarInfo;
  @Prop()modifyMileage
 
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(SysDictService) sysDictService: SysDictService;

  @Prop({
    type: Boolean,
    default: false
  })
  edit
  
  @Prop({
    type: Boolean,
    default: false
  })
  isView
  
  mounted() {
  }

  created() {
  }
  
  
}
</script>

<style lang="less">
.component.prepare-car {
  .operate-buttons {
    text-align: right;
    margin: 10px 0;
  }
  .minWidth {
    min-width: 90px;
  }
}
</style>
