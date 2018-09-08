<!--车辆合规详情页-->
<template>
  <section class="component car-compliance-detail">
    <div class="operate-buttons">
      <div>
        <i-button class="blueButton minWidth" @click="onUploadFileClick">查看进件资料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileFirstClick">查看初审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileSecondClick">查看复审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileLastClick">查看终审资料</i-button>
      </div>
      <div v-if="rowData.orderStatus === this.$enum.OrderCurrentState.CAR_COMPLIANCE">
        <i-button class="blueButton minWidth" @click="confirmMatching">确认车辆合规</i-button>
      </div>
    </div>
    <order-all-info-box-new v-if="rowData.orderCarType === this.$enum.OrderCarType.NEW" :businessType="rowData.businessType" :orderId="orderId" :rowData="rowData" :isView="true" ref="order-all-info-box"></order-all-info-box-new>
    <order-all-info-box-old v-else :businessType="rowData.businessType" :orderId="orderId" :rowData="rowData" :isView="true" ref="order-all-info-box"></order-all-info-box-old>
  </section>
</template>

<script lang="tsx">
import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import { Dependencies } from "~/core/decorator"
import { BasicOrderComplianceService } from "~/services/manage-service/basic-order-compliance.service"
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service"
import { OrderCarType, BusinessType } from "~/config/enum.config"
import SelectCar from "~/components/car-matching/select-car.tsx.vue"
import OrderAllInfoBoxNew from "~/components/car-matching/order-all-info-box-new.vue"
import OrderAllInfoBoxOld from "~/components/car-matching/order-all-info-box-old.vue"
import ApplyFilelist from "~/components/entry-manage/entry-manage-base/apply-filelist.tsx.vue"
import FileList from "~/components/risk-manage/order-check/approval-base/filelist.tsx.vue"
import { orderOpeater } from "~/config/work-flow.config"

@Component({
  components: {
    SelectCar,
    OrderAllInfoBoxNew,
    OrderAllInfoBoxOld
  }
})
export default class CarComplianceDetail extends Vue {
  @Dependencies(BasicOrderComplianceService) private basicOrderComplianceService: BasicOrderComplianceService
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @Prop() orderId
  @Prop() customerId
  @Prop() rowData

  private panel = "apply-customer-base"
  private model: any
  private orderInfo: any = null
  private isView: boolean = true

  created() {
    this.model = {
      customerId: this.customerId,
      orderId: this.orderId,
      modelId: null
    }
    if (this.rowData.stockCarNo) this.isView = false
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
   * 确认车辆合规
   */
  private confirmMatching() {
    this.basicOrderComplianceService.basicCarCompliance(this.model.orderId).subscribe(
      data => {
        this.$Message.success('操作成功！');
        this.$dialog.clear()
      },
      err => this.$Message.error(err.msg)
    )
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
.component.car-compliance-detail {
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
