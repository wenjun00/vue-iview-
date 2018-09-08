<!--车辆价格-->
<template>
  <section class="component car-price">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="指导价" prop="guidePrice">
        <i-input-number v-model="model.guidePrice" placeholder="请输入指导价" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
       <i-form-item label="采车价" prop="stockPrice">
        <i-input-number v-model="model.stockPrice" placeholder="请输入采车价" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
       <i-form-item label="融资车价" prop="financingPrice">
        <i-input-number v-model="model.financingPrice" placeholder="请输入融资车价" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
       <i-form-item label="开票价" prop="ticketPrice">
        <i-input-number v-model="model.ticketPrice" placeholder="请输入开票价" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
       <i-form-item label="其他费用" prop="otherPrice">
        <i-input-number v-model="model.otherPrice" placeholder="请输入其他费用" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";

@Component({
  components: {
    ChooseVehicleModel
  }
})
export default class CarPrice extends Vue {
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop() data;

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      guidePrice: null,//指导价
      stockPrice: null,//采车价
      financingPrice: null,//融资车价
      ticketPrice: null,//开票价
      otherPrice: null,//其他费用
    };

    this.rules = {
      financingPrice: {
        required: true,
        message: "请输入融资车价",
        trigger: "blur",
        type: "number"
      }
    };
  }

  mounted() {
    if (this.data) {
      this.model= this.data
    }
  }

  /**
   * 采购入库填写价格
   */
  private addCarPrice() {
    return new Promise((resolve, reject) => {
      resolve(this.model)
    });
  }

  /**
   * 修改价格
   */
  private modifyCarPrice() {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService
        .editCustomerStorage(this.model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }

  private submit() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve();
        let result = this.data ? this.modifyCarPrice() : this.addCarPrice();
        result
          .then(v => {
            this.$Message.success("操作成功");
            resolve(v);
          })
          .catch(e => {
            this.$Message.error(e.msg);
            resolve();
          });
      });
    });
  }

  private confirm() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false);
        return resolve(this.model)
      });
    })
  }
}
</script>
<style lang="less">
</style>
