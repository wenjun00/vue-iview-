<!--车辆参数维护-->
<template>
  <section class="component car-parms-base">
    <i-form :model="model" :rules="rules" ref="form" :label-width="110" inline>
      <i-form-item label="参数类型" prop="paramTypeCode">
        <i-select v-model="model.paramTypeCode" clearable :disabled="disabledStatus">
          <i-option v-for="{label,value} of $dict.getDictData(10062)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="参数名称" prop="name">
        <i-input v-model="model.name" placeholder="请输入参数名称" :clearable="!disabledStatus" :disabled="disabledStatus" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="参数值" prop="comment">
        <i-input v-model="model.comment" placeholder="请输入参数值" clearable :maxlength="50"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { BasicCarManageService } from '~/services/manage-service/basic-car-manage.service'
import { Form } from "iview";

@Component({
  components: {}
})
export default class CarParmsBase extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService

  @Prop({
    required: true,
    type: Number
  }) carId

  @Prop({
    default: ''
  })
  paramTypeCode

  @Prop({
    default: ''
  })
  param

  private form: Form
  private disabledStatus: Boolean = false

  private model = {
    paramTypeCode: "", // 参数类型
    name: "", // 参数名称
    comment: "", // 参数值
    id: 0 // 参数id
  }

  private rules = {
    paramTypeCode: { required: true, message: '请选择参数类型', trigger: 'blur',type: "number" },
    name: { required: true, message: '请输入参数名称', trigger: 'blur' },
    comment: { required: true, message: '请输入参数值', trigger: 'blur' }
  }

  /**
   * 新增车辆参数
   */
  private addCarParam(model) {
    return new Promise((resolve, reject) => {
      this.basicCarManageService
        .addCarConfigParamInfo(model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }

  /**
   * 修改车辆参数
   */
  private editCarParam(model) {
    return new Promise((resolve, reject) => {
      this.basicCarManageService
        .updateModelParam(model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }

  /**
    * 确定
    */
  submit() {
    let model = {
      paramTypeCode: this.model.paramTypeCode,
      name: this.model.name,
      comment: this.model.comment,
      modelId: this.carId,
      id: this.model.id
    }
    return new Promise(resolve => {
      this.form.validate(v => {
        if (!v) return resolve(false);
        let result = this.paramTypeCode ? this.editCarParam(model) : this.addCarParam(model);
        result.then(v => {
          this.$Message.success("操作成功！");
          resolve(true);
        }).catch(err => {
          this.$Message.error(err.msg);
          resolve(false);
        });
      });
    });

  }

  mounted() {
    this.form = this.$refs['form']
    if(this.paramTypeCode) {
      this.model.paramTypeCode = this.paramTypeCode,
      this.model.name = this.param.carParamName,
      this.model.comment = this.param.carParamValue,
      this.model.id = this.param.id,
      this.disabledStatus = true
    }
  }



}
</script>

<style lang="less" scoped>
</style>
