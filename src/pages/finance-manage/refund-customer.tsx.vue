<template>
  <section class="page refund-customer">
    <page-header title="退款" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="queryParamsModel" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item prop="name" label="姓名">
          <i-input v-model="queryParamsModel.name" placeholder="请输入客户姓名" :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="orderNo" label="订单号">
          <i-input v-model="queryParamsModel.orderNo" placeholder="请输入订单号" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号">
          <i-input v-model="queryParamsModel.idCard" placeholder="请输入身份证号" :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="phone" label="联系电话">
          <i-input v-model="queryParamsModel.phone" placeholder="请输入联系电话" :maxlength="11"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" @on-page-change="refreshData" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import Component from "vue-class-component";
import RefundDetail from "~/components/finance-manage/refund-detail.tsx.vue";
import { namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { Form, Button } from "iview";
import { Layout, Dependencies } from "~/core/decorator";
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";

const CustomerOrderModule = namespace("customerOrderSpace");

@Layout("workspace")
@Component({
  components: {}
})
export default class RefundCustomer extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;

  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  private queryParamsModel: any = {
    name: "",
    orderNo: "",
    idCard: "",
    phone: ""
  };

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];

  created() {
    this.columns = [
      {
        title: "操作",
        fixed: "left",
        align: "center",
        width: this.$common.getOperateWidth(1),
        render: (h, { row, column, index }) => (<i-button type="text" v-auth={633} class="row-command-button" onClick={() => this.onSubmitClick(row)}>退款</i-button>)
      },
      {
        align: "center",
        title: "订单号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showOrderInfo({id: row.id, orderType: row.orderType})}>{row.orderNo}</i-button>)
      },
      {
        align: "center",
        title: "订单状态",
        key: "orderStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderStatus)}</span>)
      },
      {
        align: "center",
        title: "业务类型",
        key: "businessType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.businessType)}</span>)
      },
      {
        align: "center",
        title: "订单期数",
        key: "orderPeriods",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "金融产品",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "退款金额",
        key: "refundMoney",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.refundMoney)}</div>)
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
        title: "联系电话",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "身份证号",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(4)
      }
    ];
  }

  activated() {
    this.refreshData();
  }

  mounted() {
    this.refreshData();
  }

  /**
   * 退款操作
   */
  private onSubmitClick(rowData) {
    this.$dialog.show({
      title: "退款",
      footer: true,
      width: 700,
      onOk: refundCustomer => {
        return refundCustomer.submit().then(v => {
          if (v) this.refreshData();
          return v;
        });
      },
      render: h => <RefundDetail orderInfo={rowData}></RefundDetail>
    });
  }

  private refreshData() {
    this.financialManagementService
      .queryFinancialRefundOrder(this.queryParamsModel, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }
}
</script>

<style lang="less" scoped>
</style>
