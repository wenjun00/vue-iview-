<!--新增跟进记录-->
<template>
  <section class="component modify-customer-info-follow">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="跟进方式" prop="followType">
        <i-select v-model="model.followType" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10026)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="跟进结果" prop="followResult">
        <i-select v-model="model.followResult" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10024)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="备注" prop="remark">
        <i-input v-model="model.remark" :maxlength="100"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";

@Component({})
export default class ModifyCustomerInfoCar extends Vue {
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  // 意向ID
  @Prop() intentionId: Number;

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      followType: '', // 跟进方式
      followResult: '', // 跟进结果
      remark: '' // 备注
    }

    this.rules = {
      followType: { required: true, message: "请选择跟进方式", trigger: "blur", type: "number" },
      followResult: { required: true, message: "请选择跟进结果", trigger: "blur", type: "number" },
      remark: { max: 200, message: "长度不能超过200个字符", trigger: "blur" }
    }
  }
  /**
   * 新增跟进记录
   */
  addFollowRecord() {
    let form: any = this.$refs.form
    return new Promise((resolve, reject) => {
      form.validate(valid => {
        if (!valid) return reject()
        this.basicCustomerService.addBasicCustomerFollow(this.model, this.intentionId)
        .subscribe(
          data => {
            this.$Message.success("新增跟进记录成功！");
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg);
            resolve(false)
          }
        );
      })
    })
  }
}
</script>
<style lang="less">
</style>
