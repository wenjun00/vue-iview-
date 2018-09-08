<!--车辆匹配详情页-->
<template>
  <section class="component matching-car-detail">
    <div class="operate-buttons">
      <div>
        <i-button class="blueButton minWidth" @click="onUploadFileClick">查看进件资料</i-button>、
        <i-button class="blueButton minWidth" @click="onUploadFileFirstClick">查看初审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileSecondClick">查看复审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileLastClick">查看终审资料</i-button>
      </div>
      <div v-if="!rowData.stockCarNo">
        <i-button class="blueButton minWidth" @click="confirmMatching">确认匹配</i-button>
      </div>
    </div>
    <order-all-info-box-new :businessType="businessType" :orderId="orderId" :rowData="rowData" :isView="true" ref="order-all-info-box-new"></order-all-info-box-new>
  </section>
</template>

<script lang="tsx">
import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import { Dependencies } from "~/core/decorator"
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service"
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service"
import { OrderCarType, BusinessType } from "~/config/enum.config"
import SelectCar from "~/components/car-matching/select-car.tsx.vue"
import OrderAllInfoBoxNew from "~/components/car-matching/order-all-info-box-new.vue"
import ApplyFilelist from "~/components/entry-manage/entry-manage-base/apply-filelist.tsx.vue"
import FileList from "~/components/risk-manage/order-check/approval-base/filelist.tsx.vue"
import { orderOpeater } from "~/config/work-flow.config";

@Component({
  components: {
    SelectCar,
    OrderAllInfoBoxNew
  }
})
export default class MatchingCarDetail extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @Prop() orderId
  @Prop() rowData
  @Prop({
    type: Boolean,
    default: false
  }) isView
  // 业务类型
  @Prop({ required: true }) businessType: BusinessType

  private model: any = null
  private orderInfo: any = null

  created() {
    this.model = {
      customerId: null,
      modelId: null,
      fileList: null
    }
    // if (this.rowData.stockCarNo) this.isView = false
  }

  mounted() {
    // 获取订单详情
    this.basicCustomerOrderService.findCustomerOrderInfo(this.orderId).subscribe(
      data => {
        this.orderInfo = data
        this.model.customerId = data.customerId
      },
      err => this.$Message.error(err.msg)
    )
    // 获取文件列表
    this.basicCustomerOrderService.findOrderFiles(this.orderId).subscribe(
      data => this.model.fileList = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 确认匹配
   */
  private confirmMatching() {
    let orderAllInfoBox: any = this.$refs['order-all-info-box-new']
    orderAllInfoBox.save(null).then(v => {
      if (v) this.$dialog.clear()
    })
  }

  /**
   * 查看进件材料
   */
  private onUploadFileClick() {
    this.$dialog.show({
      title: "查看进件材料",
      footer: true,
      width: 700,
      onOk: (uploadFile: ApplyFilelist) => {
        this.model.fileList = uploadFile.fileList
      },
      render: h => <ApplyFilelist currentFileList={this.model.fileList} isView={true}></ApplyFilelist>
    })
  }
  
  /**
   * 查看初审材料
   */
   private onUploadFileFirstClick() {
    this.$dialog.show({
      title: "查看初审材料",
      footer: true,
      isView: true,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.first.desc} isView={true}></FileList>
    })
  }

  /**
   * 查看复审材料
   */
  private onUploadFileSecondClick() {
    this.$dialog.show({
      title: "查看复审材料",
      footer: true,
      width: 700,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.second.desc} isView={true}></FileList>
    })
  }
  /**
   * 查看终审材料
   */
  private onUploadFileLastClick() {
    this.$dialog.show({
      title: "查看终审资料",
      footer: true,
      width: 700,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.last.desc} isView={true}></FileList>
    })
  }
}
</script>

<style lang="less" scoped>
.component.matching-car-detail {
  .operate-buttons {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .minWidth {
    min-width: 90px;
  }
}
</style>
