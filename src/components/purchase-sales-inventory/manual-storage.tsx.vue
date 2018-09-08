<!--手动入库-->
<template>
  <section class="component manual-storage">
    <i-card title="车辆基本信息">
      <modify-car-info :isManualStorage="true" ref="modify-car-info"></modify-car-info>
    </i-card>
    <i-form ref="car-price-form" inline :model="model" :rules="rules" :label-width="110">
      <i-card title="车辆价格信息">
        <!-- <car-price ref="car-price"></car-price> -->
        <i-form-item label="指导价" prop="guidePrice">
          <i-input-number v-model="model.guidePrice" placeholder="请输入指导价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
        <i-form-item label="采车价" prop="stockPrice">
          <i-input-number v-model="model.stockPrice" placeholder="请输入采车价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
        <i-form-item label="融资车价" prop="financingPrice">
          <i-input-number v-model="model.financingPrice" placeholder="请输入融资车价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
        <i-form-item label="开票价" prop="ticketPrice">
          <i-input-number v-model="model.ticketPrice" placeholder="请输入开票价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
        <i-form-item label="其他费用" prop="otherPrice">
          <i-input-number v-model="model.otherPrice" placeholder="请输入其他费用" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
        </i-form-item>
      </i-card>
    </i-form>
    <i-card title="手动入库登记">
      <div class="upload-materials" slot="extra">
        <i-dropdown trigger="click" @on-click="uploadMaterial">
          <a href="javascript:void(0)">
            新增手动入库材料
            <i-icon type="arrow-down-b"></i-icon>
          </a>
          <i-dropdown-menu slot="list">
            <i-dropdown-item v-for="{label, value} of $dict.getDictData(10069)" :key="value" :name="value">{{label}}</i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
      </div>
      <data-box :columns="columns" :data="dataSet" ref="databox" :height="300"></data-box>
    </i-card>
    <i-card title="手动入库备注">
      <i-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="4" :maxlength="100"></i-input>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { Button, Form } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { ImageType } from "~/config/enum.config";
import ModifyCarInfo from "~/components/purchase-sales-inventory/modify-car-info.vue";
// import CarPrice from "~/components/purchase-sales-inventory/car-price.vue";

@Component({
  components: {
    ModifyCarInfo,
    // CarPrice
  }
})
export default class ManualStorage extends Vue {
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Dependencies(BasicCarDetailService) basicCarDetailService: BasicCarDetailService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private remark: String = ''; // 入库备注

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      guidePrice: null,//指导价
      stockPrice: null,//采车价
      financingPrice: null,//融资车价
      ticketPrice: null,//开票价
      otherPrice: null,//其他费用
    };

    this.rules = {
      financingPrice: {
        required: true,
        message: "请输入融资车价",
        trigger: "blur",
        type: "number"
      }
    };

    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, columns, index }) => {
          return (<div>
            <i-button type="text" class="row-command-button" on-click={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>
          </div>
          )
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
   * 采购入库填写价格
   */
  private addCarPrice() {
    return new Promise((resolve, reject) => {
      resolve(this.model)
    });
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
          let list = fileList.map(v => v.response).map(v => ({
            dataType: v.type,
            carImageType: val,
            fileName: v.name,
            fileUrl: v.url
          }))
          this.dataSet.push(...list)
        }).catch(() => false)
      },
      render: h => <FileUpload fileSizeLimit={500}></FileUpload>
    });
  }

  //提交手动入库
  private submit() {
    // return new Promise((resolve) => {
    // let submitData = this.computeData()
    // console.log(submitData)
    // this.basicCustomerCarCenterService.addPutInStorageByCar(submitData).subscribe(
    //   data => {
    //     this.$Message.success("操作成功")
    //     resolve(true)
    //   },
    //   err => {
    //     this.$Message.error(err.msg);
    //     resolve(false)
    //   }
    // );
    // })
    return new Promise((resolve) => {
      let ModifyCarInfo: Form = this.$refs['modify-car-info']
      let CarPriceForm: Form = this.$refs['car-price-form']
      ModifyCarInfo.confirm().then(v => {
        if (!v) return resolve(false)
        let model = { ...v }
        CarPriceForm.validate(v => {
          if (!v) return resolve(false)
          model.addStorageCarModels = this.dataSet
          model.remark = this.remark
          model.guidePrice = this.model.guidePrice//指导价
          model.stockPrice = this.model.stockPrice//采车价
          model.financingPrice = this.model.financingPrice//融资车价
          model.ticketPrice = this.model.ticketPrice//开票价
          model.otherPrice = this.model.otherPrice//其他费用
          if (model.plateNo && !model.licensingDate) {
            this.$Message.warning("请同时填写或不填写上牌日期和车牌号!")
            return
          } else if (model.licensingDate && !model.plateNo) {
            this.$Message.warning("请同时填写或不填写上牌日期和车牌号!")
            return
          }
          this.basicCustomerCarCenterService.addPutInStorageByCar(model).subscribe(
            data => {
              this.$Message.success('操作成功！')
              resolve(true)
            },
            err => {
              this.$Message.error(err.msg)
              resolve(false)
            }
          );
        })
      })
    })
  }
  //组合数据
  // private computeData() {
  //   let ModifyCarInfo: Form = this.$refs['modify-car-info']
  //   let CarPrice: Form = this.$refs['car-price']
  //   let model: any = {}
  //   model.addStorageCarModels = this.dataSet
  //   model.remark = this.remark
  //   ModifyCarInfo.confirm().then(v => {
  //     if (!v) return
  //     model.carInfo = { ...v }

  //     if (model.plateNo && !model.licensingDate) {
  //       this.$Message.warning("请输入上牌日期！")
  //       return
  //     } else if (model.licensingDate && !model.plateNo) {
  //       this.$Message.warning("请输入车牌号！")
  //       return
  //     }
  //   })
  //   CarPrice.submit().then(v => {
  //     if (!v) return
  //     model.carPrice = Object.assign({
  //       guidePrice: v.guidePrice,
  //       stockPrice: v.stockPrice,
  //       financingPrice: v.financingPrice,
  //       ticketPrice: v.ticketPrice,
  //       otherPrice: v.otherPrice
  //     }, model)
  //   })
  //   return model
  // }
}
</script>

<style lang="less">
.component.manual-storage {
  .ivu-card-body {
    padding: 16px 5px;
  }
}
</style>
