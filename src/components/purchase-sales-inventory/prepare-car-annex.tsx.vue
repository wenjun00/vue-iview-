<!-- 采购车辆附件 -->
<template>
  <section class="component prepare-car-annex">
    <i-card title="采购车辆附件">
      <i-dropdown slot="extra" trigger="click" @on-click="onCarAnnex" v-if="isView">
        <a href="javascript:void(0)">
          采购车辆附件
          <i-icon type="arrow-down-b"></i-icon>
        </a>
        <i-dropdown-menu slot="list">
          <i-dropdown-item v-for="{label, value} of $dict.getDictData(10100)" :key="value" :name="value">{{label}}</i-dropdown-item>
        </i-dropdown-menu>
      </i-dropdown>
      <data-box :columns="columnsCarAnnex" :data="carAnnexData" ref="databox" :height="400"></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import FileUpload from "~/components/common/file-upload.tsx.vue";
import { Button } from "iview";
import { ImageType } from "~/config/enum.config";
import { Prop } from "vue-property-decorator";

@Component({ components: {} })
export default class PrepareCarAnnex extends Vue {

  @Prop() data
  @Prop() isView
  private carAnnexData: Array<any> = [];
  private columnsCarAnnex: any = {};
  private carImageType: Number; // 上传的资料类型

  mounted() {
    if (this.data) {
      this.carAnnexData = this.data
    }
  }

  created() {
    this.columnsCarAnnex = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.$common.downloadFile(row.fileUrl, row.fileName)}>下载</i-button>]
          if (this.isView) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.carAnnexData.splice(index, 1)}>删除</i-button>)
          }
          return h('div', buttons)
        }
      },
      {
        align: "center",
        editable: true,
        title: "材料类型",
        key: "carImageType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("span", {}, this.$filter.dictConvert(row.carImageType))
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

  /**
   * 选择资料类型后
   */
  onCarAnnex(val) {
    let dialog = this.$dialog.show({
      title: `上传${this.$filter.dictConvert(val)}`,
      okText: "上传附件",
      width: 700,
      footer: true,
      onOk: (fileUpload: FileUpload) => {
        return fileUpload.upload().then((fileList: any[]) => {
          fileList.forEach(v => {
            this.carAnnexData.push({
              dataType: v.response.type,
              fileName: v.response.name,
              fileUrl: v.response.url,
              carImageType: val
            })
          })
          return true
        }).catch(() => false)
      },
      render: h => <FileUpload></FileUpload>
    });
  }

  /**
   * 提交列表
   */
  submit() {
    return new Promise(resolve => {
      // if(this.carAnnexData.length){
      return resolve(this.carAnnexData)
      // }
    })
  }
}
</script>

<style lang="less">
</style>