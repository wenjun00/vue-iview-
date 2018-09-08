<!--维护房产信息-->
<template>
  <section class="component modify-customer-info-house">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="120">
      <i-form-item label="房产情况" prop="houseStatus">
        <i-select v-model="model.houseStatus" clearable>
          <i-option v-for="{value,label} in $dict.getDictData(10072)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="房屋所有权人" prop="houseOwner">
        <i-input v-model="model.houseOwner" :maxlength="20"></i-input>
      </i-form-item>
      <i-form-item label="房屋产权证号" prop="houseNo">
        <i-input v-model="model.houseNo" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="房权证号" prop="houseNoH">
        <i-input v-model="model.houseNoH" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="房权证字" prop="houseNoZ">
        <i-input v-model="model.houseNoZ" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="国有土地使用编号" prop="houseLandNo">
        <i-input v-model="model.houseLandNo" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="电费账号" prop="electricityFeesAccount">
        <i-input v-model="model.electricityFeesAccount" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="电费密码" prop="electricityFeesPassword">
        <i-input v-model="model.electricityFeesPassword" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="建筑面积(㎡)" prop="houseArea">
        <i-input-number v-model="model.houseArea" :min="0" :max="99999"></i-input-number>
      </i-form-item>
      <i-form-item label="车库面积(㎡)" prop="houseGarageArea">
        <i-input-number v-model="model.houseGarageArea" :min="0" :max="99999"></i-input-number>
      </i-form-item>
      <i-form-item label="成交总价(万元)" prop="housePrice">
        <i-input-number v-model.lazy="housePrice" :min="0" :max="99999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="房产地址" prop="houseCityArea">
        <i-select placeholder="选择省" v-model="model.houseProvince" clearable>
          <i-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择市" v-model="model.houseCity" :disabled="!model.houseProvince" clearable>
          <i-option v-for="{value,label} in this.model.houseProvince ? this.$city.getCityData({ level: 1, id: this.model.houseProvince }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-select placeholder="选择区/县" v-model="model.houseCityArea" :disabled="!model.houseCity" clearable>
          <i-option v-for="{value,label} in this.model.houseCity ? this.$city.getCityData({ level: 2, id: this.model.houseCity }) : []" :key="value" :label="label" :value="value"></i-option>
        </i-select>
        <i-input v-model="model.houseAddress" placeholder="详细地址" :maxlength="50"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerHouseService } from "~/services/manage-service/basic-customer-house.service";

@Component({})
export default class ModifyCustomerInfoHouse extends Vue {
  @Dependencies(BasicCustomerHouseService) private basicCustomerHouseService: BasicCustomerHouseService;
  // 客户ID
  @Prop() customerId: Number;
  // 维护数据
  @Prop() data;

  private model: any = null;
  private rules: any = null;

  created() {
    this.model = {
      houseStatus: '', // 房产情况
      houseNo: '', // 房屋产权证号
      houseNoH: '', // 房权证号
      houseNoZ: '', // 房权证字
      houseLandNo: '', // 国有土地使用编号
      electricityFeesAccount: '', // 电费账号
      electricityFeesPassword: '', // 电费密码
      houseOwner: '', // 房屋所有权人
      houseArea: null, // 建筑面积
      houseGarageArea: null, // 车库面积
      housePrice: null, // 成交总价
      houseProvince: null, // 房产所在省
      houseCity: null, // 房产所在市
      houseCityArea: null, // 房产所在区
      houseAddress: null, // 详细地址
    }

    this.rules = {
      // houseStatus: { required: true, message: "请选择房产情况", trigger: "blur", type: "number" },
      // houseOwner: { required: true, message: "请填写房屋所有权人", trigger: "blur" },
      // houseCityArea: { required: true, message: "请选择房产地址", trigger: "blur", type: "number" },
    }
  }

  mounted() {
    if (this.data) this.model = this.data
    if (this.customerId) this.model.customerId = this.customerId
  }

  /**
   * 新增房产信息
   */
  private addHouse() {
    return new Promise((resolve, reject) => {
      this.basicCustomerHouseService.addCustomHouse(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  /**
   * 修改房产信息
   */
  private modifyHouse() {
    return new Promise((resolve, reject) => {
      this.basicCustomerHouseService.updateCustomHouse(this.model).subscribe(
        data => resolve(),
        err => reject(err)
      )
    })
  }

  private submit() {
    let emptyModel = true
    let temp = Object.assign({}, this.model)
    delete temp.customerId
    delete temp.id
    Object.keys(temp).forEach(key => {
      if (temp[key]) emptyModel = false
    })
    return new Promise((resolve) => {
      if (emptyModel) return resolve(true)
      let result = this.customerId ? this.addHouse() : this.modifyHouse()
      result.then(() => {
        this.$Message.success("操作成功")
        resolve(true)
      }).catch(e => {
        this.$Message.error(e.msg)
        resolve()
      })
    })
  }

  private get housePrice() {
    let val = null
    if (this.model.housePrice !== null) {
      val = this.model.housePrice / 10000
    }
    return val
  }
  private set housePrice(val) {
    if (val !== null) val *= 10000
    this.model.housePrice = val
  }
}
</script>
<style lang="less">
</style>
