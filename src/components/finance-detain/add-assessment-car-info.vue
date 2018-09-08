<!--车辆信息-->
<template>
  <section class="component add-assessment-car-info">
    <i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
      <i-form-item label="品牌" prop="carPurpose">
        <i-input v-model="model.carPurpose" readonly placeholder="请选择品牌">
          <i-button icon="search" slot="append" @click="onSelectCarFocus"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="车系" prop="displacement">
        <i-input v-model="displacement" placeholder="请选择车系" readonly></i-input>
      </i-form-item>
      <i-form-item label="车型" prop="driver">
        <i-tooltip trigger="hover" :content="driver" placement="top" :disabled="!model.modelName">
          <i-input v-model="driver" placeholder="请选择车型" readonly></i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="车辆颜色" prop="color" :readonly="isView">
        <i-input v-model="model.color" placeholder="请输入颜色,如'红色'" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="选择省" prop="province" :readonly="isView">
        <i-select placeholder="选择省" v-model="model.province" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="选择市" prop="zone">
        <i-select placeholder="选择市" v-model="model.zone" :disabled="!model.province" clearable>
          <i-option v-for="{value,label} in this.model.province ? this.$city.getCityData({ level: 1, id: this.model.province }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="上牌日期" prop="regDate" :readonly="isView">
        <i-date-picker type="month" placeholder="请选择上牌日期" v-model="model.regDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="发证日期" prop="issueDate" :readonly="isView">
        <i-date-picker type="date" placeholder="请选择发证日期" v-model="model.issueDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="注册日期" prop="registerDate" :readonly="isView">
        <i-date-picker type="date" placeholder="请选择注册日期" v-model="model.registerDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="车辆性质" prop="isSecondHand">
        <i-select v-model="model.isSecondHand" placeholder="请选择车辆性质" :disabled="true" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10060)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="车架号" prop="stockCarNo" :readonly="isView">
        <i-input v-model="model.stockCarNo" placeholder="请输入车架号" :maxlength="17" clearable></i-input>
      </i-form-item>
      <i-form-item label="车牌号" prop="carNo" :readonly="isView">
        <i-input v-model="model.carNo" placeholder="请输入车牌号" :maxlength="10" clearable></i-input>
      </i-form-item>
      <i-form-item label="车况" prop="assessmentCarStatus">
        <i-select v-model="model.assessmentCarStatus" placeholder="请选择车况">
          <i-option v-for="{label,value} of $dict.getDictData(10046)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Prop, Model, Emit, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";

@Component({
  components: {
    ChooseVehicleModel,
  }
})
export default class AddAssessmentCarInfo extends Vue {

  @Prop({
    default: false,
    type: Boolean
  })
  isView: boolean;

  @Model('regDate-change') regDate
  @Emit('regDate-change')
  emitRegDateChange(regDate) { }

  @Watch('model.regDate', { immediate: true })
  onRegDateChange() {
    this.emitRegDateChange(this.model.regDate)
  }

  //车型
  private driver: String = "";
  //车系
  private displacement: String = "";

  private model: any = {
    carPurpose: "", // 品牌
    color: "", // 车辆颜色
    province: "", // 选择省
    zone: "", // 城市
    regDate: null, // 上牌日期
    issueDate: null,//发证日期
    registerDate: null,//注册日期
    isSecondHand: 10211, // 车辆性质
    assessmentCarStatus: "", // 车况
    stockCarNo: "", // 车架号
    carNo: "", // 车牌号
    modelLinkId: "", // 品牌id
    modelId: "", // 车型id
  };

  private rules = {
    regDate: {
      required: true,
      message: "请选择上牌日期",
      trigger: "blur",
      type: "date"
    },
    issueDate: {
      required: true,
      message: "请选择注册日期",
      trigger: "blur",
      type: "date"
    },
    registerDate: {
      required: true,
      message: "请选择发证日期",
      trigger: "blur",
      type: "date"
    },
    color: {
      required: true,
      type: "string",
      message: "请输入颜色,如'红色'",
      trigger: "blur"
    },
    zone: {
      required: true,
      type: "number",
      message: "请选择城市",
      trigger: "change"
    },
    province: {
      required: true,
      type: "number",
      message: "请选择省份",
      trigger: "change"
    },
    carPurpose: {
      required: true,
      message: "请选择车辆品牌",
      trigger: "change"
    },
    stockCarNo: [
      { required: true, message: "请输入车架号", trigger: "blur" },
      { validator: this.$validator.carVIN, trigger: "blur" }
    ],
    carNo: [
      { required: true, message: "请输入车牌号", trigger: "blur" },
      { validator: this.$validator.carCardNo, trigger: "blur" }
    ],
    isSecondHand: {
      required: true,
      type: "number",
      message: "请选择车辆性质",
      trigger: "blur"
    },
    assessmentCarStatus: {
      required: true,
      message: "请选择车况",
      type: "number",
      trigger: "blur"
    }
  };

  /**
   * 选择车型
   */
  private onSelectCarFocus() {
    this.$dialog.show({
      title: "车型选择",
      footer: true,
      width: 1100,
      onOk: (chooseCar: ChooseVehicleModel) => {
        this.model.carPurpose = chooseCar.selectData.brandName;
        this.model.modelLinkId = chooseCar.selectData.modelLinkId;
        this.model.modelId = chooseCar.selectData.modelId,
          this.displacement = chooseCar.selectData.seriesName;
        this.driver = chooseCar.selectData.modelName;
      },
      render: h =>
        h(ChooseVehicleModel, {
          props: {
            carId: this.model.modelId
          }
        })
    });
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
          this.$Message.error("车辆信息验证失败")
          return reject()
        }
      })
    });
  }
}
</script>

<style lang="less">
</style>
