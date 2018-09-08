<!--开户签约详情-->
<template>
  <section class="component account-sign-detail">
    <div class="operate-buttons">
      <div>
        <i-button class="blueButton minWidth" @click="onUploadFileClick">查看进件资料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileFirstClick">查看初审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileSecondClick">查看复审材料</i-button>
        <i-button class="blueButton minWidth" @click="onUploadFileLastClick">查看终审资料</i-button>
        <i-button v-if="accountStatus === $enum.AccountState.Open" class="blueButton minWidth" @click="onUploadContractTemplate">查看合同模板</i-button>
      </div>
      <div>
        <span v-if="accountStatus === $enum.AccountState.Open">
          <i-button class="blueButton minWidth" @click="viewOpenAccountDetail">详情</i-button>
          <i-button class="blueButton minWidth" @click="uploadContractOperate" v-if="!fileStatus">上传合同</i-button>
          <i-button class="blueButton minWidth" @click="showUploadContract" v-else>合同详情</i-button>
        </span>
        <span v-else>
          <i-button class="blueButton minWidth" @click="onOpenAccount">立即开户</i-button>
        </span>
        <i-button class="blueButton minWidth" @click="submit" v-if="!isView">提交</i-button>
      </div>
    </div>
    <order-all-info-box-new v-if="rowData.orderCarType === this.$enum.OrderCarType.NEW" :businessType="rowData.businessType" :orderId="orderId" :rowData="rowData" :isView="true" ref="order-all-info-box"></order-all-info-box-new>
    <order-all-info-box-old v-else :businessType="rowData.businessType" :orderId="orderId" :rowData="rowData" :isView="true" ref="order-all-info-box"></order-all-info-box-old>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { Action, State, namespace } from "vuex-class";
import { BasicOrderFileService } from "~/services/manage-service/basic-order-file.service";
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { OrderCarType, BusinessType, AccountState } from "~/config/enum.config";
import CustomerBankList from "~/components/customer-center/customer-bank-list.tsx.vue";
import ContractTemplate from "~/components/customer-center/contract.template.tsx.vue";
import ContractUpload from "~/components/customer-center/contract-upload.tsx.vue";
import OrderAllInfoBoxNew from "~/components/car-matching/order-all-info-box-new.vue";
import OrderAllInfoBoxOld from "~/components/car-matching/order-all-info-box-old.vue";
import ApplyFilelist from "~/components/entry-manage/entry-manage-base/apply-filelist.tsx.vue";
import FileList from "~/components/risk-manage/order-check/approval-base/filelist.tsx.vue";
import { orderOpeater } from "~/config/work-flow.config";
import SelectSignChannel from "~/components/account-sign/select-sign-channel.vue";

@Component({
  components: {
    OrderAllInfoBoxNew,
    OrderAllInfoBoxOld
  }
})
export default class AccountSignDetail extends Vue {
  @Dependencies(BasicOrderFileService) private basicOrderFileService: BasicOrderFileService;
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @Prop() orderId
  @Prop() customerId
  @Prop() rowData
  @Prop({
    default: false
  }) isView: boolean;

  private accountStatus: any = null // 开户状态
  private fileStatus: Boolean = false // 订单附件状况
  private model: any = null
  private orderInfo: any = null

  created() {
    this.model = {
      customerId: null,
      modelId: null,
      fileList: null
    }
  }

  mounted() {
    // 获取订单详情
    this.basicCustomerOrderService.findCustomerOrderInfo(this.orderId).subscribe(
      data => {
        this.orderInfo = data
        this.model.customerId = data.customerId
      },
      err => this.$Message.error(err.msg)
    )
    // 获取文件列表
    this.basicCustomerOrderService.findOrderFiles(this.orderId).subscribe(
      data => this.model.fileList = data,
      err => this.$Message.error(err.msg)
    )
    this.getOrderFile()
  }

  // 查询客户开户情况
  private getCustomerAccountStatus() {
    this.basicCustomerService.findCustomerById(this.customerId).subscribe(
      data => this.accountStatus = data.accountStatus,
      errv => err => this.$Message.error(err.msg)
    )
  }

  // 查询订单附件情况
  private getOrderFile() {
    this.getCustomerAccountStatus()
    this.basicOrderFileService.getContractFile(this.orderId).subscribe(
      data => {
        if (data.length) this.fileStatus = true
      },
      err => this.$Message.error(err.msg)
    )
  }
  // 查看合同模板
  onUploadContractTemplate() {
    this.$dialog.show({
      title: "查看合同模板",
      footer: true,
      okText: '关闭',
      isView: true,
      width: 700,
      render: h => <ContractTemplate orderId={this.orderId}></ContractTemplate>
    });
  }


  /**
   * 开户
   * @param data
   */
  onOpenAccount() {
    let isView = this.accountStatus === AccountState.Open
    this.$dialog.show({
      title: "选择签约渠道",
      footer: true,
      width: 700,
      onOk: selectSignChannel => {
        return selectSignChannel.submit().then(v => {
          if(v) this.$dialog.clear()
          return !!v
        })
      },
      render: h => <SelectSignChannel customerId={this.customerId}></SelectSignChannel>
    })
  }

  /**
   * 查看开户签约详情
   */
  private viewOpenAccountDetail(){
    this.$dialog.show({
      title: "开户详情",
      width: 700,
      onOk: customerBankList => {
        return customerBankList.submit().then(v => {
          if (v) this.getOrderFile();
          return v;
        })
      },
      render: h => <CustomerBankList customerId={this.customerId} orderId={this.orderId} isView={true}></CustomerBankList>
    });
  }

  /**
  * 上传合同
  */
  uploadContractOperate() {
    let dialog = this.$dialog.show({
      title: "上传合同",
      okText: "确认签约",
      footer: true,
      width: 700,
      onOk: contractUpload => {
        return contractUpload
          .submit()
          .then(v => {
            if (v) this.getOrderFile();
            return v;
          })
          .catch(err => {
            this.$Message.error(err.msg);
          });
      },
      render: h => <ContractUpload fileNumberLimit={100} orderId={this.orderId}></ContractUpload>
    });
  }

  /**
  * 查看合同
  */
  showUploadContract() {
    let dialog = this.$dialog.show({
      title: "查看合同",
      isView: true,
      footer: true,
      width: 700,
      render: h => <ContractUpload orderId={this.orderId} isView={true}></ContractUpload>
    });
  }

  /**
   * 保存
   */
  private save() {
    let orderAllInfoBox: any = this.$refs['order-all-info-box']
    orderAllInfoBox.save(0).then(v => {
      if (v) return v
    })
  }
  /**
   * 提交
   */
  private submit() {
    let orderAllInfoBox: any = this.$refs['order-all-info-box']
    orderAllInfoBox.save(1).then(v => {
      if (v) this.$dialog.clear()
    })
  }

  /**
   * 查看进件材料
   */
  private onUploadFileClick() {
    this.$dialog.show({
      title: "查看进件材料",
      footer: true,
      width: 700,
      onOk: (uploadFile: ApplyFilelist) => {
        this.model.fileList = uploadFile.fileList
      },
      render: h => <ApplyFilelist currentFileList={this.model.fileList} isView={true}></ApplyFilelist>
    })
  }
  /**
   * 查看初审材料
   */
  private onUploadFileFirstClick() {
    this.$dialog.show({
      title: "查看初审材料",
      footer: true,
      isView: true,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.first.desc} isView={true}></FileList>
    })
  }
  /**
   * 查看复审材料
   */
  private onUploadFileSecondClick() {
    this.$dialog.show({
      title: "查看复审材料",
      footer: true,
      width: 700,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.second.desc} isView={true}></FileList>
    })
  }
  /**
   * 查看终审材料
   */
  private onUploadFileLastClick() {
    this.$dialog.show({
      title: "查看终审资料",
      footer: true,
      width: 700,
      render: h => <FileList orderId={this.orderId} processName={orderOpeater.last.desc} isView={true}></FileList>
    })
  }
}
</script>

<style lang="less" scoped>
.component.account-sign-detail {
  .operate-buttons {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .minWidth {
    min-width: 90px;
  }
}
</style>
