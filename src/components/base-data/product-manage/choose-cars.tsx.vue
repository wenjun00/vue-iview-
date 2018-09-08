<!-- 选择车辆 -->
<template>
  <section class="component choose-cars">
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item label="数据来源：" prop="type">
          <i-select v-model="model.type">
            <i-option label="全部车辆" :value="1"></i-option>
            <i-option label="已选择车辆" :value="0"></i-option>
          </i-select>
        </i-form-item>
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
    <div class="chooes-all">
      全选：
      <i-switch v-model="selectedAll" @on-change="onSelectedAllChange"></i-switch>
    </div>
    <data-box ref="dataBox" :columns="columns" :data="dataSet" :highlightRow="true" :page="pageService" @on-selection-change="onSelectionChange" @on-page-change="refreshData"></data-box>
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
export default class ChooseCars extends Vue {
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(PageService) private pageService: PageService;
  @Prop({
    required: true
  }) productId: number;

  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 车型数据
  private model: any = null;
  // 是否全选
  private selectedAll: boolean = false;
  // 选中的车辆，非全选时候
  private selectedCars: Set<Number> = null;



  created() {
    this.model = {
      brand: "",
      series: "",
      model: "",
      type: 0 // 列表数据类型
    }
    this.columns = [
      {
        align: "center",
        type: "selection",
        width: 60
      },
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

  /**
   * 当选中项变更的时候对缓存数据进行修正
   */
  private onSelectionChange(selection: any[]) {
    this.dataSet.forEach(v => {
      if (selection.findIndex(s => s.modelId === v.modelId) < 0) {
        if (this.selectedAll) this.selectedAll = false
        if (this.selectedCars.has(v.modelId)) this.selectedCars.delete(v.modelId)
      } else {
        this.selectedCars.add(v.modelId);
      }
    })
    if (this.pageService.total === this.selectedCars.size) {
      this.selectedAll = true
      this.selectedCars.clear()
    }
  }

  /**
   * 开关触发 清空所选车辆
   */
  private onSelectedAllChange(flag) {
    this.selectedCars.clear()
    this.refreshData()
  }

  /**
   * 获取所选车型
   */
  private getSelectedCars() {
    this.repaySchemeService.findSchemeModel(this.productId).subscribe(
      data => {
        this.selectedAll = data.isAll === 1 ? true : false;
        this.selectedCars = new Set<Number>(data.modelIds || [])
        this.refreshData()
      },
      err => this.$Message.error(err.msg)
    )
  }

  private refreshData() {
    if (this.model.type === 0 && !this.selectedAll) {
      // 如果数据类型是已选车辆，并且不是全选，就看已经选择的车辆数据
      this.repaySchemeService.querySchemeModel(this.productId, this.model, this.pageService)
        .subscribe(
          data => {
            this.dataSet = data.map(v => {
              v._checked = this.selectedAll || this.selectedCars.has(v.modelId)
              return v
            })
          },
          err => this.$Message.error(err.msg)
        )
    } else {
      // 展示所有车辆
      this.basicCarManageService.queryCarModel(this.model, this.pageService).subscribe(
        data => {
          this.dataSet = data.map(v => {
            v._checked = this.selectedAll || this.selectedCars.has(v.modelId)
            return v
          })
        },
        err => this.$Message.error(err.msg)
      )
    }
  }

  /**
   * 提交选择的车型
   */
  public submit() {
    return new Promise((resolve) => {
      this.repaySchemeService.schemeModel(this.productId, this.selectedAll, Array.from(this.selectedCars)).subscribe(
        data => {
          this.$Message.success("操作成功")
          return resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          return resolve(false)
        }
      )
    })
  }

  /**
   * 获取选中的车辆ID
   */
  get SelectedCarId() {
    let selectedRow = (this.$refs.dataBox as DataBox).currentRow as any
    return (selectedRow || {}).modelId
  }

  mounted() {
    if (this.productId) {
      this.getSelectedCars()
    }
  }

}
</script>

<style lang="less" scoped>
.component.choose-cars {
  .chooes-all {
    margin-top: 20px;
    padding-left: 30px;
  }
}
</style>
