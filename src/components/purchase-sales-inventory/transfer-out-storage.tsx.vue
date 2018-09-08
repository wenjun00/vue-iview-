<!-- 调拨出库 -->
<template>
  <section class="component transfer-out-storage">

    <vehicle-details :carInfo="carInfo"></vehicle-details>

    <transfer-plan :stockId="this.data.stockId" ref="transferPlanSet"></transfer-plan>

    <i-card title="车辆调拨计划">
      <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
        <i-form-item label="现所属机构" prop="inOrgName">
          <i-input v-model="inOrgName" placeholder="现所属机构"></i-input>
        </i-form-item>
        <i-form-item label="计划调拨至机构" prop="outOrgId">
          <i-select v-model="model.outOrgId" clearable>
            <i-option v-for="item in this.deptList" :key="item.id" :label="item.orgName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="物流方式" prop="logisticsWay">
          <i-select v-model="model.logisticsWay" clearable>
            <i-option v-for="{label,value} of $dict.getDictData(10090)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="调拨事由" prop="allocationReason">
          <i-input v-model="model.allocationReason" placeholder="请输调拨事由" :maxlength="20"></i-input>
        </i-form-item>
      </i-form>
    </i-card>
    <i-card title="调拨出库登记">
      <div class="upload-materials">
        <i-dropdown trigger="click" slot="extra" @on-click="optionChange">
          <a href="javascript:void(0)">
            新增调拨出库材料
            <i-icon type="arrow-down-b"></i-icon>
          </a>
          <i-dropdown-menu slot="list">
            <i-dropdown-item v-for="{label, value} of $dict.getDictData(10091)" :key="value" :name="value">{{label}}</i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
      </div>
      <data-box :columns="columnsTransferOutStorage" :data="dataSet" ref="databox" :height="400"></data-box>
    </i-card>

    <i-card title="出库备注">
      <i-input v-model="model.remark" placeholder="请输入备注" type="textarea" :rows="4" :maxlength="100"></i-input>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import VehicleDetails from "./vehicle-details.tsx.vue";
import TransferPlan from "./transfer-plan.tsx.vue";
import { Button } from "iview";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    VehicleDetails,
    TransferPlan
  }
})
export default class TransferOutStorage extends Vue {
  @Dependencies(BasicCustomerAssessmentCarService)
  private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Dependencies(BasicCarDetailService)
  basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService)
  basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop({
    default: 0,
    type: Number
  })
  assessmentId: number;

  @Prop() data;

  private carInfo: any = {};
  private carTransferOutStorage: Array<any> = [];
  private dataSet: Array<any> = [];
  private columnsTransferOutStorage: any = {};

  private dataPreoareSet: Array<any> = [];
  private transferPlanSet: Array<any> = [];
  private deptList: Array<any> = [];

  private transferPlanDetails: any = {};
  private columnsPreoare: any = {};
  private inOrgName: String = "";//调出机构
  // private outOrgId: Number;//调出机构id
  private model: any = null;
  private rules: any = null;

  private carImageType: Number; // 上传的资料类型
  private somedata: ""

  /**
   *获取库存车辆信息
   */
  private refreshData() {
    this.basicCustomerCarCenterService
      .queryCustomerCarStorage(this.data.stockId)
      .subscribe(
        data => (
          this.carInfo = data
        ),
        err => this.$Message.error(err.msg)
      );
  }

  mounted() {
    this.refreshData();
    this.getDeptList();
    this.inOrgName = this.data.orgName
  }

  created() {
    this.model = {
      inOrgId: this.data.orgId,
      outOrgId: "",
      logisticsWay: "",
      allocationReason: "",
      remark: "",
      stockId: this.data.stockId
    }

    this.rules = {
      outOrgId: {
        required: true,
        message: "请选择调拨机构",
        type:"number",
        trigger: "blur",
      },
      logisticsWay: {
        required: true,
        message: "请选择物流方式",
        type:"number",
        trigger: "blur"
      },
      allocationReason: {
        required: true,
        message: "请输入调拨事由",
        trigger: "blur",
      }
    };

    this.columnsTransferOutStorage = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>]
          buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>)
          return h('div', buttons)
        }
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
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryTransferDeptList()
      .subscribe(
        data => { this.deptList = data },
        err => this.$Message.error(err.msg)
      );
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

  /**
   * 提交调拨出库
   */
  submit() {
    let form = this.$refs.form as Form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false);
        this.basicCustomerCarCenterService.basicTransferCarStorage(this.model,this.dataSet).subscribe(
          data => {
            this.$Message.success("操作成功！");
            resolve(true);
          },
          err => this.$Message.error(err.msg)
        );
      });
    });
  }
}
</script>

<style lang="less">
.component.transfer-out-storage {
  .upload-materials {
    text-align: right;
    margin: 10px 20px 0px auto;
    .ivu-dropdown-item {
      text-align: left;
    }
  }
}
</style>