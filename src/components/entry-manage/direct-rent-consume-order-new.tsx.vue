<!-- 直租消费贷 新车 -->
<template>
  <section class="component direct-rent-consume-order-new">
    <div class="operate-buttons">
      <div>
        <i-button class="blueButton minWidth" @click="onUploadFileClick">上传/查看进件资料</i-button>
        <i-button class="greenButton minWidth" v-if="isView" @click="onViewApprovalRecordClick">审核记录</i-button>
      </div>
      <div>
        <i-button class="blueButton minWidth" @click="onOrderSubmitClick" v-if="!isView">提交</i-button>
      </div>
    </div>
    <i-collapse v-model="panel" accordion>
      <i-panel name="apply-customer-base">
        申请人信息
        <apply-customer-base slot="content" :isView="isView" v-model="model.customerId"></apply-customer-base>
      </i-panel>
      <i-panel name="chooes-new-car">
        车辆信息
        <chooes-new-car slot="content" :isView="isView" v-model="model.modelId" :orderId="orderId" ref="chooes-new-car"></chooes-new-car>
      </i-panel>
      <i-panel name="apply-product-info">
        产品信息
        <apply-product-info slot="content" :businessType="businessType" :isView="isView" :modelId="model.modelId" :orderInfo="orderInfo" ref="apply-product-info"></apply-product-info>
      </i-panel>
      <i-panel name="customer-resource">
        客户来源
        <customer-resource slot="content" :isView="isView" :orderInfo="orderInfo" ref="customer-resource"></customer-resource>
      </i-panel>
      <i-panel name="guarantor-information">
        担保人信息
        <guarantor-information slot="content" :isView="isView" :orderId="orderId" ref="guarantor-information"></guarantor-information>
      </i-panel>
    </i-collapse>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ApplyCustomerBase from "./entry-manage-base/apply-customer-base.vue";
import ApplyProductInfo from "./entry-manage-base/apply-product-info.tsx.vue";
import ChooesNewCar from "./entry-manage-base/chooes-new-car.vue";
import CustomerResource from "./entry-manage-base/customer-resource.vue";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import GuarantorInformation from "./entry-manage-base/guarantor-information.vue";
import ApplyFilelist from "./entry-manage-base/apply-filelist.tsx.vue";
import { BusinessType, SubmitType } from "~/config/enum.config";
import ApprovalRecord from "~/components/risk-manage/order-check/approval-base/approval-record.vue";


@Component({
  components: {
    ApplyCustomerBase,
    ApplyProductInfo,
    ChooesNewCar,
    CustomerResource,
    GuarantorInformation
  }
})
export default class DirectRentConsumeOrderNew extends Vue {
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

  created() {
    this.model = {
      customerId: null,
      modelId: null,
      fileList: null
    }
  }

  mounted() {
    this.workComponents.push(this.$refs['chooes-new-car'] as ChooesNewCar)
    this.workComponents.push(this.$refs['apply-product-info'] as ApplyProductInfo)
    this.workComponents.push(this.$refs['customer-resource'] as CustomerResource)
    this.workComponents.push(this.$refs['guarantor-information'] as GuarantorInformation)
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

  /**
   * 计算数据 用于提交
   * @param values 提交数据
   * @param type 提交方式 0:保存 1:提交
   */
  private computerData(values: any[], type: SubmitType) {
    let data = {
      expenseList: [],
      fileList: this.model.fileList,
      incomingGuarantorInfo: null,
      incomingNewCarInfo: null,
      incomingOrderInfo: {
        customerId: this.model.customerId
      },
      orderId: this.orderId,
      type: type,
      businessType: this.businessType
    };
    values.forEach((v, index) => {
      if (index === 0) {
        data.incomingNewCarInfo = v
      } else if (index === 1) {
        data.incomingOrderInfo = Object.assign({
          orderPrice: v.orderPrice,
          orderUseWay: v.orderUseWay,
          schemeId: v.schemeId
        }, data.incomingOrderInfo)
        data.expenseList = v.expenseList.map(e => {
          return {
            costType: e.costType,
            expenseCode: e.expenseCode,
            expenseId: e.expenseId,
            expenseName: e.expenseName,
            isRefund: e.isRefund,
            paymentType: e.paymentType,
            repayMoney: e.repayMoney,
            repayType: e.repayType
          }
        })
      } else if (index === 2) {
        data.incomingOrderInfo = Object.assign({
          orderChannel: v.orderChannel,
          orderChannelRemark: v.orderChannelRemark
        }, data.incomingOrderInfo)
      } else {
        data.incomingGuarantorInfo = Object.assign({
          guarantorName: v.name,
          guarantorPhone: v.phone,
          guarantorPhone2: v.phone2,
          guarantorSex: v.sex
        }, v)
        delete data.incomingGuarantorInfo.name
        delete data.incomingGuarantorInfo.phone
        delete data.incomingGuarantorInfo.phone2
        delete data.incomingGuarantorInfo.sex
      }
    })

    return data
  }

  private async submit(data: any) {
    return await new Promise((resolve) => {
      this.basicCustomerOrderService.newCarIncomingApply(data).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }

  /**
   * 提交申请单
   */
  private onOrderSubmitClick() {
    this.save(SubmitType.Submit).then(v => {
      if (v) this.$dialog.clear()
    })
  }

  /**
   * 保存操作
   */
  async save(type = SubmitType.Save) {
    // 验证所有表单的数据
    let result = await Promise.all([...this.workComponents.map(v => v.submit(type))])
      .then((values: any[]) => {
        if (!this.model.customerId) {
          this.$Message.info("请选择客户信息")
          return false
        }
        let data = this.computerData(values, type)
        return this.submit(data).then((v: boolean) => v)
      }
      ).catch(err => {
        return false
      })
    return result
  }

  private onUploadFileClick() {
    this.$dialog.show({
      title: "上传/查看进件资料",
      footer: true,
      isView: this.isView,
      onOk: (uploadFile: ApplyFilelist) => {
        this.model.fileList = uploadFile.fileList
      },
      render: h => <ApplyFilelist currentFileList={this.model.fileList} isView={this.isView}></ApplyFilelist>
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
.component.direct-rent-consume-order-new {
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