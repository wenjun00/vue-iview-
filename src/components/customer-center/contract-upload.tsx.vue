<!--财务·上传图片-->
<template>
  <section class="component contract-upload">
    <i-button class="contract-title" type="primary" @click="showFileUpload" v-show="!hiddenUpload && !isView">上传</i-button>
    <i-table :height="300" :columns="uploadedColumns" :data="uploadedDataSet"></i-table>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Model, Emit, Watch } from "vue-property-decorator";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { BasicOrderFileService } from "~/services/manage-service/basic-order-file.service";
import { Button } from "iview";
import { ImageType } from "~/config/enum.config";

@Component({
  components: {}
})
export default class ContractUpload extends Vue {
  @Dependencies(BasicOrderFileService) basicOrderFileService: BasicOrderFileService;

  @Prop({ required: true }) orderId: number;

  @Prop({
    type: Boolean,
    default: false
  })
  isView: boolean;

  /**
   * 文件数量限制
   */
  @Prop() fileNumberLimit: Number;

  private uploadedDataSet: Array<any> = [];
  private uploadedColumns: Array<any> = [];
  private customerDictData: Array<any> = [];

  mounted() {
    if (this.orderId) {
      this.getContractResourceAll(this.orderId);
    }
  }

  created() {
    this.uploadedColumns = [
      {
        title: "名称",
        key: "name",
        width: 150,
        align: "center",
        render: (h, { row }) => {
          if (ImageType[row.dataType]) {
            return (<i-button type="text" class="row-command-button" on-click={() => this.$common.previewImage(row.url, row.name)}> {row.name}</i-button>)
          } else {
            return <span>{row.name}</span>
          }
        }
      },
      {
        title: "文件路径",
        key: "url",
        align: "center"
      },
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [(<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.url, row.name)}>下载</i-button>)]
          if (!this.isView) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.uploadedDataSet.splice(index, 1)}>删除</i-button>)
          }
          return buttons
        }
      }
    ];
  }

  /**
   * 计算是否显示上传按钮
   */
  get hiddenUpload() {
    // 最大写死99个文件
    return this.uploadedDataSet.length >= (this.fileNumberLimit || 99);
  }

  private showFileUpload() {
    let dialog = this.$dialog.show({
      title: `上传合同`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.uploadedDataSet.push({
              dataType: v.response.type,
              name: v.response.name,
              url: v.response.url
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }


  /**
   * 上传文件
   */
  submit() {
    return new Promise((resolve, reject) => {
      if (!this.orderId) return resolve(false);
      // 提取参数数据
      let fileModels = this.uploadedDataSet.map(val => ({
        dataType: val.dataType,
        fileName: val.name,
        fileUrl: val.url,
        isContract: 1
      }));
      if(!fileModels.length){
        this.$Message.info("请上传文件")
        return resolve(false);
      }

      this.basicOrderFileService.addUploadBasicOrderFile(this.orderId, fileModels).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      );
    });
  }

  /**
   * 查看订单合同资料
   * @param 订单ID
   */
  private getContractResourceAll(orderId) {
    this.basicOrderFileService.getContractFile(orderId).subscribe(
      data => {
        if (!data.length) return
        this.uploadedDataSet = data.map(v => ({
          dataType: v.dataType,
          url: v.fileUrl,
          name: v.fileName
        }));
      },
      err => this.$Message.error(err.msg)
    );
  }
}
</script>

<style lang="less" scoped>
.component.contract-upload {
  .contract-title {
    margin-bottom: 10px;
  }
  .command {
    padding-bottom: 10px;
  }
}
</style>
