<!-- 申请人基本信息 -->
<template>
  <section class="component apply-customer-base">
    <i-card>
      <a slot="extra" @click="onCreatePotentialClick" style="margin-right: 10px;" v-show="!isView">
        <i-icon type="plus"></i-icon>新增意向客户
      </a>
      <a slot="extra" @click="onSelectedCustomerClick" :disabled="isView">
        <i-icon type="ios-search-strong"></i-icon> 选择客户
      </a>
      <customer-info-basedata :id="customerId"></customer-info-basedata>
    </i-card>
    <i-collapse>
      <i-panel>
        职业信息
        <customer-info-job slot="content" :id="customerId"></customer-info-job>
      </i-panel>
      <i-panel>
        房产信息
        <customer-info-house slot="content" :id="customerId"></customer-info-house>
      </i-panel>
      <i-panel>
        联系人信息
        <customer-info-contacts slot="content" :id="customerId"></customer-info-contacts>
      </i-panel>
    </i-collapse>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Model, Emit, Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import CustomerInfoBasedata from "~/components/customer-center/customer-info-base/customer-info-basedata.vue";
import CustomerInfoJob from "~/components/customer-center/customer-info-base/customer-info-job.vue";
import CustomerInfoHouse from "~/components/customer-center/customer-info-base/customer-info-house.vue";
import CustomerInfoContacts from "~/components/customer-center/customer-info-base/customer-info-contacts.tsx.vue";
import ChooseCustomer from "~/components/operate-center/choose-customer.vue";
import ModifyCustomerInfoBasedata from "~/components/customer-center/customer-info-base/modify-customer-info-basedata.vue";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";

@Component({
  components: {
    CustomerInfoBasedata,
    CustomerInfoJob,
    CustomerInfoHouse,
    CustomerInfoContacts
  }
})
export default class ApplyCustomerBase extends Vue {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Model("customer-change") customerId: number;
  @Emit("customer-change")
  emitCustomerChange(customerId) { }

  @Prop() isView: boolean;

  /**
     * 新增意向客户
     */
  private onCreatePotentialClick() {
    this.$dialog.show({
      title: "新增意向客户",
      footer: true,
      width: 1000,
      onOk: addCustomerInfoBasedata => {
        // 表单校验
        return addCustomerInfoBasedata.addCustomerData().then(v => v);
      },
      render: h =>
        h(ModifyCustomerInfoBasedata, {
          props: {
            customerInfo: "",
            isGuarantor: true // 进件的时候新增的意向客户必须全部填写
          }
        })
    });
  }

  /**
   * 选择客户
   */
  private onSelectedCustomerClick() {
    this.$dialog.show({
      title: "选择客户",
      footer: true,
      width: 1000,
      onOk: (chooseCustomer: ChooseCustomer) => {
        let data = chooseCustomer.selectedData
        if (!data) return
        return this.checkCustomerInfo(data.customerId).then(v => {
          if (v) {
            this.emitCustomerChange(data.customerId)
          }
          return v
        })
      },
      render: h => h(ChooseCustomer, { props: { isView: true } })
    })
  }

  /**
   * 检查客户信息是否完善
   */
  private checkCustomerInfo(customerId: number) {
    return new Promise((resolve) => {
      this.basicCustomerOrderService.checkCustomerInfo(customerId).subscribe(
        data => resolve(true),
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }
}
</script>

<style lang="less">
.component.apply-customer-base {
  .ivu-card {
    .ivu-card-body {
      padding: 16px 5px;
    }
  }
  .ivu-collapse-content {
    padding: 0 5px;
  }
}
</style>