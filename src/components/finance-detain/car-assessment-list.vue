<!--车辆评估单-->
<template>
  <section class="component car-assessment-list">
    <i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
      <i-form-item label="内饰状况" prop="interior">
        <i-select v-model="model.interior" placeholder="请选择内饰状况" :disabled="isView" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="公里数漆面状况" prop="surface" :readonly="isView">
        <i-select v-model="model.surface" placeholder="请选择漆面状况" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="过户次数(次)" prop="transferTimes" :readonly="isView" clearable>
        <i-input-number v-model="model.transferTimes" placeholder="请输入过户次数" :min="0" :max="99" :step="1"></i-input-number>
      </i-form-item>
      <i-form-item label="工况状况" prop="workState">
        <i-select v-model="model.workState" placeholder="请选择工况状况" :disabled="isView" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10061)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="出厂日期" prop="makeDate" :readonly="isView">
        <i-date-picker type="month" placeholder="请选择出厂日期" v-model="model.makeDate" :options="$common.datePickDisabledDateCustomer(model.regDate)" :disabled="!model.regDate" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="行驶里程" prop="mile" :readonly="isView">
        <i-input-number v-model="mile" placeholder="请输入行驶里程" clearable :min="0" :max="9999999"></i-input-number>
        <span>万公里</span>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";

@Component({
  components: {
  }
})
export default class CarAssessmentList extends Vue {

  @Prop({
    default: false,
    type: Boolean
  })
  isView: boolean;

  @Prop() regDate

  @Watch('regDate', { immediate: true })
  onRegDateChange() {
    this.model.regDate = this.regDate
  }


  //车型
  private driver: String = "";
  //车系
  private displacement: String = "";

  private model: any = {
    regDate: "", // 上牌日期
    interior: "", // 内饰状况
    surface: "", // 公里数漆面状况
    workState: "", // 工况状况
    makeDate: "", // 出厂日期
    transferTimes: null, // 过户次数
    mile: null // 行驶里程
  };

  private rules = {
    interior: {
      required: true,
      type: "number",
      message: "请选择内饰状况",
      trigger: "blur"
    },
    surface: {
      required: true,
      type: "number",
      message: "请选择漆面状况",
      trigger: "blur"
    },
    workState: {
      required: true,
      type: "number",
      message: "请选择工况状况",
      trigger: "blur"
    },
    makeDate: {
      required: true,
      message: "请选择出厂日期",
      trigger: "blur",
      type: "date"
    },
    transferTimes: {
      required: true,
      type: "number",
      message: "请输入过户次数",
      trigger: "blur"
    },
    mile: {
      required: true,
      type: "number",
      message: "请输入行驶里程",
      trigger: "blur"
    }
  };

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
          this.$Message.error("车辆评估单验证失败")
          return reject()
        }
      })
    });
  }

  private get mile() {
    return this.$common.divideByTenThousands(this.model.mile)
  }

  private set mile(val) {
    this.model.mile = this.$common.multiplyByTenThousands(val)
  }

}
</script>

<style lang="less">
</style>
