<!--收款记录-->
<template>
  <section class="component order-info-base-finance-receipt">
    <proceed-record :orderId="id"></proceed-record>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import ProceedRecord from "~/components/finance-manage/proceed-record.tsx.vue";

@Component({
  components: {
    ProceedRecord
  }
})
export default class OrderInfoBaseFinanceReceipt extends Vue {

  @Prop() id: Number;

}
</script>
<style lang="less" scoped>
</style>
