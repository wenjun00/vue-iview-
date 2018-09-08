<!--查看模块功能-->
<template>
  <section class="component contract-template">
    <i-button v-if="createButton" class="blueButton minWidth" @click="generateContract">生成合同</i-button>
    <data-box :columns="compactList" :data="compactListDataSet" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Dependencies } from '~/core/decorator';
import { ContractBusinessService } from "~/services/manage-service/contract-Business.service";
import { Prop, Watch } from "vue-property-decorator";
import LookContractTemplate from "~/components/customer-center/look-contract.template.vue";
import { CommonService } from '~/utils/common.service'

@Component({ 
  components: {
  }
})
export default class ContractTemplate extends Vue {
  @Dependencies(ContractBusinessService) private contractBusinessService: ContractBusinessService;
  @Prop() orderId;
  private htmlData = ""
  private createButton: boolean = true
  private compactListDataSet: Array<Object> = [];
  private compactList: any = [
    {
      title: "序号",
      width: this.$common.getOperateWidth(1),
      align: "center",
      fixed: "left",
      type: "index",
    },
    {
      align: "center",
      title: "合同名称",
      key: "contractName",
      minWidth: this.$common.getColumnWidth(4),
    },
    {
      align: "center",
      title: "操作",
      key: "schemeName",
      minWidth: this.$common.getColumnWidth(4),
      render: (h, { row, column, index }) => {
        return h("div", [
          h("i-button",
            {
              props: {
                type: "text"
              },
              style: {
                color: "#265EA2"
              },
              on: {
                click: () => {
                  this.lookContract(row);
                }
              }
            },
            "查看"
          ),
          h("i-button",
            {
              props: {
                type: "text"
              },
              style: {
                color: "#265EA2"
              },
              on: {
                click: () => {
                  this.downloadContract(row);
                }
              }
            },
            "下载"
          )
        ])
      }
    },
  ];

  /**
   * 获取合同列表数据
   */
  getCompactData() {
    this.contractBusinessService.getContractListByOrderId(this.orderId).subscribe(
      data => {
        this.compactListDataSet = data
        this.createButton = JSON.stringify(this.compactListDataSet) === '[]'
      },
      err => this.$Message.error(err.msg)
    );
  }
  /**
   * 生成合同
   */
  generateContract() {
    this.contractBusinessService.createAllContracts(this.orderId).subscribe(
      data => {
        this.$Message.success(data.msg)
        this.getCompactData()
      },
      err => this.$Message.error(err.msg)
    );
  }
  /**
   * 查看合同
   */
  lookContract(val) {
    this.$dialog.show({
      title: "查看合同",
      footer: true,
      okText: '关闭',
      isView: true,
      width: 700,
      render: h => <LookContractTemplate contractId={val.contractId} ></LookContractTemplate>
    });
  }
  /**
   * 下载合同列表
   */
  downloadContract(val) {
    this.contractBusinessService.downLoadConract(val.contractId).subscribe(
      data => {
         CommonService.downloadFile(data.result,'合同模板')
      },
      err => this.$Message.error(err.msg)
    );
  }

  mounted() {
    this.getCompactData()
  }
}
</script>
<style lang="less" scoped>
.component.contract-template {
  .blueButton {
    margin-left: 50px;
  }
}
</style>
