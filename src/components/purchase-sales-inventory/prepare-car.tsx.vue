<!-- 车辆整备 -->
<template>
  <section class="component prepare-car">
    <div class="operate-buttons">
      <div v-if="prepareStatus">
        <i-button class="blueButton minWidth" @click="onAgainPrepareClick">重新整备</i-button>
      </div>
      <div v-else>
        <i-button class="blueButton minWidth" @click="onPrepareClick">车辆整备</i-button>
      </div>
    </div>

    <vehicle-details :carInfo="carInfo"></vehicle-details>

    <i-card title="GPS记录">
      <a slot="extra" @click="addGPS" v-show="!prepareStatus">
        <i-icon type="edit"></i-icon>
        新增GPS记录
      </a>
      <data-box :columns="columnsGPS" :data="dataSet" @on-page-change="refreshGps" ref="databox" :height="200"></data-box>
    </i-card>
    <i-card title="保险记录">
      <a slot="extra" @click="addInsurance" v-show="!prepareStatus">
        <i-icon type="edit"></i-icon>
        新增保险记录
      </a>
      <data-box :columns="columnsInsurance" :data="dataInsuranceSet" @on-page-change="refreshInsurance" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="车检记录">
      <a slot="extra" @click="addInspection" v-show="!prepareStatus">
        <i-icon type="edit"></i-icon>
        新增车检记录
      </a>
      <data-box :columns="columnsVehicleInspection" :data="dataVehicleInspectionSet" @on-page-change="refreshInspection" ref="databox" :height="200"></data-box>
    </i-card>

    <i-card title="车辆图片">
      <i-dropdown trigger="click" v-show="!prepareStatus" slot="extra" @on-click="optionChange">
        <a href="javascript:void(0)">
          新增图片类型
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10083)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columnsCarPhoto" :data="dataCarPhoto" ref="databox" :height="400"></data-box>
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
import ModifyCarInfo from "./modify-car-info.vue";
import VehicleDetails from "./vehicle-details.tsx.vue";
import PrepareCarAddGPS from "./prepare-car-add-gps.tsx.vue";
import ModifyInsuranceRecord from "./modify-insurance-record.tsx.vue";
import ModifyYearlyCheckRecord from "./modify-yearly-check-record.tsx.vue";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails
  }
})
export default class PrepareCar extends Vue {
  // @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService

  /** 是否可编辑 */
  @Prop({ default: false })
  edit: Boolean;
  @Prop({ default: () => { } })
  callBack: () => void;

  @Prop() stockId;
  @Prop() id: Number;
  @Dependencies(BasicCarDetailService)
  private basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(SysDictService) sysDictService: SysDictService;

  private carInfo: any = {};
  private dataSet: Array<any> = [];
  private dataInsuranceSet: Array<any> = [];
  private dataVehicleInspectionSet: Array<any> = [];
  private dataCarPhoto: Array<any> = [];
  private carPhotoDictData: Array<any> = [];

  private columnsCarPhoto: any = {};
  private columnsGPS: any = {};
  private columnsInsurance: any = {};
  private columnsVehicleInspection: any = {};
  private carImageType: Number; // 上传的资料类型
  private prepareStatus: Boolean = false; // 车辆整备状态

  private refreshData() {
    this.basicCustomerCarCenterService
      .queryCustomerCarStorage(this.stockId)
      .subscribe(
        data => {
          this.carInfo = data,
            this.prepareStatus = data.preparStatus === this.$enum.Prepare.PREPARE_SUCCESS ? true : false
        },
        err => this.$Message.error(err.msg)
      );
  }
  
  /**
   * 刷新图片列表
   */
  private refreshPhoto() {
    this.basicCarDetailService
      .selectCarPhoto(this.stockId)
      .subscribe(
        data => (this.dataCarPhoto = data),
        err => this.$Message.error(err.msg)
      );
  }
  /**
   *刷新gps列表
   */
  private refreshGps() {
    this.basicCarDetailService
      .queryCarGpsPage(this.stockId)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }
  /**
   *刷新保险列表
   */
  private refreshInsurance() {
    this.basicCarDetailService
      .queryInsuranceRecord(this.stockId)
      .subscribe(
        data => (this.dataInsuranceSet = data),
        err => this.$Message.error(err.msg)
      );
  }
  /**
   * 刷新车检记录
   */
  private refreshInspection() {
    this.basicCarDetailService
      .queryCarInspectionRecord(this.stockId)
      .subscribe(
        data => (this.dataVehicleInspectionSet = data),
        err => this.$Message.error(err.msg)
      );
  }
  mounted() {
    this.refreshData();
    this.refreshGps();
    this.refreshInsurance();
    this.refreshInspection();
    this.refreshPhoto();
  }

  created() {
    this.columnsGPS = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          if(!this.prepareStatus) {
            return (<i-button type="text" class="row-command-button" onClick={() => this.modifyGPS(row)}>修改</i-button>)
          }
        }
      },
      {
        align: "center",
        editable: true,
        title: "设备厂家",
        key: "gpsManufactor",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.gpsManufactor))
      },
      {
        align: "center",
        editable: true,
        title: "设备号",
        key: "gpsNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "GPS安装状态",
        key: "gpsStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => {
          return h(
            "span",
            {},
            this.$filter.dictConvert(row.gpsStatus)
          );
        }
      },
      {
        align: "center",
        editable: true,
        title: "操作人",
        key: "userRealName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "操作日期",
        key: "operatorTime",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dateFormat(row.operatorTime))
      }
    ];

    //保险
    this.columnsInsurance = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          if(!this.prepareStatus) {
            return <i-button type="text" class="row-command-button" onClick={() => this.modifyInsurance(row)}>修改</i-button>
          }
        }
      },
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
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          if(!this.prepareStatus) {
            return <i-button type="text" class="row-command-button" onClick={() => this.modifyInspection(row)}>修改</i-button>
          }
        }
      },
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
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if(!this.prepareStatus) {
            return (<div>
                <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
                <i-button type="text" class="row-command-button" onClick={() => this.dataCarPhoto.splice(index, 1)}>删除</i-button>
              </div>)
          }
        }
      },
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
      }
    ];
  }

  /**
   * 修改GPS记录
   */
  modifyGPS(row) {
    this.$dialog.show({
      title: "修改GPS",
      footer: true,
      width: 700,
      onOk: prepareCarAddGPS => {
        return prepareCarAddGPS.submit().then(v => {
          if (v) {
            this.refreshGps();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(PrepareCarAddGPS, {
          props: {
            data: row,
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 新增GPS记录
   */
  addGPS() {
    this.$dialog.show({
      title: "新增GPS记录",
      footer: true,
      width: 700,
      onOk: prepareCarAddGPS => {
        return prepareCarAddGPS.submit().then(v => {
          if (v) {
            this.refreshGps();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(PrepareCarAddGPS, {
          props: {
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 修改保险记录
   */
  modifyInsurance(row) {
    this.$dialog.show({
      title: "修改保险记录",
      footer: true,
      width: 700,
      onOk: modifyInsuranceRecord => {
        return modifyInsuranceRecord.submit().then(v => {
          if (v) {
            this.refreshInsurance();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(ModifyInsuranceRecord, {
          props: {
            data: row,
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 新增保险记录
   */
  addInsurance() {
    this.$dialog.show({
      title: "新增保险记录",
      footer: true,
      width: 700,
      onOk: modifyInsuranceRecord => {
        return modifyInsuranceRecord.submit().then(v => {
          if (v) {
            this.refreshInsurance();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(ModifyInsuranceRecord, {
          props: {
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 修改车检记录
   */
  modifyInspection(row) {
    this.$dialog.show({
      title: "修改车检记录",
      footer: true,
      width: 700,
      onOk: modifyYearlyCheckRecord => {
        return modifyYearlyCheckRecord.submit().then(v => {
          if (v) {
            this.refreshInspection();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(ModifyYearlyCheckRecord, {
          props: {
            data: row,
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 新增车检记录
   */
  addInspection() {
    this.$dialog.show({
      title: "新增车检记录",
      footer: true,
      width: 700,
      onOk: modifyYearlyCheckRecord => {
        return modifyYearlyCheckRecord.submit().then(v => {
          if (v) {
            this.refreshInspection();
            if (this.callBack) this.callBack();
          }
          return !!v;
        });
      },
      render: h =>
        h(ModifyYearlyCheckRecord, {
          props: {
            stockId: this.stockId
          }
        })
    });
  }

  /**
   * 选择资料类型后
   */
  optionChange(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.dataCarPhoto.push({
              dataType: v.response.type,
              fileName: v.response.name,
              fileUrl: v.response.url,
              carImageType: val
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }

  /**
   * 车辆整备
   */
  private onPrepareClick() {
    let data = {
      gpsId: this.editData(this.dataSet),
      inspectId: this.editData(this.dataVehicleInspectionSet),
      insuranceId: this.editData(this.dataInsuranceSet),
      stockId: this.stockId,
      basicStockCarPhotoFile: this.dataCarPhoto
    }
    this.basicCustomerCarCenterService.basicCarPrepare(data).subscribe(
      data => {
        this.prepareStatus = true
        this.$Message.success('操作成功！')
        this.$dialog.clear()
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 重新整备
   */
  private onAgainPrepareClick() {
    this.basicCustomerCarCenterService.updatePrepareStatus(this.stockId).subscribe(
      data => this.prepareStatus = false,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 截取数组中id转为字符串（'id1,id2,id3....'）
   */
  private editData(arr) {
    let result: Array<number> = [];
    if (arr.length !== 0) {
      arr.map(v => {
        result.push(v.id)
      })
    }
    return result.join(',')
  }
}
</script>

<style lang="less">
.component.prepare-car {
  .upload-materials {
    text-align: right;
    margin: 10px 20px 0px auto;
    .ivu-dropdown-item {
      text-align: left;
    }
  }
  .operate-buttons {
    text-align: right;
    margin: 10px 0;
  }
  .minWidth {
    min-width: 90px;
  }
}
</style>
