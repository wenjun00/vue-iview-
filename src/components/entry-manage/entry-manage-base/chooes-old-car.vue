<!-- 挑选二手车 -->
<template>
  <section class="component chooes-old-car">
    <i-form :model="model" :rules="rules" :label-width="110" inline ref="form">
      <i-form-item label="车架号" prop="vin">
        <i-input :value="carInfo.vin" placeholder="请选择车辆" :disabled="isView" readonly>
          <i-button icon="search" slot="append" :disabled="isView" @click="onSelectCarClick"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="精准估价">
        <i-input :value="price" readonly>
          <span slot="append">万元</span>
        </i-input>
      </i-form-item>
      <i-form-item label="发动机号">
        <i-input :value="carInfo.engineNo" readonly></i-input>
      </i-form-item>
      <i-form-item label="车辆品牌">
        <i-input :value="carInfo.brand" readonly></i-input>
      </i-form-item>
      <i-form-item label="车辆系列">
        <i-input :value="carInfo.series" readonly></i-input>
      </i-form-item>
      <i-form-item label="车辆型号">
        <i-tooltip trigger="hover" :content="carInfo.model" placement="top" :disabled="carInfo.model == ''? false : true ">
          <i-input :value="carInfo.model" readonly></i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="车辆牌照">
        <i-input :value="carInfo.cardNo" readonly></i-input>
      </i-form-item>
      <i-form-item label="车身颜色">
        <i-input :value="carInfo.color" readonly></i-input>
      </i-form-item>
      <i-form-item label="备注说明" prop="remark">
        <i-input type="textarea" :rows="1" :maxlength="100" v-model="model.remark"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Model, Emit } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ChooseSecondhandCar from "~/components/operate-center/choose-secondhand-car.tsx.vue";
import { Form } from "iview";
import { secondCarInfo } from "~/interfaces/work.interface";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { SubmitType } from "~/config/enum.config";

@Component({
  components: {
  }
})
export default class ChooesOldCar extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Prop() orderId: number;
  @Prop() isView: boolean;

  @Model("car-change") modelId: number;
  @Emit("car-change")
  private emitCarChange(id) { }

  // 客户选中的车辆信息
  private selectedCar: secondCarInfo = null;
  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      stockId: null,
      remark: "",
      vin: ""
    }
    this.rules = {
      vin: { required: true, message: "请选择车辆", trigger: "blur" }
    }
  }

  /**
   * 车辆选择
   */
  private onSelectCarClick() {
    this.$dialog.show({
      title: "车辆选择",
      footer: true,
      width: 1100,
      onOk: (chooseCar: ChooseSecondhandCar) => {
        this.selectedCar = chooseCar.selectData;
        if (this.selectedCar) {
          this.model.stockId = this.selectedCar.id
          this.model.vin = this.selectedCar.vin
          this.emitCarChange(this.selectedCar.modelId)
        }
      },
      render: h =>
        h(ChooseSecondhandCar, {
          props: { stockCarNo: this.carInfo.vin }
        })
    });
  }

  /**
   * 二手车信息
   */
  private get carInfo(): any {
    return this.selectedCar || {}
  }

  /**
   * 车辆价格 万元
   */
  get price() {
    let result = ""
    let p = this.carInfo.price
    if (p) {
      p /= 10000
      result = this.$filter.toThousands(p)
    }
    return result
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  private submit(type: SubmitType) {
    if (type === SubmitType.Save) {
      return Promise.resolve(this.model)
    }
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

  mounted() {
    if (this.orderId) {
      // 查询订单关联的二手车信息
      this.basicCustomerOrderService.findOrderOldCar(this.orderId)
        .subscribe(
          data => {
            this.model.stockId = data.stockId
            this.model.remark = data.remark
            this.emitCarChange(data.modelId)
            this.selectedCar = {
              id: data.stockId,
              vin: data.stockCarNo,
              brand: data.brandName,
              series: data.seriesName,
              model: data.modelName,
              cardNo: data.plateNo,
              modelId: data.modelId,
              engineNo: data.stockEngineNo,
              price: data.price,
              color: data.stockCarColor
            }
            this.model.vin = this.selectedCar.vin
          },
          err => this.$Message.error(err.msg)
        )
    }
  }

}
</script>

<style lang="less">
</style>