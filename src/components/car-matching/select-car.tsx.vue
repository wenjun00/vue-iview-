<!--选择车辆-->
<template>
  <section class="component select-car">
    <i-form :label-width="90" inline>
      <i-row>
        <i-col :span="6">
          <i-form-item prop="brandName" label="车辆品牌：">
            <i-input v-model="model.brandName" readonly></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="6">
          <i-form-item prop="seriesName" label="车辆系列：">
            <i-input v-model="model.seriesName" readonly></i-input>
          </i-form-item>
        </i-col>
        <i-col :span="6">
          <i-form-item prop="modelName" label="车辆型号：">
            <i-tooltip trigger="hover" :content="model.modelName" placement="top" :disabled="!model.modelName">
              <i-input v-model="model.modelName" readonly></i-input>
            </i-tooltip>
          </i-form-item>
        </i-col>
        <i-col :span="6">
          <i-form-item prop="color" label="车身颜色：">
            <i-input v-model="model.color" readonly></i-input>
          </i-form-item>
        </i-col>
      </i-row>
    </i-form>
    <data-box :columns="columns" :data="dataSet" :height="0" highlightRow :page="pageService" @on-page-change="refreshData" @on-current-change="onCurrentChange"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service"
import { BasicOrderComplianceService } from "~/services/manage-service/basic-order-compliance.service.ts";
import { Button } from "iview";
import CarInfo from "~/components/purchase-sales-inventory/car-info.tsx.vue";

@Component({
  components: {}
})
export default class SelectCar extends Vue {
  @Dependencies(PageService) private pageService: PageService
  @Dependencies(BasicOrderComplianceService) private basicOrderComplianceService: BasicOrderComplianceService;

  @Prop() model

  private columns: Array<any> = null;
  private dataSet: Array<any> = [];
  selectedData = {
    stockId: null, // 库存id
    stockCarNo: '', // 车架号
    financingPrice: null // 融资价格
  };

  created() {
    this.columns = [
      {
        align: "center",
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetVehicleInfo(row)}>{row.stockCarNo}</i-button>)
      },
      {
        align: "center",
        title: "车牌号",
        key: "plateNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "所属机构",
        key: "orgName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "融资价",
        key: "financingPrice",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.toThousands(row.financingPrice)}</div>)
      },
      {
        align: "center",
        title: "车辆状态",
        key: "stockStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.stockStatus)}</div>)
      },
      {
        align: "center",
        title: "整备状态",
        key: "preparStatus",
        minWidth: this.$common.getColumnWidth(4),
         render: (h, { row, column, index }) => {
          return h("span", {}, row.preparStatus ? this.$filter.dictConvert(row.preparStatus) : "未整备");
        }
      }
    ]
  }

  mounted() {
    this.refreshData()
  }
  /**
   * 刷新数据
   */
  private refreshData() {
    this.basicOrderComplianceService.queryCarMatchList(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 选中行事件
   */
  private onCurrentChange(currentRow, oldRow) {
    this.selectedData.stockId = currentRow.stockId
    this.selectedData.stockCarNo = currentRow.stockCarNo
    this.selectedData.financingPrice = currentRow.financingPrice
  }

  /**
   * 确认匹配
   */
  submit() {
    return new Promise((resolve, reject) => {
      if (!this.selectedData.stockCarNo) return resolve(false)
      else resolve(this.selectedData)
    });
  }
  /**
   * 查看车辆详情 
   */
  private onGetVehicleInfo(val) {
    this.$dialog.show({
      title: "车辆详情",
      isView: true,
      width: 1050,
      footer: true,
      render: h => <CarInfo data={val} isView={true}></CarInfo>
    });
  }
}
</script>

<style lang="less">
.component.select-car {
  .ivu-input-wrapper {
    width: 100% !important;
  }
}
</style>
