<!--附件资料-->
<template>
  <section class="component customer-info-materials">
    <div class="upload-materials">
      <i-dropdown trigger="click" @on-click="optionChange">
        <a href="javascript:void(0)">
          上传附件
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10013)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
    </div>
    <data-box :columns="columns" :data="dataSet" :height="440" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { Button } from "iview";
import { BasicCustomerDataService } from "~/services/manage-service/basic-customer-data.service";
import { SysDictService } from '~/services/manage-service/sys-dict.service';
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { ImageType } from "~/config/enum.config";

@Component({})
export default class CustomerInfoMaterials extends Vue {
  @Dependencies(BasicCustomerDataService) private basicCustomerDataService: BasicCustomerDataService;
  @Dependencies(SysDictService) sysDictService: SysDictService;
  @Prop() id: number

  private dataSet: Array<any> = [];
  private columns: Array<any> = [];
  private customerDictData: Array<any> = [];

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
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
                  click: () => this.$common.downloadFile(row.fileUrl)
                }
              },
              "下载"),
            h("i-button",
              {
                props: {
                  type: "text"
                },
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => this.onDeleteClick(row.id)
                }
              },
              "删除"),
          ])
        }
      },
      {
        align: "center",
        title: "文件名称",
        key: "fileName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.fileUrl, row.fileName)}> {row.fileName}</i-button>)
          } else {
            return <span>{row.fileName}</span>
          }
        }
      },
      {
        align: "center",
        title: "资料类型",
        key: "fileType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.fileType))
      }
    ]
  }

  mounted() {
    this.refreshData()
  }

  /**
   * 刷新数据
   */
  refreshData() {
    this.basicCustomerDataService.getCustomerData(this.id).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 选择资料类型后
   */
  optionChange(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          let uploadFiles = fileList.map(v => {
            return {
              dataType:v.response.type,
              fileUrl: v.response.url,
              fileName: v.name,
              fileType: val 
            }
          })
          // 将上传到mango的文件告诉后端
          return this.uploadCustomerMaterials(uploadFiles).then(v => {
            if (v) this.refreshData()
            return v
          })
        }).catch(() => false)
      },
      render: h => h(FileUpload)
    });
  }

  /**
   * 上传客户资料
   */
  private uploadCustomerMaterials(files: Array<any>) {
    return new Promise((resolve) => {
      this.basicCustomerDataService.addCustomerData(this.id, files).subscribe(
        data => {
          this.$Message.success('操作成功')
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
   * 删除资料
   */
  onDeleteClick(fileId) {
    this.$Modal.confirm({
      title: "提示",
      content: "确定删除此附件吗？",
      transfer: false,
      onOk: () => {
        this.basicCustomerDataService.deleteCustomerData(fileId).subscribe(
          val => {
            this.$Message.success(`删除成功！`)
            this.refreshData()
          },
          err => this.$Message.error(err.msg)
        );
      }
    })
  }

}
</script>
<style lang="less" scoped>
.component.customer-info-materials {
  .upload-materials {
    text-align: right;
    margin: 10px 20px 0px auto;
    .ivu-dropdown-item {
      text-align: left;
    }
  }
}
</style>
