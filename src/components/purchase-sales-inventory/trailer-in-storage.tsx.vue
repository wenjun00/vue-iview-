<!--拖车入库-->
<template>
  <section class="component trailer-in-storage">
    <i-card title="车辆基本信息">
      <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
        <i-form-item label="品牌" prop="brandName">
          <i-input v-model="model.brandName" placeholder="请选择品牌" readonly></i-input>
        </i-form-item>
        <i-form-item label="车系" prop="seriesName">
          <i-input v-model="model.seriesName" placeholder="请选择车系" readonly></i-input>
        </i-form-item>
        <i-form-item label="车型" prop="modelName">
          <i-tooltip v-if="model.modelName !== '' " trigger="hover" :content="model.modelName" placement="top">
            <i-input v-model="model.modelName" placeholder="请选择车型" readonly></i-input>
          </i-tooltip>
        </i-form-item>
        <i-form-item label="颜色" prop="stockCarColor">
          <i-input v-model="model.stockCarColor" placeholder="请输入颜色" readonly></i-input>
        </i-form-item>
        <i-form-item label="车架号" prop="stockCarNo">
          <i-input v-model="model.stockCarNo" placeholder="请输入车架号" readonly></i-input>
        </i-form-item>
        <i-form-item label="发动机号" prop="stockEngineNo">
          <i-input v-model="model.stockEngineNo" placeholder="请输入发动机号" readonly></i-input>
        </i-form-item>
        <i-form-item label="车牌号" prop="plateNo">
          <i-input v-model="model.plateNo" placeholder="请输入车牌号" readonly></i-input>
        </i-form-item>
        <i-form-item label="合格证号" prop="certificateNo">
          <i-input v-model="model.certificateNo" placeholder="请输入合格证号" readonly></i-input>
        </i-form-item>
        <i-form-item label="里程表值(公里)" prop="carMileage">
          <i-input-number v-model="model.carMileage" :min="0" :max="9999999" placeholder="请输入里程表值" readonly></i-input-number>
        </i-form-item>
        <i-form-item label="车辆性质" prop="stockCarType">
          <i-select v-model="model.stockCarType" placeholder="请选择车辆性质" disabled>
            <i-option v-for="{label,value} of $dict.getDictData(10060)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="车况" prop="carCondition">
          <i-select v-model="model.carCondition" placeholder="请选择车况" disabled>
            <i-option v-for="{label,value} of $dict.getDictData(10046)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="所属机构" prop="orgName">
          <i-input v-model="model.orgName" placeholder="请输入车牌号" readonly></i-input>
        </i-form-item>
        <i-form-item label="上牌日期" prop="licensingDate">
          <i-date-picker type="date" :options="$common.datePickDisabledDate()" placeholder="请选择上牌日期" v-model="model.licensingDate"></i-date-picker>
        </i-form-item>
        <i-form-item label="入库日期" prop="stockInDate">
          <i-date-picker class="form-picker" placeholder="请选择入库日期" v-model="model.stockInDate" :options="stockInDateOptions" clearable></i-date-picker>
        </i-form-item>
      </i-form>
    </i-card>
    <i-card title="拖车入库登记">
      <i-dropdown trigger="click" slot="extra" @on-click="uploadMaterial">
        <a href="javascript:void(0)">
          新增拖车入库材料
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10088)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columns" :data="dataSet" ref="databox" :height="300"></data-box>
    </i-card>
    <i-card title="入库备注">
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
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { ImageType } from "~/config/enum.config";
import { Object } from "core-js";

@Component({
  components: {
  }
})
export default class TrailerInStorage extends Vue {
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Dependencies(BasicCarDetailService) basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop() stockId

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private remark: String = ''; // 拖车入库备注

  private model: any = null;
  private rules: any = null;
  /**
   *限制入库日期
  */
  private stockInDateOptions: any = null

  created() {
    this.model = {
      brandName: "",
      modelName: "",
      seriesName: "",
      stockCarColor: "",
      stockCarNo: "",
      stockEngineNo: "",
      licensingDate: null,
      plateNo: "",
      certificateNo: "",
      stockCarType: "",
      carCondition: "",
      carMileage: 0,
      orgName: "",
      stockInDate: null,
    };

    this.rules = {
      stockInDate: {
        required: true,
        message: "请选择入库日期",
        trigger: "blur",
        type: "date"
      }
    };
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

  mounted() {
    this.getCarBaseInfo();
    /**
     * 限制入库时间
     */
    this.stockInDateOptions = {
      disabledDate: stockInDate => {
        return stockInDate && stockInDate.valueOf() > Date.now();
      }
    };

    // 限制车辆性质为二手车
    this.model.stockCarType = 10211
  }

  /**
   * 获取车辆基本信息
   */
  getCarBaseInfo() {
    this.basicCustomerCarCenterService
      .queryCustomerCarStorage(this.stockId)
      .subscribe(
        data => {
          let model = Object.assign({}, data);
          model.licensingDate = new Date(model.licensingDate);
          model.stockInDate = model.stockInDate ? new Date(model.stockInDate) : "";
          this.model = model;
        },
        err => this.$Message.error(err.msg)
      );
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
          console.log(this.dataSet,111)
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }


  /**
   * 拖车入库
   */
  private submit() {
    return new Promise(resolve => {
      let form: any = this.$refs['form'];
      form.validate(valid => {
        if (valid) {
          let model = Object.assign({}, this.model)
          model.addStorageCarModels = this.dataSet
          model.remark = this.remark
          model.stockId = this.stockId
          this.basicCustomerCarCenterService.basicPullStockCar(model).subscribe(
            data => resolve(true),
            err => this.$Message.error(err.msg)
          );
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.component.trailer-in-storage {
  .upload-materials {
    text-align: right;
    margin: 10px 20px 0px auto;
    .ivu-dropdown-item {
      text-align: left;
    }
  }
}
</style>
