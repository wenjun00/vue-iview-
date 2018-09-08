<!-- 挑选新车 -->
<template>
  <section class="component chooes-new-car">
    <i-form :model="model" :rules="rules" :label-width="150" inline ref="form">
      <i-form-item label="品牌" prop="brandName">
        <i-input v-model="model.brandName" placeholder="请选择车型" readonly>
          <i-button icon="search" slot="append" :disabled="isView" @click="onSelectCarClick"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="车系" prop="seriesName">
        <i-input v-model="model.seriesName" placeholder="请选择车型" readonly>
          <i-button icon="search" slot="append" @click="onSelectCarClick" :disabled="isView"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="车型" prop="modelName">
        <i-tooltip trigger="hover" :content="model.modelName" placement="top" :disabled="!model.modelName">
          <i-input v-model="model.modelName" placeholder="请选择车型" readonly>
            <i-button icon="search" slot="append" @click="onSelectCarClick" :disabled="isView"></i-button>
          </i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="车身颜色" prop="modelColor">
        <i-input v-model="model.modelColor" placeholder="请输入车身颜色" :disabled="isView" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="市场指导价(万元)" prop="referencePrice">
        <i-input-number v-model.lazy="referencePrice" :min="0" :max="99999" placeholder="请输入市场指导价" :disabled="isView"></i-input-number>
      </i-form-item>
      <i-form-item label="备注说明" prop="remark">
        <i-input type="textarea" :rows="1" :maxlength="100" v-model="model.remark" :disabled="isView"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Model, Emit, Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";
import { Form } from "iview";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { SubmitType } from "~/config/enum.config"

@Component({
  components: {
  }
})
export default class ChooesNewCar extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @Model("car-change") modelId: number;
  @Emit("car-change")
  emitCarChange(id) { }

  /**
   * 订单ID
   */
  @Prop({
    required: true
  }) orderId: number;


  @Prop() isView: boolean;

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      brandName: "",
      modelId: null,
      seriesName: "",
      modelName: "",
      modelColor: "",
      referencePrice: null,
      remark: ""
    }
    this.rules = {
      brandName: { required: true, message: "请选择车辆", trigger: "change" },
      seriesName: { required: true, message: "请选择车辆", trigger: "change" },
      modelName: { required: true, message: "请选择车辆", trigger: "change" },
      modelColor: { required: true, message: "请输入车辆颜色", trigger: "blur" },
      referencePrice: { required: true, message: "请输入市场指导价", trigger: "change", type: "number" }
    }
  }

  mounted() {
    if (this.orderId) this.revertData()
  }


  /**
   * 反显数据
   */
  private revertData() {
    this.basicCustomerOrderService.findOrderNewCar(this.orderId).subscribe(
      data => {
        this.model.modelId = data.modelId
        this.model.brandName = data.brandName
        this.model.seriesName = data.seriesName
        this.model.modelName = data.modelName
        this.model.modelColor = data.orderCarColor
        this.model.referencePrice = data.referencePrice
        this.model.remark = data.remark
        this.emitCarChange(data.modelId)
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 选择车型
   */
  private onSelectCarClick() {
    this.$dialog.show({
      title: "车型选择",
      footer: true,
      width: 1000,
      onOk: (chooseCar: ChooseVehicleModel) => {
        let car = chooseCar.selectData;
        if (car.carId) {
          this.model.brandName = car.brandName;
          this.model.modelId = car.carId;
          this.model.seriesName = car.seriesName;
          this.model.modelName = car.modelName;
          this.emitCarChange(car.carId)
        }
      },
      render: h =>
        h(ChooseVehicleModel, {
          props: { carId: this.model.modelId }
        })
    });
  }


  /**
   * 验证表单信息
   * 成功返回form数据
   */
  submit(type: SubmitType) {
    if (type === SubmitType.Save) {
      return Promise.resolve({
        modelId: this.model.modelId,
        modelColor: this.model.modelColor,
        referencePrice: this.model.referencePrice,
        remark: this.model.remark
      })
    }
    let form = this.$refs.form as Form;
    return new Promise((resolve, reject) => {
      form.validate(v => {
        if (v) {
          return resolve({
            modelId: this.model.modelId,
            modelColor: this.model.modelColor,
            referencePrice: this.model.referencePrice,
            remark: this.model.remark
          })
        } else {
          this.$Message.error("车辆信息验证失败")
          return reject()
        }
      })
    });
  }

  private get referencePrice() {
    return this.$common.divideByTenThousands(this.model.referencePrice)
  }
  private set referencePrice(val) {
    this.model.referencePrice = this.$common.multiplyByTenThousands(val)

  }
}
</script>

<style lang="less">
</style>