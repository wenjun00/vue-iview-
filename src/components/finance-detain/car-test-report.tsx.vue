<!--车辆检测报告-->
<template>
  <section class="component car-test-report">
    <i-card title="检测报告" position:absolute>
      <a v-if="!isView" slot="extra" @click="showFileUpload">
        <Icon type="arrow-up-c"></Icon>
        上传
      </a>
      <data-box :height="300" :columns="columns" :data="fileUrlData" highlightRow></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Form, Button } from "iview";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import { BasicAssessmentCarPriceAnalysisService } from "~/services/manage-service/basic-assessment-car-price-analysis.service";

@Component({
  components: {
  }
})
export default class CarTestReport extends Vue {
  @Dependencies(BasicAssessmentCarPriceAnalysisService) private basicAssessmentCarPriceAnalysisService: BasicAssessmentCarPriceAnalysisService;
  @Dependencies(BasicCustomerAssessmentCarService) private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;
  @Prop({
    default: false,
    type: Boolean
  })
  isView: boolean;
  @Prop() stockId

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private fileUrlData: Array<any> = [];

  mounted() {
    if (this.stockId) {
      //刷新评估报告列表
      this.basicCustomerAssessmentCarService.findAssessmentReportFile(this.stockId).subscribe(
        data => this.fileUrlData = data.basicAssessmentFileModels || []
      )
    }
  }
  created() {
    this.columns = [
      {
        title: "检测报告名称",
        key: "fileName",
        width: 150,
        align: "center"
      },
      {
        title: "文件路径",
        key: "fileUrl",
        align: "center"
      },
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          return (<div>
            <i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.fileUrlData.splice(index, 1)}>删除</i-button>
          </div>)
        }
      }
    ];
  }
  /**
 * 上传文件
 */
  showFileUpload(val) {
    let dialog = this.$dialog.show({
      title: `上传检测报告`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.fileUrlData.push({
              fileName: v.response.name,
              fileUrl: v.response.url
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }

  /**
   * 返回数据
   */
  private submit() {
    return this.fileUrlData
  }
}
</script>

<style lang="less">
</style>