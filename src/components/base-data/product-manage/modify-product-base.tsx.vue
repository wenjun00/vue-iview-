<!-- 产品维护 -->
<template>
  <section class="component modify-product-base">
    <i-form :label-width="110" :model="model" ref="add-modify-product-form" :rules="rules" inline>
      <i-form-item label="产品名称" prop="schemeName">
        <i-input v-model="model.schemeName" placeholder="请输入产品名称" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="审核流程" prop="workFlowKey">
        <i-select v-model="model.workFlowKey">
          <i-option v-for="{label,value} of $dict.getDictData(10038)" :key="value" :label="label" :value="label"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="还款方式" prop="repayType">
        <i-select v-model="model.repayType">
          <i-option v-for="{label,value} of $dict.getDictData(10016)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="冲抵策略" prop="offsetId">
        <i-select v-model="model.offsetId">
          <i-option v-for="{label,value} of offsetDataList" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="逾期宽限天数" prop="overdueDays">
        <i-input-number v-model="model.overdueDays" :min="0" :max="99999" placeholder="请输入逾期宽限天数"></i-input-number>
      </i-form-item>
      <i-form-item label="月利率" prop="_interestRate">
        <i-input-number v-model="model._interestRate" placeholder="请输入月利率" :min="0" :max="100" :formatter="$filter.percentFormat" :parser="$filter.percentParse"></i-input-number>
      </i-form-item>
      <i-form-item label="期数类型" prop="cycleType">
        <i-select v-model="model.cycleType">
          <i-option v-for="{label,value} of $dict.getDictData(10019)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="期数" prop="periods">
        <i-input-number v-model="model.periods" :min="0" :max="99" placeholder="请输入期数"></i-input-number>
      </i-form-item>
      <i-form-item label="还款日类型" prop="accountPeriodType">
        <i-select v-model="model.accountPeriodType">
          <i-option v-for="{label,value} of $dict.getDictData(10020)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <!--不等于固定还款日-->
      <i-form-item v-if="model.accountPeriodType !== 10060" label="还款日" prop="accountDay" :rules="{ required: true, message: `请输入还款日`, trigger: `blur`, type: `number` }">
        <i-select v-model="model.accountDay">
          <i-option v-for="day of 28" :key="day" :label="day" :value="day"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="融资最小金额" prop="moneyMin">
        <i-input-number v-model="model.moneyMin" :min="0" :max="model.moneyMax || 99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="融资最大金额" prop="moneyMax">
        <i-input-number v-model="model.moneyMax" :min="model.moneyMin || 0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="资金渠道" prop="channelId">
        <i-input value="选择资金渠道" readonly>
          <i-button icon="search" slot="append" @click="onChannelSelectClick"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="首付比例" prop="_downPayment">
        <i-input-number v-model="model._downPayment" placeholder="请输入首付比例" :min="0" :max="100" :formatter="$filter.percentFormat" :parser="$filter.percentParse"></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { Form } from "iview";
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service';
import { BasicOffsetService } from "~/services/manage-service/basic-offset.service";
import { BasicFundsChannelService } from "~/services/manage-service/basic-funds-channel.service";
import { ProdSchemeDetailType } from "~/config/enum.config";
import NumberRange from "~/components/common/number-range.vue";
import SelectFundChannel from "~/components/base-data/product-manage/select-fund-channel.tsx.vue";

@Component({
  components: {
    NumberRange
  }
})
export default class ModifyProductBase extends Vue {
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(BasicOffsetService) private basicOffsetService: BasicOffsetService;
  @Dependencies(BasicFundsChannelService) private basicFundsChannelService: BasicFundsChannelService;

  @Prop() productId
  @Prop() businessId

  private numRan: NumberRange = null;
  private form: Form;
  private dataSet: Array<any> = [];
  private schemeData: Array<Number> = [];
  private model: any = null;
  private rules: any = null;
  private offsetDataList: any[] = [];
  private selectedChannels: Set<Number> = null;

  created() {
    this.model = {
      businessId: null,
      accountDay: null, // 还款日
      accountPeriodType: null, // 还款日类型
      channelIds: [], // 资金渠道
      cycleType: null, // 周期类型
      _downPayment: null, // 首付比例
      _interestRate: null, // 月利率
      offsetId: null, // 冲抵ID
      overdueDays: null, // 逾期宽限天数
      periods: null, // 期数
      remark: "", // 备注
      repayType: null, // 还款方式
      schemeName: "", // 产品名称
      workFlowKey: "", // 工作流KEY
      moneyMin: 0,
      moneyMax: 0,
      get interestRate() {
        return this._interestRate / 100
      },
      set interestRate(val) {
        this._interestRate = val * 100
      },
      get downPayment() {
        return this._downPayment / 100
      },
      set downPayment(val) {
        this._downPayment = val * 100
      }
    }
    this.rules = {
      accountPeriodType: { required: true, message: "请选择还款日类型", trigger: "change", type: "number" },
      cycleType: { required: true, message: "请选择期数类型", trigger: "change", type: "number" },
      _downPayment: { required: true, message: "请输入首付比例", trigger: "blur", type: "number" },
      _interestRate: { required: true, message: "请输入月利率", trigger: "blur", type: "number" },
      offsetId: { required: true, message: "请选择冲抵策略", trigger: "change", type: "number" },
      overdueDays: { required: true, message: "请输入逾期宽限天数", trigger: "blur", type: "number" },
      periods: { required: true, message: "请输入期数", trigger: "blur", type: "number" },
      repayType: { required: true, message: "请选择还款方式", trigger: "change", type: "number" },
      schemeName: { required: true, message: "请输入产品名称", trigger: "blur" },
      workFlowKey: { required: true, message: "请选择审批流程", trigger: "change" },
      moneyMin: { required: true, message: "请输入最小融资金额", trigger: "blur", type: "number" },
      moneyMax: { required: true, message: "请输入最大融资金额", trigger: "blur", type: "number" }
    }
    this.GetOffsetList()
  }

  mounted() {
    this.form = this.$refs['add-modify-product-form']
    if (this.productId) {
      this.revertData()
    } else {
      this.revertBusinessInfo()
    }
    this.getSelectedChannels()
  }

  /**
   * 获取发布的冲抵策略
   */
  private GetOffsetList() {
    this.basicOffsetService.findPublishBasicOffsetByOrg().subscribe(
      data => {
        this.offsetDataList = data.map(v => ({ label: v.offsetName, value: v.id }))
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 获取所选资金渠道
   */
  private getSelectedChannels() {
    this.repaySchemeService.findSelectedChannel(this.productId).subscribe(
      data => {
        this.selectedChannels = new Set<Number>(data)
        this.model.channelIds = this.selectedChannels
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 选择资金渠道
   */
  private onChannelSelectClick() {
    this.$dialog.show({
      title: "选择资金渠道",
      footer: true,
      width: 1000,
      onOk: selectFundChannel => {
        selectFundChannel.submit().then(v => {
          this.model.channelIds = v
        })
      },
      render: h => <SelectFundChannel productId={this.productId} selectedChannels={this.selectedChannels} ref='select-fund-channel'></SelectFundChannel>
    })
  }

  /**
   * 反显数据
   */
  revertData() {
    this.repaySchemeService.findSchemeById(this.productId).subscribe(
      data => {
        this.model.businessId = data.businessId
        this.model.accountDay = data.accountDay  // 还款日
        this.model.accountPeriodType = data.accountPeriodType  // 还款日类型
        // this.model.channelIds = data.channelIds  // 资金渠道
        this.model.cycleType = data.cycleType  // 周期类型
        this.model.downPayment = data.downPayment  // 首付比例
        this.model.interestRate = data.interestRate // 月利率
        this.model.offsetId = data.offsetId  // 冲抵ID
        this.model.overdueDays = data.overdueDays  // 逾期宽限天数
        this.model.periods = data.periods  // 期数
        this.model.remark = data.remark  // 备注
        this.model.repayType = data.repayType  // 还款方式
        this.model.schemeName = data.schemeName  // 产品名称
        this.model.workFlowKey = data.workFlowKey // 工作流KEY
        this.model.moneyMax = data.moneyMax
        this.model.moneyMin = data.moneyMin
      },
      err => this.$Message.error(err.msg)
    )
  }

  private revertBusinessInfo() {
    this.repaySchemeService.findBusinessById(this.businessId).subscribe(
      data => {
        this.model.businessId = this.businessId
        this.model.workFlowKey = data.workFlowKey
        this.model.offsetId = data.offsetId
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
    * 确定新增产品
    */
  addProduct() {
    return new Promise((resolve) => {
      this.form.validate(valid => {
        if (!valid) return resolve(false)
        this.repaySchemeService.addRepayScheme(this.model)
          .subscribe(
            data => {
              this.$Message.success("操作成功！");
              resolve(true)
            },
            err => {
              this.$Message.error(err.msg);
              resolve(false)
            }
          );
      })
    })
  }
  /**
    * 编辑产品
    */
  editProduct() {
    return new Promise((resolve, reject) => {
      this.form.validate(valid => {
        if (!valid) return reject()
        this.repaySchemeService.updateRepayScheme(this.productId, this.model)
          .subscribe(
            data => {
              this.$Message.success("操作成功！");
              resolve(true)
            },
            ({ msg }) => {
              this.$Message.error(msg);
              resolve(false)
            }
          );
      })
    })
  }


}
</script>

<style lang="less" scoped>
</style>
