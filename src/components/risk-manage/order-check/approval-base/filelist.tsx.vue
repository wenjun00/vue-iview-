<!-- 审核资料 -->
<template>
  <section class="component filelist">
    <div class="text-right upload-list" v-if="!isView">
      <i-dropdown trigger="hover" @on-click="onOptionChange">
        <i-button class="blueButton">
          新增材料
          <i-icon type="arrow-down-b"></i-icon>
        </i-button>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label,value} of $dict.getDictData(10081)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
    </div>
    <data-box :columns="columns" :data="dataSet" ref="databox" :height="400"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerOrderApprove } from "~/services/manage-service/basic-customer-order-approve.service.ts";
import { Button } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {
  }
})
export default class Filelist extends Vue {
  @Dependencies(BasicCustomerOrderApprove) private basicCustomerOrderApprove: BasicCustomerOrderApprove;
  @Prop({ required: true }) orderId: number;
  @Prop({ required: true }) processName: string

  @Prop() isView: boolean;

  private columns: any[] = null;
  private dataSet: any[] = [];

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>]
          if (!this.isView) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.deleteFileClick(row.id)}>删除</i-button>)
          }
          return h('div', buttons)
        }
      },
      {
        align: "center",
        editable: true,
        title: "材料类型",
        key: "approveFileType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => <span>{this.$filter.dictConvert(row.approveFileType)}</span>
      },
      {
        align: "center",
        editable: true,
        title: "文件名",
        key: "fileName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      }
    ];
  }

  mounted() {
    if (this.orderId) {
      this.refreshData()
    }
  }

  /**
   * 选择资料类型后
   */
  private onOptionChange(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          let list = fileList.map(v => v.response)
          return this.upload(list, val).then(v => {
            if (v) this.refreshData()
            return v
          })
        }).catch(() => false)
      },
      render: h => <FileUpload fileSizeLimit={500}></FileUpload>
    });
  }

  /**
   * 删除审核附件
   */
  private deleteFileClick(fileId: number) {
    this.basicCustomerOrderApprove.deleteApproveFile(fileId).subscribe(
      data => {
        this.$Message.success("操作成功")
        this.refreshData()
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 提交上传的文件
   */
  private upload(fileList: any[], fileType: number) {
    fileList = fileList.map(v => {
      return {
        dataType: v.type,
        fileName: v.name,
        fileUrl: v.url,
        approveFileType: fileType
      }
    })

    return new Promise((resolve) => {
      this.basicCustomerOrderApprove.uploadApproveFile(this.orderId, this.processName, fileList).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }

  /**
   * 刷新附件列表
   */
  private refreshData() {
    this.basicCustomerOrderApprove.queryApprovalFile(this.orderId, this.processName).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 文件列表
   */
  get fileList() {
    return this.dataSet
  }

}
</script>

<style lang="less">
.component.filelist {
  .upload-list {
    margin-top: 10px;
  }
}
</style>