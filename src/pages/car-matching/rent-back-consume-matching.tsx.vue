<!--回租消费贷车辆匹配-->
<template>
  <section class="page rent-back-consume-matching">
    <page-header title="回租消费贷" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshData">
      <template slot="input">
        <i-form-item prop="orderNo" label="订单号：">
          <i-input placeholder="请输入订单号" v-model="model.orderNo" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号：">
          <i-input placeholder="请输入身份证号" v-model="model.idCard" clearable :maxlength="18"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" highlightRow :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>
<script lang="tsx">
import Page from "~/core/page"
import Component from "vue-class-component"
import { Dependencies } from "~/core/decorator"
import { Layout } from "~/core/decorator"
import { namespace } from "vuex-class"
import { PageService } from '~/utils/page.service'
import { Button } from "iview"
import { BasicOrderComplianceService } from "~/services/manage-service/basic-order-compliance.service.ts"
import MatchingCarDetail from "~/components/car-matching/matching-car-detail.tsx.vue"
import { BusinessType } from "~/config/enum.config";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout("workspace")
@Component({
  components: {
  }
})
export default class RentBackConsumeMatching extends Page {
  @Dependencies(PageService) private pageService: PageService
  @Dependencies(BasicOrderComplianceService) private basicOrderComplianceService: BasicOrderComplianceService
  @CustomerOrderModule.Action showCustomerInfo;

  private columns: Array<any> = null;
  private dataSet: Array<any> = [];
  private model = {
    orderNo: '', // 订单号
    idCard: '' // 身份证号
  }

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          return (<div>
            <i-button type="text" class="row-command-button" v-auth={552} onClick={() => this.checkOrderInfo(row)}>{row.orderStatus === this.$enum.OrderCurrentState.MATCH ? '车辆匹配' : '查看'}</i-button>
          </div>)
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
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.businessType)}</div>)
      },
      {
        align: "center",
        title: "金融产品名称",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "还款方式",
        key: "orderRepayType",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.orderRepayType)}</div>)
      },
      {
        align: "center",
        title: "订单状态",
        key: "orderStatus",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.orderStatus)}</div>)
      }
    ]
  }

  mounted() {
    this.refreshData();
  }
  activated() {
    this.refreshData();
  }
  /**
   * 获取回租消费贷订单列表
   */
  refreshData() {
    this.basicOrderComplianceService.queryOrderLeaseBackList(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }
  /**
   * 查看订单
   */
  private checkOrderInfo(data) {
    this.$dialog.show({
      title: '车辆匹配',
      width: 1200,
      onRemove: () => this.refreshData(),
      render: h => h(MatchingCarDetail, {
        props: {
          rowData: data,
          orderId: data.orderId,
          isView: data.orderStatus === this.$enum.OrderCurrentState.MATCH,
          businessType: BusinessType.CONSUME_BACK
        }
      })
    })
  }

}
</script>

<style lang="less" scoped>
</style>