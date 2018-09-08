<template>
  <section class="page proceeds-customer">
    <page-header title="收款" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item prop="name" label="姓名">
          <i-input v-model="model.name" placeholder="请输入客户姓名" :maxlength="20" clearable></i-input>
        </i-form-item>
        <i-form-item prop="orderNo" label="订单号">
          <i-input v-model="model.orderNo" placeholder="请输入订单号" :maxlength="50" clearable></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号">
          <i-input v-model="model.idCard" placeholder="请输入身份证号" :maxlength="18" clearable></i-input>
        </i-form-item>
        <i-form-item prop="phone" label="联系电话">
          <i-input v-model="model.phone" placeholder="请输入联系电话" :maxlength="11" clearable></i-input>
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
import ProceedsCustomerInfo from "~/components/finance-manage/proceeds-customer-info.vue";
import ProceedRecord from "~/components/finance-manage/proceed-record.tsx.vue";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout('workspace')
@Component({
  components: {}
})
export default class ProceedsCustomer extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(FinancialManagementService) private financialManagementService: FinancialManagementService;

  @CustomerOrderModule.Action showOrderInfo;
  @CustomerOrderModule.Action showCustomerInfo;

  private model: any = {
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
        title: '操作',
        fixed: 'left',
        align: 'center',
        width: this.$common.getOperateWidth(2),
        render: (h, { row }) => (
          <div>
            <i-button type="text" v-auth={628} class="row-command-button" onClick={() => this.onProceedClick(row)}>收款</i-button>
            <i-button type="text" v-auth={629} class="row-command-button" onClick={() => this.onProceedRecordClick(row)}>收款记录</i-button>
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
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.orderStatus)}</span>)
      },
      {
        align: 'center',
        title: '业务类型',
        key: 'businessType',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.businessType)}</span>)
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
        title: '已收金额',
        key: 'isFirstMoney',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div class="col-decimal">{this.$filter.toThousands(row.isFirstMoney)}</div>)
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
   * 收款点击
   */
  private onProceedClick(rowData) {
    let data = {
      orderId: rowData.id,
      orderNumber: rowData.orderNo,
      customerId: rowData.customerId,
      customerName: rowData.customerName,
      orderType: rowData.orderType
    }
    this.$dialog.show({
      title: "收款",
      footer: true,
      width: 700,
      onOk: proceed => {
        return proceed.submit().then(v => {
          if (v) this.refreshData()
          return v
        })
      },
      render: h => (<ProceedsCustomerInfo orderInfo={data}></ProceedsCustomerInfo>)
    })
  }

  /**
   * 收款记录点击
   */
  private onProceedRecordClick(rowData) {
    this.$dialog.show({
      title: "收款记录",
      width: 700,
      render: h => <ProceedRecord orderId={rowData.id}></ProceedRecord>
    })
  }

  private refreshData() {
    this.financialManagementService.queryPendingPayment(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }


}
</script>


<style lang="less" scoped>
</style>
