<template>
  <section class="page direct-rent-consume-order-approval">
    <page-header title="直租消费贷" hiddenPrint hiddenExport>
    </page-header>
    <data-form hidden-date-search :model="queryParamsModel" @on-search="refreshData">
      <template slot="input">
        <i-form-item prop="customerName" label="客户姓名：">
          <i-input placeholder="请输入客户姓名" v-model="queryParamsModel.customerName" :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号：">
          <i-input placeholder="请输入身份证号" v-model="queryParamsModel.idCard" :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="customerPhone" label="电话号码：">
          <i-input placeholder="请输入电话号码" v-model="queryParamsModel.customerPhone" :maxlength="11"></i-input>
        </i-form-item>
        <i-form-item prop="orderNo" label="订单号：">
          <i-input placeholder="请输入订单号" v-model="queryParamsModel.orderNo" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="orderStatus" label="订单状态：">
          <i-select v-model="queryParamsModel.orderStatus" clearable placeholder="请选择订单状态">
            <i-option v-for="{label,value} of $dict.getDictData(10032)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" @on-page-change="refreshData" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { Layout } from "~/core/decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicCustomerOrderApprove } from "~/services/manage-service/basic-customer-order-approve.service";
import { OrderCarType, BusinessType } from "~/config/enum.config";
import NewCar from "~/components/risk-manage/order-check/new-car.tsx.vue";
import OldCar from "~/components/risk-manage/order-check/old-car.tsx.vue";
import { Button } from "iview";

const CustomerOrderModule = namespace("customerOrderSpace");
@Layout("workspace")
@Component({
  components: {}
})
export default class DirectRentConsumeOrderApproval extends Page {
  @Dependencies(BasicCustomerOrderApprove) private basicCustomerOrderApprove: BasicCustomerOrderApprove;
  @Dependencies(PageService) private pageService: PageService;
  @CustomerOrderModule.Action showCustomerInfo;

  private straightRentConsumerDebt: any = {
    moneyType: "消费贷",
    functionType: "直租",
    value: 10235
  }
  private columns: any = null;
  private dataSet: Array<any> = [];

  queryParamsModel: any = {
    orderType: 10235,
    customerName: "",
    idCard: "",
    customerPhone: "",
    orderNo: "",
    orderStatus: ""
  };

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          return <i-button type="text" class="row-command-button" v-auth={547} onClick={() => this.onApprovalClick(row.id, row.orderCarType, row.businessType)}>审核</i-button>
        }
      },
      {
        align: "center",
        title: "订单号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(6),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.onApprovalClick(row.id, row.orderCarType, row.businessType, true)}>{row.orderNo}</i-button>
        }
      },
      {
        align: "center",
        title: "订单状态",
        key: "orderStatus",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderStatus)}</span>)
      },
      {
        align: "center",
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => <i-button type="text" class="row-command-button" onClick={() => this.showCustomerInfo({ id: row.customerId })}>{row.customerName}</i-button>
      },
      {
        align: "center",
        title: "身份证号",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        align: "center",
        title: "客户电话",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      // {
      //   align: "center",
      //   title: "资金渠道",
      //   key: "fundsChannelName",
      //   minWidth: this.$common.getColumnWidth(4),
      // },
      {
        align: "center",
        title: "金融产品系列",
        key: "businessName",
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        align: "center",
        title: "金融产品名称",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        align: "center",
        title: "还款方式",
        key: "orderRepayType",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderRepayType)}</span>)
      },
      {
        align: "center",
        title: "订单总额",
        key: "totalMoney",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.totalMoney)}</div>)
      },
      {
        align: "center",
        title: "所属门店",
        key: "storeName",
        minWidth: this.$common.getColumnWidth(4),
      },
      {
        align: "center",
        title: "业务员姓名",
        key: "employeeName",
        minWidth: this.$common.getColumnWidth(3),
      },
      {
        align: "center",
        title: "订单环节",
        key: "workFlowLinkName",
        minWidth: this.$common.getColumnWidth(3),
      }
    ]
  }

  mounted() {
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

  /**
   * 刷新列表
   */
  refreshData() {
    this.basicCustomerOrderApprove.queryWaitApproval(this.queryParamsModel, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  private onApprovalClick(orderId: number, carType: number, businessType: number, viewFlag = false) {
    if (carType === OrderCarType.NEW) {
      this.$dialog.show({
        title: `${this.straightRentConsumerDebt.functionType}(${this.straightRentConsumerDebt.moneyType}--新车)订单${viewFlag ? '查看' : '审核'}`,
        footer: true,
        isView: true,
        width: 1200,
        onRemove: this.refreshData,
        render: h => <NewCar businessType={businessType} orderId={orderId} isView={viewFlag}></NewCar>
      })
    } else {
      this.$dialog.show({
        title: `${this.straightRentConsumerDebt.functionType}(${this.straightRentConsumerDebt.moneyType}--二手车)订单${viewFlag ? '查看' : '审核'}`,
        footer: true,
        isView: true,
        width: 1200,
        onRemove: this.refreshData,
        render: h => <OldCar businessType={businessType} orderId={orderId} isView={viewFlag}></OldCar>
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
