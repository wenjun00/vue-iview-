<template>
  <section class="page vehicle-maintenance col">
    <page-header title="车辆维护" hiddenPrint hiddenExport>
      <command-button v-show="currentIsSeriesNode" label="新增车型" @click="addCarModel" v-auth="575"></command-button>
      <command-button label="在线导入车300车型数据" @click="onImportClick" v-auth="574"></command-button>
    </page-header>
    <div class="car-manage-container">
      <div class="car-tree container-height">
        <data-tree ref="data-tree" showEdit :data="carTreeData" :loadData="loadDataFunc" @on-select-change="onTreeNodeChanged" @on-edit="onEdit" @on-add="onAddClick" @on-delete="ondeleteClick"></data-tree>
      </div>
      <div class="car-list">
        <car-model-box v-if="seriesData.id" :seriesId="seriesData.id" ref="carModelBox"></car-model-box>
        <div v-else class="no-data-notice">请选择车系</div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Page from '~/core/page'
import Component from 'vue-class-component'
import { Dependencies } from '~/core/decorator'
import { Layout } from '~/core/decorator'
import { PageService } from '~/utils/page.service'
import { BasicCarManageService } from '~/services/manage-service/basic-car-manage.service'
import CarBrand from "~/components/base-data/car-manage/car-brand.vue";
import CarSeries from "~/components/base-data/car-manage/car-series.vue";
import AddVehicle from '~/components/base-data/car-manage/add-vehicle.vue'
import CarModelBox from "~/components/base-data/car-manage/car-model-box.tsx.vue";
import DataTree from "~/components/common/data-tree.vue";
import { CarPropertyType } from "~/config/enum.config";
import { ThirdpartyManageService } from '~/services/thirdparty-service/che300.service'


@Layout('workspace')
@Component({
  components: {
    DataTree,
    CarModelBox
  }
})
export default class VehicleMaintenance extends Page {
  @Dependencies(PageService) private pageService: PageService
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService
  @Dependencies(ThirdpartyManageService) private thirdpartyManageService: ThirdpartyManageService

  private currentIsSeriesNode = false;
  private seriesData: any = {};
  private brandNode: any = {};
  private carTreeData: any[] = [];
  private dataTree: DataTree = null;

  // 导入车300车型数据
  onImportClick() {
    this.$Modal.confirm({
      content: `导入数据会耗费较长时间，是否继续？`,
      onOk: () => {
        this.thirdpartyManageService.che300DataSync().subscribe()
      }
    })
  }

  /**
   * 异步加载数据绑定方法
   */
  private loadDataFunc(currentData) {
    if (currentData.type === CarPropertyType.BRAND) {
      return this.GetSeriseByBrandId(currentData.id)
    }
  }

  // 树点击修改事件
  private onEdit(data) {
    switch (data.type) {
      case CarPropertyType.BRAND:
        this.$dialog.show({
          title: "修改品牌",
          footer: true,
          onOk: editBrand => {
            let result = editBrand.confirmRepair().then(() => {
              this.refreshBrandData()
            }).catch(v => false)
            return result
          },
          onCancel: () => { },
          render: h => {
            return h(CarBrand, {
              props: {
                id: data.id
              }
            })
          }
        })
        break;
      case CarPropertyType.SERIES:
        this.$dialog.show({
          title: "修改车系",
          footer: true,
          onOk: editSeries => {
            let result = editSeries.confirmSeriesRepair().then((name) => {
              this.seriesData.title = name;
            }).catch(v => false)
            return result
          },
          onCancel: () => { },
          render: h => {
            return h(CarSeries, {
              props: {
                series: {
                  id: data.id,
                  name: data.title
                }
              }
            })
          }
        })

        break;
      case CarPropertyType.MODEL:
        this.$Message.error('当前节点不允许操作')
        break;
    }
  }
  // 树点击新增事件
  private onAddClick(data) {
    switch (data.type) {
      case CarPropertyType.BRAND:
        this.$dialog.show({
          title: "新增车系",
          footer: true,
          onOk: addSeries => {
            let result = addSeries.confirmAddSeries().then(() => {
              this.brandNode.data.loading = false;
              this.brandNode.expanded = false;
              return true
            }).catch(v => false)
            return result
          },
          onCancel: () => { },
          render: h => {
            return h(CarSeries, {
              props: {
                brandId: data.id
              }
            })
          }
        })
        break;
      case CarPropertyType.SERIES:
        this.$Message.error('当前节点不允许操作')
        break;

      default:
        this.$dialog.show({
          title: "新增品牌",
          footer: true,
          onOk: addBrand => {
            let result = addBrand.confirmAddBrand().then(() => {
              this.refreshBrandData()
              this.dataTree.selected.expanded = true
            }).catch(v => false)
            return result
          },
          onCancel: () => { },
          render: h => h(CarBrand)
        })
        break;
    }

  }

  // 树点击删除事件
  private ondeleteClick(data) {
    switch (data.type) {
      case CarPropertyType.BRAND:
        this.basicCarManageService.deleteCarBrand(data.id)
          .subscribe(data => {
            this.$Message.success('删除成功')
            this.refreshBrandData()
          }, err => {
            this.$Message.error(err.msg)
          })

        break;
      case CarPropertyType.SERIES:
        // 删除车系
        this.basicCarManageService.deleteCarSeries(this.seriesData.id)
          .subscribe(data => {
            this.$Message.success('删除成功')
            this.brandNode.data.loading = false;
            this.brandNode.expanded = false;
          }, err => {
            this.$Message.error(err.msg)
          })
        break;

      default:
        this.$Message.error('当前节点不允许操作')
        break;
    }
  }


  // 新增车型
  private addCarModel() {
    this.$dialog.show({
      title: "添加车辆",
      footer: true,
      width: 700,
      onOk: addCar => {
        return addCar.addVehicle().then(() => {
          let carList = this.$refs.carModelBox as CarModelBox
          carList.refreshData()
        }).catch(v => false)
      },
      onCancel: () => { },
      render: h => h(AddVehicle, {
        props: {
          series: {
            id: this.seriesData.id
          }
        }
      })
    })
  }



  // 点击树当前节点 
  private onTreeNodeChanged(data) {
    this.currentIsSeriesNode = false
    if (data.type === CarPropertyType.SERIES) {
      this.currentIsSeriesNode = true;
      this.seriesData = data
    } else if (data.type === CarPropertyType.BRAND) {
      this.brandNode = this.dataTree.selected
    } else {
      this.seriesData.id = 0
    }
  }

  /**
   * 初始化车辆品牌数据
   */
  private refreshBrandData() {
    this.basicCarManageService.getAllBrand().subscribe(
      data => {
        let brandData = data.map(v => {
          return {
            id: v.id,
            title: v.brandName,
            type: CarPropertyType.BRAND,
            loading: false,
          }
        })
        this.carTreeData = [{
          id: -1,
          title: "所有车辆",
          children: brandData,
          loading: true,
          expanded: true
        }]
      },
      err => this.$Message.error(err.msg)
    )
  }


  /**
   * 根据车辆ID获取车辆系列
   */
  private GetSeriseByBrandId(brandId: Number) {
    return new Promise((resolve) => {
      this.basicCarManageService.getAllSeriesByBrandId(brandId).subscribe(
        data => {
          let seriesData = data.map(v => {
            return {
              id: v.id,
              title: v.seriesName,
              type: CarPropertyType.SERIES,
              loading: true,
            }
          })
          resolve(seriesData)
        },
        err => this.$Message.error(err.msg)
      )
    })
  }

  mounted() {
    this.dataTree = this.$refs["data-tree"] as DataTree;
    this.refreshBrandData()
  }
}
</script>


<style lang="less" scoped>
.page.vehicle-maintenance {
  .car-manage-container {
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .car-tree {
    width: 260px;
    flex-basis: 260px;
    border-right: solid 1px #ccc;
    overflow-y: auto;
  }
  .car-list {
    flex: 1;
  }
}
</style>
