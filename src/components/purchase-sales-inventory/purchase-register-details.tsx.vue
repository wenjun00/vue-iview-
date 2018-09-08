<!-- 采购登记详情   -->
<template>
  <section class="component purchase-register-details">
    <div class="operate-buttons" v-if="isReview">
      <i-button class="blueButton minWidth" @click="onReviewClick(0)">通过</i-button>
      <i-button class="blueButton minWidth" @click="onReviewClick(1)">退回</i-button>
    </div>
    <i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
      <i-card title="采购单内容">
        <i-form-item prop="supplierId" label="供应商：">
          <i-select v-model="model.supplierId" disabled>
            <i-option v-for="item in this.supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="purchaseDate" label="采购日期：">
          <i-date-picker type="date" v-model="model.purchaseDate" placeholder="请选择采购日期" disabled></i-date-picker>
        </i-form-item>
      </i-card>
    </i-form>

    <i-card title="车辆信息">
      <data-box :columns="columnsVehicle" :data="dataVehicle" ref="databox" :height="0" highlightRow></data-box>
    </i-card>

    <i-card title="采购登记附件">
      <data-box :columns="columns" :data="dataSet" ref="databox" :height="0" highlightRow></data-box>
    </i-card>

    <i-card title="采购进度">
      <data-box v-if="isReview" :columns="columnsSchedules" :data="dataSchedules" ref="databox" :height="0" highlightRow></data-box>
      <data-box v-else :columns="columnsSchedule" :data="dataSchedule" ref="databox" :height="0" highlightRow></data-box>
    </i-card>

    <i-card v-if="isReview" title="复核备注">
      <i-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="4" :maxlength="100"></i-input>
    </i-card>
  </section>
</template>

<script lang="tsx">
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
import { ImageType } from "~/config/enum.config";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class PurchaseRegisterDetails extends Vue {
  @Dependencies(BasicSupplierService) private basicSupplierService: BasicSupplierService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop({ default: () => { } }) callBack: () => void
  @Prop() isView
  @Prop() isReview
  @Prop() isPurchaseDetails
  @Prop() purchaseId
  private dataSet: Array<any> = [];//登记材料
  private supplierList: Array<any> = [];//供应商列表
  private dataSchedule: Array<any> = [];//采购进度(查看)
  private dataSchedules: Array<any> = [];//采购进度(复核)
  private dataVehicle: Array<any> = [];//车辆信息
  private columnsVehicle: any = {};
  private columns: any = {};
  private columnsSchedule: any = {};
  private columnsSchedules: any = {};
  private purchaseType: Number; // 上传的资料类型
  private model: any = {}
  private rules: any = {}
  private remark = "" //备注
  private refreshData() {
    /**
   * 获取供应商列表
   */
    this.basicSupplierService.getBasicSupplierList().subscribe(
      data => this.supplierList = data,
      err => this.$Message.error(err.msg)
    );
    //获取采购登记供应商
    this.basicCustomerCarCenterService.queryPurchaseRegistration(this.purchaseId).subscribe(
      data => {
        this.model.supplierId = data.supplierId
        this.model.purchaseDate = new Date(data.purchaseDate)
      },
    )
    //获取采购车辆信息
    this.basicCustomerCarCenterService.queryPurchaseCarInfo(this.purchaseId).subscribe(
      data => {
        if (data) {
          let totalMoney: any = {
            financingPrice: 0, //融资车价
            guidePrice: 0,    //指导价
            stockPrice: 0,    //采车价
            ticketPrice: 0,   //开票价
            otherPrice: 0,    //其他费用
            stockCarType: ''
          }
          totalMoney.stockCarType = `合计：${data.length}`
          for (let index in data) {
            totalMoney.financingPrice += data[index].financingPrice
            totalMoney.guidePrice += data[index].guidePrice
            totalMoney.stockPrice += data[index].stockPrice
            totalMoney.ticketPrice += data[index].ticketPrice
            totalMoney.otherPrice += data[index].otherPrice
          }
          data.push(totalMoney)
          this.dataVehicle = data
        }
      }
    )
    //获取采购登记材料
    this.basicCustomerCarCenterService.queryPurchaseFile(this.purchaseId).subscribe(
      data => { this.dataSet = data }
    )
    // 获取采购进度
    this.basicCustomerCarCenterService.queryPurchaseProgress(this.purchaseId).subscribe(
      data => {
        if (!this.isReview) {
          if (data) {
            this.dataSchedule = [{
              auditingContent: data.auditingContent,
              auditingResult: data.auditingResult,
              remark: data.remark,
              operatorTime: data.operatorTime
            }]
          } else {
            let dataNow = new Date().getTime()
            this.dataSchedule = [{
              auditingContent: "采购登记",
              auditingResult: "未审核",
              remark: "无",
              operatorTime: dataNow
            }]
          }
        } else {
          let dataNow = new Date().getTime()
          this.dataSchedules = [{
            auditingContent: "采购申请",
            auditingResult: "未审核",
            operatorTime: dataNow
          }]
        }
      }
    )
  }
  mounted() {
    this.refreshData()
  }

  created() {
    this.model = {
      supplierId: "",
      purchaseDate: null
    }
    this.rules = {
      supplierId: {
        required: true,
        message: "请选择供应商",
        trigger: "blur"
      },
      purchaseDate: {
        required: true,
        message: "请选择采购日期",
        trigger: "blur",
        type: "date"
      },
    }

    //车辆信息
    this.columnsVehicle = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if (row.purchaseStatus === 10458 && row.stockStatus === 10456 && (index !== (this.dataVehicle.length - 1))) { //10045未入库 10458复核
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
        minWidth: this.$common.getColumnWidth(6)
      },
      {
        align: "center",
        editable: true,
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(5)
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
        title: "指导价",
        key: "guidePrice",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <div>{this.$filter.toThousands(row.guidePrice)}</div>
      },
      {
        align: "center",
        editable: true,
        title: "采车价",
        key: "stockPrice",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <div>{this.$filter.toThousands(row.stockPrice)}</div>
      },
      {
        align: "center",
        editable: true,
        title: "融资车价",
        key: "financingPrice",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <div>{this.$filter.toThousands(row.financingPrice)}</div>
      },
      {
        align: "center",
        editable: true,
        title: "开票价",
        key: "ticketPrice",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <div>{this.$filter.toThousands(row.ticketPrice)}</div>
      },
      {
        align: "center",
        editable: true,
        title: "其他费用",
        key: "otherPrice",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <div>{this.$filter.toThousands(row.otherPrice)}</div>
      },
      {
        align: "center",
        editable: true,
        title: "附件材料",
        key: "addStorageCarModels",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) => {
          if (index < this.dataVehicle.length - 1) {
            return <i-button type="text" class="row-command-button" onClick={() => this.onPrepareCarAnnex(index)}>附件材料</i-button>
          }
        }
      },
    ]

    //采购登记
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.name)}>下载</i-button>
        }
        // <i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>
      },
      {
        align: "center",
        editable: true,
        title: "图片类型",
        key: "purchaseType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.purchaseType))
      },
      {
        align: "center",
        editable: true,
        title: "文件名",
        key: "stockStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      }
    ];

    //采购进度(查看)
    this.columnsSchedule = [
      {
        align: "center",
        editable: true,
        title: "审核事项",
        key: "auditingContent",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        editable: true,
        title: "审核结果",
        key: "auditingResult",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row, columns, index }) => h("p", {}, this.$filter.dictConvert(row.auditingResult))
      },
      {
        align: "center",
        editable: true,
        title: "复核备注",
        key: "remark",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        editable: true,
        title: "采购时间",
        key: "operatorTime",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) => h("span", {}, this.$filter.dateFormat(row.operatorTime))
      }
    ];
    //采购进度(复核)
    this.columnsSchedules = [
      {
        align: "center",
        editable: true,
        title: "审核事项",
        key: "auditingContent",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        editable: true,
        title: "审核结果",
        key: "auditingResult",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        editable: true,
        title: "采购时间",
        key: "operatorTime",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) => h("span", {}, this.$filter.dateFormat(row.operatorTime))
      }
    ];
  }

  /**
   * 复核退回或通过
   */
  private onReviewClick(type: number) {
    let model = {
      purchaseId: this.purchaseId,
      reviewRemark: this.remark,
      type: type
    }
    this.$Modal.confirm({
      content: `是否确定此操作？`,
      onOk: () => {
        this.basicCustomerCarCenterService.basicPurchaseReview(model).subscribe(
          data => {
            this.$Message.success(`操作成功！`)
            this.$dialog.clear()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
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