<!--车辆参考定价和精准价格-->
<template>
  <section class="component car-appraisal">
    <i-form :label-width="150" :model="model" :rules="rules" ref="form" inline>
      <i-card title="参考定价">
        <a slot="extra" @click="onRecommendedPriceClick" v-show="!isView">
          立即估价
        </a>
        <i-form-item label="参考最高价(万元)" prop="inputHighAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="inputHighAssessmentPrice" placeholder="请输入估价" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :min="inputLowAssessmentPrice || 0" :max="9999"></i-input-number>
        </i-form-item>
        <i-form-item label="参考最低价(万元)" prop="inputLowAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="inputLowAssessmentPrice" placeholder="请先填写最高估价" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :min="0" :max="inputHighAssessmentPrice || 9999" :disabled="!inputHighAssessmentPrice"></i-input-number>
        </i-form-item>
      </i-card>
      <i-card title="精准价格">
        <i-form-item label="精准估价(万元)" prop="inputAssessmentPrice" :readonly="isView">
          <i-input-number v-model.lazy="inputAssessmentPrice" placeholder="请输入估价" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :min="0" :max="9999"></i-input-number>
        </i-form-item>
      </i-card>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Prop, Model, Emit, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicAssessmentCarPriceAnalysisService } from "~/services/manage-service/basic-assessment-car-price-analysis.service";

@Component({
  components: {
  }
})
export default class CarAppraisal extends Vue {
  @Dependencies(BasicAssessmentCarPriceAnalysisService) private basicAssessmentCarPriceAnalysisService: BasicAssessmentCarPriceAnalysisService;

  @Prop() carAppraisal
  @Prop() lowAssessmentPrice
  @Prop() highAssessmentPrice
  @Prop({
    default: false,
    type: Boolean
  })
  isView: boolean;

  @Watch('lowAssessmentPrice')
  onLowAssessmentPriceChange(val) {
    this.inputLowAssessmentPrice = val / 10000
  }
  @Watch('highAssessmentPrice')
  onHighAssessmentPriceChange(val) {
    this.inputHighAssessmentPrice = val / 10000
  }

  private model: any = {
    inputHighAssessmentPrice: null,
    inputLowAssessmentPrice: null,
    assessmentPrice: null
  };

  private rules = {
    inputHighAssessmentPrice: {
      required: true,
      type: "number",
      message: "请输入最低估价",
      trigger: "blur"
    },
    inputLowAssessmentPrice: {
      required: true,
      type: "number",
      message: "请输入最高估价",
      trigger: "blur"
    }
  };


  /**
     * 立即估价
     */
  onRecommendedPriceClick() {
    this.carAppraisal(1)
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  private submit() {
    let form = this.$refs.form as Form;
    return new Promise((resolve, reject) => {
      form.validate(v => {
        if (v) {
          return resolve(this.model)
        } else {
          this.$Message.error("车辆估价验证失败")
          return reject()
        }
      })
    });
  }

  private get inputHighAssessmentPrice() {
    return this.$common.divideByTenThousands(this.model.inputHighAssessmentPrice)
  }
  private set inputHighAssessmentPrice(val) {
    this.model.inputHighAssessmentPrice = this.$common.multiplyByTenThousands(val)
  }


  private get inputLowAssessmentPrice() {
    return this.$common.divideByTenThousands(this.model.inputLowAssessmentPrice)
  }
  private set inputLowAssessmentPrice(val) {
    this.model.inputLowAssessmentPrice = this.$common.multiplyByTenThousands(val)
  }


  private get inputAssessmentPrice() {
    return this.$common.divideByTenThousands(this.model.assessmentPrice)
  }
  private set inputAssessmentPrice(val) {
    this.model.assessmentPrice = this.$common.multiplyByTenThousands(val)
  }
}
</script>

<style lang="less">
</style>
