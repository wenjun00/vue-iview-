<!-- 采购登记 -->
<template>
  <section class="component purchase-register">
    <i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
      <i-card title="采购单内容">
        <i-form-item prop="supplierId" label="供应商：">
          <i-select v-model="model.supplierId" clearable>
            <i-option v-for="item in this.supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="purchaseDate" label="采购日期：">
          <i-date-picker type="date" v-model="model.purchaseDate" :options="$common.datePickDisabledDate()" placeholder="请选择采购日期"></i-date-picker>
        </i-form-item>
      </i-card>
    </i-form>

    <i-card title="车辆信息">
      <a v-if="!isView" slot="extra" @click="addPurchaseVehicle">
        <i-icon type="add"></i-icon>
        新增车辆信息
      </a>
      <data-box :columns="columnsVehicle" :data="dataVehicle" ref="databox" :height="0" highlightRow></data-box>
    </i-card>

    <i-card title="采购登记">
      <i-dropdown slot="extra" trigger="click" @on-click="optionChange">
        <a href="javascript:void(0)">
          新增采购登记附件
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10098)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columns" :data="dataSet" ref="databox" :height="0" highlightRow></data-box>
    </i-card>

    <i-card title="采购进度">
      <data-box :columns="columnsSchedule" :data="dataSchedule" ref="databox" :height="0" highlightRow></data-box>
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
import ModifyMileage from "./modify-mileage.vue";
import PrepareCarAnnex from "./prepare-car-annex.tsx.vue";
import AddPurchaseVehicle from "./add-purchase-vehicle.vue";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { BasicSupplierService } from "~/services/manage-service/basic-supplier.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { Object } from "core-js";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class PurchaseRegister extends Vue {
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(BasicSupplierService) private basicSupplierService: BasicSupplierService;
  @Prop({ default: () => { } }) callBack: () => void
  @Prop() data
  @Prop() isView
  private dataSet: Array<any> = [];//登记材料
  private supplierList: Array<any> = [];//供应商列表
  private dataSchedule: Array<any> = [];//采购进度
  private dataVehicle: Array<any> = [];//车辆信息
  private columnsVehicle: any = {};
  private columns: any = {};
  private columnsSchedule: any = {};
  private purchaseType: Number; // 上传的资料类型

  private model: any = {}
  private rules: any = {}
  private totalMoney: any = {
    financingPrice: 0, //融资车价
    guidePrice: 0,    //指导价
    stockPrice: 0,    //采车价
    ticketPrice: 0,   //开票价
    otherPrice: 0,    //其他费用
    stockCarType: ''
  }

  private refreshData() {
    /**
   * 获取供应商列表
   */
    this.basicSupplierService.getBasicSupplierList().subscribe(
      data => this.supplierList = data,
      err => this.$Message.error(err.msg)
    );
    //获取采购登记供应商
    this.basicCustomerCarCenterService.queryPurchaseRegistration(this.data.purchaseId).subscribe(
      data => {
        this.model.supplierId = data.supplierId
        this.model.purchaseDate = new Date(data.purchaseDate)
      },
    )
    //获取采购车辆信息
    this.basicCustomerCarCenterService.queryPurchaseCarInfo(this.data.purchaseId).subscribe(
      data => {
        if (data) {
          this.totalMoney.stockCarType = `合计${data.length}`
          for (let index in data) {
            this.totalMoney.financingPrice += data[index].financingPrice
            this.totalMoney.guidePrice += data[index].guidePrice
            this.totalMoney.stockPrice += data[index].stockPrice
            this.totalMoney.ticketPrice += data[index].ticketPrice
            this.totalMoney.otherPrice += data[index].otherPrice
          }
          data.push(this.totalMoney)
          this.dataVehicle = data
        }
      }
    )
    //获取采购登记材料
    this.basicCustomerCarCenterService.queryPurchaseFile(this.data.purchaseId).subscribe(
      data => { this.dataSet = data }
    )
  }

  mounted() {
    this.getSupplierList();//获取供应商列表
    if (this.data) { this.refreshData() }
    this.getSchedule()
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
        trigger: "blur",
        type: "number"
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
          if (index < this.dataVehicle.length - 1) {
            if (this.isView) { //复核拒绝
              return <i-button type="text" class="row-command-button" onClick={() => this.editCarInfo(row, index)}>修改</i-button>
            }else{
              return <i-button type="text" class="row-command-button" onClick={() => this.deleteDataVehicle(index)}>删除</i-button>

            }
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
        title: "融资车价",
        key: "financingPrice",
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
          if (index < this.dataVehicle.length - 1) {
            return <i-button type="text" class="row-command-button" onClick={() => this.onPrepareCarAnnex(index)}>附件材料</i-button>
          }
        }
      }
    ]

    //采购登记
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => (
          <div>
            <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>
          </div>
        )
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

    //采购进度
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
  }

  /**
   * 采购进度
   */
  private getSchedule() {
    let dataNow = new Date().getTime()
    this.dataSchedule = [{
      auditingContent: "采购登记",
      auditingResult: "未审核",
      remark: "无",
      operatorTime: dataNow
    }]
  }
  /**
   * 获取供应商列表
   */
  private getSupplierList() {
    this.basicSupplierService.getBasicSupplierList().subscribe(
      data => this.supplierList = data,
      err => this.$Message.error(err.msg)
    );
  }

  /**
   * 删除车辆信息，重新计算合计行
   */
  private deleteDataVehicle(index) {
    this.dataVehicle.splice(index, 1)
    this.dataVehicle.pop()
    this.onTotal(this.dataVehicle)
    if (this.dataVehicle.length == 1) this.dataVehicle.pop() //没车辆信息时，同时删除合计行
  }

  /**
   * 获取采购车辆信息，并合计
   */
  private onCarTotal(val) {
    this.dataVehicle.pop()
    this.dataVehicle.push(val)
    this.onTotal(this.dataVehicle)
  }

  /**
   * 清空原合计行的值，并重新计算
   */
  private onTotal(data) {
    this.totalMoney = {
      financingPrice: 0, //融资车价
      guidePrice: 0,    //指导价
      stockPrice: 0,    //采车价
      ticketPrice: 0,   //开票价
      otherPrice: 0,    //其他费用
      stockCarType: ''
    }
    this.totalMoney.stockCarType = `合计${data.length}`
    for (let index in data) {
      this.totalMoney.financingPrice += data[index].financingPrice
      this.totalMoney.guidePrice += data[index].guidePrice
      this.totalMoney.stockPrice += data[index].stockPrice
      this.totalMoney.ticketPrice += data[index].ticketPrice
      this.totalMoney.otherPrice += data[index].otherPrice
    }
    data.push(this.totalMoney)
    this.dataVehicle = data
  }
  /**
   * 添加车辆
   */
  addPurchaseVehicle() {
    this.$dialog.show({
      title: "添加车辆",
      footer: true,
      width: 1050,
      onOk: addPurchaseVehicle => {
        return addPurchaseVehicle.submit().then(v => {
          if (v) {
            this.onCarTotal(v)
            if (this.callBack) this.callBack();
          }
          return !!v
        })
      },
      render: h => <AddPurchaseVehicle isView={true}></AddPurchaseVehicle>
    })
  }

  /**
   * 编辑车辆基本信息
   */
  editCarInfo(data, index) {
    this.$dialog.show({
      title: "修改车辆信息",
      footer: true,
      width: 1050,
      onOk: addPurchaseVehicle => {
        return addPurchaseVehicle.submit().then(v => {
          if (v) {
            this.dataVehicle[index] = v
            this.dataVehicle.pop()
            this.onTotal(this.dataVehicle)
            this.dataVehicle = [...this.dataVehicle]
            if (this.callBack) this.callBack();
          }
          return !!v
        })
      },
      render: h => <AddPurchaseVehicle data={data} isView={true}></AddPurchaseVehicle>
    })
  }

  /**
   * 附件材料 
   */
  private onPrepareCarAnnex(index) {
    this.$dialog.show({
      title: "采购登记附件",
      footer: true,
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
      render: h => <PrepareCarAnnex data={this.dataVehicle[index].addStorageCarModels} isView="true"></PrepareCarAnnex>
    });
  }

  /**
   * 选择资料类型后
   */
  optionChange(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 1000,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.dataSet.push({
              dataType: v.response.type,
              fileName: v.response.name,
              fileUrl: v.response.url,
              purchaseType: val
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }

  private addPurchaseRegister(data) {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService.addPurchaseInfo(data).subscribe(
        data => resolve(true),
        err => reject(err)
      );
    });
  }

  private modifyPurchaseRegister(data) {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService.updatePurchaseCarInfo(data).subscribe(
        data => resolve(true),
        err => reject(err)
      );
    });
  }



  /**
   * 提交采购登记
   */
  submit() {
    this.dataVehicle.map(v => {
      if ("addStorageCarModels" in v) {
        return
      } else {
        v.addStorageCarModels = []
      }
    })
    let data = Object.assign([], this.dataVehicle)
    data.pop()//删除合计行
    let addData = {
      supplierId: this.model.supplierId,//供应商ID
      purchaseDate: this.$filter.dateFormat(this.model.purchaseDate),//采购日期
      addStockCarModels: data,//采购车辆信息
      basicStockCarPurchaseModels: this.dataSet,//采购登记材料 ''
    }
    let modifyData = {}
    if (this.data) {
      modifyData = {
        supplierId: this.model.supplierId,//供应商ID
        purchaseDate: this.$filter.dateFormat(this.model.purchaseDate),//采购日期
        addStockCarModels: data,//采购车辆信息
        basicStockCarPurchaseModels: this.dataSet,//采购登记材料
        purchaseId: this.data.purchaseId,
        stockId: this.data.stockId
      }
    }
    let form = this.$refs['form'] as Form
    return new Promise((resolve, reject) => {
      form.validate(v => {
        if (!v) return reject();
        let result = this.data ? this.modifyPurchaseRegister(modifyData) : this.addPurchaseRegister(addData);
        result
          .then(v => {
            this.$Message.success("操作成功");
            resolve(v);
          })
          .catch(e => {
            this.$Message.error(e.msg);
            reject();
          });
      });
    });
  }

  private assembleData() {

  }
}
</script>

<style lang="less">
</style>