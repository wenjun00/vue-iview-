<!-- 库存车辆 -->
<template>
  <section class="page car-manage">
    <page-header title="库存车辆" hidden-print hidden-export>
      <command-button label="新增车辆" v-auth="535" @click="addCarClick"></command-button>
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
        <i-form-item prop="plateNo" label=" 车牌号：">
          <i-input placeholder="请输入车牌号" v-model="model.plateNo" :maxlength="10"></i-input>
        </i-form-item>
        <i-form-item prop="stockCarNo" label="车架号：">
          <i-input placeholder="请输入车架号" v-model="model.stockCarNo" :maxlength="17"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" @on-page-change="refreshData" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import { Button } from "iview";
import { Layout } from "~/core/decorator";
import CarInfo from "~/components/purchase-sales-inventory/car-info.tsx.vue";
import PrepareCar from "~/components/purchase-sales-inventory/prepare-car.tsx.vue";
import ManualStorage from "~/components/purchase-sales-inventory/manual-storage.tsx.vue";
import Component from "vue-class-component";
import CarParams from "~/components/base-data/car-manage/car-params.vue";
import LeaseOutStorage from "~/components/purchase-sales-inventory/lease-out-storage.tsx.vue";
import CarTransfer from "~/components/purchase-sales-inventory/car-transfer.tsx.vue";
import TrailerInStorage from "~/components/purchase-sales-inventory/trailer-in-storage.tsx.vue";
import TransferOutStorage from "~/components/purchase-sales-inventory/transfer-out-storage.tsx.vue";
import TransferStorage from "~/components/purchase-sales-inventory/transfer-storage.tsx.vue";
import MortgageOutStorage from "~/components/purchase-sales-inventory/mortgage-out-storage.tsx.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicStockCarService } from "~/services/manage-service/basic-stock-car.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";
import { PreparState, CarStorageState, CarLockState } from "~/config/enum.config";

/**
 * 拖车入库 车辆过户 需要使用的状态
 */
const IN_STORE_ASSIGNED = [CarStorageState.OutRent, CarStorageState.OutGuaranty, CarStorageState.OutAllot]
/**
 * 调拨出库所需要的状态  (调拨,拖车,采购,评估,手动入库) ; 只要入库便可以整备
 */
const OUT_STORE_Transfer = [CarStorageState.InTransfer, CarStorageState.InTrailer, CarStorageState.InPurchase, CarStorageState.InAssess, CarStorageState.InManual,]

@Layout("workspace")
@Component({
  components: {}
})
export default class CarManage extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicStockCarService) private basicStockCarService: BasicStockCarService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;

  private columns: any = [];
  private dataSet: Array<any> = [];
  private deptList: Array<any> = [];
  private brandNameList: Array<any> = [];
  private seriesNameList: Array<any> = [];

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
          if (row.preparStatus !== PreparState.Yes && (CarLockState[row.stockStatus] || OUT_STORE_Transfer.includes(row.stockStatus))) {
            let buttons = [<i-button type="text" class="row-command-button" v-auth={536} onClick={() => this.onPrepareCar(row.stockId)}>车辆整备</i-button>]
            if (row.stockStatus === CarLockState.ALLOT  && row.orgId === row.targetDeptId) {
              buttons.push(<i-button type="text" class="row-command-button" v-auth={540} onClick={() => this.onTransferStorage(row.stockId)}>调拨入库</i-button>)
            } else if (OUT_STORE_Transfer.includes(row.stockStatus)) {
              buttons.push(<i-button type="text" class="row-command-button" v-auth={542} onClick={() => this.onTransferOutStorage(row)}>调拨出库</i-button>)
            }
            return h('div', buttons)
          }
          else if (row.preparStatus === PreparState.Yes) {
            // let buttons = [<i-button type="text" class="row-command-button"></i-button>]
            if (row.stockStatus === CarLockState.ALLOT  && row.orgId === row.targetDeptId) {
              return <i-button type="text" class="row-command-button" v-auth={540} onClick={() => this.onTransferStorage(row.stockId)}>调拨入库</i-button>
            } else if (OUT_STORE_Transfer.includes(row.stockStatus)) {
              return <i-button type="text" class="row-command-button" v-auth={542} onClick={() => this.onTransferOutStorage(row)}>调拨出库</i-button>
            } else if (row.stockStatus === CarLockState.GUARANTY) {
              return <i-button type="text" class="row-command-button" v-auth={537} onClick={() => this.onMortgageOutStorage(row.stockId)}>抵押出库</i-button>
            } else if (row.stockStatus === CarLockState.LEASE) {
              return <i-button type="text" class="row-command-button" v-auth={538} onClick={() => this.onLeaseOutStorage(row.stockId)}>租赁出库</i-button>
            } else if (IN_STORE_ASSIGNED.includes(row.stockStatus)) {
              // let buttons = [<i-button type="text" class="row-command-button" v-auth={541} onClick={() => this.onCarTransfer(row.stockId)}>车辆过户</i-button>]
              // if(){
              //   buttons.push(<i-button type="text" class="row-command-button" v-auth={539} onClick={() => this.onTrailerInStorage(row.stockId)}>拖车入库</i-button>)
              // }
              // return h('div',buttons)
              return (<div>
                <i-button type="text" class="row-command-button" v-auth={539} onClick={() => this.onTrailerInStorage(row.stockId)}>拖车入库</i-button>
                <i-button type="text" class="row-command-button" v-auth={541} onClick={() => this.onCarTransfer(row.stockId)}>车辆过户</i-button>
              </div>)
            }
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
        minWidth: this.$common.getColumnWidth(4)
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
        title: "整备状态",
        key: "preparStatus",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, column, index }) => {
          return h("span", {}, row.preparStatus ? this.$filter.dictConvert(row.preparStatus) : "未整备");
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
    this.getAllBrand();
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
      this.model.brandName = null
      this.model.seriesName = null
      this.seriesNameList = []
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

  private getAllBrand() {
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
   * 获取车辆列表
   */
  private refreshData() {
    this.basicCustomerCarCenterService
      .queryCustomerCarList(this.model, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryTransferDeptList()
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
      onRemove: () => this.refreshData(),
      render: h => <CarInfo data={val} isView={true}></CarInfo>
    });
  }

  /**
   * 新增车辆
   */
  private addCarClick() {
    this.$dialog.show({
      title: "手动入库",
      footer: true,
      width: 1050,
      onOk: addCustomerInfoBasedata => {
        return addCustomerInfoBasedata.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => h(ManualStorage)
    });
  }

  /**
   * 修改库存状态
   * @param dataManualStorage
   */
  onChangeCsrStockStatus(row) {
    this.$Modal.confirm({
      content: "确定执行车辆整备操作吗？",
      onOk: () => {
        this.basicStockCarService.updateCarStockStatus(row).subscribe(
          data => {
            this.$Message.success("操作成功！");
            this.refreshData();
          },
          err => this.$Message.error(err.msg)
        );
      }
    });
  }

  /**
   * 车辆整备
   */
  onPrepareCar(stockId) {
    this.$dialog.show({
      title: "车辆整备",
      width: 1050,
      onRemove: () => this.refreshData(),
      render: h => <PrepareCar stockId={stockId} isView={true}></PrepareCar>
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
      onOk: mortgageOutStorage => {
        return mortgageOutStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => <MortgageOutStorage stockId={stockId} isView={true}></MortgageOutStorage>
    });
  }

  /**
   * 拖车入库
   */
  onTrailerInStorage(stockId) {
    this.$dialog.show({
      title: "拖车入库",
      footer: true,
      width: 1050,
      onOk: trailerInStorage => {
        return trailerInStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => h(TrailerInStorage, {
        props: {
          stockId: stockId
        }
      })
    });
  }

  /**
   * 调拨出库
   */
  onTransferOutStorage(val) {
    this.$dialog.show({
      title: "调拨出库",
      footer: true,
      width: 1050,
      onOk: transferOutStorage => {
        return transferOutStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => h(TransferOutStorage, {
        props: {
          data: val,
          isView: false
        }
      })
    });
  }

  /**
   * 调拨入库
   */
  onTransferStorage(stockId) {
    this.$dialog.show({
      title: "调拨入库",
      footer: true,
      width: 1050,
      onOk: transferStorage => {
        return transferStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => h(TransferStorage, {
        props: {
          stockId: stockId,
          isView: true
        }
      })
    });
  }

  /**
   * 车辆过户
   */
  onCarTransfer(stockId) {
    this.$dialog.show({
      title: "车辆过户",
      footer: true,
      width: 1050,
      onOk: mortgageOutStorage => {
        return mortgageOutStorage.submit().then(v => {
          if (v) this.refreshData();
          return !!v;
        });
      },
      render: h => <CarTransfer stockId={stockId} isView={true}></CarTransfer>
    });
  }

}
</script>

<style lang="less" scoped>
</style>
