<!-- 订单凭证列表 -->
<template>
  <section class="component voucher-list">
    <div class="proceeds-channel">
      代收渠道：
      <i-radio-group v-model="proceedsChannel">
        <i-radio :label="10476" v-if="isView">平安付</i-radio>
        <i-radio :label="10477" v-if="isView">宝付</i-radio>
        <i-radio :label="10478">线下支付</i-radio>
      </i-radio-group>
    </div>
    <i-card :title="cardTitle" v-show="isOffLine" class="voucher-list">
      <a slot="extra" @click="showFileUpload">
        <Icon type="arrow-up-c"></Icon>
        上传凭证
      </a>
      <data-box :columns="voucherColumns" :data="voucherData" :height="0" ref="databox"></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { ImageType } from "~/config/enum.config";
import { Button } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";

@Component({
  components: {
  }
})
export default class VoucherList extends Vue {
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService

  @Prop() orderId
  @Prop() cardTitle
  @Prop({
    type: Boolean,
    default: true
  }) isView

  private voucherColumns: Array<any> = [];
  private voucherData: Array<any> = [];
  private proceedsChannel: Number = this.isView ? 10476 : 10478; // 代收渠道默认选中平安付，收款和退款时默认选中线下支付
  private isOffLine: Boolean = false; // 是否为线下支付

  @Watch('proceedsChannel', { immediate: true })
  onProceedsChannelChange() {
    this.isOffLine = this.proceedsChannel === 10478 ? true : false
  }

  created() {
    this.voucherColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        render: (h, { row, column, index }) => <i-button type="text" class="row-command-button" onClick={() => this.voucherData.splice(index, 1)}>删除</i-button>
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

  /**
   * 上传收款凭证
   */
  private showFileUpload() {
    let dialog = this.$dialog.show({
      title: `上传${this.cardTitle}`,
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
          this.voucherData.push(...tmpFileList)
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
   * 返回已上传凭证列表
   */
  submit() {
    return new Promise(resolve => {
      if (!this.voucherData.length && this.isOffLine) {
        this.$Message.warning('线下支付需上传支付凭证！')
        return resolve(false)
      }
      return resolve({
        fileList: this.voucherData,
        type: this.proceedsChannel
      })
    })
  }

}
</script>

<style lang="less" scoped>
.component.voucher-list {
  .proceeds-channel {
    padding: 10px 5px;
  }
  .voucher-list {
    margin-bottom: 10px;
  }
}
</style>