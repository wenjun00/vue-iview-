<template>
  <section class="page open-account">
    <page-header title="开户签约" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="queryParamsModel" @on-search="refreshOpenAccount">
      <template slot="input">
        <i-form-item prop="orderNo" label="订单号：">
          <i-input placeholder="请输入订单号" v-model="queryParamsModel.orderNo" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号：">
          <i-input placeholder="请输入身份证号" v-model="queryParamsModel.idCard" clearable :maxlength="18"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :id="20" :columns="openAccountColumns" :data="openAccountDataSet" @on-page-change="refreshOpenAccount" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import DataBox from "~/components/common/data-box.vue";
import Component from "vue-class-component";
import CustomerBankList from "~/components/customer-center/customer-bank-list.tsx.vue";
import { Form, Model } from "iview";
import { namespace } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicOrderComplianceService } from "~/services/manage-service/basic-order-compliance.service.ts";
import { Layout } from "~/core/decorator";
import { Button } from "iview";
import AccountSignDetail from "~/components/account-sign/account-sign-detail.tsx.vue";
import CarInfo from "~/components/purchase-sales-inventory/car-info.tsx.vue"

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class OpenAccount extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicOrderComplianceService)
  private basicOrderComplianceService: BasicOrderComplianceService;

  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  private openAccountColumns: any = [];
  private openAccountDataSet: Array<Object> = [];

  private queryParamsModel = {
    orderNo: '', // 订单号
    idCard: '', // 身份证号
    orderStatus: "10115"
  }

  created() {
    this.openAccountColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        fixed: "left",
        render: (h, { row, column, index }) => {
          return (<i-button type="text" class="row-command-button" v-auth={550} onClick={() => this.onCheckClick(row)}>{row.orderStatus === this.$enum.OrderCurrentState.OPEN_ACCOUNT ? '开户签约' : '查看'}</i-button>)
        }
      },
      {
        align: "center",
        title: "订单号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetVehicleInfo(row)}>{row.stockCarNo}</i-button>)
      },
      {
        align: "center",
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showCustomerInfo({ id: row.customerId })}>{row.customerName}</i-button>)
      },
      {
        align: "center",
        title: "身份证号",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "手机号",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      // {
      //   align: "center",
      //   title: "资金渠道",
      //   key: "fundsChannel",
      //   minWidth: this.$common.getColumnWidth(4)
      // },
      {
        align: "center",
        title: "金融产品系列",
        key: "businessType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.dictConvert(row.businessType)}</div>)
      },
      {
        align: "center",
        title: "金融产品名称",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "车辆类型",
        key: "orderCarType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.dictConvert(row.orderCarType)}</div>)
      },
      {
        align: "center",
        title: "还款方式",
        key: "orderRepayType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.dictConvert(row.orderRepayType)}</div>)
      },
      {
        align: "center",
        title: "订单总额",
        key: "totalMoney",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.toThousands(row.totalMoney)}</div>)
      },
      {
        align: "center",
        title: "订单状态",
        key: "orderStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.dictConvert(row.orderStatus)}</div>)
      }
    ];
  }

  mounted() {
    // 加载列表数据
    this.refreshOpenAccount();
  }

  /**
   * keep-alive生命周期钩子函数
   */
  activated() {
    // 加载列表数据
    this.refreshOpenAccount();
  }

  /**
   * 刷新列表
   */
  refreshOpenAccount() {
    this.basicOrderComplianceService
      .queryOrderList(this.queryParamsModel, this.pageService)
      .subscribe(
        data => (this.openAccountDataSet = data),
        err => this.$Message.error(err.msg)
      );
  }
 
  /**
   * 查看
   */
  private onCheckClick(data) {
    this.$dialog.show({
      title: '开户签约',
      width: 1200,
      footer: true,
      okText: '保存',
      onOk: accountSignDetail => {
        accountSignDetail.save()
      },
      onRemove: () => this.refreshOpenAccount(),
      render: h =>
        h(AccountSignDetail, {
          props: {
            rowData: data,
            orderId: data.orderId,
            customerId: data.customerId,
            isView: !(data.orderStatus === this.$enum.OrderCurrentState.OPEN_ACCOUNT)
          }
        })
    })
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

<style lang="less" scoped>
</style>
