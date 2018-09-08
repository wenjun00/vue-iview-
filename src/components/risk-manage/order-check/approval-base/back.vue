<!-- 审核退回 -->
<template>
  <section class="component back">
    <i-form :model="model" :rules="rules" :label-width="110" ref="form">
      <i-form-item :label="`${reasonTypeLabel}原因`" prop="reason">
        <i-select v-model="model.refuseReason1" class="reason1">
          <i-option v-for="(reason,index) of reasonType1" :key="index" :label="reason" :value="reason"></i-option>
        </i-select>
        <i-select v-model="model.refuseReason2" :disabled="!model.refuseReason1" class="reason2">
          <i-option v-for="(reason,index) of reasonType2" :key="index" :label="reason" :value="reason"></i-option>
        </i-select>
        <i-select v-model="model.refuseReason3" :disabled="!model.refuseReason2" class="reason3">
          <i-option v-for="(reason,index) of reasonType3" :key="index" :label="reason" :value="reason"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="退回环节" prop="type" v-if="reasonType === $enum.ApprovalReasonType.BACK">
        <i-radio-group v-model="model.type">
          <i-radio :label="1" v-if="!(orderStatus === $enum.OrderCurrentState.FIRST || orderStatus === $enum.OrderCurrentState.SECOND_RETURN)">退回上一环节</i-radio>
          <i-radio :label="3">退回到进件</i-radio>
        </i-radio-group>
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
import { BusinessType, OrderCurrentState, ApprovalReasonType } from "~/config/enum.config";
import { Form } from "iview";

@Component({
  components: {
  }
})
export default class Back extends Vue {
  @Dependencies(BasicCustomerOrderApprove) private basicCustomerOrderApprove: BasicCustomerOrderApprove;
  @Prop({ required: true }) orderId: number
  @Prop({ required: true }) reasonType: ApprovalReasonType;
  @Prop() orderStatus: number

  private reasonDataSet: any[] = []
  private model: any = {
    orderId: null,
    remark: "",
    type: 1,
    refuseReason1: "",
    refuseReason2: "",
    refuseReason3: ""
  }

  private rules = {
    reason: { required: true, validator: this.reasonValidator, trigger: "blur" },
    type: { required: true, message: "请选择退回环节", trigger: "blur", type: "number" }
  }

  mounted() {
    this.model.orderId = this.orderId
    this.model.type = this.reasonType
    this.basicCustomerOrderApprove.getApproveReasonByType(this.reasonType).subscribe(
      data => this.reasonDataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  private reasonValidator(rule, value, callback) {
    if (!this.model.refuseReason3) {
      callback(new Error("请选择原因"))
    } else {
      callback()
    }
  }

  submit(): Promise<boolean> {
    return new Promise((resolve) => {
      (this.$refs.form as Form).validate(v => {
        if (!v) return resolve(false)
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
    })
  }

  /**
   * 一级退回原因
   */
  private get reasonType1() {
    let set = new Set<string>(this.reasonDataSet.map(v => v.reason1))
    return Array.from(set)
  }

  /**
   * 二级退回原因
   */
  private get reasonType2() {
    let dataSet = this.reasonDataSet.filter(v => v.reason1 === this.model.refuseReason1)
    let set = new Set<string>(dataSet.map(v => v.reason2))
    return Array.from(set)
  }

  /**
   * 三级退回原因
   */
  private get reasonType3() {
    return this.reasonDataSet.filter(v => v.reason1 === this.model.refuseReason1)
      .filter(v => v.reason2 === this.model.refuseReason2).map(v => v.reason3)
  }

  private get reasonTypeLabel() {
    return this.reasonType === ApprovalReasonType.BACK ? "退回" : "拒绝"
  }
}
</script>

<style lang="less" scoped>
.component.back {
  .remark {
    width: 635px;
  }
}
</style>

<style lang="less">
.set-select-width(@width) {
  .ivu-select-selection {
    width: @width!important;
  }
  .ivu-select-dropdown {
    width: @width!important;
  }
}

.component.back {
  @width: 90px;
  .reason1 {
    width: @width!important;
    .set-select-width(@width);
  }
  .reason2 {
    width: @width*2!important;
    .set-select-width(@width*2);
  }
  .reason3 {
    width: @width*4!important;
    .set-select-width(@width*4);
  }
}
</style>
