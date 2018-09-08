<!--新增车辆-->
<template>
  <section class="component add-vehicle">
    <i-form :label-width="110" ref="form" :model="model" :rules="rules">
      <i-row :gutter="15">
        <i-col :span="12">
          <i-form-item label="车型名称" prop="modelName">
            <i-input v-model="model.modelName" placeholder="请输入车型名称" :maxlength="100"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="排放标准" prop="dischargeStandard">
            <i-input v-model="model.dischargeStandard" placeholder="请输入排放标准" :maxlength="20"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="变速箱" prop="gearType">
            <i-input v-model="model.gearType" placeholder="请输入变速箱" :maxlength="20"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="排量" prop="liter">
            <i-input v-model="model.liter" placeholder="请输入排量" :maxlength="20"></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="最大上牌年份" prop="maxRegYear">
            <i-date-picker type="year" v-model="model.maxRegYear" :options="optionMax" placeholder="请选择" clearable></i-date-picker>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="最小上牌年份" prop="minRegYear">
            <i-date-picker type="year" v-model="model.minRegYear" :options="optionMin" placeholder="请选择" clearable></i-date-picker>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="年款" prop="modelYear">
            <i-date-picker type="year" v-model="model.modelYear" placeholder="请选择" clearable></i-date-picker>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="参考价格" prop="referencePrice">
            <i-input-number v-model="model.referencePrice" placeholder="请输入参考价格" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="座位数" prop="seatNumber">
            <i-input-number v-model="model.seatNumber" placeholder="请输入座位数" :min="0" :max="30"></i-input-number>
          </i-form-item>
        </i-col>
        <i-col :span="24">
          <i-form-item label="备注" prop="remark">
            <i-input v-model="model.remark" class="item-full" :maxlength="100"></i-input>
          </i-form-item>
        </i-col>
      </i-row>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCarManageService } from '~/services/manage-service/basic-car-manage.service'
import { Form } from "iview";

@Component({
  components: {}
})
export default class AddVehicle extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;

  // 系列ID
  @Prop({
    type: Object,
    default: () => { }
  }) series

  @Prop() carId: number;
  @Prop() name;

  private carSeriesId: any
  private optionMax = {
    disabledDate: date => {
      return this.model.minRegYear ? date.getFullYear() < new Date(Number(this.model.minRegYear)).getFullYear() : false;
    }
  }
  private optionMin = {
    disabledDate: date => {
      return this.model.maxRegYear ? date.getFullYear() > new Date(Number(this.model.maxRegYear)).getFullYear() : false;
    }
  }
  private model = {
    modelName: '', // 车型名称
    dischargeStandard: '', // 排放标准
    gearType: '', // 变速箱
    liter: '',  // 排量
    maxRegYear: '', // 最大上牌年份
    minRegYear: '', // 最小上牌年份
    modelYear: '', // 年款
    referencePrice: null, // 参考价格
    seatNumber: null, // 座位数
    remark: ''
  };

  private rules = {
    modelName: { trigger: "blur", message: "请输入车型名称", required: true },
    dischargeStandard: { trigger: "blur", message: "请输入排放标准", required: true },
    gearType: { trigger: "blur", message: "请输入变速箱类型", required: true },
    liter: { trigger: "blur", message: "请输入排量", required: true },
    maxRegYear: { trigger: "blur", message: "请选择最大上牌年份", required: true, type: "date" },
    minRegYear: { trigger: "blur", message: "请选择最小上牌年份", required: true, type: "date" },
    modelYear: { trigger: "blur", message: "请选择年款", required: true, type: "date" },
    referencePrice: { trigger: "blur", message: "请输入参考价格", required: true, type: "number" },
    seatNumber: { trigger: "blur", message: "请输入座位数", required: true, type: "number" }
  }

  private form: Form;

  /**
   * 新增车辆
   */
  addVehicle() {
    return new Promise((resolve, reject) => {
      this.form.validate(valid => {
        if (!valid) return reject()
        this.basicCarManageService.addCarModel(this.series.id, this.model).subscribe(
          data => {
            this.$Message.success("新增车辆成功！");
            resolve()
          },
          ({ msg }) => {
            this.$Message.error(msg);
            reject()
          }
        );
      });
    })
  }

  /**
   * 修改车型
   */
  updateVehicle() {
    return new Promise((resolve, reject) => {
      this.form.validate(valid => {
        if (!valid) return reject()
        this.basicCarManageService.editCarModel(this.carId, this.model).subscribe(
          data => {
            this.$Message.success("修改车辆成功！");
            resolve()
          },
          ({ msg }) => {
            this.$Message.error(msg);
            reject()
          }
        );
      });
    })
  }

  mounted() {
    // 新增车辆
    this.form = this.$refs['form']

    if (this.carId) {
      this.basicCarManageService.carModelInfo(this.carId).subscribe(
        data => {
          this.model.modelName = data.modelName
          this.model.dischargeStandard = data.dischargeStandard
          this.model.gearType = data.gearType
          this.model.liter = data.liter
          this.model.maxRegYear = data.maxRegYear
          this.model.minRegYear = data.minRegYear
          this.model.modelYear = data.modelYear
          this.model.referencePrice = data.referencePrice
          this.model.seatNumber = data.seatNumber
          this.model.remark = data.remark
        },
        err => this.$Message.error(err.msg)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.add-vehicle {
  .item-full {
    width: 545px !important;
  }
  .item-span {
    color: red;
    padding-left: 90px;
  }
}
</style>
