<!-- 选择机构 手动、采购入库 -->
<template>
  <section class="component choose-orgs-purchase">
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
    <data-box :columns="columns" ref="databox" :data="dataSet" highlightRow :page="pageService" @on-page-change="refreshData"></data-box>
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
import DataBox from "~/components/common/data-box.vue";
import { selecOrgs } from "~/interfaces/work.interface";

// 支持机构类型
const supportOrgType = [10209, 10293];

@Component({
  components: {}
})
export default class ChooseOrgsPurchase extends Vue {
  @Dependencies(SysOrgService) private sysOrgService: SysOrgService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;
  @Dependencies(PageService) private pageService: PageService;

  private columns: Array<any> = null;
  private dataSet: Array<any> = []; // 机构数据
  private model: any = null;

  private orgTypes: any[] = this.$dict.getDictData(10002).filter(x => supportOrgType.includes(x.value))

  created() {
    this.model = {
      zCompany: "",
      fCompany: "",
      store: "",
      type: ""
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
  }

  /**
   * 获取选中的机构
   */
  get selectData(): selecOrgs {
    let selecOrgs: selecOrgs = null;
    let data = (this.$refs.databox as DataBox).currentRow || {}
      selecOrgs = {
        zCompany: data.zCompany,
        fCompany: data.fCompany,
        store: data.store,
        type: data.type,
        storeId: data.storeId
      }
    return selecOrgs
  }

  /**
   * 更新数据
   */
  private refreshData() {
    this.sysOrgService.queryStoreAndExternal(this.model, this.pageService).subscribe(
      data => {
        // data.forEach(v => { v._highlight = v.modelId === this.carId })
        this.dataSet = data
      },
      err => this.$Message.error(err.msg)
    )
  }

  submit() {
    return new Promise((resolve) => {
      if (!this.selectData) return resolve(false)
      return resolve(this.selectData)
    })
  }

  mounted() {
    this.refreshData()
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
