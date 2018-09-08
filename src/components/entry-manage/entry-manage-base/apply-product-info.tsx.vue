<!-- 进件 产品信息 -->
<template>
  <section class="component apply-product-info">
    <i-form :model="model" :rules="rules" :label-width="150" inline ref="form">
      <i-form-item prop="orderPrice" label="意向金额(万元)">
        <i-input-number placeholder="请输入意向金额" v-model.lazy="orderPrice" :max="99999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :readonly="isView && !editOrderPrice"></i-input-number>
        <!--
          // 其他解决方案
          display: inline;
          position: relative;
          left: -45px;
          padding-top: 9px;
          padding-bottom: 8px;
          
        <span>万元</span> -->

      </i-form-item>
      <i-form-item prop="orderUseWay" label="融资用途">
        <i-select v-model="model.orderUseWay" clearable :disabled="isView">
          <i-option v-for="{label,value} of $dict.getDictData(10075)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="融资额度(万元)" v-if="getOrderCurrentState >= $enum.OrderCurrentState.MATCH && businessType === $enum.BusinessType.CASH_BACK">
        <i-input :value="orderFinancingPrice" readonly></i-input>
      </i-form-item>
      <i-form-item prop="businessType" label="金融业务类型">
        <i-select v-model="model.businessType" @on-change="onBusinessChange" :disabled="isView" clearable>
          <i-option v-for="{label,value} of businessList" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item prop="schemeName" label="金融产品名称">
        <i-input :value="model.schemeName" placeholder="请选择产品" readonly>
          <i-button icon="search" slot="append" :disabled="!model.businessType || isView" @click="onProductSelectClick"></i-button>
        </i-input>
      </i-form-item>
      <!-- <i-form-item label="资金渠道">
        <i-input :value="product.fundsChannel" readonly></i-input>
      </i-form-item> -->
      <i-form-item label="还款方式">
        <i-input :value="product.repayType | dictConvert" readonly></i-input>
      </i-form-item>
      <i-form-item label="期数">
        <i-input :value="product.periods" readonly></i-input>
      </i-form-item>
      <i-form-item label="月利率">
        <i-input :value="product.interestRate | decimalToPrecent(4)" readonly></i-input>
      </i-form-item>
      <i-card title="费用项" class="expense">
        <a slot="extra" @click="onViewReportClick">
          <i-icon type="ios-list"></i-icon> 查看融资计划
        </a>
        <div v-if="model.expenseList.length === 0" class="no-data-notice">
          暂无数据
        </div>
        <data-box v-else :data="model.expenseList" :height="400" :columns="columns" ref="databox"></data-box>
      </i-card>
    </i-form>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { Form, Select, Option, InputNumber } from "iview";
import ChooseProduct from "~/components/operate-center/choose-product.tsx.vue"
import { productInfo, planData } from "~/interfaces/work.interface";
import { BasicCustomerOrderService } from "~/services/manage-service/basic-customer-order.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import DataBox from "~/components/common/data-box.vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { BusinessType, SubmitType, OrderCurrentState } from "~/config/enum.config";

@Component({
  components: {
  }
})
export default class ApplyProductInfo extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService
  @Dependencies(BasicCustomerOrderService) private basicCustomerOrderService: BasicCustomerOrderService

  @Prop() modelId: number;
  @Watch("modelId")
  private onModelIdChange(val, oldVal) {
    if (val !== oldVal && oldVal != null) {
      this.form.resetFields()
    }
  }

  @Prop({
    required: true
  }) orderInfo: any;

  @Prop({
    required: true
  }) businessType: BusinessType;

  @Prop() isView: boolean;

  @Watch("orderInfo", { immediate: true })
  onOrderInfoChange(val) {
    if (val) this.revertData()
  }

  // 业务列表
  private businessList: any = [];
  private rules: any = null;
  private model: any = null;
  private currentProduct: productInfo = null
  private columns: any[] = null;
  // 费用项验证规则
  private expenseRules: any = null
  private form: Form;

  created() {
    this.model = {
      orderPrice: null,
      orderUseWay: null,
      businessType: null, // 业务类型
      schemeId: null,
      expenseList: [],
      schemeName: ""
    }
    this.rules = {
      orderPrice: [
        { required: true, message: "请输入意向融资金额", trigger: "blur", type: "number" },
        { validator: this.$validator.minus, trigger: "change" },
      ],
      orderUseWay: { required: true, message: "请选择融资用途", trigger: "change", type: "number" },
      businessType: { required: true, message: "请选择业务类型", trigger: "change", type: "number" },
      schemeName: { required: true, message: "请选择产品", trigger: "change" }
    }

    this.expenseRules = {
      repayType: { required: true, message: "请选择支付方式", type: "number" },
      costType: { required: true, message: "请选择费用类型", type: "number" },
      repayMoney: { required: true, message: "请输入实际费用", type: "number" },
      isRefund: { required: true, message: "请选择是否退款", type: "number" }
    }

    this.columns = [
      {
        title: "序号",
        type: "index",
        align: "center",
        width: 60
      },
      {
        title: "费用项名称",
        align: "center",
        minWidth: this.$common.getColumnWidth(2),
        key: "expenseName"
      },
      {
        title: "支付方式",
        align: "center",
        minWidth: this.$common.getColumnWidth(4),
        key: "repayType",
        render: (h, { row, index }) => {
          let changeHandle = (val) => {
            this.model.expenseList[index].repayType = val
            this.model.expenseList[index].costType = null
          }
          return (
            <i-select class="select-mini" value={this.model.expenseList[index].repayType} onOn-change={changeHandle} disabled={this.isView}>
              {
                row.selectRepayType.map(v => {
                  return <i-option label={this.$filter.dictConvert(v)} value={v}></i-option>
                })
              }
            </i-select>
          )
        }
      },
      {
        title: "收取方式",
        align: "center",
        minWidth: this.$common.getColumnWidth(2),
        key: "paymentType",
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.paymentType));
        }
      },
      {
        title: "详细费用",
        align: "center",
        minWidth: this.$common.getColumnWidth(1),
        key: "fixedCost",
        render: (h, { row, column, index }) => {
          return (<div class="col-decimal">{this.$filter.toThousands(row.fixedCost)}</div>)
        }
      },
      {
        title: "费用类型",
        align: "center",
        minWidth: this.$common.getColumnWidth(4),
        key: "costType",
        render: (h, { row, index }) => {
          let disableds: number[] = [];
          if (this.model.expenseList[index].repayType === 10063) {
            disableds.push(10246)
          } else {
            disableds.push(10245, 10247)
          }
          return (
            <i-select class="select-mini" value={this.model.expenseList[index].costType} onOn-change={r => this.model.expenseList[index].costType = r}
              disabled={!this.model.expenseList[index].repayType || this.isView}>
              {
                row.selectCostType.map(v => {
                  return <i-option disabled={disableds.includes(v)} label={this.$filter.dictConvert(v)} value={v}></i-option>
                })
              }
            </i-select>
          )
        }
      },
      {
        title: "实际费用",
        align: "center",
        minWidth: this.$common.getColumnWidth(4),
        key: "repayMoney",
        render: (h, { row, column, index }) => {
          return <i-input-number style="width:120px" placeholder="请输入实际费用" value={row.repayMoney}
            min={0} max={99999999} disabled={this.isView || row.paymentType === 10242}
            onOn-change={val => row.repayMoney = val}
            formatter={this.$filter.moneyFormat} parser={this.$filter.moneyParse}></i-input-number>
        }
      },
      {
        title: "是否退款",
        align: "center",
        minWidth: this.$common.getColumnWidth(2),
        key: "isRefund",
        render: (h, { row, index }) => (<span>{this.$filter.dictConvert(row.isRefund)}</span>)
      }
    ];
  }

  mounted() {
    this.form = this.$refs.form
    this.getProductBusiness()
  }

  /**
   * 反显数据
   */
  private revertData() {
    this.model.schemeName = this.orderInfo.schemeName
    this.model.orderUseWay = this.orderInfo.orderUseWay
    this.model.orderPrice = this.orderInfo.orderPrice
    this.model.businessType = this.orderInfo.businessId
    // 产品接口变量数据还原
    this.$nextTick(() => {
      this.model.schemeId = this.orderInfo.schemeId
      this.currentProduct = {
        id: this.orderInfo.schemeId,
        schemeName: this.orderInfo.schemeName,
        fundsChannel: this.orderInfo.fundsChannelName,
        repayType: this.orderInfo.orderRepayType,
        periods: this.orderInfo.orderPeriods,
        interestRate: this.orderInfo.orderInterestRate
      }
      this.revertExpense(this.orderInfo.id)
    })
  }

  /**
   * 反显费用项
   */
  private revertExpense(orderId: number) {
    this.basicCustomerOrderService.findOrderSchemeExpanseList(orderId).subscribe(
      data => {
        let tmpData = data.map(v => {
          v.selectCostType = v.selectCostType || []
          v.selectRepayType = v.selectRepayType || []
          return v
        })
        this.model.expenseList = tmpData
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 业务发生变化，清除产品信息
   */
  private onBusinessChange(val) {
    this.model.schemeId = null;
    this.model.expenseList = []
    this.currentProduct = null;
  }

  /**
   * 产品选择变更
   */
  private onProductSelectClick() {
    if (!this.modelId) {
      this.$Message.info("请先选择车型")
      return
    }
    this.$dialog.show({
      title: "选择产品",
      footer: true,
      onOk: (chooseProduct: ChooseProduct) => {
        // 配置选中行的产品信息
        if (chooseProduct.productInfo) {
          this.currentProduct = chooseProduct.productInfo
          this.model.schemeId = chooseProduct.productInfo.id
          this.model.schemeName = chooseProduct.productInfo.schemeName
          // 根据产品查询产品需要输入的费用项
          this.repaySchemeService.findInputSchemeExpenseBySchemeId(this.model.schemeId)
            .subscribe(
              data => {
                let tmpData = data.map(v => Object.assign({ repayMoney: v.fixedCost }, v))
                tmpData.forEach(v => {
                  if (v.selectRepayType && v.selectRepayType.length === 1) v.repayType = v.selectRepayType[0]
                  if (v.selectCostType && v.selectCostType.length === 1) v.costType = v.selectCostType[0]
                })
                this.model.expenseList = tmpData
              },
              err => this.$Message.error(err.msg)
            )
        }
      },
      render: h => <ChooseProduct businessId={this.model.businessType} modelId={this.modelId} schemeId={this.model.schemeId}></ChooseProduct>
    })
  }

  /**
   * 意向金额是否可以编辑
   */
  get editOrderPrice() {
    // 如果是开户签约状态 并且是现金贷回租，则可以编辑意向金额
    return this.orderInfo && this.orderInfo.orderStatus === OrderCurrentState.OPEN_ACCOUNT
      && this.orderInfo.businessType === BusinessType.CASH_BACK
  }

  /**
   * 适用于订单信息反显
   * 适用于产品变更后获取产品基本信息
   */
  private get product(): any {
    return this.currentProduct || {}
  }

  /**
   * 获取产品系列列表
   */
  private getProductBusiness() {
    this.repaySchemeService.findByBusinessType(this.businessType).subscribe(
      data => this.businessList = data.map(v => ({ label: v.businessName, value: v.id })),
      err => this.$Message.error(err.msg)
    )
  }

  private validateExpense() {
    return Promise.all(this.model.expenseList.map(v => this.$validator.validate(v, this.expenseRules)))
      .then((results: any[]) => {
        let errResult = results.some((message, index) => {
          if (message) {
            this.$Message.error(`第${index + 1}行,${message}`)
            return true
          } else {
            return false
          }
        })
        return !errResult
      }).catch(() => { })
  }

  /**
   * 获取DataBox内部数据
   */
  private getDataBoxInnerData() {
    let dataBox = this.$refs.databox as DataBox;
    if (!dataBox) return
    let tmpData = (dataBox.table || {}).rebuildData || []
    tmpData.forEach((v, index) => {
      this.model.expenseList[index].repayMoney = v.repayMoney
    })
  }

  /**
  * 验证表单信息
  * 成功返回form数据
  */
  submit(type: SubmitType) {
    this.getDataBoxInnerData()
    if (type === SubmitType.Save) {
      return Promise.resolve(this.model)
    }
    let productBase = this.$refs.form as Form;
    return new Promise((resolve, reject) => {
      productBase.validate(v => {
        if (v) {
          this.validateExpense().then(result => {
            return result ? resolve(this.model) : reject()
          }).catch()
        } else {
          this.$Message.error("产品信息验证失败")
          return reject()
        }
      })
    });
  }

  /**
   * 点击查看融资计划
   */
  private onViewReportClick() {
    this.submit(SubmitType.Submit).then((data: any) => {
      this.queryPlan(data.expenseList)
    }).catch()
  }

  /**
   * 请求融资计划数据
   */
  private queryPlan(expenseList: any[]) {
    let expenseDataList = expenseList.map(v => {
      delete v.id
      delete v.schemeMoney
      delete v.selectCostType
      delete v.selectRepayType
      delete v.repayProportion
      delete v.orderId
      return v
    })
    this.basicCustomerOrderService.findFinancingPlan(expenseDataList, this.model.schemeId, this.model.orderPrice)
      .subscribe(
        data => this.showPlan(data),
        err => this.$Message.error(err.msg)
      )
  }

  private showPlan(data: planData) {
    this.$dialog.show({
      title: "参考融资方案",
      footer: true,
      isView: true,
      height: 200,
      render: h => (
        <DataGrid labelWidth={120} labelAlign="right" contentAlign="left">
          <DataGridItem label="订单总额：" span={4}>{this.$filter.toThousands(data.orderPay)}</DataGridItem>
          <DataGridItem label="首付金额：" span={4}>{this.$filter.toThousands(data.firstPay)}</DataGridItem>
          <DataGridItem label="融资金额：" span={4}>{this.$filter.toThousands(data.financingPay)}</DataGridItem>
          <DataGridItem label="利息金额：" span={4}>{this.$filter.toThousands(data.interestPay)}</DataGridItem>
          <DataGridItem label="期数：" span={4}>{data.periods}</DataGridItem>
          <DataGridItem label="首月还款：" span={4}>{this.$filter.toThousands(data.monthPay)}</DataGridItem>
        </DataGrid>
      )
    })
  }

  private get getOrderCurrentState() {
    let val = -1
    if (this.orderInfo) {
      val = this.orderInfo.orderStatus
    }
    return val
  }

  private get orderPrice() {
    return this.$common.divideByTenThousands(this.model.orderPrice)
  }
  private set orderPrice(val) {
    this.model.orderPrice = this.$common.multiplyByTenThousands(val)
  }

  private get orderFinancingPrice() {
    return this.$common.divideByTenThousands(this.orderInfo.orderFinancingPrice)
  }

}
</script>

<style lang="less">
.component.apply-product-info {
  .expense {
    .ivu-card-body {
      padding: 0 0;
    }
    @width: 150px;
    .select-mini {
      width: @width;
      .ivu-select-selection {
        width: @width;
      }
    }
  }
}
</style>
