<!-- 车辆整备状态和车辆调拨计划 -->
<template>
  <section class="component transfer-plan">

    <i-card title="车辆整备信息">
      <data-box :columns="columnsPreoare" :data="dataPreoareSet" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="车辆调拨计划" v-if="isView">
      <data-box :columns="transferPlanDetails" :data="transferPlanSet" :height="100" ref="databox-plan"></data-box>
    </i-card>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import VehicleDetails from "./vehicle-details.tsx.vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Form, Select, Option, InputNumber, Input } from "iview";
import ModifyCarInfo from "./modify-car-info.vue";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service'
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import DataBox from "~/components/common/data-box.vue";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails
  }
})
export default class TransferPlan extends Vue {

  @Prop({ default: () => { } }) callBack: () => void
  @Prop({ default: false }) isView: boolean;
  @Prop() stockId;
  
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  private dataPreoareSet: Array<any> = [];
  private transferPlanSet: Array<any> = [];
  private deptList: Array<any> = [];

  private transferPlanDetails: any = {};
  private columnsPreoare: any = {};
  private outOrgName: String = "";//调出机构
  private model: any = null;
  private rules: any = null;

  private refreshData() {
    //车辆整备信息
    this.basicCustomerCarCenterService.queryStockCarPrepareInfo(this.stockId).subscribe(
      data => {
        let _len = data.length - 1
        this.dataPreoareSet = data[_len]
        if (this.dataPreoareSet) {
          this.dataPreoareSet = [{
            gpsStatus: data[_len].gpsStatus,
            licensingDate: data[_len].licensingDate ? "已上牌" : "未上牌",
            inspectId: data[_len].inspectId ? "已登记" : "未登记",
            insuranceId: data[_len].insuranceId ? "已登记" : "未登记",
            preparStatus: data[_len].preparStatus ? data[_len].preparStatus : "未整备"
          }]
        } else {
          this.dataPreoareSet = [{
            licensingDate: "未上牌",
            inspectId: "未登记",
            insuranceId: "未登记",
            preparStatus: "未整备"
          }]
        }
      },
      err => this.$Message.error(err.msg)
    );
    //获取现在机构
    this.basicCustomerCarCenterService.queryCustomerCarStorage(this.stockId).subscribe(
      data => {
        this.outOrgName = data.orgName,
          this.getVehicleTransferPlan()
      },
      err => this.$Message.error(err.msg)
    );
  }

  private getVehicleTransferPlan() {
    //获取车辆调拨计划
    this.basicCustomerCarCenterService.vehicleTransferPlan(this.stockId).subscribe(
      data => {
        this.$emit("getId",data.id)
        this.$emit("getOutId",data.outOrgId)
        if (data) {
          this.transferPlanSet = [{
            outOrgName: data.inOrgName,
            orgName: data.outOrgName,
            allocationReason: data.allocationReason,
            logisticsWay: data.logisticsWay
          }]
        } else {
          this.transferPlanSet = [{
            outOrgName: this.outOrgName,
            orgName: "",
            allocationReason: "",
            logisticsWay: ""
          }]
        }
      },
      err => this.$Message.error(err.msg)
    );
  }

  created() {

    //整备状态
    this.columnsPreoare = [
      {
        align: "center",
        editable: true,
        title: "GPS状态",
        key: "gpsStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$dict.getDictName(row.gpsStatus))
      },
      {
        align: "center",
        editable: true,
        title: "车辆上牌",
        key: "licensingDate",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车辆登记",
        key: "inspectId",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "保险登记",
        key: "insuranceId",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "整备状态",
        key: "preparStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => {
          return h("span", {}, row.preparStatus ? this.$filter.dictConvert(row.preparStatus) : "未整备");
        }
      }
    ];


    //车辆调拨计划
    this.transferPlanDetails = [
      {
        align: "center",
        editable: true,
        title: "现所属机构",
        key: "outOrgName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "计划调拨至机构",
        key: "orgName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "调拨理由",
        key: "allocationReason",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        editable: true,
        title: "物流方式",
        key: "logisticsWay",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$dict.getDictName(row.logisticsWay))
      }
    ];
  }

  mounted() {
    this.refreshData();
    this.getDeptList();
  }

  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryDeptList()
      .subscribe(
        data => { this.deptList = data },
        err => this.$Message.error(err.msg)
      );
  }

  // submit() {
  //   let databox = this.$refs['databox-plan'] as DataBox
  //   let data = databox.table.rebuildData as Array<any>
  //   data.forEach((v, index) => {
  //     this.transferPlanSet[index].allocationReason = v.allocationReason
  //     this.transferPlanSet[index].logisticsWay = v.logisticsWay
  //     this.transferPlanSet[index].outOrgName = v.outOrgName
  //   })
  //   if (this.planValidator()) {
  //     return Promise.resolve(this.transferPlanSet)
  //   } else {
  //     return Promise.resolve()
  //   }
  // }

  /**
   * 对表单行数据进行校验
   */
  // private planValidator() {
  //   let result = true
  //   // 校验规则
  //   let rules = {
  //     allocationReason: { required: true, message: "请选择调拨机构" },
  //     logisticsWay: { required: true, message: "请选择调拨机构" },
  //     outOrgName: { required: true, message: "请选择调拨机构" }
  //   }
  // }


}
</script>

<style lang="less">
.component.transfer-plan {
  @width: 150px;
  .select-mini {
    width: @width;
    .ivu-select-selection {
      width: @width;
    }
  }
}
</style>
