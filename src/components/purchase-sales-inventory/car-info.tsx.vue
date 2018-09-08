<!-- 查看车辆详情和整备状态，关联订单信息 -->
<template>
  <section class="component car-info">

    <vehicle-details :carInfo="carInfo" :edit="this.edit" :editCarInfo='editCarInfo'></vehicle-details>

    <vehicle-preparation-info :stockId="stockId" :isView="isView && isOutStorage"></vehicle-preparation-info>

    <car-test-report :isView="isView" :stockId="stockId"> </car-test-report>

    <i-card title="保险记录">
      <data-box :columns="columnsInsurance" :data="dataInsuranceSet" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="车检记录">
      <data-box :columns="columnsVehicleInspection" :data="dataVehicleInspectionSet" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="车辆图片">
      <data-box :columns="columnsCarPhoto" :data="dataCarPhoto" ref="databox" :height="200"></data-box>
    </i-card>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import VehicleDetails from "./vehicle-details.tsx.vue";
import VehiclePreparationInfo from "./vehicle-preparation-info.tsx.vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import ModifyCarInfo from "./modify-car-info.vue";
import PrepareCarAddGPS from "./prepare-car-add-gps.tsx.vue";
import ModifyInsuranceRecord from "./modify-insurance-record.tsx.vue";
import ModifyYearlyCheckRecord from "./modify-yearly-check-record.tsx.vue";
import CarTestReport from "~/components/finance-detain/car-test-report.tsx.vue"
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service'
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { ImageType } from "~/config/enum.config";
import { Button } from "iview";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails,
    VehiclePreparationInfo,
    CarTestReport
  }
})
export default class CarInfo extends Vue {

  @Prop({ default: () => { } }) callBack: () => void
  @Prop() data
  @Prop({ default: false }) isView: boolean;
  @Dependencies(BasicCarDetailService)
  private basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  private dataSet: Array<any> = [];
  private dataInsuranceSet: Array<any> = [];
  private dataVehicleInspectionSet: Array<any> = [];
  private dataCarPhoto: Array<any> = [];
  private dataReportSet: Array<any> = [];

  private columnsCarPhoto: any = {};
  private columnsInsurance: any = {};
  private columnsVehicleInspection: any = {};
  private carImageType: Number; // 上传的资料类型
  private carInfo: any = {};
  private stockId = this.data.stockId
  private edit: boolean = true;
  private isOutStorage: boolean = false; //是否出库

  private refreshData() {
    this.basicCustomerCarCenterService.queryCustomerCarStorage(this.stockId).subscribe(
      data => this.carInfo = data,
      err => this.$Message.error(err.msg)
    )
    //刷新车辆图片记录
    this.basicCarDetailService
      .selectCarPhoto(this.stockId)
      .subscribe(
        data => (this.dataCarPhoto = data),
        err => this.$Message.error(err.msg)
      );
    //刷新车检记录
    this.basicCarDetailService
      .queryCarInspectionRecord(this.stockId)
      .subscribe(
        data => (this.dataVehicleInspectionSet = data),
        err => this.$Message.error(err.msg)
      );
    //刷新保险列表
    this.basicCarDetailService
      .queryInsuranceRecord(this.stockId)
      .subscribe(
        data => (this.dataInsuranceSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  created() {
    if (this.data.stockStatus === 10250 || this.data.stockStatus === 10240 || this.data.stockStatus === 10241 || this.data.stockStatus === 10249) {
      this.edit = false
    }
    if (this.data.stockStatus !== 10141) {
      this.isOutStorage = true
    }
    //保险
    this.columnsInsurance = [
      {
        align: "center",
        editable: true,
        title: "保险终止日",
        key: "insuranceEndDate",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dateFormat(row.insuranceEndDate))
      },
      {
        align: "center",
        editable: true,
        title: "保险公司",
        key: "insuranceCompany",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "保险费用  ",
        key: "totalAmount",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h("span", {}, this.$filter.toThousands(row.totalAmount))
      },
      {
        align: "center",
        editable: true,
        title: "险种备注",
        key: "insuranceRemark",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "操作人",
        key: "userRealName",
        minWidth: this.$common.getColumnWidth(4)
      }
    ];

    //车检
    this.columnsVehicleInspection = [
      {
        align: "center",
        editable: true,
        title: "车检到期日",
        key: "inspectEndDate",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dateFormat(row.inspectEndDate))
      },
      {
        align: "center",
        editable: true,
        title: "车检结果",
        key: "inspectResult",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => {
          return h(
            "span",
            {},
            this.$filter.dictConvert(row.inspectResult)
          );
        }
      },
      {
        align: "center",
        editable: true,
        title: "年检费用  ",
        key: "inspectCost",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h("span", {}, this.$filter.toThousands(row.inspectCost))
      },
      {
        align: "center",
        editable: true,
        title: "车检备注",
        key: "remark",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "操作人",
        key: "userRealName",
        minWidth: this.$common.getColumnWidth(4)
      }
    ];

    //车辆图片
    this.columnsCarPhoto = [
      {
        align: "center",
        title: "图片类型",
        key: "carImageType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.carImageType))
      },
      {
        align: "center",
        editable: true,
        title: "文件名",
        key: "fileName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      },
      {
        align: "center",
        editable: true,
        title: "操作人",
        key: "operator",
        minWidth: this.$common.getColumnWidth(4)
      }
    ];
  }

  mounted() {

    this.refreshData()
  }

  /**
   * 编辑车辆基本信息
   */
  editCarInfo() {
    this.$dialog.show({
      title: "修改车辆信息",
      footer: true,
      width: 1050,
      onOk: modifyCarInfo => {
        return modifyCarInfo.submit().then(v => {
          if (v) {
            this.refreshData()
            if (this.callBack) this.callBack();
          }
          return !!v
        })
      },
      render: h => h(ModifyCarInfo, {
        props: {
          data: Object.assign({}, this.carInfo)
        }
      })
    })
  }

}
</script>

<style lang="less">
</style>
