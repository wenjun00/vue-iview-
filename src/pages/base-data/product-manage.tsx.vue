<template>
  <section class="page product-manage">
    <page-header title="产品管理" hiddenPrint hiddenExport>
      <command-button label="新增业务" v-auth="592" @click="addProductBusiness"></command-button>
      <command-button v-if="businessId" label="新增产品" v-auth="593" @click="addProduct"></command-button>
    </page-header>
    <div class="product-manage-container">
      <div class="product-series container-height">
        <data-tree ref="data-tree" showEdit :data="productSeriesData" :edit-config="nodeEditTypes" @on-select-change="onTreeNodeChanged" @on-edit="onEdit" @on-delete="ondeleteClick"></data-tree>
      </div>
      <div class="product-list">
        <div v-if="!businessId" class="no-data-notice">请选择业务</div>
        <product-list v-else ref="productList" :businessId="businessId"></product-list>
      </div>
    </div>
  </section>
</template>

<script lang="tsx">
import Page from '~/core/page'
import { Layout, Dependencies } from '~/core/decorator'
import Component from "vue-class-component";
import { EditType } from "~/config/enum.config";
import { Button } from "iview";
import DataTree from "~/components/common/data-tree.vue";
import { BasicProductService } from "~/services/manage-service/basic-product.service";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";
import ProductBusiness from "~/components/base-data/product-manage/product-business.vue";
import ModifyProductBase from '~/components/base-data/product-manage/modify-product-base.tsx.vue';
import ProductList from "~/components/base-data/product-manage/product-list.tsx.vue";

@Layout('workspace')
@Component({
  components: {
    DataTree,
    ProductList
  }
})
export default class ProductManage extends Page {
  @Dependencies(BasicProductService) private basicProductService: BasicProductService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;

  private nodeEditTypes = [EditType.MODIFY, EditType.DELETE]
  private productSeriesData: any[] = [];
  private businessId: number = null;



  private refreshBusinessList() {
    this.repaySchemeService.findBusinessList().subscribe(
      data => {
        this.productSeriesData = data.map(v => {
          return {
            id: v.id,
            title: v.businessName
          }
        })
      },
      err => this.$Message.error(err.msg)
    )
  }

  private onEdit(data) {
    this.$dialog.show({
      title: "修改业务",
      footer: true,
      onOk: (edit: ProductBusiness) => {
        return edit.submit().then(v => {
          if (v) this.refreshBusinessList()
          return v
        })
      },
      render: h => (<ProductBusiness id={data.id}></ProductBusiness>)
    })
  }

  private ondeleteClick(data) {
    this.$Modal.confirm({
      title: '提示',
      content: `确定删除<b>${data.title}</b>吗？`,
      onOk: () => {
        this.repaySchemeService.deleteBusinessById(data.id).subscribe(
          val => {
            this.$Message.success(`删除成功！`)
            this.refreshBusinessList()
          },
          err => this.$Message.error(err.msg)
        )
      }
    })
  }

  private onTreeNodeChanged(data) {
    this.businessId = data.id
  }

  /**
   * 新增产品系列
   */
  private addProductBusiness() {
    this.$dialog.show({
      title: "新增业务",
      footer: true,
      onOk: (add: ProductBusiness) => {
        return add.submit().then(v => {
          if (v) this.refreshBusinessList()
          return v
        })
      },
      render: h => (<ProductBusiness></ProductBusiness>)
    })
  }


  /**
   * 新增产品
   */
  private addProduct() {
    this.$dialog.show({
      title: '新增产品',
      footer: true,
      width: 700,
      onOk: (add: ModifyProductBase) => {
        return add.addProduct().then(v => {
          if (v) {
            let productList = this.$refs.productList as ProductList;
            productList.refreshProductData()
          }
          return v
        })
      },
      render: h => (<ModifyProductBase businessId={this.businessId}></ModifyProductBase>)
    })
  }

  mounted() {
    this.refreshBusinessList()
  }
}
</script>


<style lang="less" scoped>
.page.product-manage {
  .product-manage-container {
    display: flex;
  }
  .product-series {
    min-width: 260px;
    overflow: auto;
    border-right: 1px solid #ccc;
  }
  .product-list {
    flex: 1;
  }
}
</style>
