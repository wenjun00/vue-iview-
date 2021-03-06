<!--银行卡信息-->
<template>
  <section class="component modify-customer-info-bank">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="账号" prop="cardNo">
        <i-input v-model="model.cardNo" :maxlength="19" clearable></i-input>
      </i-form-item>
      <i-form-item label="账户类型" prop="accountType">
        <i-select v-model="model.accountType" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10044)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="银行名称" prop="bankName">
        <i-input v-model="model.bankName" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="开户行" prop="bankBranch">
        <i-input v-model="model.bankBranch" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="开户省份" prop="province">
        <i-select placeholder="选择省" v-model="model.province" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="开户城市" prop="depositCity">
        <i-select placeholder="选择市" v-model="model.depositCity" :disabled="!model.province" clearable>
          <i-option v-for="{value,label} in this.model.province ? this.$city.getCityData({ level: 1, id: this.model.province }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="备注" prop="remark">
        <i-input v-model="model.remark" :maxlength="100" clearable></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Form } from 'iview'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";


@Component({})
export default class ModifyCustomerInfoBank extends Vue {
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  // 客户ID
  @Prop() customerId: Number;
  // 维护数据
  @Prop() data: any;


  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      accountType: "",
      bankBranch: "",
      bankName: "",
      province: "",
      depositCity: "",
      cardNo: "",
      customerId: "",
      id: 0,
      remark: ""
    }

    this.rules = {
      accountType: { required: true, message: "请选择账户类型", trigger: "blur", type: "number" },
      bankName: [
        { required: true, message: "请填写银行名称", trigger: "blur" },
        { validator: this.checkBankName, trigger: "blur" }
      ],
      bankBranch: { validator: this.checkBankBranch, trigger: "blur" },
      cardNo: [
        { required: true, message: "请填写银行卡号", trigger: "blur" },
        { min: 16, message: "请填写正确的银行卡号", trigger: "blur" }
      ]
    }
  }

  /**
   * 验证银行名称
   */
  checkBankName(rule, value, callback) {
    if ((/^[\u4e00-\u9fa5]*$/).test(value)) {
      callback();
    } else {
      callback(new Error("银行名称必须为中文"));
    }
  }

  // /**
  //  * 验证开户行
  //  */
  checkBankBranch(rule, value, callback) {
    if ((/^(\d|[\u4e00-\u9fa5])*$/).test(value)) {
      callback();
    } else {
      callback(new Error("开户行必须为中文或中文加数字"));
    }
  }
  /**
   * 增加银行卡
   */
  private addBankInfo() {
    return new Promise((resolve, reject) => {
      this.basicCustomerService.addBasicCustomerBank(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  /**
   * 维护银行卡
   */
  private modifyBankInfo() {
    return new Promise((resolve, reject) => {
      this.basicCustomerService.updateCustomerBank(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  /**
   * 提交 新增 / 修改
   */
  submit() {
    return new Promise((resolve) => {
      let form = this.$refs.form as Form;
      form.validate(v => {
        if (!v) return resolve()
        // 根据customerId 判断新增 修改
        let result = this.customerId ? this.addBankInfo() : this.modifyBankInfo()
        result.then(() => {
          this.$Message.success('操作成功')
          resolve(true)
        }).catch(e => {
          this.$Message.error(e.msg)
          resolve()
        })
      })
    })
  }

  mounted() {
    if (this.data) this.model = this.data
    if (this.customerId) this.model.customerId = this.customerId
  }

}
</script>
<style lang="less" scoped>
</style>
