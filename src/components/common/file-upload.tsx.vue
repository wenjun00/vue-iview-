<!--财务·上传图片-->
<template>
  <section class="component file-upload">
    <i-upload :on-progress="onProgress" :on-success="onSuccess" :on-exceeded-size="onExceededSize" :on-error="onError" :max-size="500*1024" :show-upload-list="false" :accept="acceptFileType" :headers="{'authorization':userToken}" ref="upload" :action="uploadUrl" :before-upload="beforeUpload">
      <div class="command">
        <i-button type="primary" icon="ios-cloud-upload-outline">选择文件</i-button>
      </div>
    </i-upload>
    <i-table :columns="uploadColumns" :data="uploadList"></i-table>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { NetService } from "~/utils/net.service";
import { fileService } from "~/config/server";
import { Prop, Emit } from "vue-property-decorator";
import { Upload, Button } from "iview";
import { State } from "vuex-class";
import appConfig from "~/config/app.config";
import { LoadingService } from "~/utils/loading.service";

@Component({
  components: {}
})
export default class FileUpload extends Vue {
  @State userToken;
  // 文件数量限制
  @Prop({
    default: 5,
    type: [Boolean, Number]
  })
  fileNumberLimit;

  // 文件大小限制
  @Prop({
    default: 200,
    type: Number
  })
  fileSizeLimit;

  @Prop({
    type: String
  })
  acceptFileType;

  @Emit("on-success")
  private success(filelist) {
    if (this.uploadReslove) {
      this.uploadReslove(this.fileList)
    }
    if (this.loadingModel) this.loadingModel.remove()
  }

  @Emit('on-error')
  private emitOnError() {
    if (this.uploadReslove) {
      this.uploadReslove(this.fileList)
    }
    if (this.loadingModel) this.loadingModel.remove()
  }



  private uploadReslove
  private loadingModel = null;
  private uploadList: Array<any> = [];
  private fileList: Array<any> = []; // 文件上传成功文件列表
  private uploadColumns = [
    {
      title: "操作",
      align: "center",
      fixed: "left",
      render: (h, { row, column, index }) => {
        // 移除文件
        let removeHandle = () => {
          this.$Modal.confirm({
            title: "提示",
            content: "确定移除吗？",
            transfer: false,
            onOk: () => {
              this.uploadList.splice(index, 1);
            }
          });
        };
        // 移除按钮
        return (
          <i-button
            type="text"
            disabled={row.state !== "ready"}
            class="row-command-button"
            onClick={removeHandle}
          >
            移除
          </i-button>
        );
      }
    },
    {
      title: "名称",
      key: "name",
      align: "center"
    },
    {
      title: "大小",
      key: "size",
      align: "center"
    },
    {
      title: "文件类型",
      key: "type",
      align: "center"
    }
  ];

  /**
   * 上传文件服务路径
   */
  private get uploadUrl() {
    let url = NetService.generateRequestUrl(
      fileService.fileUploadController.uploadFileGrid
    );
    return `${appConfig.url.server}/${url}`;
  }

  /**
   * 上传预处理
   */
  private beforeUpload(file) {
    if (this.fileSizeLimit * 1024 * 1024 < file.size) {
      this.$Message.info(
        `文件${name}超过上传文件大小限制${this.fileSizeLimit}MB`
      );
      return false;
    }

    if (this.fileNumberLimit <= this.uploadList.length) {
      this.$Message.info(`文件上传文件数量限制${this.fileNumberLimit}个`);
      return false;
    }

    // 添加待上传文件
    this.uploadList.push({
      name: file.name,
      size: file.size,
      type: file.type,
      state: "ready",
      percentage: 0,
      file: file
    });

    return false;
  }

  /**
   * 进度通知
   */
  private onProgress(event, file) {
    let target = this.uploadList.find(x => x.file.uid === file.uid);
    target.state = "uploading";
    target.percentage = file.percentage;
  }

  private onExceededSize(file, fileList) {
    let target = this.uploadList.find(x => x.file.uid === file.uid);
    target.state = "finish";
    if (this.uploadList.every(x => x.state === "finish")) {
      this.fileList = fileList;
      this.success(this.fileList);
    }

    this.$Message.warning(`文件 <b>${file.name}</b>  超过限制，最大不能超过1M，请重新上传`)
  }

  /**
   * 上传成功回调
   */
  private onSuccess(event, file, fileList) {
    let target = this.uploadList.find(x => x.file.uid === file.uid);
    target.state = "finish";

    if (this.uploadList.every(x => x.state === "finish")) {
      this.fileList = fileList;
      this.success(this.fileList);
    }
  }

  /**
   * 返回上传成功时文件列表
   */
  makeList() {
    return this.fileList;
  }

  /**
   * 上传操作
   */
  upload(): Promise<any> {
    if (this.uploadList.length === 0) {
      this.$Message.warning("请选择文件！")
      return Promise.reject(null)
    }
    let upload = this.$refs["upload"] as Upload;
    this.uploadList.filter(x => x.state === "ready").forEach(({ file }) => {
      upload.post(file);
    });
    this.loadingModel = LoadingService.show()
    return new Promise((reslove) => {
      this.uploadReslove = reslove
    })
  }

  reset() {
    let upload = this.$refs["upload"] as Upload;
    this.uploadList = [];
    upload.clearFiles();
  }
  /**
   *
   */
  private onError(event, file, fileList) {
    let fileName = fileList.name
    this.$Message.error(`文件 [${fileName}] 上传失败,已移除`)
    // 查找这个文件并且移除掉
    let fileIndex = this.uploadList.findIndex(x => x.name === fileName && x.state !== 'ready')
    this.uploadList.splice(fileIndex, 1)
    this.emitOnError();
  }
}
</script>

<style lang="less" scoped>
.component.file-upload {
  .command {
    padding-bottom: 10px;
  }
  .ivu-upload {
    text-align: right;
  }
}
</style>
