<!--职业信息-->
<template>
  <section class="component customer-info-job">
    <div v-if="isView">
      <div class="no-data-notice" key="no-data">
        暂无数据
      </div>
      <div class="add-customer-info" v-if="edit">
        <a @click="onAddJobInfo">
          <svg-icon iconClass="add"></svg-icon>
          新增职业信息
        </a>
      </div>
    </div>
    <i-card class="job" v-else :span="24" :title="dataSet.companyName">
      <div slot="extra" v-if="edit">
        <a @click="onDeleteClick()">
          <svg-icon iconClass="delete-bold"></svg-icon>
          删除
        </a>
        <a @click="onModifyClick()" style="margin-left: 20px;">
          <svg-icon iconClass="tianxie"></svg-icon>
          修改
        </a>
      </div>
      <data-grid class="job-info" :labelWidth="120" labelAlign="right" contentAlign="left">
        <data-grid-item label="工作单位 " :span="4">{{dataSet.companyName }}</data-grid-item>
        <data-grid-item label="部门" :span="4">{{dataSet.department}}</data-grid-item>
        <data-grid-item label="职位" :span="4">{{dataSet.duty}}</data-grid-item>
        <data-grid-item label="单位电话" :span="4">{{dataSet.companyPhone}}</data-grid-item>
        <data-grid-item label="起始工作日期" :span="4">{{dataSet.accessCompanyTime | dateFormat}}</data-grid-item>
        <data-grid-item label="单位性质 " :span="4">{{dataSet.companyNature | dictConvert}}</data-grid-item>
        <data-grid-item label="从业年限 " :span="4">{{dataSet.businessYears}}</data-grid-item>
        <data-grid-item label="本单位从业年限 " :span="4">{{dataSet.companyYears}}</data-grid-item>
        <data-grid-item label="社保情况" :span="4">{{dataSet.socialSecuritySituation | dictConvert}}</data-grid-item>
        <data-grid-item label="社保编号" :span="4">{{dataSet.socialSecurityAccount}}</data-grid-item>
        <data-grid-item label="社保账号密码" :span="4">{{dataSet.socialSecurityPassword }}</data-grid-item>
        <data-grid-item label="年收入" :span="4">{{dataSet.yearlySalaries | toThousands }}</data-grid-item>
        <data-grid-item label="公积金情况" :span="4">{{dataSet.providentFundSituation | dictConvert }}</data-grid-item>
        <data-grid-item label="公积金账号" :span="4">{{dataSet.accumulationFundAccount}}</data-grid-item>
        <data-grid-item label="公积金账号密码" :span="4">{{dataSet.accumulationFundPassword}}</data-grid-item>
        <data-grid-item label="单位地址" :span="12">{{getCityName(dataSet.province)}} {{getCityName(dataSet.city)}} {{getCityName(dataSet.area)}} {{dataSet.companyAddressDetail}}</data-grid-item>
      </data-grid>
    </i-card>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerJobService } from "~/services/manage-service/basic-customer-job.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import ModifyCustomerInfoJob from "./modify-customer-info-job.vue";


@Component({
  components: {
    DataGrid, DataGridItem
  }
})
export default class CustomerInfoJob extends Vue {
  @Dependencies(BasicCustomerJobService) private basicCustomerJobService: BasicCustomerJobService;
  @Prop() id: Number

  /** 是否可编辑 */
  @Prop({ default: false }) edit: Boolean

  private dataSet: any = {};
  private isView: boolean = true;

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
    this.basicCustomerJobService.findCustomerJobList(this.id).subscribe(
      data => {
        if(data){
          this.isView = false
          this.dataSet = data
        } else{
          this.isView = true
        }
      },
      err => this.$Message.error(err.msg)
    )
  }
  /**
   * 新增职业信息
   */
  private onAddJobInfo() {
    this.$dialog.show({
      title: '新增职业信息',
      footer: true,
      width: 1050,
      onOk: addCustomerInfoJob => {
        return addCustomerInfoJob.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      render: h => h(ModifyCustomerInfoJob, {
        props: {
          customerId: this.id
        }
      })
    })
  }
  /**
   * 修改职业信息
   */
  private onModifyClick() {
    this.dataSet.customerId = this.id
    this.$dialog.show({
      title: "修改职业信息",
      footer: true,
      width: 1050,
      onOk: modifyCustomerInfoJob => {
        return modifyCustomerInfoJob.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      onCancel: () => {
        this.refreshData()
      },
      render: h => h(ModifyCustomerInfoJob, {
        props: {
          data: this.dataSet
        }
      })
    })
  }
  /**
  * 删除职业信息
  */
  onDeleteClick() {
    this.$Modal.confirm({
      title: '提示',
      content: `确定删除该职业信息吗？`,
      onOk: () => {
        this.basicCustomerJobService.deletePersonalJob(this.dataSet.id)
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
.component.customer-info-job {
  .job {
    margin-bottom: 20px;
  }
}
</style>
