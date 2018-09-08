<!-- 车辆出库 -->
<template>
  <section class="page sales-car-checkout">
    <page-header title="车辆出库" hidden-print hidden-export>
    </page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData">
      <template slot="input">
        <i-form-item prop="brandName" label="选择品牌：">
          <i-select v-model="brandName" clearable>
            <i-option v-for="item in this.brandNameList" :key="item.id" :label="item.brandName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="seriesName" label="选择车系：">
          <i-select v-model="model.seriesName" :disabled="!model.brandName" clearable>
            <i-option v-for="item in this.seriesNameList" :key="item.id" :label="item.seriesName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="orgName" label="选择机构：">
          <i-select v-model="model.orgName" clearable>
            <i-option v-for="item in this.deptList" :key="item.id" :label="item.orgName" :value="item.orgName"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="stockStatus" label="车辆状态：">
          <i-select v-model="model.stockStatus" clearable>
            <i-option v-for="{value,label} in $dict.getDictData(10051)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="plateNo" label=" 车牌号：" style="width:264px">
          <i-input placeholder="请输入车牌号" v-model="model.plateNo" :maxlength="10"></i-input>
        </i-form-item>
        <i-form-item prop="stockCarNo" label="车架号：" style="width:264px">
          <i-input placeholder="请输入车架号" v-model="model.stockCarNo" :maxlength="17"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" @on-page-change="refreshData" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import { namespace } from "vuex-class";
import { Button } from "iview";
import { Layout } from "~/core/decorator";
import CarInfo from "~/components/purchase-sales-inventory/car-info.tsx.vue";
import Component from "vue-class-component";
import CarParams from "~/components/base-data/car-manage/car-params.vue";
import LeaseOutStorage from "~/components/purchase-sales-inventory/lease-out-storage.tsx.vue";
import MortgageOutStorage from "~/components/purchase-sales-inventory/mortgage-out-storage.tsx.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";
import { CarLockState } from "~/config/enum.config"

@Layout("workspace")
@Component({
  components: {}
})
export default class SalesCarCheckout extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  private columns: any = [];
  private dataSet: Array<any> = [];
  private deptList: Array<any> = [];
  private brandNameList: Array<any> = [];
  private seriesNameList: Array<any> = [];
  private brandId: number

  private model: any = {
    brandName: "",
    seriesName: "",
    orgName: "",
    stockStatus: "",
    plateNo: "",
    stockCarNo: ""
  };

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if (row.stockStatus === CarLockState.GUARANTY  && row.preparStatus ===  10301) {
            return (<i-button type="text" class="row-command-button" v-auth={543} onClick={() => this.onMortgageOutStorage(row.stockId)}>抵押出库</i-button>)
          }
          else if (row.stockStatus === CarLockState.LEASE && row.preparStatus ===  10301) {
            return (<i-button type="text" class="row-command-button" v-auth={544} onClick={() => this.onLeaseOutStorage(row.stockId)}>租赁出库</i-button>)
          }
        }
      },
      {
        align: "center",
        editable: true,
        title: "车牌号",
        key: "plateNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetVehicleInfo(row)}>{row.stockCarNo}</i-button>)
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
        title: "车型",
        key: "modelName",
        minWidth: this.$common.getColumnWidth(6),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetCarParams(row.modelId)}>{row.modelName}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "所属机构",
        key: "orgName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.orgName));
        }
      },
      {
        align: "center",
        editable: true,
        title: "车辆性质",
        key: "stockCarType",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.stockCarType));
        }
      },
      {
        align: "center",
        editable: true,
        title: "车辆状态",
        key: "stockStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.stockStatus));
        }
      }
    ];
  }

  mounted() {
    this.getDeptList();
    // 加载数据
    this.refreshData();
  }

  /**
   * keep-alive生命周期钩子函数
   */
  activated() {
    // 加载数据
    this.refreshData();
  }

  get brandName() {
    return this.model.brandName
  }

  set brandName(val: number) {
    if (!val) {
      this.model.brandName = ""
      this.model.seriesName = ""
    } else {
      this.model.brandName = val
      this.basicCarManageService
        .getAllSeriesByBrandId(val)
        .subscribe(
          data => (this.seriesNameList = data),
          err => this.$Message.error(err.msg)
        );
    }
  }

  /**
   * 获取车辆列表
   */
  private refreshData() {
    this.basicCustomerCarCenterService.queryOutOfStockCarList(this.model, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );

    this.basicCarManageService
      .getAllBrand()
      .subscribe(
        data => (
          this.brandNameList = data
        ),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryDeptList()
      .subscribe(
        data => (this.deptList = data),
        err => this.$Message.error(err.msg)
      );

  }

  /**
   * 查看车型信息
   */
  onGetCarParams(modelId) {
    this.$dialog.show({
      title: "车型信息",
      isView: true,
      width: 1050,
      footer: true,
      render: h => <CarParams carId={modelId} isView={true}></CarParams>
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

  /**
   * 租赁出库
   */
  onLeaseOutStorage(stockId) {
    this.$dialog.show({
      title: "租赁出库",
      footer: true,
      width: 1050,
      onOk: leaseOutStorage => {
        return leaseOutStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => <LeaseOutStorage stockId={stockId} isView={true}></LeaseOutStorage>
    });
  }

  /**
   * 抵押出库
   */
  onMortgageOutStorage(stockId) {
    this.$dialog.show({
      title: "抵押出库",
      footer: true,
      width: 1050,
      onOk: (mortgageOutStorage:MortgageOutStorage) => {
        return mortgageOutStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => <MortgageOutStorage stockId={stockId} isView={true}></MortgageOutStorage>
    });
  }
}
</script>

<style lang="less" scoped>
</style>
