<!-- 产品业务 -->
<template>
  <section class="component product-business">
    <i-form :label-width="110" :model="model" ref="form" :rules="rules" inline>
      <i-form-item label="业务名称" prop="businessName">
        <i-input v-model="model.businessName" placeholder="请输入业务名称" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="业务类型" prop="businessType">
        <i-select v-model="model.businessType" :disabled="!!id">
          <i-option v-for="{label,value} of $dict.getDictData(10063)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="冲抵策略" prop="offsetId">
        <i-select v-model="model.offsetId">
          <i-option v-for="{label,value} of offsetDataList" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="审核流程" prop="workFlowKey">
        <i-select v-model="model.workFlowKey">
          <i-option v-for="{label,value} of $dict.getDictData(10038)" :key="value" :label="label" :value="label"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="备注" prop="remark">
        <i-input type="textarea" class="text-area" v-model="model.remark" :maxlength="100"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { Form } from "iview";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { BasicOffsetService } from "~/services/manage-service/basic-offset.service";

@Component({
  components: {
  }
})
export default class ProductBusiness extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService
  @Dependencies(BasicOffsetService) private basicOffsetService: BasicOffsetService

  @Prop() id

  private form: Form
  private model: any = {
    businessType: null,
    businessName: "",
    offsetId: null,
    remark: "",
    workFlowKey: ""
  }
  private offsetDataList: any[] = []

  private rules = {
    businessType: { required: true, message: "请选择业务类型", trigger: "change", type: "number" },
    businessName: { required: true, message: "请输入业务名称", trigger: "blur" },
    offsetId: { required: true, message: "请选择冲抵策略", trigger: "change", type: "number" },
    workFlowKey: { required: true, message: "请选择审核流程", trigger: "change" },
  }

  /**
   * 还原数据
   */
  private revertData() {
    this.repaySchemeService.findBusinessById(this.id).subscribe(
      data => {
        this.model.businessType = data.businessType
        this.model.businessName = data.businessName
        this.model.offsetId = data.offsetId
        this.model.remark = data.remark
        this.model.workFlowKey = data.workFlowKey
      },
      err => this.$Message.error(err.msg)
    )
  }



  mounted() {
    this.GetAllOffsetData()
    this.form = this.$refs.form
    if (this.id) this.revertData()
  }

  /**
   * 获取所有冲抵策略
   */
  private GetAllOffsetData() {
    this.basicOffsetService.findBasicOffsetByOrg().subscribe(
      data => {
        this.offsetDataList = data.map(v => {
          return {
            label: v.offsetName,
            value: v.id
          }
        })
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
    * 新增产品系列
    */
  private addProduct() {
    return new Promise((resolve) => {
      this.form.validate(valid => {
        if (!valid) return resolve(false)
        this.repaySchemeService.addBusiness(this.model)
          .subscribe(
            data => {
              this.$Message.success("操作成功！");
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
  /**
    * 编辑产品系列
    */
  private editProduct() {
    return new Promise((resolve, reject) => {
      this.form.validate(valid => {
        if (!valid) return reject()
        this.repaySchemeService.updateBusiness(this.id, this.model)
          .subscribe(
            data => {
              this.$Message.success("操作成功！");
              resolve(true)
            },
            ({ msg }) => {
              this.$Message.error(msg);
              resolve(false)
            }
          );
      })
    })
  }

  submit() {
    return this.id ? this.editProduct() : this.addProduct();
  }



}
</script>

<style lang="less" scoped>
.component.product-business {
  .text-area {
    width: 525px;
  }
}
</style>
