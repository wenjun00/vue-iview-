<!--维护直系联系人信息-->
<template>
  <section class="component modify-customer-info-direct-contacts">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="姓名" prop="contactName">
        <i-input v-model="model.contactName" clearable :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="关系" prop="contactRelation">
        <i-select v-model="model.contactRelation" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10056)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="身份证号" prop="idCard">
        <i-input v-model="model.idCard" :maxlength="18" clearable></i-input>
      </i-form-item>
      <i-form-item label="联系方式" prop="contactPhone">
        <i-input v-model="model.contactPhone" :maxlength="11" clearable></i-input>
      </i-form-item>
      <i-form-item label="户籍所在地" prop="area">
        <i-select placeholder="选择省" v-model="model.province" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择市" v-model="model.city" :disabled="!model.province" clearable>
          <i-option v-for="{value,label} in this.model.province ? this.$city.getCityData({ level: 1, id: this.model.province }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择区/县" v-model="model.area" :disabled="!model.city" clearable>
          <i-option v-for="{value,label} in this.model.city ? this.$city.getCityData({ level: 2, id: this.model.city }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-input v-model="model.contactAddress" placeholder="详细地址" :maxlength="50"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerContactService } from "~/services/manage-service/basic-customer-contact.service";

@Component({})
export default class ModifyCustomerInfoDirectContacts extends Vue {
  @Dependencies(BasicCustomerContactService) private basicCustomerContactService: BasicCustomerContactService;
 // 客户ID
  @Prop() customerId: Number;
  // 维护数据
  @Prop() data;

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      contactType: 10316, // 直系联系人
      contactName: '', // 姓名
      contactRelation: '', // 关系
      idCard: '', // 身份证号
      contactPhone: '', // 电话
      province: '', // 所在省
      city: '', // 所在市
      area: '', // 所在区
      contactAddress: '' // 详细地址
    }

    this.rules = {
      contactName: [
        { required: true, message: "请填写姓名", trigger: "blur" },
        { validator: this.$validator.chineseName, trigger: "blur" }
      ],
      contactRelation: { required: true, message: "请选择关系", trigger: "blur", type: "number" },
      idCard: [
        { required: true, message: "请填写身份证号", trigger: "blur" },
        { validator: this.$validator.idCard, trigger: "blur" },
      ],
      contactPhone: [
        { required: true, message: "请填写电话", trigger: "blur" },
        { validator: this.$validator.phoneNumber, trigger: "blur" }
      ],
      area: { required: true, message: "请选择户籍所在地", trigger: "blur", type: "number" },
    }
  }

  mounted() {
    if (this.data) this.model = this.data
    if (this.customerId) this.model.customerId = this.customerId
  }

  /**
   * 新增联系人
   */
  private addContact() {
    return new Promise((resolve, reject) => {
      this.basicCustomerContactService.addCustomContact(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  /**
   * 修改联系人
   */
  private modifyContact() {
    return new Promise((resolve, reject) => {
      this.basicCustomerContactService.updateCustomContant(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  private submit() {
    let form: any = this.$refs.form
    return new Promise((resolve) => {
      form.validate(v => {
        if (!v) return resolve()
        let result = this.customerId ? this.addContact() : this.modifyContact()
        result.then(() => {
          this.$Message.success("操作成功")
          resolve(true)
        }).catch(e => {
          this.$Message.error(e.msg)
          resolve()
        })
      })
    })
  }
}
</script>
<style lang="less">
</style>
