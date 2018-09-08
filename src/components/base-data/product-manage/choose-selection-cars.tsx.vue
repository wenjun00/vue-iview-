<!-- 进件选择车辆 查看已配置的车辆 -->
<template>
  <section class="component choose-selection-cars">
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item label="品牌名称：" prop="brand">
          <i-input placeholder="请输入品牌名称" v-model="model.brand" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="系列名称：" prop="series">
          <i-input placeholder="请输入系列名称" v-model="model.series" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="车型名称：" prop="model">
          <i-input placeholder="请输入车型名称" v-model="model.model" clearable :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box ref="dataBox" :columns="columns" :data="dataSet" :highlightRow="true" :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { CarPropertyType } from "~/config/enum.config";
import CarParams from "~/components/base-data/car-manage/car-params.vue"
import { PageService } from "~/utils/page.service";
import { Button } from "iview";
import DataBox from "~/components/common/data-box.vue";

@Component({
  components: {}
})
export default class ChooseSelectionCars extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(PageService) private pageService: PageService;
  @Prop({
    required: true
  }) productId: number;


  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 车型数据
  private model: any = null;


  created() {
    this.model = {
      brand: "",
      series: "",
      model: ""
    }
    this.columns = [
      {
        align: "center",
        title: "车型名称",
        key: "modelId",
        minWidth: this.$common.getColumnWidth(8),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" title={row.modelName} onClick={() => this.showCarDetail(row.modelId)}>{row.modelName}</i-button>
        }
      },
      {
        align: "center",
        title: "变速箱",
        key: "gearType",
        minWidth: this.$common.getColumnWidth(2),
      },
      {
        align: "center",
        title: "排量",
        key: "liter",
        minWidth: this.$common.getColumnWidth(2),
      },
      {
        align: "center",
        title: "年款",
        key: "modelYear",
        minWidth: this.$common.getColumnWidth(2),
      },
      {
        align: "center",
        title: "参考价格(万元)",
        key: "referencePrice",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.toTenThousands(row.referencePrice)}</div>)
      }
    ]
  }

  // 查看车型信息
  private showCarDetail(modelId) {
    this.$dialog.show({
      title: '车型详情',
      isView: true,
      width: 1000,
      render: h => (<CarParams isView={true} carId={modelId}></CarParams>)
    })
  }

  private refreshData() {

    // 查看模式，只展示选中的机构
    this.repaySchemeService.querySchemeModel(this.productId, this.model, this.pageService)
      .subscribe(
        data => this.dataSet = data,
        err => this.$Message.error(err.msg)
      )

  }

  /**
   * 获取选中的车辆信息
   */
  get SelectedCarId(): any {
    return (this.$refs.dataBox as DataBox).currentRow as any || {}
  }

  mounted() {
    if (this.productId) {
      this.refreshData()
    }
  }

}
</script>

<style lang="less" scoped>
</style>
