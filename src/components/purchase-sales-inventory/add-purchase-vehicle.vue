<!--添加车辆 采购-->
<template>
  <section class="component add-purchase-vehicle">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="品牌" prop="brandName">
        <i-input v-model="model.brandName" placeholder="请选择品牌" readonly>
          <i-button v-if="this.isView" icon="search" slot="append" @click="onSelectCarClick"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="车系" prop="seriesName">
        <i-input v-model="model.seriesName" placeholder="请选择车系" readonly></i-input>
      </i-form-item>
      <i-form-item label="车型" prop="modelName">
        <i-tooltip trigger="hover" :content="model.modelName" placement="top" :disabled="!model.modelName">
          <i-input v-model="model.modelName" placeholder="请选择车型" readonly></i-input>
        </i-tooltip>
      </i-form-item>
      <i-form-item label="车架号" prop="stockCarNo">
        <i-input v-model="model.stockCarNo" placeholder="请输入车架号" clearable :maxlength="17"></i-input>
      </i-form-item>
      <i-form-item label="颜色" prop="stockCarColor">
        <i-input v-model="model.stockCarColor" placeholder="请输入颜色" clearable :maxlength="10"></i-input>
      </i-form-item>
      <i-form-item label="车辆性质" prop="stockCarType">
        <i-select v-model="model.stockCarType" placeholder="请选择车辆性质" disabled>
          <i-option v-for="{label,value} of $dict.getDictData(10060)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="融资车价" prop="financingPrice">
        <i-input-number v-model="model.financingPrice" placeholder="请输入融资车价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="指导价" prop="guidePrice">
        <i-input-number v-model="model.guidePrice" placeholder="请输入指导价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="采车价" prop="stockPrice">
        <i-input-number v-model="model.stockPrice" placeholder="请输入采车价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="开票价" prop="ticketPrice">
        <i-input-number v-model="model.ticketPrice" placeholder="请输入开票价" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="其他费用" prop="otherPrice">
        <i-input-number v-model="model.otherPrice" placeholder="请输入其他费用" clearable :min="0" :max="9999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";

@Component({
  components: {
    ChooseVehicleModel
  }
})
export default class AddPurchaseVehicle extends Vue {
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop() data;
  @Prop() isView; 
  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      brandName: "",
      modelName: "",
      seriesName: "",
      stockCarColor: "",
      stockCarNo: "",
      stockCarType: "",
      guidePrice: null,//指导价
      stockPrice: null,//采车价
      financingPrice: null,//融资车价
      ticketPrice: null,//开票价
      otherPrice: null,//其他费用
    };

    this.rules = {
      brandName: {
        required: true,
        message: "请选择品牌",
        trigger: "change"
      },
      stockCarColor: {
        required: true,
        message: "请输入颜色",
        trigger: "blur"
      },
      stockCarNo: [
        {
          required: true,
          message: "请输入车架号",
          trigger: "blur"
        },
        { validator: this.$validator.carVIN, trigger: "blur" }
      ],
      stockCarType: {
        required: true,
        message: "请选择车辆性质",
        type: "number",
        trigger: "blur"
      },
      financingPrice: {
        required: true,
        message: "请输入融资车价",
        trigger: "blur",
        type: "number"
      }
    };
  }

  mounted() {
    //若为修改  则返显数据
    if (this.data) {
      this.model = Object.assign({}, this.data);
    }
    //采购入库  限制车辆性质为新车
    this.model.stockCarType = 10210
  }

  /**
   * 新增车辆
   */
  private addVehicle() {
    return new Promise((resolve, reject) => {
      resolve(this.model)
    });
  }
  

  /**
   * 选择车型
   */
  private onSelectCarClick() {
    this.$dialog.show({
      title: "车型选择",
      footer: true,
      width: 1050,
      onOk: (chooseCar: ChooseVehicleModel) => {
        return chooseCar.submit()
          .then(v => {
            if (!v) {
              this.$Message.warning('请选择一条数据！')
              return v
            }
            this.model.brandName = chooseCar.selectData.brandName;
            this.model.modelId = chooseCar.selectData.carId
            this.model.seriesName = chooseCar.selectData.seriesName
            this.model.modelName = chooseCar.selectData.modelName;
            return v
          })

      },
      render: h =>
        h(ChooseVehicleModel, {
          props: {
            carId: this.model.modelId
          }
        })
    });
  }
  //提交表单
  private submit() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve();
        let result = this.addVehicle();
        result
          .then(v => {
            this.$Message.success("操作成功");
            resolve(v);
          })
          .catch(e => {
            this.$Message.error(e.msg);
            resolve();
          });
      });
    });
  }

  private confirm() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false);
        return resolve(this.model)
      });
    })
  }
}
</script>
<style lang="less">
</style>
