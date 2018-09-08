<!-- 客户来源 -->
<template>
  <section class="component customer-resource">
    <i-form :model="model" :rules="rules" inline ref="form">
      <i-form-item prop="resource">
        <i-checkbox-group v-model="model.resource">
          <i-checkbox v-for="{label,value} of $dict.getDictData(10076)" :disabled="isView" :key="value" :label="value">{{label}}</i-checkbox>
        </i-checkbox-group>
      </i-form-item>
      <i-form-item prop="remark">
        <i-input v-model="model.remark" :maxlength="100" :disabled="model.resource.indexOf(10303) < 0 || isView" placeholder="请输入其他来源信息"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { differenceInYears } from "date-fns";
import { Form } from "iview";
import { SubmitType } from "~/config/enum.config";

@Component({
  components: {
  }
})
export default class CustomerResource extends Vue {
  @Prop({
    required: true
  }) orderInfo: any;

  @Prop() isView: boolean;

  @Watch("orderInfo", { immediate: true })
  onOrderInfoChange(val) {
    if (val) {
      if (!val.orderChannel) return
      let resource = (val.orderChannel || "").split(",")
      this.model.resource = resource.map(v => Number.parseInt(v));
      this.model.remark = val.orderChannelRemark
    }
  }

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      resource: [],
      remark: ""
    }
    this.rules = {
      resource: { required: true, message: "请选择客户来源", trigger: "change", type: "array" }
    }
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  private submit(type: SubmitType) {
    if (type === SubmitType.Save) {
      return Promise.resolve({
        orderChannel: this.model.resource.join(","),
        orderChannelRemark: this.model.remark
      })
    }
    let form = this.$refs.form as Form;
    return new Promise((resolve, reject) => {
      form.validate(v => {
        if (v) {
          return resolve({
            orderChannel: this.model.resource.join(","),
            orderChannelRemark: this.model.remark
          })
        } else {
          this.$Message.error("客户来源验证失败")
          return reject()
        }
      })
    });
  }

}
</script>

<style lang="less">
</style>