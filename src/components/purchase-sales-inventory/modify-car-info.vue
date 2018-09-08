<!--维护车辆信息-->
<template>
  <section class="component modify-car-info">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="品牌" prop="brandName">
        <i-input v-model="model.brandName" placeholder="请选择品牌" readonly>
          <i-button v-if="isManualStorage" icon="search" slot="append" @click="onSelectCarClick"></i-button>
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
      <i-form-item label="颜色" prop="stockCarColor">
        <i-input v-model="model.stockCarColor" placeholder="请输入颜色" clearable :maxlength="10"></i-input>
      </i-form-item>
      <i-form-item label="车架号" prop="stockCarNo">
        <i-input v-model="model.stockCarNo" placeholder="请输入车架号" clearable :maxlength="17"></i-input>
      </i-form-item>
      <i-form-item label="发动机号" prop="stockEngineNo">
        <i-input v-model="model.stockEngineNo" placeholder="请输入发动机号" clearable :maxlength="8"></i-input>
      </i-form-item>
      <i-form-item label="车牌号" prop="plateNo">
        <i-input v-model="model.plateNo" placeholder="请输入车牌号" clearable :maxlength="10"></i-input>
      </i-form-item>
      <i-form-item label="合格证号" prop="certificateNo">
        <i-input v-model="model.certificateNo" placeholder="请输入合格证号" clearable :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="里程表值(公里)" prop="carMileage">
        <i-input-number v-model="model.carMileage" placeholder="请输入里程表值" clearable :min="0" :max="9999999"></i-input-number>
      </i-form-item>
      <i-form-item label="车辆性质" prop="stockCarType">
        <i-select v-model="model.stockCarType" placeholder="请选择车辆性质" disabled>
          <i-option v-for="{label,value} of $dict.getDictData(10060)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="车况" prop="carCondition">
        <i-select v-model="model.carCondition" placeholder="请选择车况" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10046)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="车辆状态" prop="stockStatus">
        <i-select v-model="model.stockStatus" placeholder="请选择车辆状态" disabled>
          <i-option v-for="{label,value} of $dict.getDictData(10051)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="所属机构" prop="deptName">
        <i-input v-model="model.deptName" placeholder="请选择机构" readonly>
          <i-button icon="search" slot="append" @click="onSelectOrgClick"></i-button>
        </i-input>
      </i-form-item>
      <i-form-item label="上牌日期" prop="licensingDate">
        <i-date-picker placeholder="请选择上牌日期" v-model="model.licensingDate" :options="licensingDateOptions" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="入库日期" prop="stockInDate">
        <i-date-picker class="form-picker" placeholder="请选择入库日期" v-model="model.stockInDate" :options="stockInDateOptions" clearable></i-date-picker>
      </i-form-item>
      <i-form-item label="出厂日期" prop="makeDate">
        <i-date-picker placeholder="请选择出厂日期" v-model="model.makeDate" :options="$common.datePickDisabledDate()" clearable></i-date-picker>
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
import ChooseOrgsPurchase from "~/components/purchase-sales-inventory/choose-orgs-purchase.tsx.vue";

@Component({
  components: {
    ChooseVehicleModel,
    ChooseOrgsPurchase
  }
})
export default class ModifyCarInfo extends Vue {
  @Dependencies(BasicCustomerCarCenterService)
  private basicCustomerCarCenterService: BasicCustomerCarCenterService;

  @Prop() data;
  // 是否为手动入库
  @Prop({
    type: Boolean,
    default: false
  })
  isManualStorage

  @Prop({
    type: Boolean,
    default: false
  })
  isPurchaseStorage

  private model: any = null;
  private rules: any = null;
  private deptList: Array<any> = [];
  /**
   *限制入库日期
   */
  private stockInDateOptions: any = null
  /**
   *限制上牌日期
   */
  private licensingDateOptions: any = null
  private deptName = ""
  created() {
    this.model = {
      brandName: "",
      modelName: "",
      seriesName: "",
      stockCarColor: "",
      stockCarNo: "",
      stockEngineNo: "",
      licensingDate: null,
      makeDate: null,
      plateNo: "",
      certificateNo: "",
      stockCarType: "",
      carCondition: "",
      carMileage: 0,
      deptName: "",
      deptId: "",
      stockInDate: null,
      stockStatus: ""
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
      stockEngineNo: {
        required: true,
        message: "请输入发动机号",
        trigger: "blur"
      },
      plateNo: [
        { message: "请输入车牌号", trigger: "blur" },
        { validator: this.$validator.carCardNo, trigger: "blur" }
      ],
      stockCarType: {
        required: true,
        message: "请选择车辆性质",
        type: "number",
        trigger: "blur"
      },
      carCondition: {
        required: true,
        message: "请选择车况",
        type: "number",
        trigger: "blur"
      },
      carMileage: {
        required: true,
        message: "请输入里程表值",
        trigger: "blur",
        type: "number"
      },
      deptName: {
        required: true,
        message: "请选择所属机构",
        trigger: "change",
      },
      stockInDate: {
        required: true,
        message: "请选择入库日期",
        trigger: "blur",
        type: "date"
      },
      stockStatus: {
        required: true,
        message: "请选择车辆状态",
        type: "number",
        trigger: "blur"
      }
    };
  }

  mounted() {
    if (this.data) {
      this.data.stockInDate = this.data.stockInDate ? new Date(this.data.stockInDate) : ""
      this.data.makeDate = this.data.makeDate ? new Date(this.data.makeDate) : ""
      this.data.licensingDate = this.data.licensingDate ? new Date(this.data.licensingDate) : ''
      this.model = Object.assign({}, this.data)
      this.model.deptId = this.data.id
      this.model.deptName = this.data.orgName
    }
    /**
     * 限制入库时间
     */
    this.stockInDateOptions = {
      disabledDate: stockInDate => {
        if (this.model && this.model.licensingDate) {
          return stockInDate < this.model.licensingDate || stockInDate > Date.now();
        }
        return stockInDate && stockInDate.valueOf() > Date.now();
      }
    };

    /**
     * 限制上牌时间
     */
    this.licensingDateOptions = {
      disabledDate: licensingDate => {
        if (this.model && this.model.stockInDate) {
          return licensingDate > this.model.stockInDate;
        }
        return licensingDate && licensingDate.valueOf() > Date.now();
      }
    };
    this.getDeptList()
    // 如果为手动入库，则限制车辆状态为手动入库，限制车辆性质为新车
    if (this.isManualStorage) {
      this.model.stockStatus = 10182
      this.model.stockCarType = this.$enum.CarState.NewCar
    } else if (this.isPurchaseStorage) {
      this.model.stockStatus = 10180
      this.model.stockCarType = this.$enum.CarState.NewCar
    }
  }

  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryDeptList()
      .subscribe(
        data => (this.deptList = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 新增车辆
   */
  private addCar() {
    return new Promise((resolve, reject) => {
      resolve(this.model)
    });
  }

  /**
   * 修改车辆
   */
  private modifyCar() {
    return new Promise((resolve, reject) => {
      this.basicCustomerCarCenterService
        .editCustomerStorage(this.model)
        .subscribe(data => resolve(true), err => reject(err));
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

  /**
   * 选择机构
   */
  private onSelectOrgClick() {
    this.$dialog.show({
      title: "机构选择",
      footer: true,
      width: 1050,
      onOk: (selecOrgs: ChooseOrgsPurchase) => {
        return selecOrgs.submit()
          .then(v => {
            if (!v) {
              this.$Message.warning('请选择一条数据！')
              return v
            }
            this.model = Object.assign({}, this.model, {
              deptName: selecOrgs.selectData.store,
              deptId: selecOrgs.selectData.storeId
            })
            return v
          })
      },
      render: h =>
        h(ChooseOrgsPurchase)
    });
  }
  private submit() {
    let form: any = this.$refs.form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve();
        let result = this.data ? this.modifyCar() : this.addCar();
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
