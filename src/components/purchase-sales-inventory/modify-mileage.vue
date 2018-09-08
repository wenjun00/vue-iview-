<!--维护车辆信息-->
<template>
  <section class="component modify-mileage">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">

      <i-form-item label="里程表值(公里)" prop="carMileage">
        <i-input-number v-model="model.carMileage" placeholder="请输入里程表值" clearable :min="0" :max="99999"></i-input-number>
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

@Component({
  components: {}
})
export default class ModifyMileage extends Vue {
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop() carMileage;
  @Prop() stockId
  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      carMileage: 0,
      stockId:""
    };

    this.rules = {
      carMileage: {
        message: "请输入里程表值",
        trigger: "blur",
        type: "number"
      }
    };
  }

  mounted() {
    this.model.carMileage = this.carMileage
    this.model.stockId = this.stockId
  }

  /**
   * 修改里程数值
   */
  private modifyCarMileage() {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService
        .editCarMileage(this.model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }


  private submit() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve();
        let result = this.modifyCarMileage()
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
