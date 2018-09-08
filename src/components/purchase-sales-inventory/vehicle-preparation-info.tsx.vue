<!-- 车辆整备状态和关联订单信息 -->
<template>
  <section class="component vehicle-preparation-info">

    <i-card title="车辆整备信息">
      <a v-if="isView" slot="extra" @click="onPrepareCar">
        <i-icon type="edit"></i-icon>
        车辆整备
      </a>
      <data-box :columns="columnsPreoare" :data="dataPreoareSet" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="关联订单信息">
      <data-box :columns="columnsOrderDetails" :data="dataOrderDetailsSet" ref="databox" :height="200"></data-box>
    </i-card>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import VehicleDetails from "./vehicle-details.tsx.vue";
import AssessmentReportDetails from "~/components/finance-detain/assessment-report-details.vue";
import PrepareCar from "~/components/purchase-sales-inventory/prepare-car.tsx.vue";
import OrderInfoBasedata from "~/components/order-manage/order-info-base/order-info-basedata.vue";
import { Button } from "iview";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import ModifyCarInfo from "./modify-car-info.vue";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service'
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails
  }
})
export default class VehiclePreparationInfo extends Vue {

  @Prop({ default: () => { } }) callBack: () => void
  @Prop() stockId
  @Prop({
    default: false
  }) isView: boolean
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  private carInfo: any = {};
  private dataPreoareSet: Array<any> = [];
  private dataOrderDetailsSet: Array<any> = [];

  private columnsOrderDetails: any = {};
  private columnsPreoare: any = {};

  private straightRentConsumerDebt: any = {
    moneyType: "现金贷",
    functionType: "回租",
    value: 10237,
  }

  private refreshData() {
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
    this.basicCustomerCarCenterService.queryOrderByCarInfo(this.stockId).subscribe(
      data => (this.dataOrderDetailsSet = data),
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
      },
      {
        align: "center",
        editable: true,
        title: "车检登记",
        key: "inspectId",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        editable: true,
        title: "保险登记",
        key: "insuranceId",
        minWidth: this.$common.getColumnWidth(4),
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

    //订单详情
    this.columnsOrderDetails = [
      {
        align: "center",
        editable: true,
        title: "订单号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.onOrderInfoClick(row.orderId)}>{row.orderNo}</i-button>
        }
      },
      {
        align: "center",
        editable: true,
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        editable: true,
        title: "身份证号",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        editable: true,
        title: "联系电话",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        editable: true,
        title: "下单时间",
        key: "createDate",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dateFormat(row.createDate))
      },
      {
        align: "center",
        editable: true,
        title: "订单状态",
        key: "orderStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$dict.getDictName(row.orderStatus))
      }
    ];
  }

  mounted() {
    this.refreshData()
  }

  /**
  * 车辆整备
  */
  onPrepareCar() {
    this.$dialog.show({
      title: "车辆整备",
      width: 1050,
      onRemove: () => this.refreshData(),
      render: h => h(PrepareCar, {
        props: {
          stockId: this.stockId,
          isView: true
        }
      })
    });
  }
  /**
   * 订单详情
   */
  onOrderInfoClick(orderId) {
    this.$dialog.show({
      title: "订单详情",
      width: 1050,
      render: h => h(OrderInfoBasedata, {
        props: {
          id: orderId,
          isView: true
        }
      })
    });
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
