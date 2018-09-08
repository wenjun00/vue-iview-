<!-- 放款详情 -->
<template>
  <section class="component loan-info">
    <data-grid :labelWidth="120" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名" :span="6">
        <i-button type="text" class="row-command-button" @click="showCustomerInfo({id:orderInfo.customerId})">{{orderInfo.customerName}}</i-button>
      </data-grid-item>
      <data-grid-item label="订单号" :span="6">
        <i-button type="text" class="row-command-button" @click="showOrderInfo({id: orderInfo.id, orderType: orderInfo.orderType})">{{orderInfo.orderNo}}</i-button>
      </data-grid-item>
    </data-grid>
    <i-form :model="model" :rules="rules" ref="form" :label-width="90">
      <i-form-item label="资金渠道" prop="fundsChannelName">
        <i-input v-model="model.fundsChannelName" readonly placeholder="请选择资金渠道">
          <i-button icon="search" slot="append" @click="onChannelSelectClick"></i-button>
        </i-input>
      </i-form-item>
    </i-form>
    <i-card title="放款凭证">
      <a slot="extra" @click="showFileUpload">
        <Icon type="arrow-up-c"></Icon>
        上传凭证
      </a>
      <data-box :columns="columns" :data="dataSet" :height="0"></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { BasicFundsChannelService } from "~/services/manage-service/basic-funds-channel.service";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service';
import { Button, Form } from "iview";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { ImageType } from "~/config/enum.config";
import SelectFundChannel from "~/components/base-data/product-manage/select-fund-channel.tsx.vue";

const CustomerOrderModule = namespace("customerOrderSpace")

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class LoanInfo extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService
  @Dependencies(BasicFundsChannelService) private basicFundsChannelService: BasicFundsChannelService
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;

  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  @Prop() orderInfo

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private fundChannelList: Array<any> = [];
  private model = {
    fundsChannelId: null, // 资金渠道id
    fundsChannelName: '' // 资金渠道名称
  }

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => <i-button type="text" class="row-command-button" onClick={() => this.dataSet.splice(index, 1)}>删除</i-button>
      },
      {
        title: '序号',
        align: 'center',
        type: "index",
        minWidth: this.$common.getColumnWidth(1)
      },
      {
        title: '文件名',
        align: 'center',
        key: 'fileName',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      },
      {
        title: '上传时间',
        align: 'center',
        key: 'createTime',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => h('span', {}, this.$filter.dateFormat(row.createTime, 'YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: '操作人',
        align: 'center',
        key: "creator",
        minWidth: this.$common.getColumnWidth(2)
      }
    ]
  }

  private rules = {
    fundsChannelName: { trigger: "blur", message: "请选择资金渠道", required: true }
  }

  /**
   * 选择资金渠道
   */
  private onChannelSelectClick() {
    this.$dialog.show({
      title: "选择资金渠道",
      footer: true,
      width: 1000,
      onOk: selectFundChannel => {
        return selectFundChannel.submit().then(v => {
          if (!v) {
            this.$Message.warning('请选择一条数据！')
            return !!v
          }
          this.model.fundsChannelId = v.fundsChannelId
          this.model.fundsChannelName = v.fundsChannelName
        })
      },
      render: h => <SelectFundChannel productId={this.orderInfo.schemeId} isEdit={false} ref='select-fund-channel'></SelectFundChannel>
    })
  }

  /**
   * 上传凭证
   */
  private showFileUpload() {
    let dialog = this.$dialog.show({
      title: `上传凭证`,
      okText: "上传",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          let tmpFileList = fileList.map(v => {
            return {
              dataType: v.response.type,
              fileUrl: v.response.url,
              fileName: v.response.name,
              fileType: v.response.name.substring(v.response.name.lastIndexOf('.') + 1),
              createTime: v.response.createTime,
              creator: this.$store.state.userData.realname
            }
          })
          this.dataSet.push(...tmpFileList)
          return true
        }).catch(() => false)
      },
      render: h => h(FileUpload, {
        props: {
          acceptFileType: "image/*"
        }
      })
    });
  }

  /**
   * 确认放款
   */
  submit() {
    let form = this.$refs["form"] as Form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false)
        if (!this.dataSet.length) {
          this.$Message.warning('请上传放款凭证！')
          return resolve(false)
        }
        return resolve({ fileParamList: this.dataSet, fundsChannelId: this.model.fundsChannelId })
      })
    })
  }
}
</script>

<style lang="less">
.component.loan-info {
  .table {
    padding: 10px 0;
  }
  .ivu-form-item {
    margin-top: 24px;
  }
}
</style>