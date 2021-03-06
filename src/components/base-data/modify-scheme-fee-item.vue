<!--新增或修改还款方案比例详情-->
<template>
  <section class="component modify-scheme-fee-item">
    <i-form :label-width="100" :model="model" :rules="rules" ref="form" inline>
      <i-form-item label="费用项" prop="expenseId">
        <i-select v-model="model.expenseId" :disabled="isDefault || isLease">
          <i-option v-for="item in expenseArr" :key="item.id" :label="item.expenseName" :value="item.id"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="是否首付款" prop="isFirst">
        <i-select v-model="model.isFirst" @on-change="selectIsFirst" :disabled="isLast || isEdit">
          <i-option v-for="{value,label} in $dict.getDictData(10001)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="是否尾款" prop="isLast">
        <i-select v-model="model.isLast" @on-change="selectIsLast" :disabled="isFirst || isEdit">
          <i-option v-for="{value,label} in $dict.getDictData(10001)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="是否退款" prop="isRefund">
        <i-select v-model="model.isRefund" :disabled="isLast || isEdit">
          <i-option v-for="{value,label} in $dict.getDictData(10001)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="费用类型">
        <RadioGroup v-model="costTypes">
          <Radio label="1" :disabled="isDefault">利率</Radio>
          <Radio label="2" :disabled="isDefault">固定费用</Radio>
        </RadioGroup>
      </i-form-item>
      <i-form-item label="利率" prop="repayProportion" v-if="costTypes===`1`">
        <i-input-number v-model="model.repayProportion" :min="0" :max="100" :formatter="$filter.percentFormat" :parser="$filter.percentParse"></i-input-number>
      </i-form-item>
      <i-form-item label="固定费用" prop="fixedCost" v-else>
        <i-input-number v-model="model.fixedCost" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="还款方式" prop="repayType">
        <i-select v-model="model.repayType" @on-change="selectRepayType" :disabled="isFirst || isLast || isEdit">
          <i-option v-for="{value,label} in $dict.getDictData(10022)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="备注" prop="remark">
        <i-input type="textarea" v-model="model.remark" :maxlength="100"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { BasicExpenseService } from "~/services/manage-service/basic-expense.service.ts";
import { Form } from "iview";

@Component({
  components: {}
})
export default class ModifySchemeFeeItem extends Vue {
  @Dependencies(RepaySchemeService)
  private repaySchemeService: RepaySchemeService;
  @Dependencies(BasicExpenseService)
  private basicExpenseService: BasicExpenseService;
  @Prop() data: any;
  @Prop() schemeId: Number;
  @Prop() schemeType: Number;

  private accountDay: Array<Number> = [];
  private expenseArr: Array<Number> = [];
  private banEditItem: Array<String> = ['yj', 'gpsfy', 'bj', 'lx', 'fx', 'tqjqsxf', 'fj', 'sfk'];
  private defaultItem: Array<String> = ['yj', 'gpsfy', 'glf', 'bj', 'lx', 'fx', 'tqjqsxf', 'fj'];
  private isFirstStatus: Boolean = false;
  private isLastStatus: Boolean = false;
  private isOnceStatus: Boolean = false;
  private isEdit: Boolean = false;
  private isDefault: Boolean = false;
  private isLease: Boolean = false;

  // 费用类型
  private costTypes: string = "1";

  private model: any = {
    isFirst: "", // 是否首付款
    repayProportion: null, // 利率
    fixedCost: null, // 固定费用
    repayType: "", // 还款方式
    isLast: "", // 是否尾款
    isRefund: "", //是否退款
    expenseId: "", // 费用项id
    schemeId: "", //还款方案Id
    remark: "" // 备注
  };

  private rules = {
    isFirst: {
      required: true,
      message: "请选择是否首付款",
      trigger: "blur",
      type: "number"
    },
    repayType: {
      required: true,
      message: "请选择还款方式",
      trigger: "blur",
      type: "number"
    },
    isLast: {
      required: true,
      message: "请选择是否尾款",
      trigger: "blur",
      type: "number"
    },
    isRefund: {
      required: true,
      message: "请选择是否退款",
      trigger: "blur",
      type: "number"
    },
    expenseId: {
      required: true,
      message: "请选择费用项",
      trigger: "blur",
      type: "number"
    }
  };

  /**
   * 反显数据
   */
  private revertData() {
    this.model.id = this.data.id;
    this.model.schemeId = this.schemeId;
    this.model.isFirst = this.data.isFirst;
    this.model.fixedCost = this.data.fixedCost;
    this.model.repayProportion = this.data.repayProportion * 100;
    this.model.repayType = this.data.repayType;
    this.model.isLast = this.data.isLast;
    this.model.isRefund = this.data.isRefund;
    this.model.expenseId = this.data.expenseId;
    this.model.remark = this.data.remark;

    // 费用类型
    this.costTypes = this.data.repayProportion === null ? "2" : "1";
  }

  mounted() {
    this.basicExpenseService.findBasicExpenseByOrg().subscribe(val => {
      this.expenseArr = val;
    });

    if (this.schemeId) this.model.schemeId = this.schemeId;

    if (this.data) {
      this.revertData();
      this.isEdit = this.banEditItem.indexOf(this.data.expenseCode) > -1 ? true : false
      this.isDefault = this.defaultItem.indexOf(this.data.expenseCode) > -1 ? true : false
      if(this.data.expenseCode === 'sfk' && this.schemeType === 10049) {
        this.isLease = this.isDefault = true;
      }
      if(this.data.expenseCode === 'sfk' && this.schemeType === 10050) {
        this.isEdit = false;
      }
    }
  }

  get isFirst() {
    return (this.isFirstStatus = this.model.isFirst === 10002 ? true : false);
  }
  get isLast() {
    return (this.isLastStatus = this.model.isLast === 10002 ? true : false);
  }
  get isOnce() {
    return (this.isOnceStatus = this.model.repayType === 10063 ? true : false);
  }

  /**
   * 选择是否首付款
   */
  selectIsFirst() {
    if (this.isFirst) {
      this.$Message.warning("是首付款不可是尾款,且必须一次性收取");
      this.model.repayType = 10063;
      this.model.isLast = 10003;
    }
  }
  /**
   * 选择是否尾款
   */
  selectIsLast() {
    if (this.isLast) {
      this.$Message.warning("是尾款不可是首付款,且必须一次性收取,不可退款");
      this.model.repayType = 10063;
      this.model.isRefund = 10003;
      this.model.isFirst = 10003;
    }
  }
  /**
   * 选择还款方式
   */
  selectRepayType() {
    if (this.isOnce && !this.isFirst && !this.isLast) {
      this.$Message.warning("是一次性收取,必须是首付款或是尾款");
    }
  }
  /**
   * 确定新增还款方案详情
   */
  submit() {
    var form = this.$refs["form"] as Form;
    if (!form) return;

    return new Promise(resolve => {
      form.validate(valid => {
        if (!valid) return resolve(false);

        if (this.costTypes === "1") {
          this.model.fixedCost = null;
        } else {
          this.model.repayProportion = null;
        }

        // this.repaySchemeService.addBasicSchemeExpense(this.model).subscribe(
        //   data => {
        //     this.$Message.success("操作成功！");
        //     resolve(true);
        //   },
        //   err => {
        //     this.$Message.error(err.msg);
        //     resolve(false);
        //   }
        // );
      });
    });
  }
}
</script>

<style lang="less" scoped>
</style>
