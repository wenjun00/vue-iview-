<!-- 费用项 -->
<template>
  <section class="component fee-item">
    <i-form :model="model" :label-width="110" :rules="rules" ref="form">
      <i-form-item label="收取方式" prop="paymentType">
        <i-radio-group v-model="model.paymentType" @on-change="onPaymentTypeChange">
          <i-radio v-for="{label,value} of $dict.getDictData(10064)" :key="value" :label="value">{{label}}</i-radio>
        </i-radio-group>
      </i-form-item>
      <i-form-item v-if="model.paymentType === feeOnFixedId" label="固定费用" prop="fixedCost">
        <i-input-number placeholder="请输入固定费用" v-model="model.fixedCost" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item v-else-if="model.paymentType === feeOnRatioId" :label="isDailyInterestRate ? '日利率' : '利率'" prop="_repayProportion">
        <i-input-number placeholder="请输入利率" v-model="model._repayProportion" :min="0" :max="100" :formatter="$filter.percentFormat" :parser="$filter.percentParse"></i-input-number>
      </i-form-item>
      <i-form-item label="费用项" prop="expenseId">
        <i-select v-model="model.expenseId">
          <i-option v-for="{label,value} of FeeNameList" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item v-if="model.paymentType !== feeOnRatioId" label="支付方式" prop="repayType">
        <i-checkbox-group v-model="model.repayType" @on-change="onRepayTypeChange">
          <i-checkbox v-for="{label,value} of $dict.getDictData(10022)" :key="value" :label="value">{{label}}</i-checkbox>
        </i-checkbox-group>
      </i-form-item>
      <i-form-item v-if="model.paymentType !== feeOnRatioId" label="费用项类型" prop="costType">
        <i-checkbox-group v-model="model.costType">
          <i-checkbox v-for="{label,value} of $dict.getDictData(10065)" :disabled="costTypeDisables.includes(value)" :key="value" :label="value">{{label}}</i-checkbox>
        </i-checkbox-group>
      </i-form-item>
      <i-form-item label="是否退款" prop="isRefund">
        <i-select v-model="model.isRefund">
          <i-option v-for="{label,value} of  $dict.getDictData(10001)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>

    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { Form } from "iview";

@Component({
  components: {}
})
export default class FeeItem extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  /**
   * 产品ID
   */
  @Prop({
  }) productId: number;

  /**
   * 费用项ID
   */
  @Prop({
  }) feeItemId: number;

  @Prop({
    type: Array
  }) FeeNameList: any[]

  onPaymentTypeChange() {
    // 当收取方式变化时，清空已填写内容
    this.model.fixedCost = null
    this.model._repayProportion = null
    this.model.repayType = []
    this.model.costType = []
  }

  @Watch('model.expenseId', { immediate: true })
  onExpenseIdChange() {
    // 当选择的费用项为罚金或罚息时，利率变为日利率
    this.isDailyInterestRate = (this.model.expenseId === 98 || this.model.expenseId === 111) ? true : false
  }

  // 固定费用
  private feeOnFixedId = 10242
  // 按比例收取费用项ID
  private feeOnRatioId = 10243
  // 自定义费用
  private feeOnCustomId = 10244
  // 是否为日利率
  private isDailyInterestRate: Boolean = false

  /**
    1、仅选择一次性支付（10063），费用类型只能选择首付或尾款（10245，10247）；
      
    2、仅选择分期支付 （10064），费用类型只能选择分期 （10246）；

    3、多选一次性支付和分期支付，费用类型也支持多选；
   */
  get costTypeDisables(): number[] {
    let disableds = []
    if (this.model.repayType.length === 1) {
      let selected = this.model.repayType[0];
      if (selected === 10063) {
        disableds.push(10246)
      } else {
        disableds.push(10245, 10247)
      }
    }
    return disableds
  }

  /**
   * 当选中支付类型发生改变的时候移除不相关的费用项类型
   */
  private onRepayTypeChange(values: Array<number>) {
    if (values.length === 1) {
      this.costTypeDisables.forEach(v => {
        let index = this.model.costType.indexOf(v)
        if (index > -1) this.model.costType.splice(index, 1)
      })
    }
  }

  private form: Form = null;
  private rules: any = null;
  private model: any = {
    id: null,
    schemeId: "",
    paymentType: 10242,
    fixedCost: null,
    _repayProportion: null,
    get repayProportion() {
      return (this._repayProportion || 0) / 100
    },
    set repayProportion(val) {
      this._repayProportion = val * 100
    },
    expenseId: "", // 费用项名称ID
    isRefund: 10002, // 是否退款,默认退款
    repayType: [], // 支付方式
    costType: [] // 费用项类型
  }

  created() {
    this.rules = {
      // paymentType: { required: true, message: "请选择支付方式", trigger: "blur", type: "number" },
      fixedCost: { required: true, message: "请输入固定费用", trigger: "change", type: "number" },
      _repayProportion: { required: true, message: "请输入利率", trigger: "change", type: "number" },
      expenseId: { required: true, message: "请选择费用项", trigger: "change", type: "number" }, // 费用项名称ID
      repayType: { required: true, message: "请选择支付方式", trigger: "change", type: "array" }, // 支付方式
      costType: { required: true, message: "请选择费用项", trigger: "change", type: "array" }, // 费用项类型
      isRefund: { required: true, message: "请选择费用项", trigger: "change", type: "number" } // 费用项类型
    }
  }

  /**
   * 反显数据
   */
  private revertData() {
    this.repaySchemeService.getSchemeExpenseById(this.feeItemId).subscribe(
      data => {
        this.model.id = this.feeItemId
        this.model.schemeId = data.schemeId
        this.model.paymentType = data.paymentType
        this.model.fixedCost = data.fixedCost
        this.model.repayProportion = data.repayProportion
        this.model.expenseId = data.expenseId
        this.model.isRefund = data.isRefund
        this.model.repayType = (data.repayType || "").split(',').map(v => new Number(v).valueOf())
        this.model.costType = (data.costType || "").split(',').map(v => new Number(v).valueOf())
      },
      err => this.$Message.error(err.msg)
    )
  }


  submit() {
    return new Promise((resolve) => {
      this.form.validate(v => {
        if (!v) return resolve(false)
        if (this.model.paymentType === this.feeOnRatioId) {
          this.model.repayType = [10064] // 支付方式
          this.model.costType = [10246] // 费用项类型
        }
        this.repaySchemeService.schemeExpense(this.model).subscribe(
          data => {
            this.$Message.success('操作成功')
            return resolve(true)
          },
          err => {
            this.$Message.error(err.msg)
            return resolve(false)
          }
        )
      })
    })
  }


  mounted() {
    this.form = this.$refs.form;
    if (this.productId) this.model.schemeId = this.productId
    if (this.feeItemId) this.revertData()
  }

}
</script>

<style lang="less" scoped>
.component.choose-orgs {
  .chooes-all {
    margin-top: 20px;
    padding-left: 30px;
  }
}
</style>
