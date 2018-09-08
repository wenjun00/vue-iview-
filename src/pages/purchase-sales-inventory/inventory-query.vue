<template>
  <section class="page inventory-manage">
    <page-header title="库存车辆管理" hiddenPrint hiddenExport></page-header>
    <i-row class="form" :gutter="16">
      <i-col class="data-form" :span="6">
        <i-row class="data-form-item">
          <div class="data-form-item-icon"></div>
          <span>车辆品牌</span>
        </i-row>
        <div class="data-form-tree">
          <data-tree ref="data-tree" :data="carTreeData" @on-select-change="onStockCarSelectChange"></data-tree>
        </div>
      </i-col>
      <i-col :span="18">
        <car-model-box v-if="seriesId" :seriesId="seriesId" :isEdit="false" ref="carModelBox"></car-model-box>
        <div v-else class="empty-text">空空如也，请选择车辆^_^</div>
      </i-col>
    </i-row>
  </section>
</template>

<script lang="ts">
import Page from "~/core/page";
import Component from "vue-class-component";
import DataTree from "~/components/common/data-tree.vue";
import CarModelBox from "~/components/base-data/car-manage/car-model-box.tsx.vue";
import { Layout } from "~/core/decorator";
import { Action, Getter, namespace } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { CarPropertyType } from "~/config/enum.config";

@Layout("workspace")
@Component({
  components: {
    DataTree,
    CarModelBox
  }
})
export default class InventoryQuery extends Page {
  @Dependencies(PageService) private pageService: PageService;

  private inventoryColumns: any;
  private inventoryDataSet: Array<Object> = [];
  private dataTree: DataTree;
  private seriesId: number = 0;
  // 查询参数实体
  private queryParamsModel = {
    modelId: 0,
    supplierId: ""
  };

  created() {
    this.dataTree = this.$refs["data-tree"] as DataTree;
  }
  
  /**
   * 车型选中改变事件
   */
  onStockCarSelectChange(data) {
    //判断选中节点是否为叶子节点
    if(data.type === CarPropertyType.SERIES) {
      this.seriesId = data.id
    } else{
      this.seriesId = 0
    }
  }
}
</script>

<style lang="less" scoped>
.page.inventory-manage {
  overflow-x: hidden;
  .empty-text {
    height: 300px;
    text-align: center;
    line-height: 400px;
    position: absolute;
    top: 0;
    left: 350px;
  }
  .data-form {
    margin-top: 10px;
    .data-form-item {
      width: 100%;
      height: 30px;
      border: 1px solid #dddd;
      line-height: 30px;
      font-size: 16px;
      .data-form-item-icon {
        width: 4px;
        height: 15px;
        background: rgb(38, 94, 162);
        display: inline-block;
        margin-left: 10px;
        position: relative;
        top: 2px;
      }
    }
    .command {
      .command-item {
        width: 20%;
      }
      .command-add {
        margin-left: 10px;
        position: absolute;
        right: 13px;
      }
    }
    .data-form-tree {
      width: 100%;
      height: 600px;
      border: 1px solid #dddd;
      border-top: 0;
      overflow: auto;
    }
  }
}
</style>
