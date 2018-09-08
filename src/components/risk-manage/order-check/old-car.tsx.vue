<!-- 直租消费贷 二手车 -->
<template>
  <section class="component old-car">
    <div class="operate-buttons">
      <div>
        <i-button class="blueButton minWidth" @click="onUploadFileClick">上传/查看进件资料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileFirstClick" v-if="orderState >= $enum.OrderCurrentState.FIRST ">上传/查看初审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileSecondClick" v-if="orderState >= $enum.OrderCurrentState.SECOND && !canNotViewStatus.notSecond.includes(orderState)">上传/查看复审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileLastClick" v-if="orderState >= $enum.OrderCurrentState.LAST && !canNotViewStatus.notLast.includes(orderState)">上传/查看终审资料</i-button>
        <i-button class="greenButton minWidth" @click="onViewApprovalRecordClick">审核记录</i-button>
      </div>
      <div>
        <i-button class="blueButton minWidth" @click="onPassClick" v-if="!isView && (needfirstCheck || needsecondCheck || needlastCheck)">通过</i-button>
        <i-button class="blueButton minWidth" @click="() => this.approvalReturn(this. $enum.ApprovalReasonType.DENY)" v-if="!isView && (needsecondCheck || needlastCheck)">拒绝</i-button>
        <i-button class="blueButton minWidth" @click="() => this.approvalReturn(this. $enum.ApprovalReasonType.BACK)" v-if="!isView && (needfirstCheck || needsecondCheck || needlastCheck)">退回</i-button>
      </div>
    </div>
    <i-collapse v-model="panel" accordion>
      <i-panel name="apply-customer-base">
        申请人信息
        <apply-customer-base slot="content" :isView="true" v-model="model.customerId"></apply-customer-base>
      </i-panel>
      <i-panel name="chooes-old-car">
        车辆信息
        <chooes-old-car slot="content" :isView="true" v-model="model.modelId" :orderId="orderId" ref="chooes-old-car"></chooes-old-car>
      </i-panel>
      <i-panel name="apply-product-info">
        产品信息
        <apply-product-info slot="content" :businessType="businessType" :isView="true" :modelId="model.modelId" :orderInfo="orderInfo" ref="apply-product-info"></apply-product-info>
      </i-panel>
      <i-panel name="customer-resource">
        客户来源
        <customer-resource slot="content" :isView="true" :orderInfo="orderInfo" ref="customer-resource"></customer-resource>
      </i-panel>
      <i-panel name="guarantor-information">
        担保人信息
        <guarantor-information slot="content" :isView="true" :orderId="orderId" ref="guarantor-information"></guarantor-information>
      </i-panel>
    </i-collapse>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ApplyCustomerBase from "~/components/entry-manage/entry-manage-base/apply-customer-base.vue";
import ApplyProductInfo from "~/components/entry-manage/entry-manage-base/apply-product-info.tsx.vue";
import ChooesOldCar from "~/components/entry-manage/entry-manage-base/chooes-old-car.vue";
import ApplyFilelist from "~/components/entry-manage/entry-manage-base/apply-filelist.tsx.vue";
import GuarantorInformation from "~/components/entry-manage/entry-manage-base/guarantor-information.vue";
import CustomerResource from "~/components/entry-manage/entry-manage-base/customer-resource.vue";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { BusinessType, ApprovalReasonType, OrderCurrentState } from "~/config/enum.config";
import { orderOpeater } from "~/config/work-flow.config";
import Pass from "./approval-base/pass.vue";
import Back from "./approval-base/back.vue";
import ApprovalRecord from "./approval-base/approval-record.vue";
import FileList from "./approval-base/filelist.tsx.vue";

@Component({
  components: {
    ApplyCustomerBase,
    ApplyProductInfo,
    ChooesOldCar,
    CustomerResource,
    GuarantorInformation
  }
})
export default class OldCar extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Prop() orderId: number;

  @Prop({
    default: false
  }) isView: boolean;

  @Prop({
    required: true
  }) businessType: BusinessType;

  private panel = "apply-customer-base"
  private model: any = null;
  private orderInfo: any = null
  private workComponents: any[] = []
  // 不可看到的状态
  private canNotViewStatus = {
    notSecond: [...orderOpeater.first.status],
    notLast: [...orderOpeater.first.status, ...orderOpeater.submit.status]
  }
  created() {
    this.model = {
      customerId: null,
      modelId: null,
      fileList: null
    }
  }

  mounted() {
    if (!this.orderId) return
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

  private onUploadFileClick() {
    this.$dialog.show({
      title: "进件材料上传",
      footer: true,
      isView: this.isView,
      onOk: (uploadFile: ApplyFilelist) => {
        this.model.fileList = uploadFile.fileList
      },
      render: h => <ApplyFilelist currentFileList={this.model.fileList} isView={true}></ApplyFilelist>
    })
  }

  private onUploadFileFirstClick() {
    this.$dialog.show({
      title: "上传/查看初审材料",
      footer: true,
      isView: true,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.first.desc}
        isView={!orderOpeater.first.status.includes(this.orderState) || this.isView}></FileList>
    })
  }

  private onUploadFileSecondClick() {
    this.$dialog.show({
      title: "上传/查看复审材料",
      footer: true,
      isView: true,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.second.desc}
        isView={!orderOpeater.second.status.includes(this.orderState) || this.isView}></FileList>
    })
  }

  private onUploadFileLastClick() {
    this.$dialog.show({
      title: "上传/查看终审资料",
      footer: true,
      isView: true,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.last.desc}
        isView={!orderOpeater.last.status.includes(this.orderState) || this.isView}></FileList>
    })
  }

  /**
   * 当前订单状态
   */
  private get orderState(): number {
    return this.orderInfo ? this.orderInfo.orderStatus : 0
  }

  /**
   * 初审
   */
  private get needfirstCheck() {
    return orderOpeater.first.status.includes(this.orderState)
  }

  /**
   * 复审
   */
  private get needsecondCheck() {
    return orderOpeater.second.status.includes(this.orderState)
  }

  /**
   * 终审
   */
  private get needlastCheck() {
    return orderOpeater.last.status.includes(this.orderState)
  }

  private onPassClick() {
    this.$dialog.show({
      title: "审核通过",
      footer: true,
      width: 800,
      onOk: (p: Pass) => {
        return p.submit().then(v => {
          if (v) this.$dialog.clear()
          return v
        })
      },
      render: h => <Pass orderId={this.orderId} businessType={this.businessType} orderState={this.orderState}></Pass>
    })
  }
  private approvalReturn(type: ApprovalReasonType) {
    let title = type === ApprovalReasonType.BACK ? "退回" : "拒绝";
    this.$dialog.show({
      title: `审核${title}`,
      footer: true,
      width: 800,
      onOk: (p: Back) => {
        return p.submit().then(v => {
          if (v) this.$dialog.clear()
          return v
        })
      },
      render: h => <Back orderStatus={this.orderInfo.orderStatus} orderId={this.orderId} reasonType={type}></Back>
    })
  }

  private onViewApprovalRecordClick() {
    this.$dialog.show({
      title: `审核记录`,
      footer: true,
      isView: true,
      width: 1000,
      render: h => <ApprovalRecord orderId={this.orderId}></ApprovalRecord>
    })
  }

}
</script>

<style lang="less" scoped>
.component.old-car {
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