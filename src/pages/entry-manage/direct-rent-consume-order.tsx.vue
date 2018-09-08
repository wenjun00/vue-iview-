<!--直租消费贷订单-->
<template>
  <section class="page direct-rent-consume-order">
    <page-header title="直租消费贷订单" hiddenPrint hiddenExport>
      <command-button label="新车进件申请" v-auth="608" @click="() => this.newCarApplyClick(null)"></command-button>
      <command-button label="二手车进件申请" v-auth="609" @click="() => this.oldCarApplyClick(null)"></command-button>
    </page-header>
    <data-form :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item prop="orderNo" label="订单号：">
          <i-input placeholder="请输入订单号" v-model="model.orderNo" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号：">
          <i-input v-model="model.idCard" clearable placeholder="请输入身份证号" :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="orderStatus" label="订单状态：">
          <i-select v-model="model.orderStatus" clearable placeholder="请选择订单状态">
            <i-option v-for="{label,value} of $dict.getDictData(10032)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" ref="databox" :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from '~/core/page'
import { Layout, Dependencies } from '~/core/decorator'
import Component from "vue-class-component";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { PageService } from "~/utils/page.service.ts";
import { Button } from "iview";
import DirectRentConsumeOrderNew from "~/components/entry-manage/direct-rent-consume-order-new.tsx.vue";
import DirectRentConsumeOrderOld from "~/components/entry-manage/direct-rent-consume-order-old.tsx.vue";
import { OrderCarType, BusinessType } from "~/config/enum.config";
import { orderOpeater } from "~/config/work-flow.config";
import { namespace } from "vuex-class";

const CustomerOrderModule = namespace("customerOrderSpace");

@Layout('workspace')
@Component({
  components: {
  }
})
export default class DirectRentConsumeOrder extends Page {
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService;
  @Dependencies(PageService) private pageService: PageService;
  @CustomerOrderModule.Action showCustomerInfo;

  private model: any = null;
  private dataSet: any[] = [];
  private columns: any[] = null;
  private businessType = BusinessType.CONSUME_DIRECT;

  created() {
    this.model = {
      orderNo: "",
      idCard: "",
      orderStatus: ""
    }
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = []
          if (orderOpeater.submit.status.includes(row.orderStatus)) {
            // buttons.push(<i-button type="text" class="row-command-button" v-auth={610} onClick={() => this.onDeleteClick(row.id)}>删除</i-button>)
            buttons.push(<i-button type="text" class="row-command-button" v-auth={611} onClick={() => this.onEditClick(row.id, row.orderCarType)}>编辑</i-button>)
          }
          return h('div', buttons)
        }
      },
      {
        align: "center",
        title: "订单号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(6),
        render: (h, { row }) => {
          return <i-button type="text" class="row-command-button" onClick={() => this.onViewOrderClick(row.id, row.orderCarType)}>{row.orderNo}</i-button>
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
        minWidth: this.$common.getColumnWidth(4),
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
        title: "车辆类型",
        key: "orderCarType",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<span>{this.$filter.dictConvert(row.orderCarType)}</span>)
      },
      {
        align: "center",
        title: "还款方式",
        key: "orderRepayType",
        minWidth: this.$common.getColumnWidth(4),
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
      }
    ]

  }

  activated() {
    this.refreshData()
  }

  mounted() {
    this.refreshData()
  }

  // 刷新页面数据
  private refreshData() {
    this.basicCustomerOrderService.queryOrderConsumeDirectPage(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 新车申请单新建/修改
   * 如果不传orderId 则为新建订单
   */
  private newCarApplyClick(orderId: number) {
    this.$dialog.show({
      title: "直租(消费贷--新车)申请",
      footer: true,
      width: 1200,
      okText: "保存",
      onOk: (newCarApply: DirectRentConsumeOrderNew) => {
        return newCarApply.save().then(v => v)
      },
      onRemove: this.refreshData,
      render: h => <DirectRentConsumeOrderNew businessType={this.businessType} orderId={orderId}></DirectRentConsumeOrderNew>
    })
  }

  /**
   * 订单查看
   */
  private onViewOrderClick(orderId: number, orderCarType: number) {
    if (orderCarType === OrderCarType.NEW) {
      this.$dialog.show({
        title: "直租(消费贷--新车)订单查看",
        footer: true,
        isView: true,
        width: 1200,
        render: h => <DirectRentConsumeOrderNew businessType={this.businessType} orderId={orderId} isView={true}></DirectRentConsumeOrderNew>
      })
    } else {
      this.$dialog.show({
        title: "直租(消费贷--二手车)订单查看",
        footer: true,
        isView: true,
        width: 1200,
        render: h => <DirectRentConsumeOrderOld businessType={this.businessType} orderId={orderId} isView={true}></DirectRentConsumeOrderOld>
      })
    }
  }

  /**
   * 订单编辑
   */
  private onEditClick(orderId: number, orderCarType: number) {
    if (orderCarType === OrderCarType.NEW) {
      this.newCarApplyClick(orderId)
    } else if (orderCarType === OrderCarType.OLD) {
      this.oldCarApplyClick(orderId)
    }
  }

  private oldCarApplyClick(orderId: number) {
    this.$dialog.show({
      title: "直租(消费贷--二手车)申请",
      footer: true,
      width: 1200,
      okText: "保存",
      onOk: (newCarApply: DirectRentConsumeOrderOld) => {
        return newCarApply.save().then(v => v)
      },
      onRemove: this.refreshData,
      render: h => <DirectRentConsumeOrderOld businessType={this.businessType} orderId={orderId}></DirectRentConsumeOrderOld>
    })
  }

  // 删除
  private onDeleteClick(orderId: number) {
    this.$Modal.confirm({
      title: '提示',
      content: `确定删除该订单吗？`,
      onOk: () => {
        this.basicCustomerOrderService.deleteOrder(orderId).subscribe(
          data => {
            this.$Message.success("操作成功")
            this.refreshData()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
  }

}
</script>


<style lang="less" scoped>
</style>
