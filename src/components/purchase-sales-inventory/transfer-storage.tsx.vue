<!--调拨入库-->
<template>
  <section class="component transfer-storage">
    <!-- 车辆详情 -->
    <vehicle-details :carInfo="carInfo"></vehicle-details>

    <!-- 整备信息和调拨计划 -->
    <transfer-plan :stockId="stockId" @getId='getId' @getOutId="getOutId" :isView="isView"></transfer-plan>

    <i-card title="调拨入库登记">
      <div class="upload-materials">
        <i-dropdown trigger="click" slot="extra" @on-click="uploadMaterial">
          <a href="javascript:void(0)">
            新增调拨入库材料
            <i-icon type="arrow-down-b"></i-icon>
          </a>
          <i-dropdown-menu slot="list">
            <i-dropdown-item v-for="{label, value} of $dict.getDictData(10092)" :key="value" :name="value">{{label}}</i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
      </div>
      <data-box :columns="columns" :data="dataSet" ref="databox" :height="300"></data-box>
    </i-card>
    <i-card title="调拨入库备注">
      <i-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="4" :maxlength="100"></i-input>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { Button } from "iview";
import TransferPlan from "./transfer-plan.tsx.vue";
import VehicleDetails from "./vehicle-details.tsx.vue";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import ModifyCarInfo from "~/components/purchase-sales-inventory/modify-car-info.vue";
import { Object } from "core-js";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {
    ModifyCarInfo,
    TransferPlan,
    VehicleDetails
  }
})
export default class TransferStorage extends Vue {
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Dependencies(BasicCarDetailService) basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop({
    default: false
  }) isView: boolean;
  @Prop() stockId
  private carInfo: any = {};
  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private remark: String = ''; // 入库备注
  private id = '';//库存id
  private outOrgId = "" // 调拨至机构Id
  private getOutId(val) {
    this.outOrgId = val
  }
  private getId(val) {
    this.id = val
  }
  /**
   *获取库存车辆信息
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
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>]
          if (!this.isView) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>)
          }
          return h('div', buttons)
        }
      },
      {
        align: "center",
        editable: true,
        title: "图片类型",
        key: "carImageType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => h("span", {}, this.$filter.dictConvert(row.carImageType))
      },
      {
        align: "center",
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
    ]
  }

  /**
   * 选择上传的资料类型后
   */
  private uploadMaterial(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.dataSet.push({
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

  private submit() {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService
        .basicTransferCarInStorage(this.id, this.outOrgId,this.stockId, this.remark, this.dataSet)
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

<style lang="less" scoped>
.component.transfer-storage {
  .upload-materials {
    text-align: right;
    margin: 10px 20px 0px auto;
    .ivu-dropdown-item {
      text-align: left;
    }
  }
}
</style>
