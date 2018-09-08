<!--维护保险记录-->
<template>
  <section class="component modify-insurance-record">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-row :gutter="15">
        <i-col :span="12">
          <i-form-item label="保险终止日" prop="insuranceEndDate">
            <i-date-picker class="form-picker"  v-model="model.insuranceEndDate" placeholder="请选择保险终止日" clearable></i-date-picker>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="交强险单号" prop="jqxNo">
            <i-input v-model="model.jqxNo" placeholder="请输入交强险单号" clearable :maxlength="50"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="保险公司" prop="insuranceCompany">
            <i-input v-model="model.insuranceCompany" placeholder="请输入保险公司" clearable :maxlength="50"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="商业险单号" prop="syNo">
            <i-input v-model="model.syNo" placeholder="请输入商业险单号" clearable :maxlength="50"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="24">
          <i-form-item label="险种备注" prop="insuranceRemark">
            <i-input v-model="model.insuranceRemark" placeholder="请输入险种备注" class="item-full" :maxlength="50" clearable></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="合计金额" prop="totalAmount">
            <i-input-number v-model="model.totalAmount" placeholder="请输入合计金额" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
          </i-form-item>
        </i-col>
        <i-col :span="24">
          <i-card title="保险单据">
            <a slot="extra" @click="editCarModelInfo" v-show="!isView">
              <i-icon type="ios-cloud-upload-outline"></i-icon>
              上传
            </a>
            <data-box :columns="uploadedColumns" :data="uploadedDataSet" :height="0" highlightRow></data-box>
          </i-card>
        </i-col>
      </i-row>
    </i-form>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Dependencies } from "~/core/decorator";
import { Button } from "iview";
import { Prop, Model, Emit, Watch } from "vue-property-decorator";
import { ImageType } from "~/config/enum.config";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";

@Component({})
export default class ModifyInsuranceRecord extends Vue {
  @Dependencies(BasicCarDetailService)
  private basicCarDetailService: BasicCarDetailService;

  @Prop({
    type: Boolean,
    default: false
  })
  isView;

  @Prop() data;
  @Prop() stockId;

  @Model("on-resource-change", {
    default: () => []
  })
  pictureResource: Array<any>;

  /**
   * 文件数量限制
   */
  @Prop() fileNumberLimit: Number;

  private model: any = null;
  private rules: any = null;
  private baiscStockCarFileModel: any = null;
  private type: number;
  private uploadedDataSet: Array<any> = [];
  private uploadedColumns: Array<any> = [];
  // private BaiscStockCarFileModel: Array<any> = [];
  /**
   * 计算是否显示上传按钮
   */
  get hiddenUpload() {
    // 最大写死99个文件
    return this.pictureResource.length >= (this.fileNumberLimit || 99);
  }

  created() {

    this.model = {
      insuranceEndDate: null,
      jqxNo: "",
      insuranceCompany: "",
      syNo: "",
      insuranceRemark: "",
      totalAmount: null
    };

    this.rules = {
      insuranceEndDate: {
        required: true,
        message: "请选择保险终止日",
        trigger: "blur",
        type: "date"
      },
      insuranceCompany: {
        required: true,
        message: "请输入保险公司",
        trigger: "blur"
      },
      insuranceRemark: [
        { required: true, message: "请输入险种备注", trigger: "blur" },
        { max: 200, message: "长度不能超过200个字符", trigger: "blur" }
      ],
      totalAmount: {
        required: true,
        message: "请输入合计金额",
        trigger: "blur",
        type: "number"
      }
    };

    this.uploadedColumns = [
      {
        title: "保险名称",
        key: "fileName",
        width: 150,
        align: "center",
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      },
      {
        title: "文件路径",
        key: "fileUrl",
        align: "center"
      },
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>]
          if (!this.isView) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.uploadedDataSet.splice(index, 1)}>删除</i-button>)
          }
          return h('div', buttons)
        }
      }
    ];
  }

  mounted() {
    if (this.data) {
      this.uploadedDataSet = this.data.basicStockCarFileModels || [];
      this.model = Object.assign({}, this.data);
      this.model.insuranceEndDate = new Date(this.data.insuranceEndDate)
    }
  }

  /**
   * 新增保险记录
   */
  private addInsurance() {
    return new Promise((resolve, reject) => {
      this.basicCarDetailService.addInsuranceRecord(this.model, this.uploadedDataSet, this.stockId).subscribe(
        data => {
          resolve(true)
        }, err => {
          this.$Message.error(err.msg)
          reject(err)
        });
    });
  }

  /**
   * 修改保险记录
   */
  private modifyInsurance() {
    return new Promise((resolve, reject) => {
      this.basicCarDetailService
        .editInsuranceRecord(this.model, this.data.id)
        .subscribe(data => resolve(), err => reject(err));
    });
  }

  /**
   * 上传保险记录相关文件
   */
  editCarModelInfo() {
    let dialog = this.$dialog.show({
      title: `上传保险单据`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.uploadedDataSet.push({
              dataType: v.response.type,
              fileName: v.response.name,
              fileUrl: v.response.url
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => h(FileUpload)
    });
  }

  submit() {
    let form: any = this.$refs.form;
    // for (let i = 0; i < this.uploadedDataSet.length; i++) {
    //   this.baiscStockCarFileModel = {
    //     dataType: this.uploadedDataSet[i].type,
    //     name: this.uploadedDataSet[i].name,
    //     url: this.uploadedDataSet[i].url
    //   };
    //   this.BaiscStockCarFileModel.push(this.baiscStockCarFileModel)
    // }

    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve();
        let result = this.data ? this.modifyInsurance() : this.addInsurance();
        result.then(() => {
          this.$Message.success("操作成功");
          resolve(true);
        }).catch(e => {
          this.$Message.error(e.msg);
          resolve();
        });
      });
    });
  }
}
</script>
<style lang="less">
.component.modify-insurance-record {
  .item-full {
    width: 542px !important;
  }
}
</style>
