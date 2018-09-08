<!--基础信息-->
<template>
  <section class="component customer-info-basedata">
    <div class="customer-no">
      客户编号：
      <b>{{customerBaseInfo.customerCode}}</b>
    </div>
    <data-grid :labelWidth="110" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="4">{{customerBaseInfo.customerName}}</data-grid-item>
      <data-grid-item label="客户性别" :span="4">{{customerBaseInfo.customerSex | dictConvert}}</data-grid-item>
      <data-grid-item label="身份证号" :span="4">{{customerBaseInfo.idCard}}</data-grid-item>
      <data-grid-item label="出生日期" :span="4">{{customerBaseInfo.birthTime | dateFormat}}</data-grid-item>
      <data-grid-item label="年龄" :span="4">{{customerBaseInfo.customerAge}}岁</data-grid-item>
      <data-grid-item label="学历" :span="4">{{customerBaseInfo.education | dictConvert}}</data-grid-item>
      <data-grid-item label="婚姻状况" :span="4">{{customerBaseInfo.marital | dictConvert}}</data-grid-item>
      <data-grid-item label="子女个数" :span="4">{{customerBaseInfo.childsNum}}</data-grid-item>
      <data-grid-item label="供养人数" :span="4">{{customerBaseInfo.provideNum}}</data-grid-item>
      <data-grid-item label="手机号" :span="4">{{customerBaseInfo.customerPhone }}</data-grid-item>
      <data-grid-item label="手机号2" :span="4">{{customerBaseInfo.customerPhoneMain }}</data-grid-item>
      <data-grid-item label="QQ" :span="4">{{customerBaseInfo.qq}}</data-grid-item>
      <data-grid-item label="微信号" :span="4">{{customerBaseInfo.wechat}}</data-grid-item>
      <data-grid-item label="住址房产性质" :span="4">{{customerBaseInfo.homeType | dictConvert}}</data-grid-item>
      <data-grid-item label="邮编" :span="4">{{customerBaseInfo.postalCode}}</data-grid-item>
      <data-grid-item label="现住地址" :span="12">{{this.$city.getCityName(customerBaseInfo.localHomeProvince)}} {{this.$city.getCityName(customerBaseInfo.localHomeCity)}} {{this.$city.getCityName(customerBaseInfo.localHomeArea)}} {{customerBaseInfo.localHomeAddr}}</data-grid-item>
      <data-grid-item label="户口所在地" :span="12">{{this.$city.getCityName(customerBaseInfo.idCardProvince)}} {{this.$city.getCityName(customerBaseInfo.idCardCity)}} {{this.$city.getCityName(customerBaseInfo.idCardArea)}} {{customerBaseInfo.idCardAddress}}</data-grid-item>
    </data-grid>
    <div class="udpate-basedata" v-if="edit">
      <a @click="onModifyClick">
        <svg-icon iconClass="tianxie"></svg-icon>
        修改资料
      </a>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import ModifyCustomerInfoBasedata from "./modify-customer-info-basedata.vue";
import { namespace } from "vuex-class";

const CustomOrderModule = namespace("customerOrderSpace")

@Component({
  components: { DataGrid, DataGridItem }
})
export default class CustomerInfoBasedata extends Vue {
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  @Prop() id: Number

  /** 是否可编辑 */
  @Prop({ default: false }) edit: Boolean
  @Prop({ default: () => { } }) callBack: () => void
  // 是否强验证
  @CustomOrderModule.State isApply: boolean;
  private customerBaseInfo: any = {}

  @Watch("id", { immediate: true })
  onIdChange() {
    if (this.id) this.refreshData()
  }

  private refreshData() {
    this.basicCustomerService.findCustomerById(this.id).subscribe(
      data => this.customerBaseInfo = data,
      err => this.$Message.error(err.msg)
    )
  }

  private onModifyClick() {
    this.$dialog.show({
      title: "修改客户资料",
      footer: true,
      width: 1050,
      onOk: modifyCustomerInfoBasedata => {
        return modifyCustomerInfoBasedata.submit().then(v => {
          return this.editCustomerInfo(v).then(r => r)
        }).catch(() => false)
      },
      render: h => h(ModifyCustomerInfoBasedata, {
        props: {
          customerInfo: Object.assign({}, this.customerBaseInfo),
          customerId: this.id,
          isGuarantor: this.isApply
        }
      })
    })
  }

  /**
   * 修改客户基本信息
   */
  private editCustomerInfo(data) {
    return new Promise((resolve) => {
      this.basicCustomerService.editBasicCustomer(data, this.id).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
          this.refreshData()
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }

}
</script>
<style lang="less" scoped>
.component.customer-info-basedata {
  .udpate-basedata {
    text-align: right;
    margin: 10px 30px 0px auto;
  }
  .customer-no {
    margin: 0 auto 5px 40px;
  }
}
</style>
