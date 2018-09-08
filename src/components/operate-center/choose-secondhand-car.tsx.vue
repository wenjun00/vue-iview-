<!--选择二手车车辆-->
<template>
  <section class="component choose-secondhand-car">
    <data-form :model="model" @on-search="refreshData" hiddenDateSearch :page="pageService">
      <template slot="input">
        <i-form-item prop="brandName" label="品牌:">
          <i-input v-model="model.brandName" placeholder="请输入品牌名称" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="seriesName" label="系列:">
          <i-input v-model="model.seriesName" placeholder="请输入系列名称" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="orgName" label="机构名称:">
          <i-input v-model="model.orgName" placeholder="请输入机构名称" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="plateNo" label="车牌号:">
          <i-input v-model="model.plateNo" placeholder="请输入车牌号" :maxlength="10"></i-input>
        </i-form-item>
        <i-form-item prop="stockCarNo" label="车架号:">
          <i-input v-model="model.stockCarNo" placeholder="请输入车架号" :maxlength="17"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :show-config-column="false" :columns="columns" highlightRow :data="dataSet" ref="databox" :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>

<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Emit } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { PageService } from "~/utils/page.service";
import CarParams from "~/components/base-data/car-manage/car-params.vue";
import { Button } from "iview";
import DataBox from "~/components/common/data-box.vue";
import { secondCarInfo } from "~/interfaces/work.interface";


@Component({
  components: {}
})
export default class ChooseSecondhandCar extends Vue {
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(PageService) private pageService: PageService;

  // 选中的车架号
  @Prop() stockCarNo: string;


  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private model = {
    brandName: "", //品牌
    seriesName: "", //系列
    orgName: "", // 所属机构
    stockStatus: 10181, // 库存状态:评估入库
    plateNo: "", // 车牌号
    stockCarNo: "" // 车架号

  }

  created() {
    this.columns = [
      {
        align: "center",
        title: "品牌",
        key: 'brandName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "系列",
        key: 'seriesName',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "车型",
        key: 'modelName',
        minWidth: this.$common.getColumnWidth(5),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showCarDetail(row.modelId)}>{row.modelName}</i-button>)
      },
      {
        align: "center",
        title: "车牌号",
        key: 'plateNo',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "颜色",
        key: 'stockCarColor',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "精准估价",
        key: 'price',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <span>{this.$filter.toThousands(row.price)}</span>
      },
      {
        align: "center",
        title: "车架号",
        key: 'stockCarNo',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "发动机号",
        key: 'stockEngineNo',
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "库存状态",
        key: 'stockStatus',
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => <span>{this.$filter.dictConvert(row.stockStatus)}</span>
      }
    ]
  }

  mounted() {
    this.model.stockCarNo = this.stockCarNo
    this.refreshData();
  }

  /**
   * 获取选中的车辆
   */
  get selectData(): secondCarInfo {
    let selectedCar: secondCarInfo = null;
    let data = (this.$refs.databox as DataBox).currentRow || {}
    if (data.stockId) {
      selectedCar = {
        id: data.stockId,
        vin: data.stockCarNo,
        brand: data.brandName,
        series: data.seriesName,
        model: data.modelName,
        cardNo: data.plateNo,
        modelId: data.modelId,
        engineNo: data.stockEngineNo,
        price: data.price,
        color: data.stockCarColor
      }
    }
    return selectedCar
  }

  /**
   * 更新数据
   */
  private refreshData() {
    this.basicCustomerCarCenterService.queryStockCar(this.model, this.pageService).subscribe(
      data => {
        data.forEach(v => { v._highlight = v.stockCarNo === this.stockCarNo })
        this.dataSet = data
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查看车辆详情
   */
  private showCarDetail(carId: Number) {
    this.$dialog.show({
      title: "车型详情",
      isView: true,
      width: 1000,
      render: h => (<CarParams carId={carId} isView={true} ></CarParams>)
    })
  }

}
</script>

<style lang="less">
.component.choose-vehicle-model {
  .money-align {
    text-align: right;
    padding-right: 5%;
  }
}
</style>
