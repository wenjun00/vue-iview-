<template>
  <section class="page potential-clients">
    <page-header title="意向客户" hidden-print hidden-export>
      <command-button label="新增意向客户" v-auth="602" @click="onCreatePotentialClick"></command-button>
    </page-header>
    <data-form :model="model" @on-search="refreshData" hidden-date-search>
      <template slot="input">
        <i-form-item prop="name" label="姓名：">
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
    <data-box :columns="columns" :data="dataSet" :page="pageService" ref="databox" @on-page-change="refreshData"></data-box>
  </section>
</template>

<script lang="ts">
import Page from "~/core/page";
import Component from "vue-class-component";
import ModifyCustomerInfoBasedata from "~/components/customer-center/customer-info-base/modify-customer-info-basedata.vue";
import CustomerInfoIntentionRecord from "~/components/customer-center/customer-info-base/customer-info-intention-record.tsx.vue";
import { namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { Layout, Dependencies } from "~/core/decorator";
import { BasicCustomerCenterService } from "~/services/manage-service/basic-customer-center.service";
import { BasicCustomerService } from "~/services/manage-service/basic-customer.service";

const CustomerOrderModule = namespace("customerOrderSpace");

@Layout("workspace")
@Component({
  components: {}
})
export default class PotentialClients extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicCustomerCenterService) private basicCustomerCenterService: BasicCustomerCenterService;
  @Dependencies(BasicCustomerService) private basicCustomerService: BasicCustomerService;
  @CustomerOrderModule.Action showCustomerInfo;

  private columns: any;
  private dataSet: any = [];

  private model = {
    name: "",
    phoneNumber: "",
    idCard: ""
  };

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
            h(
              "i-button",
              {
                props: {
                  type: "text"
                },
                directives: this.$common.bindAuth(603),
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => this.viewCustomerInfo(row.id)
                }
              },
              "修改"
            ),
            h(
              "i-button",
              {
                props: {
                  type: "text"
                },
                directives: this.$common.bindAuth(604),
                style: {
                  color: "#265EA2"
                },
                on: {
                  click: () => this.followCustomer(row.id)
                }
              },
              "跟进"
            )
          ]);
        }
      },
      {
        align: "center",
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        title: "性别",
        key: "customerSex",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) =>
          h("p", {}, this.$filter.dictConvert(row.customerSex))
      },
      {
        align: "center",
        title: "证件号码",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(6)
      },
      {
        align: "center",
        title: "客户电话",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(3)
      },
      {
        align: "center",
        title: "意向类型",
        key: "intentionType",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) =>
          h("p", {}, this.$filter.dictConvert(row.intentionType))
      },
      {
        align: "center",
        title: "意向等级",
        key: "intentionLevel",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) =>
          h("Rate", { props: { value: row.intentionLevel, disabled: true } })
      },
      {
        align: "center",
        title: "跟进结果",
        key: "followResult",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row }) =>
          h("p", {}, this.$filter.dictConvert(row.followResult))
      }
    ];
  }

  /**
   * 查看客户详情
   */
  private viewCustomerInfo(id) {
    this.showCustomerInfo({ id, enabledEdit: true, callBack: this.refreshData });
  }

  /**
   * 跟进
   */
  followCustomer(customerId) {
    this.$dialog.show({
      title: "意向记录",
      width: 1050,
      onRemove: () => { this.refreshData() },
      render: h =>
        h(CustomerInfoIntentionRecord, {
          props: {
            id: customerId,
            modifyRecord: true
          }
        })
    });
  }

  /**
   * 获取意向客户列表
   */
  private refreshData() {
    this.basicCustomerCenterService
      .findPotentialCustomerList(this.model, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  private addCustomerData(data) {
    return new Promise((resolve) => {
      this.basicCustomerService.addBasicCustomer(data).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
          this.refreshData()
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }

  private onCreatePotentialClick() {
    this.$dialog.show({
      title: "新增意向客户",
      footer: true,
      width: 1050,
      onOk: addCustomerInfoBasedata => {
        return addCustomerInfoBasedata.submit().then(v => {
          return this.addCustomerData(v).then(result => result)
        }).catch(() => false);
      },
      render: h => h(ModifyCustomerInfoBasedata)
    });
  }
}
</script>


<style lang="less" scoped>
</style>
