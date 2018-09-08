<!-- 审核通过 -->
<template>
  <section class="component pass">
    <div class="tips">
      <p>
        <b>确认审核通过？</b>
      </p>
    </div>
    <i-form :model="model" :rules="rules" :label-width="150">
      <!-- <i-form-item label="允许融资金额(万元)" prop="orderFinancingPrice" v-if="businessType === $enum.BusinessType.CASH_BACK && orderState === $enum.OrderCurrentState.LAST"> -->
      <i-form-item label="允许融资金额(万元)" prop="orderFinancingPrice"  v-if="orderState === $enum.OrderCurrentState.LAST">
        <i-input-number placeholder="请输入允许融资金额" v-model.lazy="orderPrice" :min="0" :max="99999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="备注" prop="remark">
        <i-input type="textarea" class="remark" v-model="model.remark" :maxlength="100"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerOrderApprove } from "~/services/manage-service/basic-customer-order-approve.service";
import { BusinessType, OrderCurrentState } from "~/config/enum.config";

@Component({
  components: {
  }
})
export default class Pass extends Vue {
  @Dependencies(BasicCustomerOrderApprove) private basicCustomerOrderApprove: BasicCustomerOrderApprove;
  @Prop({ required: true }) orderId: number
  @Prop() businessType: BusinessType;
  @Prop() orderState: OrderCurrentState;

  private model: any = {
    orderId: null,
    remark: "",
    type: 0,
    orderFinancingPrice: null
  }

  private rules = {
    orderFinancingPrice: { required: true, message: "请输入允许融资金额", trigger: "blur", type: "number" }
  }

  mounted() {
    this.model.orderId = this.orderId
  }

  submit(): Promise<boolean> {
    return new Promise((resolve) => {
      this.basicCustomerOrderApprove.approval(this.model).subscribe(
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


  private get orderPrice() {
    return this.$common.divideByTenThousands(this.model.orderFinancingPrice)
  }
  private set orderPrice(val) {
    this.model.orderFinancingPrice = this.$common.multiplyByTenThousands(val)
  }


}
</script>

<style lang="less" scoped>
.component.pass {
  .remark {
    width: 600px;
  }
  .tips {
    padding-left: 150px;
    font-size: 20px;
    color: red;
    margin-bottom: 20px;
  }
}
</style>