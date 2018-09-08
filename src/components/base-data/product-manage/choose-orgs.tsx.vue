<!-- 选择机构 -->
<template>
  <section class="component choose-orgs">
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item label="总公司名称：" prop="zCompany">
          <i-input placeholder="请输入总公司名称" v-model="model.zCompany" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="分公司名称：" prop="fCompany">
          <i-input placeholder="请输入分公司名称" v-model="model.fCompany" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="机构类型" prop="type">
          <i-select v-model="model.type" clearable>
            <i-option v-for="{label,value} of orgTypes" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="门店名称：" prop="store">
          <i-input placeholder="请输入门店名称" v-model="model.store" clearable :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <div v-if="!isView" class="chooes-all">
      全选：
      <i-switch v-model="selectedAll" @on-change="onSelectedAllChange"></i-switch>
    </div>
    <data-box :columns="columns" :data="dataSet" highlightRow :page="pageService" @on-selection-change="onSelectionChange" @on-page-change="refreshData"></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { SysOrgService } from "~/services/manage-service/sys-org.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import { PageService } from "~/utils/page.service";
import { Button } from "iview";

// 支持机构类型
const supportOrgType = [10209, 10293];

@Component({
  components: {}
})
export default class ChooseOrgs extends Vue {
  @Dependencies(SysOrgService) private sysOrgService: SysOrgService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(PageService) private pageService: PageService;
  @Prop({
    required: true
  }) productId: number;

  @Prop({
    type: Boolean,
    default: false
  }) isView: boolean;

  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 机构数据
  private model: any = null;
  // 是否全选
  private selectedAll: boolean = false;
  // 选中的机构，非全选时候
  private selectedOrgs: Set<Number> = null;
  private orgTypes: any[] = this.$dict.getDictData(10002).filter(x => supportOrgType.includes(x.value))

  created() {
    this.model = {
      zCompany: "",
      fCompany: "",
      store: "",
      type: ""
    }
    let selectionColumn = {
      align: "center",
      type: "selection",
      width: 60
    }
    this.columns = [
      {
        align: "center",
        title: "总公司名称",
        key: "zcompany",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "分公司名称",
        key: "fcompany",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        title: "门店名称",
        key: "store",
        minWidth: this.$common.getColumnWidth(6)
      },
      {
        align: "center",
        title: "机构性质",
        key: "orgKind",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.orgKind)}</span>)
      },
      {
        align: "center",
        title: "机构类型",
        key: "type",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<span>{this.$dict.getDictName(row.type)}</span>)
      }
    ]

    if (!this.isView) this.columns.unshift(selectionColumn)
  }



  /**
   * 当选中项变更的时候对缓存数据进行修正
   */
  private onSelectionChange(selection: any[]) {
    this.dataSet.forEach(v => {
      if (selection.findIndex(s => s.storeId === v.storeId) < 0) {
        if (this.selectedAll) this.selectedAll = false
        if (this.selectedOrgs.has(v.storeId)) this.selectedOrgs.delete(v.storeId)
      } else {
        this.selectedOrgs.add(v.storeId);
      }
    })
    if (this.pageService.total === this.selectedOrgs.size) {
      this.selectedAll = true
      this.selectedOrgs.clear()
    }
  }

  /**
   * 开关触发 清空所选机构
   */
  private onSelectedAllChange(flag) {
    this.selectedOrgs.clear()
    this.refreshData()
  }

  /**
   * 获取所选机构
   */
  private getSelectedOrgs() {
    this.repaySchemeService.findSchemeOrg(this.productId).subscribe(
      data => {
        this.selectedAll = data.isAll === 1 ? true : false;
        this.selectedOrgs = new Set<Number>(data.orgIds)
        this.refreshData()
      },
      err => this.$Message.error(err.msg)
    )
  }

  private refreshData() {
    if (!this.isView) {
      // 非查看模式。展示所有车辆，并且回显选择的机构
      this.sysOrgService.queryStoreAndExternal(this.model, this.pageService).subscribe(
        data => {
          this.dataSet = data.map(v => {
            v._checked = this.selectedAll || this.selectedOrgs.has(v.storeId)
            return v
          })
        },
        err => this.$Message.error(err.msg)
      )
    } else {
      // 查看模式，只展示选中的机构
      this.repaySchemeService.querySchemeOrg(this.productId, this.model, this.pageService)
        .subscribe(
          data => this.dataSet = data,
          err => this.$Message.error(err.msg)
        )
    }
  }

  /**
   * 提交选择的机构
   */
  public submit() {
    return new Promise((resolve) => {
      this.repaySchemeService.schemeOrg(this.productId, this.selectedAll, Array.from(this.selectedOrgs)).subscribe(
        data => {
          this.$Message.success("操作成功")
          return resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          return resolve(false)
        }
      )
    })
  }
  mounted() {
    if (this.productId) {
      this.isView ? this.refreshData() : this.getSelectedOrgs()
    }
  }

}
</script>

<style lang="less" scoped>
.component.choose-orgs {
  .chooes-all {
    margin-top: 20px;
    padding-left: 30px;
  }
}
</style>
