<template>
  <section class="page query-order-list">
    <page-header title="订单查询" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item prop="customerName" label="姓名">
          <i-input v-model="model.customerName" placeholder="请输入客户姓名" clearable :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="orderNo" label="订单号">
          <i-input v-model="model.orderNo" placeholder="请输入订单号" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号">
          <i-input v-model="model.idCard" placeholder="请输入身份证号" clearable :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="customerPhone" label="联系电话">
          <i-input v-model="model.customerPhone" placeholder="请输入联系电话" clearable :maxlength="11"></i-input>
        </i-form-item>
        <i-form-item prop="orderStatus" label="订单状态">
          <i-select v-model="model.orderStatus" clearable>
            <i-option v-for="{label,value} of $dict.getDictData(10032)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" @on-page-change="refreshData" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from '~/core/page'
import Component from "vue-class-component";
import { Button } from "iview";
import { namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { Layout, Dependencies } from '~/core/decorator'
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import OrderAllInfoBoxNew from "~/components/car-matching/order-all-info-box-new.vue";
import OrderAllInfoBoxOld from "~/components/car-matching/order-all-info-box-old.vue";
import { OrderCarType } from "~/config/enum.config";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout('workspace')
@Component({
  components: {
    OrderAllInfoBoxNew,
    OrderAllInfoBoxOld
  }
})
export default class QueryOrderList extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;

  @CustomerOrderModule.Action showOrderInfo;

  private model: any = {
    customerName: "",
    orderNo: "",
    idCard: "",
    customerPhone: "",
    orderStatus: ""
  };

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];

  created() {
    this.columns = [
      {
        align: 'center',
        title: '订单号',
        key: 'orderNo',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.showOrderInfo({id: row.id, orderType: row.orderType})}>{row.orderNo}</i-button>
        }
      },
      {
        align: 'center',
        title: '客户姓名',
        key: 'customerName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '订单状态',
        key: 'orderStatus',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderStatus)}</span>)
      },
      {
        align: 'center',
        title: '业务类型',
        key: 'orderType',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderType)}</span>)
      },
      {
        align: 'center',
        title: '产品名称',
        key: 'schemeName',
        minWidth: this.$common.getColumnWidth(4)
      },
      // {
      //   align: 'center',
      //   title: '资金渠道',
      //   key: 'fundsChannelName',
      //   minWidth: this.$common.getColumnWidth(4)
      // },
      {
        align: 'center',
        title: '还款方式',
        key: 'orderRepayType',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderRepayType)}</span>)
      },
      {
        align: 'center',
        title: '订单总额',
        key: 'orderPrice',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.orderPrice)}</div>)
      },
      {
        align: 'center',
        title: '首付金额',
        key: 'firstMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.firstMoney)}</div>)
      },
      {
        align: 'center',
        title: '所属门店',
        key: 'storeName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '归属业务员',
        key: 'customerName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '联系电话',
        key: 'customerPhone',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '身份证号',
        key: 'idCard',
        minWidth: this.$common.getColumnWidth(4)
      }
    ]
  }

  activated() {
    this.refreshData()
  }

  mounted() {
    this.refreshData()
  }

  private refreshData() {
    this.basicCustomerOrderService.queryOrder(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

}
</script>


<style lang="less" scoped>
</style>
