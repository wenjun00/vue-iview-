<!--联系人信息-->
<template>
  <section class="component customer-info-contacts">
    <i-card style="padding-right:15px;text-align:right">
      请务必填写两个直系联系人和一个其他联系人！
    </i-card>
    <i-card class="contacts" title="直系联系人">
      <div slot="extra" v-if="edit">
        <a @click="addDirectContact">
          <svg-icon iconClass="add"></svg-icon>
          新增直系联系人
        </a>
      </div>
      <data-box :columns="directContactColumns" :data="directContactData" :height="0" highlightRow></data-box>
    </i-card>

    <i-card class="contacts" title="其他联系人">
      <div slot="extra" v-if="edit">
        <a @click="addOtherContact">
          <svg-icon iconClass="add"></svg-icon>
          新增其他联系人
        </a>
      </div>
      <data-box :columns="otherContactColumns" :data="otherContactData" :height="0" highlightRow></data-box>
    </i-card>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerContactService } from "~/services/manage-service/basic-customer-contact.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Button } from "iview";
import ModifyCustomerInfoDirectContacts from "./modify-customer-info-direct-contacts.vue";
import ModifyCustomerInfoOtherContacts from "./modify-customer-info-other-contacts.vue";

@Component({
  components: {
    DataGrid, DataGridItem
  }
})
export default class CustomerInfoContacts extends Vue {
  @Dependencies(BasicCustomerContactService) private basicCustomerContactService: BasicCustomerContactService
  @Prop() id: Number

  /** 是否可编辑 */
  @Prop({ default: false }) edit: Boolean

  private directContactColumns: Array<any> = [];
  private directContactData: Array<any> = [];
  private otherContactColumns: Array<any> = [];
  private otherContactData: Array<any> = [];

  @Watch("id", { immediate: true })
  onIdChange() {
    if (this.id) this.refreshData()
  }

  created() {
    this.directContactColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        render: (h, { row, column, index }) => {
          return (<div>
            <i-button type="text" class="row-command-button" onClick={() => this.modifyDirectContact(row)}>修改</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.onDeleteClick(row)}>删除</i-button>
          </div>)
        }
      },
      {
        align: "center",
        title: "姓名",
        key: "contactName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "关系",
        key: "contactRelation",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.contactRelation)}</div>)
      },
      {
        align: "center",
        title: "身份证号",
        key: "idCard",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "联系方式",
        key: "contactPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "户籍所在地",
        key: "area",
        minWidth: this.$common.getColumnWidth(6),
        render: (h, { row }) => (<div>{this.$city.getCityName(row.province)} {this.$city.getCityName(row.city)} {this.$city.getCityName(row.area)} {row.contactAddress}</div>)
      }
    ]

    this.otherContactColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(1),
        align: "center",
        render: (h, { row, column, index }) => {
          return (<div>
            <i-button type="text" class="row-command-button" onClick={() => this.modifyOtherContact(row)}>修改</i-button>
            <i-button type="text" class="row-command-button" onClick={() => this.onDeleteClick(row)}>删除</i-button>
          </div>)
        }
      },
      {
        align: "center",
        title: "姓名",
        key: "contactName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "关系",
        key: "contactRelation",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row }) => (<div>{this.$dict.getDictName(row.contactRelation)}</div>)
      },
      {
        align: "center",
        title: "联系方式",
        key: "contactPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "单位名称",
        key: "contractCompany",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "职位",
        key: "contractJob",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "家庭地址",
        key: "referencePrice",
        minWidth: this.$common.getColumnWidth(6),
        render: (h, { row }) => (<div>{this.$city.getCityName(row.province)} {this.$city.getCityName(row.city)} {this.$city.getCityName(row.area)} {row.contactAddress}</div>)
      }
    ]
  }

  /**
   * 刷新数据
   */
  private refreshData() {
    this.directContactData = [];
    this.otherContactData = [];
    this.basicCustomerContactService.findCustomerContactList(this.id).subscribe(
      data => {
        data.forEach(v => {
          if (v.contactType === 10316) this.directContactData.push(v)
          if (v.contactType === 10317) this.otherContactData.push(v)
        })
      },
      err => this.$Message.error(err.msg)
    )
  }
  /**
   * 新增直系联系人
   */
  private addDirectContact() {
    this.$dialog.show({
      title: '新增直系联系人',
      footer: true,
      width: 1000,
      onOk: addCustomerInfoContacts => {
        return addCustomerInfoContacts.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      render: h => h(ModifyCustomerInfoDirectContacts, {
        props: {
          customerId: this.id
        }
      })
    })
  }
  /**
   * 修改直系联系人
   */
  private modifyDirectContact(contactInfo) {
    contactInfo.customerId = this.id
    let tmpData = Object.assign({}, contactInfo)
    this.$dialog.show({
      title: "修改直系联系人",
      footer: true,
      width: 1000,
      onOk: modifyCustomerInfoContacts => {
        return modifyCustomerInfoContacts.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      onCancel: () => {
        this.refreshData()
      },
      render: h => h(ModifyCustomerInfoDirectContacts, {
        props: {
          data: tmpData
        }
      })
    })
  }
  /**
  * 新增其他联系人
  */
  private addOtherContact() {
    this.$dialog.show({
      title: '新增其他联系人',
      footer: true,
      width: 1000,
      onOk: addCustomerInfoContacts => {
        return addCustomerInfoContacts.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      render: h => h(ModifyCustomerInfoOtherContacts, {
        props: {
          customerId: this.id
        }
      })
    })
  }
  /**
   * 修改其他联系人
   */
  private modifyOtherContact(contactInfo) {
    contactInfo.customerId = this.id
    let tmpData = Object.assign({}, contactInfo)
    this.$dialog.show({
      title: "修改其他联系人",
      footer: true,
      width: 1000,
      onOk: modifyCustomerInfoContacts => {
        return modifyCustomerInfoContacts.submit().then(v => {
          if (v) this.refreshData()
          return !!v
        })
      },
      onCancel: () => {
        this.refreshData()
      },
      render: h => h(ModifyCustomerInfoOtherContacts, {
        props: {
          data: tmpData
        }
      })
    })
  }
  /**
  * 删除联系人信息
  */
  onDeleteClick(contactInfo) {
    this.$Modal.confirm({
      title: '提示',
      content: `确定删除联系人<b>${contactInfo.contactName}</b>的信息吗？`,
      onOk: () => {
        this.basicCustomerContactService.deleteCustomContant(contactInfo.id)
          .subscribe(val => {
            this.$Message.success(`删除联系人<b>${contactInfo.contactName}</b>的信息成功！`)
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
.component.customer-info-contacts {
  .customer-no {
    min-height: 500px;
    margin: 0 auto 5px 40px;
  }
  .contacts {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.component.customer-info-contacts {
  .ivu-card-body {
    padding: 0;
  }
}
</style>
