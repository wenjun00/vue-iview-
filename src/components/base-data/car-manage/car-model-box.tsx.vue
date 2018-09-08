<!--车型列表-->
<template>
  <section class="component car-model-box">
    <data-form hidden-date-search :model="model" @on-search="refreshData">
      <template slot="input">
        <i-form-item prop="modelName" label="车型名称：">
          <i-input placeholder="请输入车型名称" v-model="model.modelName" clearable :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" :height="600" highlightRow :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator"
import { Dependencies } from '~/core/decorator'
import { PageService } from '~/utils/page.service'
import { BasicCarManageService } from '~/services/manage-service/basic-car-manage.service'
import { CarPropertyType } from "~/config/enum.config"
import { Button } from "iview"
import CarParams from "./car-params.vue"
import AddVehicle from './add-vehicle.vue'
import InventoryDetails from '~/components/purchase-sales-inventory/inventory-details.tsx.vue'

@Component({
  components: {
    CarParams
  }
})
export default class CarModelBox extends Vue {
  @Dependencies(PageService) private pageService: PageService
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService

  @Prop({
    type: Number,
    default: null
  })
  seriesId
  @Prop({
    type: Boolean,
    default: true
  })
  isEdit

  @Watch('seriesId', { immediate: true })
  onSeriesIdChange() {
    if (this.seriesId) {
      this.refreshData()
    }
  }

  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 车型数据
  private model = {
    modelName: "", // 车型名称
  }

  // 获取车型数据
  public refreshData() {
    this.basicCarManageService.queryModelBySeriesId(this.seriesId, this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }


  // 查看车型信息
  private showCarDetail(modelId) {
    this.$dialog.show({
      title: '车型详情',
      width: 1000,
      onRemove: () => { this.refreshData() },
      render: h => (<CarParams carId={modelId}></CarParams>)
    })
  }
  // 删除车型
  private deleteCarModel(carInfo) {
    this.$Modal.confirm({
      content: `是否删除车型: <b>${carInfo.modelName}</b>`,
      onOk: () => {
        this.basicCarManageService.deleteCarModel(carInfo.modelId).subscribe(
          data => {
            this.$Message.success(`已删除车型: <b>${carInfo.modelName}</b>`)
            this.refreshData()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
  }
  // 查看库存
  private showCarStock(modelId) {
    this.$dialog.show({
      title: '车型库存',
      width: 1000,
      onRemove: () => { this.refreshData() },
      render: h => {
        return h(InventoryDetails, {
          props: {
            carId: modelId
          }
        })
      }
    })
  }

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if (this.isEdit) {
            return (<div>
              <i-button type="text" class="row-command-button" v-auth={576} onClick={() => this.deleteCarModel(row)}>删除</i-button>
            </div>
            )
          } else {
            return (<div>
              <i-button type="text" class="row-command-button" v-auth={577} onClick={() => this.showCarStock(row.modelId)}>查看库存</i-button>
            </div>
            )
          }
        }
      },
      {
        align: "center",
        title: "车型名称",
        key: "modelName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.showCarDetail(row.modelId)}>{row.modelName}</i-button>
        }
      },
      {
        align: "center",
        title: "变速箱",
        key: "gearType",
        width: 110
      },
      {
        align: "center",
        title: "排量",
        key: "liter",
        width: 110
      },
      {
        align: "center",
        title: "年款",
        key: "modelYear",
        width: 110
      },
      {
        align: "center",
        title: "参考价格(万元)",
        key: "referencePrice",
        width: 180,
        render: (h, { row }) => (<div>{this.$filter.toTenThousands(row.referencePrice)}</div>)
      }
    ]
  }
}
</script>

<style lang="less" scoped>
</style>

