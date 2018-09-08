<!--维护职业信息-->
<template>
  <section class="component modify-customer-info-job">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="120">
      <i-form-item label="工作单位" prop="companyName">
        <i-input v-model="model.companyName" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="部门" prop="department">
        <i-input v-model="model.department" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="职位" prop="duty">
        <i-input v-model="model.duty" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="单位电话" prop="companyPhone">
        <i-input v-model="model.companyPhone" :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="起始工作日期" prop="accessCompanyTime">
        <i-date-picker v-model="model.accessCompanyTime" type="date" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="单位性质" prop="companyNature">
        <i-select v-model="model.companyNature" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10053)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="从业年限(年)" prop="businessYears">
        <i-input-number v-model="model.businessYears" :min="0" :max="99"></i-input-number>
      </i-form-item>
      <i-form-item label="本单位从业年限(年)" prop="companyYears">
        <i-input-number v-model="model.companyYears" :min="0" :max="99"></i-input-number>
      </i-form-item>
      <i-form-item label="社保情况" prop="socialSecuritySituation">
        <i-select v-model="model.socialSecuritySituation" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10054)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="社保编号" prop="socialSecurityAccount">
        <i-input v-model="model.socialSecurityAccount" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="社保账号密码" prop="socialSecurityPassword">
        <i-input v-model="model.socialSecurityPassword" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="年收入" prop="yearlySalaries">
        <i-input-number v-model="model.yearlySalaries" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="公积金情况" prop="providentFundSituation">
        <i-select v-model="model.providentFundSituation" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10054)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="公积金账号" prop="accumulationFundAccount">
        <i-input v-model="model.accumulationFundAccount" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="公积金账号密码" prop="accumulationFundPassword">
        <i-input v-model="model.accumulationFundPassword" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="单位地址" prop="area">
        <i-select placeholder="选择省" v-model="model.province" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择市" v-model="model.city" :disabled="!model.province" clearable>
          <i-option v-for="{value,label} in this.model.province ? this.$city.getCityData({ level: 1, id: this.model.province }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择区/县" v-model="model.area" :disabled="!model.city" clearable>
          <i-option v-for="{value,label} in this.model.city ? this.$city.getCityData({ level: 2, id: this.model.city }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-input v-model="model.companyAddressDetail" placeholder="详细地址" :maxlength="50"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerJobService } from "~/services/manage-service/basic-customer-job.service";

@Component({})
export default class ModifyCustomerInfoJob extends Vue {
  @Dependencies(BasicCustomerJobService) private basicCustomerJobService: BasicCustomerJobService;
  // 客户ID
  @Prop() customerId: Number;
  // 维护数据
  @Prop() data;

  private model: any = null;
  private rules: any = null;


  created() {
    this.model = {
      companyName: '', // 工作单位
      department: '', // 部门
      duty: '', // 职务
      companyPhone: '', // 单位电话
      province: null, // 单位所在省
      city: null, // 单位所在市
      area: null, // 单位所在区
      companyAddressDetail: '', // 单位详细地址
      accessCompanyTime: '', // 起始工作日期
      companyNature: null, // 单位性质
      businessYears: null, // 从业年限
      companyYears: null, // 本单位从业年限
      socialSecuritySituation: null, // 社保情况
      socialSecurityAccount: '', // 社保编号
      socialSecurityPassword: '', // 社保账号密码
      yearlySalaries: null, // 年收入
      providentFundSituation: null, // 公积金情况
      accumulationFundAccount: '', // 公积金账号
      accumulationFundPassword: '', // 公积金账号密码
    }

    this.rules = {
      companyName: { required: true, message: "请填写工作单位", trigger: "blur" },
      companyPhone: { required: true, message: "请填写单位电话", trigger: "blur" },
      area: { required: true, message: "请选择单位地址", trigger: "blur", type: "number" }
    }
  }

  mounted() {
    if (this.data) {
      this.data.accessCompanyTime = this.data.accessCompanyTime ? new Date(this.data.accessCompanyTime) : ''
      this.model = this.data
    }
    if (this.customerId) this.model.customerId = this.customerId
  }

  /**
   * 新增职业信息
   */
  private addJob() {
    this.model.customerId = this.customerId
    return new Promise((resolve, reject) => {
      this.basicCustomerJobService.addPersonalJob(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  /**
   * 修改职业信息
   */
  private modifyJob() {
    return new Promise((resolve, reject) => {
      this.basicCustomerJobService.updatePersonalJob(this.model).subscribe(
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
        let result = this.customerId ? this.addJob() : this.modifyJob()
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
