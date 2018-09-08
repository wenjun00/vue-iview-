<!--房产信息-->
<template>
  <section class="component customer-info-house">
    <div class="no-data-notice" v-if="dataSet.length === 0" key="no-data">
      暂无数据
    </div>
    <i-card class="house" v-else v-for="item of dataSet" :key="item.id" :span="24" :title="' '">
      <div slot="extra" v-if="edit">
        <a @click="onDeleteClick(item)">
          <svg-icon iconClass="delete-bold"></svg-icon>
          删除
        </a>
        <a @click="onModifyClick(item)" style="margin-left: 20px;">
          <svg-icon iconClass="tianxie"></svg-icon>
          修改
        </a>
      </div>
      <data-grid class="house-info" :labelWidth="130" labelAlign="right" contentAlign="left">
        <data-grid-item label="房产情况" :span="4">{{item.houseStatus | dictConvert}}</data-grid-item>
        <data-grid-item label="房屋所有权人" :span="4">{{item.houseOwner}}</data-grid-item>
        <data-grid-item label="房屋产权证号" :span="4">{{item.houseNo}}</data-grid-item>
        <data-grid-item label="房权证号" :span="4">{{item.houseNoH}}</data-grid-item>
        <data-grid-item label="房权证字" :span="4">{{item.houseNoZ}}</data-grid-item>
        <data-grid-item label="国有土地使用编号" :span="4">{{item.houseLandNo}}</data-grid-item>
        <data-grid-item label="电费账号" :span="4">{{item.electricityFeesAccount}}</data-grid-item>
        <data-grid-item label="电费密码" :span="4">{{item.electricityFeesPassword}}</data-grid-item>
        <data-grid-item label="建筑面积(㎡）" :span="4">{{item.houseArea}}</data-grid-item>
        <data-grid-item label="车库面积(㎡）" :span="4">{{item.houseGarageArea}}</data-grid-item>
        <data-grid-item label="成交总价(万元)" :span="4">{{item.housePrice | toTenThousands}}</data-grid-item>
        <data-grid-item :span="4"></data-grid-item>
        <data-grid-item label="房产地址" :span="12">{{getCityName(item.houseProvince)}} {{getCityName(item.houseCity)}} {{getCityName(item.houseCityArea)}} {{item.houseAddress}}</data-grid-item>
      </data-grid>
    </i-card>
    <div class="add-customer-info" v-if="edit" key="edit">
      <a @click="onAddHouseInfo">
        <svg-icon iconClass="add"></svg-icon>
        新增房产信息
      </a>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerHouseService } from "~/services/manage-service/basic-customer-house.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import ModifyCustomerInfoHouse from "./modify-customer-info-house.vue";

@Component({
  components: { DataGrid, DataGridItem }
})
export default class CustomerInfoHouse extends Vue {
  @Dependencies(BasicCustomerHouseService) private basicCustomerHouseService: BasicCustomerHouseService;
  @Prop() id: Number

  /** 是否可编辑 */
  @Prop({ default: false }) edit: Boolean

  private dataSet: Array<any> = []

  @Watch("id", { immediate: true })
  onIdChange() {
    if (this.id) this.refreshData()
  }

  /**
   * 获取城市
   */
  private getCityName(cityCode) {
    return this.$city.getCityName(cityCode)
  }

  /**
   * 刷新数据
   */
  private refreshData() {
    this.basicCustomerHouseService.findCustomerHouseList(this.id).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }
  /**
   * 新增房产信息
   */
  private onAddHouseInfo() {
    this.$dialog.show({
      title: '新增房产信息',
      footer: true,
      width: 1050,
      onOk: addCustomerInfoHouse => {
        return addCustomerInfoHouse.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      render: h => h(ModifyCustomerInfoHouse, {
        props: {
          customerId: this.id
        }
      })
    })
  }
  /**
   * 修改房产信息
   */
  private onModifyClick(houseInfo) {
    houseInfo.customerId = this.id
    let tmpData = Object.assign({}, houseInfo)
    this.$dialog.show({
      title: "修改房产信息",
      footer: true,
      width: 1050,
      onOk: modifyCustomerInfoHouse => {
        return modifyCustomerInfoHouse.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      onCancel: () => {
        this.refreshData()
      },
      render: h => h(ModifyCustomerInfoHouse, {
        props: {
          data: tmpData
        }
      })
    })
  }
  /**
  * 删除房产信息
  */
  onDeleteClick(houseInfo) {
    this.$Modal.confirm({
      title: '提示',
      content: `确定删除该房产信息吗？`,
      onOk: () => {
        this.basicCustomerHouseService.deleteCustomHouse(houseInfo.id)
          .subscribe(val => {
            this.$Message.success(`删除成功！`)
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
.component.customer-info-house {
  .house {
    margin-bottom: 20px;
  }
}
</style>
