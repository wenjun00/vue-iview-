<!-- 评估入库 -->
<template>
  <section class="component assessment-rstorage">
    <i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
      <i-card title="车辆信息">
        <i-form-item label="品牌" prop="brandName">
          <i-input v-model="model.brandName" placeholder="请选择品牌" readonly></i-input>
        </i-form-item>
        <i-form-item label="车系" prop="seriesName">
          <i-input v-model="model.seriesName" placeholder="请选择车系" readonly></i-input>
        </i-form-item>
        <i-form-item label="车型" prop="modelName">
          <i-tooltip trigger="hover" :content="model.modelName" placement="top" readonly>
            <i-input v-model="model.modelName" placeholder="请选择车型" readonly></i-input>
          </i-tooltip>
        </i-form-item>
        <i-form-item label="车辆颜色" prop="color" :readonly="isView">
          <i-input v-model="model.color" placeholder="请输入颜色,如'红色'" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="发动机号" prop="stockEngineNo" :readonly="isView">
          <i-input v-model="model.stockEngineNo" placeholder="请输发动机号" :maxlength="8"></i-input>
        </i-form-item>
        <i-form-item label="合格证号" prop="certificateNo">
          <i-input v-model="model.certificateNo" placeholder="请输入合格证号" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="上牌日期" prop="regDate" :readonly="isView">
          <i-date-picker type="month" placeholder="请选择上牌日期" v-model="model.regDate"></i-date-picker>
        </i-form-item>
        <i-form-item label="发证日期" prop="issueDate" :readonly="isView">
          <i-date-picker type="date" placeholder="请选择发证日期" v-model="model.issueDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
        </i-form-item>
        <i-form-item label="注册日期" prop="registerDate" :readonly="isView">
          <i-date-picker type="date" placeholder="请选择注册日期" v-model="model.registerDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
        </i-form-item>
        <i-form-item label="车辆性质" prop="isSecondHand">
          <i-select v-model="model.isSecondHand" placeholder="请选择车辆性质" :disabled="!isView">
            <i-option v-for="{value,label} in $dict.getDictData(10060)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="车架号" prop="stockCarNo" :readonly="isView">
          <i-input v-model="model.stockCarNo" placeholder="请输入车架号" :maxlength="17"></i-input>
        </i-form-item>
        <i-form-item label="车牌号" prop="carNo" :readonly="isView">
          <i-input v-model="model.carNo" placeholder="请输入车牌号" :maxlength="10"></i-input>
        </i-form-item>
        <i-form-item label="车况" prop="assessmentCarStatus">
          <i-select v-model="model.assessmentCarStatus" placeholder="请选择车况">
            <i-option v-for="{label,value} of $dict.getDictData(10046)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="选择机构" prop="deptName" :readonly="isView">
          <i-input v-model="model.deptName" placeholder="请选择机构" readonly>
          <i-button icon="search" slot="append" @click="onSelectOrgClick"></i-button>
        </i-input>
        </i-form-item>
        <i-form-item label="入库时间" prop="stockDate" :readonly="isView">
          <i-date-picker type="date" v-model="model.stockDate" placeholder="请选择入库日期"></i-date-picker>
        </i-form-item>
      </i-card>

      <i-card title="车辆评估单">
        <i-form-item label="内饰状况" prop="interior">
          <i-select v-model="model.interior" placeholder="请选择内饰状况" :disabled="isView">
            <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="公里数漆面状况" prop="surface" :readonly="isView">
          <i-select v-model="model.surface" placeholder="请选择漆面状况">
            <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="过户次数" prop="transferNo" :readonly="isView">
          <i-input-number v-model="model.transferNo" placeholder="请输入过户次数" :min="0" :max="99"></i-input-number>
          <span>次</span>
        </i-form-item>
        <i-form-item label="工况状况" prop="workState">
          <i-select v-model="model.workState" placeholder="请选择工况状况" :disabled="isView">
            <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="出厂日期" prop="makeDate" :readonly="isView">
          <i-date-picker type="month" placeholder="请选择出厂日期" v-model="model.makeDate" :options="$common.datePickDisabledDateCustomer()" :disabled="!model.regDate"></i-date-picker>
        </i-form-item>
        <i-form-item label="行驶里程" prop="mile" :readonly="isView">
          <i-input-number v-model="mile" placeholder="请输入行驶里程" :min="0" :max="9999999"></i-input-number>
          <span>万公里</span>
        </i-form-item>
      </i-card>
    </i-form>
    <i-form :label-width="150" :rules="assessmentRules" :model="assessmentPrice" ref="formAssessment" inline>
      <i-card title="参考定价">
        <i-form-item label="参考最高价(万元)" prop="highAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="highAssessmentPrice" placeholder="请输入估价" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :min="lowAssessmentPrice || 0" :max="9999"></i-input-number>
        </i-form-item>
        <i-form-item label="参考最低价(万元)" prop="lowAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="lowAssessmentPrice" placeholder="请先填写最高估价" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :min="0" :max="highAssessmentPrice || 0" :disabled="!highAssessmentPrice"></i-input-number>
        </i-form-item>
      </i-card>

      <i-card title="精准价格">
        <i-form-item label="精准估价(万元)" prop="precisionAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="precisionAssessmentPrice" placeholder="请输入估价" :formatter="$filter.moneyFormat" :min="0" :max="9999" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
      </i-card>
    </i-form>
    <i-card title="检测报告" position:absolute>
      <a slot="extra" @click="showFileUpload" v-show="!isView">
        <Icon type="arrow-up-c"></Icon>
        上传
      </a>
      <data-box :height="300" :columns="uploadedColumns" :data="uploadedDataSet" highlightRow></data-box>
    </i-card>

    <i-card title="入库登记">
      <i-dropdown trigger="click" slot="extra" @on-click="optionChange">
        <a href="javascript:void(0)">
          新增入库材料
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10084)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columnsCarMaterials" :data="carRstorageMaterials" ref="databox" :height="300"></data-box>
    </i-card>
    <i-card title="入库备注">
      <i-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="4" :maxlength="100"></i-input>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Button } from "iview";
import { Form } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import ChooseOrgsPurchase from "~/components/purchase-sales-inventory/choose-orgs-purchase.tsx.vue";
import { ImageType } from "~/config/enum.config";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";

@Component({
  components: {
    ChooseOrgsPurchase
  }
})
export default class AssessmentStorage extends Vue {
  @Dependencies(BasicCustomerAssessmentCarService)
  private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;
  @Dependencies(BasicCustomerCarCenterService)
  basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop({
    default: 0,
    type: Number
  })
  assessmentId: number;
  @Prop({
    default: false,
    type: Boolean
  })
  isView: boolean;

  @Prop() id;

  private carRstorageMaterials: Array<any> = [];
  private dataCarMaterials: Array<any> = [];
  private columnsCarMaterials: any = {};

  private carImageType: Number; // 上传的资料类型

  /**
   * 文件数量限制
   */
  @Prop() fileNumberLimit: Number;

  private uploadedDataSet: Array<any> = [];
  private uploadedColumns: Array<any> = [];
  private data3: Array<any> = [];

  private assessmentPrice: any = {
    highAssessmentPrice: null,
    lowAssessmentPrice: null,
    precisionAssessmentPrice: null
  };

  private dialog = {
    selectedCustomer: false
  };

  /**
   *限制出厂日期
   */
  private makeDateOptions: any = null;

  private assessment = "Asessment";
  private remark = "";
  //车型
  private modelName: String = "";
  //车系
  private seriesName: String = "";
  private deptList: Array<any> = [];

  private model: any = {
    carId: "",
    //车架号
    stockCarNo: "",
    //车辆性质
    isSecondHand: 10211,
    //车况
    assessmentCarStatus: "",
    //车牌号
    carNo: "",
    //客户姓名
    name: "",
    //联系电话
    phone: "",
    //品牌
    brandName: "",
    seriesName: "",
    modelName: "",
    //车型id
    modelId: "",
    //车辆颜色
    color: "",
    // 行驶里程
    mile: 0,
    //城市
    zone: "",
    // 过户次数
    transferNo: 0,
    // 出厂日期
    makeDate: null,
    // 工况状况
    workState: "",
    // 上牌日期
    regDate: null,
    issueDate: null,//发证日期
    registerDate: null,//注册日期
    //内饰状况
    interior: "",
    // 公里数漆面状况
    surface: "",
    stockEngineNo: "",
    certificateNo: "",
    deptId: "",
    deptName:"",
    stockDate: ""
  };

  private rules = {
    // 上牌日期
    regDate: {
      required: true,
      message: "请选择上牌日期",
      trigger: "blur",
      type: "date"
    },
    issueDate: {
      required: true,
      message: "请选择注册日期",
      trigger: "blur",
      type: "date"
    },
    registerDate: {
      required: true,
      message: "请选择发证日期",
      trigger: "blur",
      type: "date"
    },
    // 出厂日期
    makeDate: {
      required: true,
      message: "请选择出厂日期",
      trigger: "blur",
      type: "date"
    },
    // 入库日期
    stockDate: {
      required: true,
      message: "请选择入库日期",
      trigger: "blur",
      type: "date"
    },
    mile: {
      required: true,
      type: "number",
      message: "请输入行驶里程",
      trigger: "blur"
    },
    color: {
      required: true,
      type: "string",
      message: "请输入颜色,如'红色'",
      trigger: "blur"
    },
    drivingNo: {
      required: true,
      message: "请输入行驶证号",
      trigger: "blur"
    },

    stockEngineNo: {
      required: true,
      message: "请输入发动机号",
      trigger: "blur"
    },
    brandName: {
      required: true,
      message: "请选择车辆品牌",
      trigger: "change"
    },
    transferNo: {
      required: true,
      type: "number",
      message: "请输入过户次数",
      trigger: "blur"
    },
    surface: {
      required: true,
      type: "number",
      message: "请选择漆面状况",
      trigger: "change"
    },
    workState: {
      required: true,
      type: "number",
      message: "请选择工况状况",
      trigger: "change"
    },
    interior: {
      required: true,
      type: "number",
      message: "请选择内饰状况",
      trigger: "change"
    },
    stockCarNo: [
      { required: true, message: "请输入车架号", trigger: "blur" },
      { validator: this.$validator.carVIN, trigger: "blur" }
    ],
    carNo: [
      { required: true, message: "请输入车牌号", trigger: "blur" },
      { validator: this.$validator.carCardNo, trigger: "blur" }
    ],
    isSecondHand: {
      required: true,
      type: "number",
      message: "请选择车辆性质",
      trigger: "change"
    },
    assessmentCarStatus: {
      required: true,
      message: "请选择车况",
      type: "number",
      trigger: "blur"
    },
    deptId: {
      required: true,
      type: "number",
      message: "请选择机构",
      trigger: "change"
    },
    deptName: {
      required: true,
      type: "string",
      message: "请选择机构",
      trigger: "change"
    },
  };

  private assessmentRules = {
    lowAssessmentPrice: {
      required: true,
      type: "number",
      message: "请输入最低估价",
      trigger: "change"
    },
    highAssessmentPrice: {
      required: true,
      type: "number",
      message: "请输入最高估价",
      trigger: "change"
    },
    precisionAssessmentPrice: {
      required: true,
      type: "number",
      message: "请输入精准价格",
      trigger: "change"
    }
  };

  mounted() {
    this.basicCustomerAssessmentCarService
      .findAssessmentReportInfo(this.assessmentId)
      .subscribe(
        data => {
          data.regDate = new Date(data.regDate);
          data.issueDate = new Date(data.issueDate);
          data.registerDate = new Date(data.registerDate)
          this.assessmentPrice.highAssessmentPrice = data.highAssessmentPrice
          this.assessmentPrice.lowAssessmentPrice = data.lowAssessmentPrice
          this.assessmentPrice.precisionAssessmentPrice = data.assessmentPrice
          this.revertData(data)
        },
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 反显评估信息
   */
  private revertData(data: any) {
    this.model.carId = data.carId
    this.model.stockCarNo = data.stockCarNo
    this.model.isSecondHand = data.isSecondHand
    this.model.assessmentCarStatus = data.assessmentCarStatus
    this.model.carNo = data.carNo
    this.model.brandName = data.brandName
    this.model.seriesName = data.seriesName
    this.model.modelName = data.modelName
    this.model.modelId = data.modelId
    this.model.color = data.color
    this.model.mile = data.mile
    this.model.zone = data.zone
    this.model.transferNo = data.transferTimes
    this.model.makeDate = new Date(data.makeDate)
    this.model.workState = data.workState
    this.model.regDate = new Date(data.regDate)
    this.model.issueDate = new Date(data.issueDate)
    this.model.registerDate = new Date(data.registerDate)
    this.model.interior = data.interior
    this.model.surface = data.surface
    this.uploadedDataSet = data.basicAssessmentFileModels
  }

  created() {
    this.getDeptList();
    this.uploadedColumns = [
      {
        title: "检测报告名称",
        key: "fileName",
        width: 150,
        align: "center"
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
        render: (h, { row, column, index }) => (
          <div>
            <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.uploadedDataSet.splice(index, 1)}>删除</i-button>
          </div>
        )
      }
    ];
    //评估入库材料
    this.columnsCarMaterials = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => (
          <div>
            <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.carRstorageMaterials.splice(index, 1)}>删除</i-button>
          </div>
        )
      },
      {
        align: "center",
        editable: true,
        title: "材料类型",
        key: "carImageType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.carImageType))
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
    ];
  }

  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryTransferDeptList()
      .subscribe(
        data => (this.deptList = data),
        err => this.$Message.error(err.msg)
      );
  }
  
   /**
   * 选择机构
   */
  private onSelectOrgClick() {
    this.$dialog.show({
      title: "机构选择",
      footer: true,
      width: 1050,
      onOk: (selecOrgs: ChooseOrgsPurchase) => {
        return selecOrgs.submit()
          .then(v => {
            if (!v) {
              this.$Message.warning('请选择一条数据！')
              return v
            }
            this.model = Object.assign({}, this.model, {
              deptId: selecOrgs.selectData.storeId,
              deptName: selecOrgs.selectData.store
            })
            return v
          })
      },
      render: h =>
        h(ChooseOrgsPurchase)
    });
  }
  
  /**
   * 上传报告
   */
  showFileUpload() {
    let dialog = this.$dialog.show({
      title: `上传报告`,
      okText: "上传",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          let tmpFileList = fileList.map(v => {
            return {
              fileUrl: v.response.url,
              fileName: v.response.name
            }
          })
          // 追加合同文件
          this.uploadedDataSet.push(...tmpFileList)
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
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
            this.carRstorageMaterials.push({
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
   * 提交评估入库
   */
  submit() {
    let submitData = this.computeData()
    return new Promise((resolve) => {
      return this.validateForms().then(v => {
        if (!v) return v
        this.basicCustomerCarCenterService.assessmentInstorage(submitData).subscribe(
          data => {
            this.$Message.success("操作成功")
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg);
            resolve(false)
          }
        );
      })
    })
  }

  private validateForms() {
    let form = this.$refs["form"] as Form;
    let formAssessment = this.$refs["formAssessment"] as Form;

    // 车辆信息校验
    return new Promise((resolve) => {
      form.validate(v => {
        if (!v) {
          this.$Message.error("车辆信息校验失败")
          return resolve(false)
        }
        // 校验评估单
        formAssessment.validate(x => {
          if (!x) {
            this.$Message.error("车辆信息校验失败")
            return resolve(false)
          }
          return resolve(true)
        })
      })
    })
  }

  /**
   * 组合数据
   */
  private computeData() {
    return {
      assessmentId: this.assessmentId,
      assessmentPrice: this.assessmentPrice.precisionAssessmentPrice,
      basicAssessmentFileModels: this.uploadedDataSet,
      carId: this.model.carId,
      certificateNo: this.model.certificateNo,
      color: this.model.color,
      deptId: this.model.deptId,
      modelId: this.model.modelId,
      highAssessmentPrice: this.assessmentPrice.highAssessmentPrice,
      interior: this.model.interior,
      isSecondHand: this.model.isSecondHand,
      assessmentCarStatus: this.model.assessmentCarStatus,
      lowAssessmentPrice: this.assessmentPrice.lowAssessmentPrice,
      makeDate: this.$filter.dateFormat(this.model.makeDate),
      mile: this.model.mile,
      outInId: this.id,
      plateNo: this.model.carNo,
      regDate: this.$filter.dateFormat(this.model.regDate),
      issueDate: this.$filter.dateFormat(this.model.issueDate),
      registerDate: this.$filter.dateFormat(this.model.registerDate),
      remark: this.remark,
      stockCarNo: this.model.stockCarNo,
      stockEngineNo: this.model.stockEngineNo,
      stockInDate: this.$filter.dateFormat(this.model.stockDate),
      surface: this.model.surface,
      transferTimes: this.model.transferNo,
      workState: this.model.workState,
      // 入库材料
      basicStockCarPhotoFile: this.carRstorageMaterials
    }
  }


  private get highAssessmentPrice() {
    return this.$common.divideByTenThousands(this.assessmentPrice.highAssessmentPrice)
  }
  private set highAssessmentPrice(val) {
    this.assessmentPrice.highAssessmentPrice = this.$common.multiplyByTenThousands(val)
  }


  private get lowAssessmentPrice() {
    return this.$common.divideByTenThousands(this.assessmentPrice.lowAssessmentPrice)
  }
  private set lowAssessmentPrice(val) {
    this.assessmentPrice.lowAssessmentPrice = this.$common.multiplyByTenThousands(val)
  }


  private get precisionAssessmentPrice() {
    return this.$common.divideByTenThousands(this.assessmentPrice.precisionAssessmentPrice)
  }
  private set precisionAssessmentPrice(val) {
    this.assessmentPrice.precisionAssessmentPrice = this.$common.multiplyByTenThousands(val)
  }

  /**
   * 公里数转换
   */
  private get mile() {
    return this.$common.divideByTenThousands(this.model.mile)
  }

  private set mile(val) {
    this.model.mile = this.$common.multiplyByTenThousands(val)
  }

}
</script>

<style lang="less">
</style>