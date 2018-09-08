<!--还款记录-->
<template>
  <section class="component order-info-base-finance-receipt">
    <repay-record :orderId="id"></repay-record>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import RepayRecord from "~/components/finance-manage/repay-record.tsx.vue";

@Component({
  components: {
    RepayRecord
  }
})
export default class OrderInfoBaseFinanceRepay extends Vue {

  @Prop() id: Number;

}
</script>
<style lang="less" scoped>
</style>
