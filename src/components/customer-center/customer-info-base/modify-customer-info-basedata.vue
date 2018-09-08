<!-- 客户信息 -->
<template>
  <section class="component modify-customer-info-basedata">
    <i-form :model="model" :rules="rules" :label-width="110" inline ref="form">
      <i-form-item label="姓名" prop="name">
        <i-input v-model="model.name" placeholder="请输入姓名" clearable :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="性别" prop="sex">
        <i-select v-model="model.sex" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10008)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="身份证号" prop="idCard">
        <i-input v-model.lazy="idCard" placeholder="请输入身份证号" :maxlength="18" clearable></i-input>
      </i-form-item>
      <i-form-item label="出生日期" prop="birthDate">
        <i-date-picker type="date" placeholder="选择出生日期" :options="$common.datePickDisabledDate()" v-model="birthDate"></i-date-picker>
      </i-form-item>
      <i-form-item label="年龄">
        <i-input v-model="age" readonly>
          <span slot="append">岁</span>
        </i-input>
      </i-form-item>
      <i-form-item label="学历" prop="education">
        <i-select v-model="model.education" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10028)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="婚姻状况" prop="marital">
        <i-select v-model="model.marital" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10029)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="子女个数" prop="childsNum" v-if="!isGuarantor">
        <i-input-number v-model="model.childsNum" :min="0" :max="99" placeholder="请输入子女个数" clearable></i-input-number>
      </i-form-item>
      <i-form-item label="供养人数" prop="provideNum">
        <i-input-number v-model="model.provideNum" :min="0" :max="99" placeholder="请输入供养人数" clearable></i-input-number>
      </i-form-item>
      <i-form-item label="手机号" prop="phone">
        <i-input v-model="model.phone" placeholder="请输入手机号" :maxlength="11" clearable></i-input>
      </i-form-item>
      <i-form-item label="手机号2" prop="phone2">
        <i-input v-model="model.phone2" placeholder="请输入手机号2" :maxlength="11" clearable></i-input>
      </i-form-item>
      <i-form-item label="QQ" prop="qq">
        <i-input v-model="model.qq" placeholder="请输入QQ号" clearable :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="微信号" prop="wechat">
        <i-input v-model="model.wechat" placeholder="请输入微信号" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="意向类型" prop="intentionType" v-if="!customerId">
        <i-select v-model="model.intentionType" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10015)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="意向等级" prop="intentionLevel" v-if="!customerId">
        <i-rate v-model="model.intentionLevel"></i-rate>
      </i-form-item>
      <i-form-item label="邮编(现居地)" prop="postalCode" v-if="!isView">
        <i-input v-model="model.postalCode" placeholder="请输入邮编" clearable :maxlength="6"></i-input>
      </i-form-item>
      <i-form-item label="住址房产性质" prop="homeType">
        <i-select v-model="model.homeType" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10072)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="现住地址" prop="homeArea">
        <i-select placeholder="选择省" v-model="model.homeProvince" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择市" v-model="model.homeCity" :disabled="!model.homeProvince" clearable>
          <i-option v-for="{value,label} in this.model.homeProvince ? this.$city.getCityData({ level: 1, id: this.model.homeProvince }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择区/县" v-model="model.homeArea" :disabled="!model.homeCity" clearable>
          <i-option v-for="{value,label} in this.model.homeCity ? this.$city.getCityData({ level: 2, id: this.model.homeCity }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-input v-model="model.localHomeAddr" placeholder="详细地址" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="户口所在地" prop="idCardArea">
        <i-select placeholder="选择省" v-model="model.idCardProvince" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择市" v-model="model.idCardCity" :disabled="!model.idCardProvince" clearable>
          <i-option v-for="{value,label} in this.model.idCardProvince ? this.$city.getCityData({ level: 1, id: this.model.idCardProvince }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择区/县" v-model="model.idCardArea" :disabled="!model.idCardCity" clearable>
          <i-option v-for="{value,label} in this.model.idCardCity ? this.$city.getCityData({ level: 2, id: this.model.idCardCity }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-input v-model="model.idCardAddress" placeholder="详细地址" clearable :maxlength="50"></i-input>
        <i-checkbox v-model="model.addressSync" @on-change="onAddressSyncClick">同现在住址</i-checkbox>
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
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";
import { SubmitType } from "~/config/enum.config";
import { Object } from "core-js";

@Component({
  components: {
  }
})
export default class ModifyCustomerInfoBasedata extends Vue {
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  @Prop() customerInfo: any;
  @Prop({
    type: Boolean,
    default: false
  }) isGuarantor
  @Prop() isView
  @Prop() customerId

  @Watch("customerInfo", { immediate: true })
  onCustomerInfoChange(val) {
    if (val) this.model = val
  }

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      name: "",
      sex: null,
      birthDate: null,
      age: null,
      education: null,
      idCard: "",
      marital: null,
      provideNum: null,
      childsNum: null,
      phone: "",
      phone2: "",
      qq: "",
      wechat: "",
      homeProvince: "",
      homeCity: "",
      homeArea: null,
      localHomeAddr: "",
      homeType: null,
      idCardProvince: "",
      idCardCity: "",
      idCardArea: null,
      idCardAddress: "",
      postalCode: "",
      intentionType: "",
      intentionLevel: 0
    }
    this.rules = {
      name: { required: true, message: "请输入姓名", trigger: "blur" },
      sex: { required: this.isGuarantor, message: "请选择性别", trigger: "blur", type: "number" },
      birthDate: { required: this.isGuarantor, message: "请选择出生日期", trigger: "blur", type:"date" },
      education: { required: this.isGuarantor, message: "请选择学历", trigger: "blur", type: "number" },
      idCard: [
        { required: this.isGuarantor, message: "请输入身份证号", trigger: "blur" },
        { validator: this.$validator.idCard, trigger: 'change' },
      ],
      marital: { required: this.isGuarantor, message: "请选择婚姻状况", trigger: "blur", type: "number" },
      provideNum: { message: "请输入正确的供养人数", trigger: "blur", type: "number" },
      phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: this.$validator.phoneNumber, trigger: "blur" },
      ],
      phone2: { validator: this.$validator.phoneNumber, trigger: "blur" },
      qq: { required: this.isGuarantor, message: "请输入QQ号码", trigger: "blur" },
      wechat: { required: this.isGuarantor, message: "请输入微信号", trigger: "blur" },
      homeArea: { required: this.isGuarantor, message: "请选择现在住址", trigger: "blur", type: "number" },
      localHomeAddr: { required: this.isGuarantor, message: "请输入详细地址", trigger: "blur" },
      homeType: { required: this.isGuarantor, message: "请选择住址房产性质", trigger: "change", type: "number" },
      idCardArea: { required: this.isGuarantor, message: "请选择户口所在地", trigger: "blur", type: "number" },
      idCardAddress: { required: this.isGuarantor, message: "请输入详细地址", trigger: "blur" },
      postalCode: [
        { required: this.isGuarantor, message: "请输入邮政编号", trigger: "blur" },
        { validator: this.$validator.zipCode, trigger: 'blur' }
      ]
    }
  }

  get idCard() {
    return this.model.idCard
  }

  set idCard(val) {
    if (val && val.length === 18) {
      (this.$refs.form as Form).validateField('idCard', (result) => {
        if (result || result === '') {
          let dateStr = [val.substr(6, 4), val.substr(10, 2), val.substr(12, 2)].join('-')
          this.model.birthDate = new Date(dateStr)
        }
      })
    }
    this.model.idCard = val
  }

  get birthDate() {
    return this.model.birthDate ? new Date(this.model.birthDate) : ''
  }

  set birthDate(val) {
    this.model.birthDate = val
  }

  get age(): number {
    let result: number = null
    if (this.model.birthDate) {
      result = differenceInYears(Date.now(), this.model.birthDate)
    }
    this.model.age = result
    return result
  }

  mounted() {
    if (this.customerInfo) {
      this.model.name = this.customerInfo.customerName
      this.model.sex = this.customerInfo.customerSex
      this.model.birthDate = this.customerInfo.birthTime
      this.model.age = this.customerInfo.customerAge
      this.model.education = this.customerInfo.education
      this.model.idCard = this.customerInfo.idCard
      this.model.marital = this.customerInfo.marital
      this.model.provideNum = this.customerInfo.provideNum
      this.model.childsNum = this.customerInfo.childsNum
      this.model.phone = this.customerInfo.customerPhone
      this.model.phone2 = this.customerInfo.customerPhoneMain
      this.model.qq = this.customerInfo.qq
      this.model.wechat = this.customerInfo.wechat
      this.model.homeProvince = this.customerInfo.localHomeProvince
      this.model.homeCity = this.customerInfo.localHomeCity
      this.model.homeArea = this.customerInfo.localHomeArea
      this.model.localHomeAddr = this.customerInfo.localHomeAddr
      this.model.homeType = this.customerInfo.homeType
      this.model.idCardProvince = this.customerInfo.idCardProvince
      this.model.idCardCity = this.customerInfo.idCardCity
      this.model.idCardArea = this.customerInfo.idCardArea
      this.model.idCardAddress = this.customerInfo.idCardAddress
      this.model.postalCode = this.customerInfo.postalCode
    }
  }

  /**
   * 点击同步现居住地址的时候
   */
  private onAddressSyncClick(val) {
    if (val) {
      this.model.idCardProvince = this.model.homeProvince
      this.model.idCardCity = this.model.homeCity
      this.model.idCardArea = this.model.homeArea
      this.model.idCardAddress = this.model.localHomeAddr
    }
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  submit(type = SubmitType.Submit) {
    if (type === SubmitType.Save) {
      return Promise.resolve(this.model)
    }
    let form = this.$refs.form as Form;
    let result = true
    let data = Object.assign({}, this.model)
    delete data.id
    delete data.orderId
    Object.keys(data).forEach((key, value) => {
      if (data[key]) {
        result = false
        return
      }
    })
    if(!this.isView) result = false //若是新增意向客户，必须验证
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(this.model)
      } else {
        form.validate(v => {
          if (v) {
            return resolve(this.model)
          } else {
            return reject()
          }
        })
      }

    });
  }


  // 添加意向客户
  addCustomerData() {
    return new Promise((resolve) => {
      this.submit().then(data => {
        this.basicCustomerService.addBasicCustomer(data).subscribe(
          data => {
            this.$Message.success("操作成功")
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg)
            resolve(false)
          }
        )
      }).catch(() => resolve(false))
    })
  }

}
</script>

<style lang="less" scoped>
</style>