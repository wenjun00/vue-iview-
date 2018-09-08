<!-- 产品列表 -->
<template>
  <section class="component product-list">
    <data-form :model="model" @on-search="refreshProductData">
      <template slot="input">
        <i-form-item prop="schemeName" label="产品名称：">
          <i-input placeholder="请输入产品名称" v-model="model.schemeName" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="repayType" label="还款方式：">
          <i-select v-model="model.repayType" clearable placeholder="请选择还款方式：">
            <i-option v-for="{label,value} of $dict.getDictData(10016)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="schemeStatus" label="发布状态：">
          <i-select v-model="model.schemeStatus" clearable placeholder="请选择产品发布状态">
            <i-option v-for="{label,value} of $dict.getDictData(10018)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" ref="databox" :page="pageService" highlightRow></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { RepaySchemeService } from '~/services/manage-service/basic-repay-scheme.service'
import { PageService } from "~/utils/page.service";
import ModifyProductBase from "~/components/base-data/product-manage/modify-product-base.tsx.vue";
import ProductBase from "./product-base.tsx.vue";
import ChooseCars from "./choose-cars.tsx.vue";
import ChooseSelectionCars from "./choose-selection-cars.tsx.vue";
import ChooseOrgs from "./choose-orgs.tsx.vue";
import FeeList from "./fee-list.tsx.vue"
import { Button } from "iview";
import DialogBox from "~/components/common/dialog-box.vue";
import DataBox from "~/components/common/data-box.vue";

@Component({
  components: {}
})
export default class ProductList extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService
  @Prop({
    required: true
  }) businessId: Number;

  @Watch('businessId', { immediate: true })
  onBusinessId() {
    if (this.businessId) this.refreshProductData()
  }

  private columns: any;
  private dataSet: any = [];

  private model = {
    schemeName: "",
    repayType: null,
    schemeStatus: null,
  }

  created() {


    let operateColumn = {
      title: "操作",
      width: this.$common.getOperateWidth(5),
      fixed: "left",
      align: "center",
      render: (h, { row, column, index }) => {
        if (row.schemeStatus === 10056) {
          return (<div>
            <i-button type="text" class="row-command-button" v-auth={594} onClick={() => this.publishClick(row.id)}>发布</i-button>
            <i-button type="text" class="row-command-button" v-auth={596} onClick={() => this.onEditClick(row.id)} >编辑</i-button>
            <i-button type="text" class="row-command-button" v-auth={597} onClick={() => this.onDeleteClick(row.id, row.schemeName)}>删除</i-button>
            <i-button type="text" class="row-command-button" v-auth={598} onClick={() => this.onEditFeeItemsClick(row.id)}>编辑费用项</i-button>
            <i-button type="text" class="row-command-button" v-auth={599} onClick={() => this.onChooesOrgsClick(row.id)}>选择机构</i-button>
            <i-button type="text" class="row-command-button" v-auth={600} onClick={() => this.onChooesCarsClick(row.id)}>选择车型</i-button>
          </div>
          )
        } else {
          return (
            <div>
              <i-button type="text" class="row-command-button" v-auth="595" onClick={() => this.publishClick(row.id)}>取消发布</i-button>
            </div>
          )
        }
      }
    }
    this.columns = [

      {
        align: "center",
        title: "产品名称",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => {
          return (
            <i-button type="text" class="row-command-button" onClick={() => this.onViewProductClick(row.id)}> {row.schemeName}</i-button>
          )
        }
      },
      {
        align: "center",
        title: "还款方式",
        key: "repayType",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row, columns, index }) => {
          return h('span', {}, this.$dict.getDictName(row.repayType))
        }
      },
      {
        align: "center",
        title: "期数",
        key: "periods",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        title: "支持车型",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => {
          return (
            <i-button type="text" class="row-command-button" onClick={() => this.onViewChooesCarsClick(row.id)}>支持车型</i-button>
          )
        }
      },
      {
        align: "center",
        title: "支持机构",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => {
          return (
            <i-button type="text" class="row-command-button" onClick={() => this.onViewChooesOrgsClick(row.id)}>支持机构</i-button>
          )
        }
      },
      {
        align: "center",
        title: "费用项",
        key: "schemeName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => {
          return (
            <i-button type="text" class="row-command-button" onClick={() => this.onViewFeeListClick(row.id)}>费用项</i-button>
          )
        }
      },
    ];

    this.columns.unshift(operateColumn)
  }

  /**
  * 刷新业务数据
  */
  public refreshProductData() {
    if (this.businessId) {
      this.repaySchemeService.querySchemeByBusiness(this.businessId, this.model, this.pageService)
        .subscribe(
          data => this.dataSet = data,
          err => this.$Message.error(err.msg)
        )
    }
  }

  /**
   * 编辑产品
   */
  private onEditClick(productId: Number) {
    this.$dialog.show({
      title: '编辑产品',
      footer: true,
      width: 700,
      onOk: (modify: ModifyProductBase) => {
        return modify.editProduct().then(v => {
          if (v) this.refreshProductData()
          return v
        })
      },
      render: h => (<ModifyProductBase productId={productId}></ModifyProductBase>)
    })
  }

  /**
   * 删除产品
   */
  private onDeleteClick(productId: Number, name: String) {
    this.$Modal.confirm({
      content: `是否删除产品: <b>${name}</b>`,
      onOk: () => {
        this.repaySchemeService.deleteRepayScheme(productId).subscribe(
          data => {
            this.$Message.success("操作成功")
            this.refreshProductData()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
  }

  /**
   * 发布，取消发布产品
   */
  private publishClick(productId: Number) {
    this.repaySchemeService.releaseRepayScheme(productId).subscribe(
      data => {
        this.$Message.success("操作成功")
        this.refreshProductData()
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查看产品基本信息
   */
  private onViewProductClick(productId: Number) {
    this.$dialog.show({
      title: '查看产品基本信息',
      isView: true,
      footer: true,
      width: 700,
      render: h => (<ProductBase productId={productId}></ProductBase>)
    })
  }

  private onEditFeeItemsClick(productId: Number) {
    this.$dialog.show({
      title: '编辑费用项',
      isView: true,
      footer: true,
      width: 1000,
      render: h => (<FeeList productId={productId}></FeeList>)
    })
  }

  private onViewFeeListClick(productId: Number) {
    this.$dialog.show({
      title: '查看费用项',
      isView: true,
      footer: true,
      width: 1000,
      render: h => (<FeeList productId={productId} isView={true}></FeeList>)
    })
  }

  /**
   * 选择机构
   */
  private onChooesOrgsClick(productId: Number) {
    this.$dialog.show({
      title: "机构选择",
      width: 1000,
      footer: true,
      onOk: (choose: ChooseOrgs) => {
        return choose.submit().then(v => v)
      },
      render: h => (<ChooseOrgs productId={productId}></ChooseOrgs>)
    })
  }

  /**
   * 查看支持的机构
   */
  private onViewChooesOrgsClick(productId: Number) {
    this.$dialog.show({
      title: "查看支持选择",
      width: 1000,
      isView: true,
      footer: true,
      render: h => (<ChooseOrgs isView={true} productId={productId}></ChooseOrgs>)
    })
  }

  /**
   * 选择车型
   */
  private onChooesCarsClick(productId: Number) {
    this.$dialog.show({
      title: "车辆选择",
      width: 1000,
      footer: true,
      onOk: (choose: ChooseCars) => {
        return choose.submit().then(v => v)
      },
      render: h => (<ChooseCars productId={productId}></ChooseCars>)
    })
  }

  /**
   * 查看支持的车型
   */
  private onViewChooesCarsClick(productId: Number) {
    this.$dialog.show({
      title: "查看支持车型",
      width: 1000,
      isView: true,
      footer: true,
      render: h => (<ChooseSelectionCars productId={productId}></ChooseSelectionCars>)
    })
  }
}
</script>

<style lang="less">
</style>
