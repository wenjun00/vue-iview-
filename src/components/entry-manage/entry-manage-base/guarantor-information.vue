<!-- 担保人信息 -->
<template>
  <section class="component guarantor-information">
    <data-grid v-if="isView" :labelWidth="110" labelAlign="right" contentAlign="left">
      <data-grid-item label="担保人姓名" :span="4">{{viewCustomerInfo.name}}</data-grid-item>
      <data-grid-item label="担保人性别" :span="4">{{viewCustomerInfo.sex | dictConvert}}</data-grid-item>
      <data-grid-item label="身份证号" :span="4">{{viewCustomerInfo.idCard}}</data-grid-item>
      <data-grid-item label="出生日期" :span="4">{{viewCustomerInfo.birthDate | dateFormat}}</data-grid-item>
      <data-grid-item label="年龄" :span="4">{{age}}岁</data-grid-item>
      <data-grid-item label="学历" :span="4">{{viewCustomerInfo.education | dictConvert}}</data-grid-item>
      <data-grid-item label="婚姻状况" :span="4">{{viewCustomerInfo.marital | dictConvert}}</data-grid-item>
      <data-grid-item label="供养人数" :span="4">{{viewCustomerInfo.provideNum}}</data-grid-item>
      <data-grid-item label="手机号" :span="4">{{viewCustomerInfo.phone }}</data-grid-item>
      <data-grid-item label="手机号2" :span="4">{{viewCustomerInfo.phone2 }}</data-grid-item>
      <data-grid-item label="QQ" :span="4">{{viewCustomerInfo.qq}}</data-grid-item>
      <data-grid-item label="微信号" :span="4">{{viewCustomerInfo.wechat}}</data-grid-item>
      <data-grid-item label="住址房产性质" :span="4">{{viewCustomerInfo.homeType | dictConvert}}</data-grid-item>
      <data-grid-item label="" :span="4"></data-grid-item>
      <data-grid-item label="" :span="4"></data-grid-item>
      <data-grid-item label="现住地址" :span="12">
        {{this.$city.getCityName(viewCustomerInfo.homeProvince)}} {{this.$city.getCityName(viewCustomerInfo.homeCity)}} {{this.$city.getCityName(viewCustomerInfo.homeArea)}} {{viewCustomerInfo.localHomeAddr}}
      </data-grid-item>
      <data-grid-item label="户口所在地" :span="12">
        {{this.$city.getCityName(viewCustomerInfo.idCardProvince)}} {{this.$city.getCityName(viewCustomerInfo.idCardCity)}} {{this.$city.getCityName(viewCustomerInfo.idCardArea)}} {{viewCustomerInfo.idCardAddress}}</data-grid-item>
    </data-grid>
    <modify-customer-info-basedata v-else :customerId="true" :customerInfo="customerInfo" :isGuarantor="true" :isView="true" ref="customer"></modify-customer-info-basedata>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { differenceInYears } from "date-fns";
import { Form } from "iview";
import ModifyCustomerInfoBasedata from "~/components/customer-center/customer-info-base/modify-customer-info-basedata.vue";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { SubmitType } from "~/config/enum.config";

@Component({
  components: {
    ModifyCustomerInfoBasedata,
    DataGrid, DataGridItem
  }
})
export default class GuarantorInformation extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Prop({
    required: true
  }) orderId: number;
  @Prop() isView: boolean;
  private customerInfo: any = null;

  mounted() {
    if (this.orderId) this.revertData()
  }

  private revertData() {
    this.basicCustomerOrderService.findOrderGuarantor(this.orderId).subscribe(
      data => {
        let newData = Object.assign({
          name: data.guarantorName,
          phone: data.guarantorPhone,
          phone2: data.guarantorPhone2,
          sex: data.guarantorSex,
        }, data)
        delete newData.guarantorName
        delete newData.guarantorPhone
        delete newData.guarantorPhone2
        delete newData.guarantorSex
        newData.birthDate = data.birthDate === null ? '' : new Date(data.birthDate)
        this.customerInfo = newData
      },
      err => this.$Message.error(err.msg)
    )
  }

  get age(): number {
    let result: number = null
    if (this.customerInfo) {
      let data: number = this.customerInfo.birthDate ? this.customerInfo.birthDate : 0
      if (data !== 0) result = differenceInYears(Date.now(), this.customerInfo.birthDate)
    }
    return result
  }

  /**
   * 查看客户信息
   */
  get viewCustomerInfo() {
    return this.customerInfo || {}
  }

  /**
   * 验证表单信息
   * 成功返回form数据
   */
  submit(type: SubmitType) {
    let customer = this.$refs.customer as ModifyCustomerInfoBasedata;
    return new Promise((resolve, reject) => {
      customer.submit(type).then((data: any) => {
        if (data) {
          data = Object.assign({
            guarantorName: data.name,
            guarantorPhone: data.phone,
            guarantorPhone2: data.phone2,
            guarantorSex: data.sex
          }, data)
          delete data.name
          delete data.phone
          delete data.phone2
          delete data.sex
          resolve(data)
        } else {
          this.$Message.error("担保人信息验证失败")
          reject()
        }
      })
        .catch(() => this.$Message.error("担保人信息验证失败"))
    });
  }

}
</script>

<style lang="less" scoped>
</style>