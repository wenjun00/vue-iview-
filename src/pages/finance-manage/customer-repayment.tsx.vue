<!--客户还款-->
<template>
  <section class="page proceeds-for-customer">
    <page-header title="还租金" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item prop="name" label="姓名">
          <i-input v-model="model.name" placeholder="请输入客户姓名" :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="orderNo" label="订单号">
          <i-input v-model="model.orderNo" placeholder="请输入订单号" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号">
          <i-input v-model="model.idCard" placeholder="请输入身份证号" :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="phone" label="联系电话">
          <i-input v-model="model.phone" placeholder="请输入联系电话" :maxlength="11"></i-input>
        </i-form-item>
        <i-form-item prop="orderStatus" label="订单状态">
          <i-select v-model="model.orderStatus" clearable placeholder="请选择订单状态">
            <i-option v-for="{label,value} of orderStatus" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="orderType" label="业务类型">
          <i-select v-model="model.orderType" clearable placeholder="请选择业务类型">
            <i-option v-for="{label,value} of $dict.getDictData(10063)" :key="value" :label="label" :value="value"></i-option>
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
import CustomerRepaymentCurrentPeriod from "~/components/finance-manage/customer-repayment-current-period.tsx.vue";
import CustomerRepaymentDetails from "~/components/finance-manage/customer-repayment-details.tsx.vue";
import RepayRecord from "~/components/finance-manage/repay-record.tsx.vue";
import { Button } from "iview";
import { namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { Layout, Dependencies } from '~/core/decorator'
import { FinancialManagementService } from "~/services/manage-service/financial-management.service";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout('workspace')
@Component({
  components: {
  }
})
export default class CustomerRepayment extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;

  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  private model: any = {
    name: "",
    orderNo: "",
    idCard: "",
    phone: "",
    orderStatus: "",
    orderType: ""
  };

  private columns: Array<any> = [];
  private dataSet: Array<any> = [];
  private orderStatus: Array<any> = [
    {
      label: '还款中',
      value: 10256
    },
    {
      label: '已逾期',
      value: 10257
    }
  ];

  created() {
    this.columns = [
      {
        title: '操作',
        fixed: 'left',
        align: 'center',
        width: this.$common.getOperateWidth(3),
        render: (h, { row }) => (
          <div>
            <i-button type="text" v-auth={630} class="row-command-button" onClick={() => this.onRepaymentClick(row)}>还租金</i-button>
            <i-button type="text" v-auth={631} class="row-command-button" onClick={() => this.onPaymenyDetailClick(row.id)}>租金方案</i-button>
            <i-button type="text" v-auth={632} class="row-command-button" onClick={() => this.onRepayRecordClick(row.id, row.orderPeriods)}>还款记录</i-button>
          </div>
        )
      },
      {
        align: 'center',
        title: '订单号',
        key: 'orderNo',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showOrderInfo({ id: row.id, orderType: row.orderType })}>{row.orderNo}</i-button>)
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
        key: 'businessType',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.businessType)}</span>)
      },
      {
        align: 'center',
        title: '还款状态',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{row.orderNowPeriod}/{row.orderPeriods}</span>)
      },
      {
        align: 'center',
        title: '金融产品',
        key: 'schemeName',
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: 'center',
        title: '订单金额',
        key: 'orderPrice',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.orderPrice)}</div>)
      },
      {
        align: 'center',
        title: '未还金额',
        key: 'remainRepayment',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.orderPrice - row.isRepayMoney)}</div>)
      },
      {
        align: 'center',
        title: '客户姓名',
        key: 'customerName',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showCustomerInfo({ id: row.customerId })}>{row.customerName}</i-button>)
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

  /**
   * 点击租金方案
   */
  private onPaymenyDetailClick(orderId: Number) {
    this.$dialog.show({
      title: "租金方案",
      footer: true,
      isView: true,
      width: 1200,
      render: h => (<CustomerRepaymentDetails orderId={orderId}></CustomerRepaymentDetails>)
    })
  }

  /**
   * 点击还款记录
   */
  private onRepayRecordClick(orderId, orderPeriods) {
    this.$dialog.show({
      title:"还款记录",
      width:700,
      render: h => <RepayRecord orderId={orderId} orderPeriods={orderPeriods}></RepayRecord>
    })
  }

  /**
   * 还款操作
   * @param orderId 订单号
   * @param period 还款期数
   */
  private onRepaymentClick(row) {
    let data = {
      customerId: row.customerId,
      customerName: row.customerName,
      orderNumber: row.orderNo,
      orderId: row.id,
      orderPeriods: row.orderPeriods,
      orderType: row.orderType,
    }
    this.$dialog.show({
      title: "还租金",
      width: 700,
      footer: true,
      onOk: payment => {
        return payment.submit().then(v => {
          if (v) this.refreshData()
          return v
        })
      },
      render: h => (<CustomerRepaymentCurrentPeriod orderInfo={data}></CustomerRepaymentCurrentPeriod>)
    })
  }

  private refreshData() {
    this.financialManagementService.queryPendingRepay(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }
}
</script>


<style lang="less" scoped>
</style>
