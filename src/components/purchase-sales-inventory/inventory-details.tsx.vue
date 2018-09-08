<!-- 车型库存 -->
<template>
  <section class="component inventory-details">
    <data-form hidden-date-search :model="queryParamsModel" @on-search="getStockData">
      <template slot="input">
        <i-form-item prop="supplierId" label="供应商：">
          <i-select v-model="queryParamsModel.supplierId" clearable filterable>
            <i-option v-for="{id,supplierName} in supplierDataSet" :key="id" :label="supplierName" :value="id"></i-option>
          </i-select>
        </i-form-item>
        <div class="add-customer-info">
          <a @click="onStockCarOperate('')">
            <svg-icon iconClass="add"></svg-icon>
            新增库存车辆
          </a>
        </div>
      </template>
    </data-form>
    <data-box :columns="inventoryColumns" :data="inventoryDataSet" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { Form } from "iview";
import { State, Getter, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { BasicSupplierService } from "~/services/manage-service/basic-supplier.service";
import { BasicStockCarService } from "~/services/manage-service/basic-stock-car.service";
import ModifyBasicStockCar from "~/components/purchase-sales-inventory/modify-basic-stock-car.vue";
import CarParams from "~/components/base-data/car-manage/car-params.vue";

@Component({
  components: {
  }
})
export default class InventoryDetails extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicSupplierService) private basicSupplierService: BasicSupplierService;
  @Dependencies(BasicStockCarService) private basicStockCarService: BasicStockCarService;

  @Prop({
    default: 0,
    type: Number
  })
  orderId: number;
  @Prop({
    default: 0,
    type: Number
  })
  carId: number;

  private inventoryColumns: any;
  private inventoryDataSet: Array<Object> = [];
  private supplierDataSet: Array<Object> = [];
  private queryParamsModel = {
    modelId: 0,
    supplierId: "" // 供应商id
  };

  created() {
    this.inventoryColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        render: (h, { row, column, index }) => {
          return h("div", [
            h(
              "i-button",
              {
                props: {
                  type: "text"
                },
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => {
                    this.onGetCarParams(row);
                  }
                }
              },
              "详情"
            )
          ]);
        }
      },

      {
        align: "center",
        editable: true,
        title: "供应商名称",
        key: "supplierName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(5)
      },
      {
        align: "center",
        editable: true,
        title: "发动机号",
        key: "stockEngineNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车辆颜色",
        key: "stockCarColor",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "采购价格（元）",
        key: "stockPrice",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("p", {}, this.$filter.toThousands(row.stockPrice))

      },
      {
        align: "center",
        editable: true,
        title: "库存状态",
        key: "stockStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("p", {}, this.$filter.dictConvert(row.stockStatus))
      },
      {
        align: "center",
        editable: true,
        title: "是否供应商放款",
        key: "hasSupplierLoan",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) =>
          h("p", {}, this.$filter.dictConvert(row.hasSupplierLoan))
      }
    ];
  }
  mounted() {
    this.getBasicSupplier();
    this.getStockData();
  }

  /**
   * 获取供应商列表
   */
  private getBasicSupplier() {
    return new Promise((resolve, reject) => {
      this.basicSupplierService.getBasicSupplierList().subscribe(
        data => {
          this.supplierDataSet = data;
          resolve(true);
        },
        err => reject(err)
      );
    });
  }

  /**
   * 获取库存数据
   */
  private getStockData() {
    this.queryParamsModel.modelId = this.carId
    this.basicStockCarService
      .findAllStockCarList(this.queryParamsModel, this.pageService)
      .subscribe(
        data => (this.inventoryDataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 获取车型信息
   * @param val 选中行数据
   */
  onGetCarParams(val: Object) {
    this.$dialog.show({
      title: "查看车型信息",
      isView: true,
      footer: true,
      width: 1000,
      render: h =>
        h(CarParams, {
          props: {
            carId: this.carId,
            isView: true
          }
        })
    });
  }

   /**
   * 库存操作
   */
  onStockCarOperate(val?: Object) {
    if (!this.carId) {
      this.$Message.warning("请选择车型！");
      return;
    }
    this.$dialog.show({
      title: val ? "维护库存车辆" : "新增库存车辆",
      footer: true,
      width: 700,
      onOk: modifyBasicStockCar => {
        return modifyBasicStockCar.submit().then(v => {
          if (v) this.getStockData();
          return v;
        });
      },
      render: h =>
        h(ModifyBasicStockCar, {
          props: {
            modelId: this.carId,
            stockCarData: val
          }
        })
    });
  }
}
</script>

<style lang="less" scoped>
.component.inventory-details {
  .add-customer-info {
    position: absolute;
    right: 20px;
  }
}
</style>