<!--匹配车辆-->
<template>
  <section class="component matching-car">
    <i-form :label-width="110" ref="form" :model="model" :rules="rules" inline>
      <i-form-item label="车架号" prop="stockCarNo">
        <i-input v-model="model.stockCarNo" readonly>
          <i-button icon="search" slot="append" @click="selectCarClick" :disabled="!isMatching"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="车辆品牌" prop="brandName">
        <i-input v-model="model.brandName" :disabled="!isMatching" readonly></i-input>
      </i-form-item>
      <i-form-item label="车辆系列" prop="seriesName">
        <i-input v-model="model.seriesName" :disabled="!isMatching" readonly></i-input>
      </i-form-item>
      <i-form-item label="车辆型号" prop="modelName">
        <i-tooltip trigger="hover" :content="model.modelName" placement="top" :disabled="!model.modelName">
          <i-input v-model="model.modelName" :disabled="!isMatching" readonly></i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="车身颜色" prop="color">
        <i-input v-model="model.color" :disabled="!isMatching" readonly></i-input>
      </i-form-item>
      <i-form-item label="融资价格" prop="financingPrice">
        <i-input-number v-model="model.financingPrice" :min="0" :max="99999999" :disabled="!isMatching" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" readonly></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="tsx">
import Vue from "vue"
import Component from "vue-class-component"
import { Prop, Model, Emit, Watch } from "vue-property-decorator"
import { Dependencies } from "~/core/decorator"
import { Form } from "iview"
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service"
import SelectCar from "~/components/car-matching/select-car.tsx.vue"
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service.ts"

@Component({
  components: {
    SelectCar
  }
})
export default class MatchingCar extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @Prop() orderId
  @Prop() matchingInfo

  @Model("stock-car-change") modelId: number;
  @Emit("stock-car-change")
  emitStockCarChange(stockId) { }

  private isMatching: Boolean = true

  private model = {
    stockId: null, // 库存id
    stockCarNo: '', // 车架号
    brandName: '', // 车辆品牌
    seriesName: '', // 车辆系列
    modelName: '', // 车辆型号
    color: '', // 车身颜色
    financingPrice: null // 融资价格
  }

  private rules = {
    stockCarNo: { trigger: "blur", message: "请选择车辆", required: true }
  }

  mounted() {
    this.basicCustomerOrderService.findOrderNewCar(this.orderId).subscribe(
      data => {
        this.model.brandName = data.brandName
        this.model.seriesName = data.seriesName
        this.model.modelName = data.modelName
        this.model.color = data.orderCarColor
      }
    )
    // 如果有车架号（已匹配），反显信息
    if (this.matchingInfo.stockCarNo) {
      this.model.stockCarNo = this.matchingInfo.stockCarNo
      this.model.financingPrice = this.matchingInfo.financingPrice
      this.isMatching = false
    }
  }

  /**
   * 选择车辆
   */
  private selectCarClick() {
    this.$dialog.show({
      title: '车辆选择',
      footer: true,
      width: 1000,
      okText: '确认匹配',
      onOk: (SelectCar: SelectCar) => {
        return SelectCar
          .submit()
          .then(v => {
            if (v) {
              this.model.stockId = SelectCar.selectedData.stockId;
              this.model.stockCarNo = SelectCar.selectedData.stockCarNo;
              this.model.financingPrice = SelectCar.selectedData.financingPrice;
              this.emitStockCarChange(SelectCar.selectedData.stockId)
            }
            else this.$Message.warning('请选择一条数据！')
            return v
          })
          .catch(err => {
            this.$Message.error(err.msg);
          });
      },
      render: h => (<SelectCar model={this.model}></SelectCar>)
    })
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  submit() {
    let form = this.$refs.form as Form;
    return new Promise((resolve, reject) => {
      form.validate(v => {
        if (v) {
          return resolve({
            stockId: this.model.stockId,
            stockCarNo: this.model.stockCarNo,
            financingPrice: this.model.financingPrice
          })
        } else {
          this.$Message.error("车辆匹配信息验证失败")
          return reject()
        }
      })
    });
  }
}
</script>

<style lang="less" scoped>
</style>
