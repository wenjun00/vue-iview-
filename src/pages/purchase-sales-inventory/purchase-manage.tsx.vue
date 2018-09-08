<!-- 采购管理 -->
<template>
  <section class="page purchase-manage">
    <page-header title=" 采购管理" hidden-print hidden-export>
      <command-button label="新增采购登记" @click="addPurchaseRegisterClick"></command-button>
    </page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData">
      <template slot="input">
        <i-form-item prop="startEndDate">
          <i-date-picker v-model="model.startEndDate" placeholder="请选择出厂日期" type="daterange" ></i-date-picker>
        </i-form-item>
        
        <i-form-item prop="userRealName" label="申请人：">
          <i-input placeholder="请输入申请人" v-model="model.userRealName" :maxlength="17"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <span></span>
    <data-box :columns="enterShellSaveColumns" :data="enterShellSaveDataSet" @on-page-change="refreshData" :page="pageService" ref="databox" :height='this.height'></data-box>
    <purchase-vehicle-details v-if="isView" :purchaseId="this.purchaseId"></purchase-vehicle-details>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import { namespace } from "vuex-class";
import { Button } from "iview";
import { Layout } from "~/core/decorator";
import Component from "vue-class-component";
import CarParams from "~/components/base-data/car-manage/car-params.vue";
import PurchaseRegister from "~/components/purchase-sales-inventory/purchase-register.tsx.vue";
import PurchaseRegisterDetails from "~/components/purchase-sales-inventory/purchase-register-details.tsx.vue";
import PurchaseVehicleDetails from "~/components/purchase-sales-inventory/purchase-vehicle-details.tsx.vue";
import PrepareCar from "~/components/purchase-sales-inventory/prepare-car.tsx.vue";
import CarInfo from "~/components/purchase-sales-inventory/car-infos.tsx.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { PreparState, CarStorageState, CarLockState, OrderCarType } from "~/config/enum.config";
// const CustomerOrderModule = namespace("customerOrderSpace");

@Layout("workspace")
@Component({
  components: {
    PurchaseVehicleDetails
  }
})
export default class PurchaseManage extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  // @CustomerOrderModule.Action showOrderInfo;


  private enterShellSaveColumns: any = [];
  private enterShellSaveDataSet: Array<any> = [];
  private seriesNameList: Array<any> = [];
  private deptList: Array<any> = [];
  private isView: boolean = false;
  private purchaseId = "";
  private height: number = 550

  private model = {
    startEndDate: ['',''],
    userRealName: ""
  };

  created() {
    this.enterShellSaveColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [<i-button type="text" class="row-command-button" onClick={() => this.onDetails(row)}>查看</i-button>]
          if (row.purchaseStatus === 10457) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.onReview(row.purchaseId)}>复核</i-button>)
          }
          return h('div', buttons)
        }
      },
      {
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        align: "center",
        editable: true,
        title: "采购状态",
        key: "purchaseStatus",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row, column, index }) => 
          h('p',{},this.$filter.dictConvert(row.purchaseStatus))
      },
      {
        align: "center",
        editable: true,
        title: "申请时间",
        key: "operateTime",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row, columns, index }) =>
          h("p", {}, this.$filter.dateFormat(row.operateTime))
      },
      {
        align: "center",
        editable: true,
        title: "申请人",
        key: "userRealName",
        minWidth: this.$common.getColumnWidth(3)
      },
    ];
  }

  mounted() {
    // 加载数据
    this.refreshData();
    this.getDeptList();
  }

  /**
   * 获取调拨机构列表
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
   * keep-alive生命周期钩子函数
   */
  activated() {
    // 加载数据
    this.refreshData();
  }

  private isViewDataBox(purchaseId) {
    this.purchaseId = purchaseId;
    if (this.isView) {
      this.isView = false
      this.height = 550
    } else {
      this.isView = true
      this.height = 200
    }
  }

  /**
   * 刷新列表
   */
  refreshData() {
    this.basicCustomerCarCenterService
      .queryPurchaseList(this.model, this.pageService)
      .subscribe(
        data => (this.enterShellSaveDataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 修改采购登记
   */
  onDetails(val) {
    if (val.purchaseStatus === 10459) { //10459 复核拒绝,修改登记信息,再次审核
      this.$dialog.show({
        title: "修改采购登记",
        width: 1200,
        footer: true,
        onOk: purchaseRegister => {
          return purchaseRegister.submit().then(v => {
            if (v) this.refreshData();
            return v;
          });
        },
        render: h => <PurchaseRegister data={val} isView={true}></PurchaseRegister>
      });
    } else {
      this.$dialog.show({
        title: "查看采购详情",
        isView: true,
        width: 1200,
        onOk: purchaseRegisterDetails => {
          return purchaseRegisterDetails.submit().then(v => {
            if (v) this.refreshData();
            return v;
          })
        },
        render: h => <PurchaseRegisterDetails purchaseId={val.purchaseId} isView={true} isPurchaseDetails={true}></PurchaseRegisterDetails>
      });
    }

  }

  /**
   * 采购复核
   */
  onReview(purchaseId) {
    this.$dialog.show({
      title: "采购复核",
      width: 1200,
      onRemove: () => this.refreshData(),
      render: h => <PurchaseRegisterDetails purchaseId={purchaseId} isView={true} isReview={true}></PurchaseRegisterDetails>
    });
  }

  /**
   * 新建采购登记
   */
  addPurchaseRegisterClick() {
    this.$dialog.show({
      title: " 采购登记",
      width: 1200,
      footer: true,
      onOk: purchaseRegister => {
        return purchaseRegister.submit().then(v => {
          if (v) this.refreshData();
          return v;
        });
      },
      render: h => <PurchaseRegister></PurchaseRegister>
    });
  }



}
</script>

<style lang="less" scoped>
.purchase-vehicle-details {
  position: absolute;
  left: 100px;
  z-index: 99;
}
</style>
