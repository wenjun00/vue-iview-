<!-- 租赁出库 -->
<template>
  <section class="component lease-out-storage">

    <vehicle-details :carInfo="carInfo" :isView="this.isView" :modifyMileage="modifyMileage"></vehicle-details>

    <vehicle-preparation-info :stockId="stockId"></vehicle-preparation-info>

    <i-card title="租赁出库登记">

      <i-dropdown slot="extra" trigger="click" @on-click="optionChange">
        <a href="javascript:void(0)">
          新增租赁出库材料
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10086)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columnsLeaseOutStorage" :data="carLeaseOutStorage" ref="databox" :height="400"></data-box>
    </i-card>

    <i-card title="出库备注">
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
import VehicleDetails from "./vehicle-details.tsx.vue";
import VehiclePreparationInfo from "./vehicle-preparation-info.tsx.vue";
import ModifyMileage from "./modify-mileage.vue";
import { Dependencies } from "~/core/decorator";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { ImageType } from "~/config/enum.config";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails,
    VehiclePreparationInfo
  }
})
export default class LeaseOutStorage extends Vue {
  @Dependencies(BasicCustomerAssessmentCarService)
  private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Dependencies(BasicCarDetailService)
  basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService)
  basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Prop({ default: () => { } }) callBack: () => void

  @Prop({
    default: 0,
    type: Number
  })
  assessmentId: number;

  @Prop() stockId;

  private carInfo: any = {};
  private carLeaseOutStorage: Array<any> = [];
  private dataLeaseOutStorage: Array<any> = [];

  private columnsLeaseOutStorage: any = {};

  private carImageType: Number; // 上传的资料类型

  private remark: String = ""; // 入库备注
  private isView: boolean = true
  /**
   *获取库存车辆信息，整备状态列表和订单信息
   */
  private refreshData() {
    this.basicCustomerCarCenterService
      .queryCustomerCarStorage(this.stockId)
      .subscribe(
        data => (this.carInfo = data),
        err => this.$Message.error(err.msg)
      );
  }

  mounted() {
    this.refreshData();
  }

  created() {
    this.columnsLeaseOutStorage = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => (
          <div>
            <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.carLeaseOutStorage.splice(index, 1)}>删除</i-button>
          </div>
        )
      },
      {
        align: "center",
        editable: true,
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
  * 修改里程表数
  */
  modifyMileage() {
    this.$dialog.show({
      title: "修改里程表数",
      footer: true,
      width: 1050,
      onOk: modifyMileage => {
        return modifyMileage.submit().then(v => {
          if (v) {
            this.refreshData()
            if (this.callBack) this.callBack();
          }
          return !!v
        })
      },
      render: h => h(ModifyMileage, {
        props: {
          carMileage: this.carInfo.carMileage,
          stockId: this.stockId
        }
      })
    })
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
            this.carLeaseOutStorage.push({
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
   * 提交租赁出库
   */
  submit() {
    let data = {
      stockId: this.stockId,
      basicStockCarPhotoFile: this.carLeaseOutStorage,
      remark: this.remark
    }
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService
        .leaseOutstorage(data)
        .subscribe(
          data => resolve(true),
          err => {
            this.$Message.error(err.msg);
            reject(err);
          }
        );
    });
  }
}
</script>

<style lang="less">
</style>