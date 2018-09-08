<!-- 采购登记详情   -->
<template>
  <div>
    <page-header title="采购详情" hidden-print hidden-export></page-header>
    <data-box :columns="columnsVehicle" :data="dataVehicle" ref="databox" highlightRow :height='200'></data-box>
  </div>
</template>

<script lang="tsx">
import Page from "~/core/page";
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { Button } from "iview";
import { Prop } from "vue-property-decorator";
import PrepareCarAnnex from "./prepare-car-annex.tsx.vue";
import PurchaseInStorage from "./purchase-in-storage.tsx.vue";
import { Dependencies } from "~/core/decorator";
import { BasicSupplierService } from "~/services/manage-service/basic-supplier.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";

@Component({})
export default class PurchaseVehicleDetails extends Page {
  @Dependencies(BasicSupplierService) private basicSupplierService: BasicSupplierService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop({ default: () => { } }) callBack: () => void
  @Prop() isView
  @Prop() isInStorage
  @Prop() purchaseId
  private dataVehicle: Array<any> = [];//车辆信息
  private columnsVehicle: any = {};
  private inStorage: boolean = true

  private totalMoney:any = {
    financingPrice:0, //融资车价
    guidePrice:0,    //指导价
    stockPrice:0,    //采车价
    ticketPrice:0,   //开票价
    otherPrice:0,    //其他费用
    stockCarType:''
  }

  private refreshData() {
    //获取采购车辆信息
    this.basicCustomerCarCenterService.queryPurchaseCarInfo(this.purchaseId).subscribe(
      data => {
        if(data){
          this.totalMoney.stockCarType = `合计${data.length}`
          for(let index in data){
            this.totalMoney.financingPrice+= data[index].financingPrice
            this.totalMoney.guidePrice+= data[index].guidePrice
            this.totalMoney.stockPrice+= data[index].stockPrice
            this.totalMoney.ticketPrice+= data[index].ticketPrice
            this.totalMoney.otherPrice+= data[index].otherPrice
          }
          data.push(this.totalMoney)
          this.dataVehicle = data
        }
      }
    )
  }
  mounted() {
    this.refreshData()
  }

  created() {
    //车辆信息
    this.columnsVehicle = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if(index !== this.dataVehicle.length-1 && row.stockStatus === 10456 && row.purchaseStatus === 10458){//10456 未入库 10458复核通过
            return <i-button type="text" class="row-command-button" onClick={() => this.onPurchaseInStorage(row)}>采购入库</i-button>
          }
        }
      },
      {
        align: "center",
        editable: true,
        title: "品牌",
        key: "brandName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "车系",
        key: "seriesName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "车型",
        key: "modelName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "颜色",
        key: "stockCarColor",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "车辆性质",
        key: "stockCarType",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) => h("p", {}, this.$filter.dictConvert(row.stockCarType))
      },
      {
        align: "center",
        editable: true,
        title: "融资车价",
        key: "financingPrice",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "指导价",
        key: "guidePrice",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "采车价",
        key: "stockPrice",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "开票价",
        key: "ticketPrice",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "其他费用",
        key: "otherPrice",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "附件材料",
        key: "addStorageCarModels",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) => {
          if(index !== this.dataVehicle.length-1){
            return <i-button type="text" class="row-command-button" onClick={() => this.onPrepareCarAnnex(index)}>附件材料</i-button>
          }
        }
      }
    ]
  }

  /**
   * 附件材料
   */
  private onPrepareCarAnnex(index) {
    this.$dialog.show({
      title: "采购登记附件",
      // footer: true,
      width: 1050,
      onOk: prepareCarAnnex => {
        prepareCarAnnex.submit().then(v => {
          if (v) {
            //将附件赋值给附件列表
            this.dataVehicle[index].addStorageCarModels = v
            if (this.callBack) this.callBack();
          }
          return !!v
        })
      },
      render: h => <PrepareCarAnnex data={this.dataVehicle[index].addStorageCarModels} isView={false}></PrepareCarAnnex>
    });
  }

  /**
   * 采购入库
   */
  onPurchaseInStorage(data) {
    this.$dialog.show({
      title: "采购入库",
      width: 1050,
      footer: true,
      onOk: purchaseInStorage => {
        return purchaseInStorage.submit().then(v => {
          // if (v) this.inStorage = false;
          this.refreshData()
          return v;
        })
      },
      render: h => <PurchaseInStorage data={data}></PurchaseInStorage>
    });
  }
}
</script>

<style lang="less" scoped>
.component.purchase-register-details {
  .operate-buttons {
    text-align: right;
    margin: 10px 0;
  }
}
</style>
