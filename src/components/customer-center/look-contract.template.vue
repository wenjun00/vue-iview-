<!--查看模块功能-->
<template>
  <section class="component look-contract-template">
      <div class="dataStyle" v-if="!htmlData">数据生成中</div>
      <div v-html="htmlData"></div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { ContractBusinessService } from "~/services/manage-service/contract-Business.service";


@Component({
  components: {

  }
})
export default class LookContractTemplate extends Vue {
  @Dependencies(ContractBusinessService) private contractBusinessService: ContractBusinessService;
  @Prop() contractId;

  private htmlData: any =''

  getLookContract() {
    this.contractBusinessService.getContractViewByContractId(this.contractId).subscribe(
      data => {
        this.htmlData = data.result
      },
      err => this.$Message.error(err.msg)
    );
  }

  mounted() {
    this.getLookContract()
  }





}
</script>
<style lang="less" scoped>
  .component.look-contract-template{
    .dataStyle{
      text-align: center;
      font-size: 16px;
    }
  }

</style>
