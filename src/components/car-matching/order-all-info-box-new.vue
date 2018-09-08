<!--订单信息组件(新车)-->
<template>
  <section class="component order-all-info-box-new">
    <i-collapse v-model="panel" accordion>
      <i-panel name="apply-customer-base">
        申请人信息
        <apply-customer-base slot="content" :isView="isView" v-model="model.customerId"></apply-customer-base>
      </i-panel>
      <i-panel name="chooes-new-car">
        车辆信息
        <chooes-new-car slot="content" :isView="isView" v-model="model.modelId" :orderId="orderId" ref="chooes-new-car"></chooes-new-car>
      </i-panel>
      <i-panel name="matching-car">
        匹配车辆
        <matching-car slot="content" v-model="model.stockId" :orderId="orderId" :matchingInfo="rowData" ref="matching-car"></matching-car>
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
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { Action, State, namespace } from "vuex-class";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { BasicOrderComplianceService } from "~/services/manage-service/basic-order-compliance.service";
import CustomerBankList from "~/components/customer-center/customer-bank-list.tsx.vue";
import ApplyCustomerBase from "~/components/entry-manage/entry-manage-base/apply-customer-base.vue";
import ApplyProductInfo from "~/components/entry-manage/entry-manage-base/apply-product-info.tsx.vue";
import ChooesNewCar from "~/components/entry-manage/entry-manage-base/chooes-new-car.vue";
import CustomerResource from "~/components/entry-manage/entry-manage-base/customer-resource.vue";
import GuarantorInformation from "~/components/entry-manage/entry-manage-base/guarantor-information.vue";
import MatchingCar from "~/components/car-matching/matching-car.tsx.vue";
import { BusinessType } from "~/config/enum.config";

@Component({
  components: {
    ApplyCustomerBase,
    ApplyProductInfo,
    ChooesNewCar,
    CustomerResource,
    GuarantorInformation,
    MatchingCar
  }
})
export default class OrderAllInfoBoxNew extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Dependencies(BasicOrderComplianceService) private basicOrderComplianceService: BasicOrderComplianceService;

  @Prop() orderId
  @Prop() rowData
  @Prop({
    default: false
  }) isView: boolean;
  @Prop({
    required: true
  }) businessType: BusinessType;

  private panel = "apply-customer-base"
  private model: any = null
  private orderInfo: any = null
  private workComponents: any[] = []

  created() {
    this.model = {
      customerId: null,
      modelId: null,
      fileList: null,
      stockId: null
    }
  }

  mounted() {
    this.workComponents.push(this.$refs['matching-car'] as MatchingCar)
    this.workComponents.push(this.$refs['apply-product-info'] as ApplyProductInfo)
    // 获取订单详情
    this.basicCustomerOrderService.findCustomerOrderInfo(this.orderId).subscribe(
      data => {
        this.orderInfo = data
        this.model.customerId = data.customerId
      },
      err => this.$Message.error(err.msg)
    )
  }
  /**
     * 计算数据 用于提交
     * @param values 提交数据
     * @param type 提交方式 0:保存 1:提交
     */
  private computerData(values: any[], type: number) {
    let data = {
      fileList: this.model.fileList,
      incomingOrderInfo: {
        customerId: this.model.customerId
      },
      orderId: this.orderId,
      type: type,
      stockId: null
    };
    values.forEach((v, index) => {
      if (index === 0) {
        data.stockId = v.stockId
      } else if (index === 1) {
        data.incomingOrderInfo = Object.assign({
          orderPrice: v.orderPrice,
          orderUseWay: v.orderUseWay,
          schemeId: v.schemeId
        }, data.incomingOrderInfo)
      }
    })
    return data
  }

  private submit(data: any, type) {
    if (this.orderInfo.orderStatus === this.$enum.OrderCurrentState.MATCH) {
      return new Promise((resolve) => {
        this.basicOrderComplianceService.basicCarConfirmMatch(data.stockId, data.orderId).subscribe(
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
    if (this.orderInfo.orderStatus === this.$enum.OrderCurrentState.OPEN_ACCOUNT) {
      return new Promise((resolve) => {
        this.basicCustomerOrderService.sign(data, data.type).subscribe(
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
    return Promise.resolve(false)
  }

  /**
   * 保存操作
   */
  async save(type: number = 0) {
    // 验证所有表单的数据
    let result = await Promise.all([...this.workComponents.map(v => v.submit(type))]).then(
      (values: any[]) => {
        let data = this.computerData(values, type)
        return this.submit(data, type).then((v: boolean) => v)
      }
    ).catch(err => { return false })
    return result
  }

}
</script>

<style lang="less" scoped>
</style>
