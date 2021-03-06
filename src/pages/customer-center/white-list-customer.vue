<template>
  <section class="page white-list-customer">
    <page-header title="白名单客户" hidden-print hidden-export></page-header>
    <data-form :model="model" @on-search="refreshData" hidden-date-search>
      <template slot="input">
        <i-form-item prop="name" label="姓名">
          <i-input placeholder="请输入客户姓名" v-model="model.name" :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="idCard" label="身份证号：">
          <i-input placeholder="请输入客户身份证号" v-model="model.idCard" :maxlength="18"></i-input>
        </i-form-item>
        <i-form-item prop="phoneNumber" label="手机号：">
          <i-input placeholder="请输入客户手机号" v-model="model.phoneNumber" :maxlength="11"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" ref="databox" :page="pageService" @on-page-change="refreshData"></data-box>
  </section>
</template>

<script lang="ts">
import Page from '~/core/page'
import Component from "vue-class-component";
import { namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { Layout, Dependencies } from '~/core/decorator'
import { BasicCustomerCenterService } from "~/services/manage-service/basic-customer-center.service";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout('workspace')
@Component({
  components: {}
})
export default class WhiteListCustomer extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicCustomerCenterService) private basicCustomerCenterService: BasicCustomerCenterService;
  @CustomerOrderModule.Action showCustomerInfo;

  private columns: any;
  private dataSet: any = [];

  private model = {
    name: "",
    phoneNumber: "",
    idCard: ""
  }


  activated() {
    this.refreshData();
  }

  mounted() {
    this.refreshData();
  }

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          return h("div", [
            h("i-button",
              {
                props: {
                  type: "text"
                },
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => {
                    this.showCustomerInfo({ id: row.id })
                  }
                }
              },
              "详情"
            ),
            h("i-button",
              {
                props: {
                  type: "text"
                },
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => this.removeCustomerState(row.id)
                }
              },
              "移出"
            )
          ])
        }
      },
      {
        align: "center",
        editable: true,
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        editable: true,
        title: "客户状态",
        key: "customerStatus",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.customerStatus))
      },
      {
        align: "center",
        editable: true,
        title: "客户性别",
        key: "customerSex",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.customerSex))
      },
      {
        align: "center",
        editable: true,
        title: "证件号码",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(6)
      },
      {
        title: '开户状态',
        key: 'accountStatus',
        minWidth: this.$common.getColumnWidth(3),
        align: 'center',
        render: (h, { row }) => h('p', {}, this.$filter.dictConvert(row.accountStatus))
      }
    ];
  }

  /**
   * 移除当前状态
   */
  private removeCustomerState(id) {
    this.basicCustomerCenterService.updateCustomerStatusWhite(id).subscribe(
      data => {
        this.$Message.success("操作成功")
        this.refreshData()
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 获取白名单客户列表
   */
  private refreshData() {
    this.basicCustomerCenterService.findWhiteCustomerList(this.model, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

}
</script>


<style lang="less" scoped>
</style>
