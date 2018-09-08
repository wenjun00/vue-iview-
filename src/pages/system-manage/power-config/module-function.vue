<!--模块功能-->
<template>
  <section class="page module-function">
    <page-header title="模块功能" hidden-print hidden-export></page-header>

    <div class="module-function-container">
      <div class="module-tree">
        <data-tree :data="treeData" @on-select-change="onSelectChanged"></data-tree>
      </div>
      <div class="function-list">
        <data-box :columns="treeColumns" :data="dataSet"></data-box>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import DataBox from "~/components/common/data-box.vue";
import Page from "~/core/page";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Layout } from "~/core/decorator";
import { SysModuleService } from "~/services/manage-service/sys-module.service";
import { PageService } from "~/utils/page.service";
import DataTree from "~/components/common/data-tree.vue";
import ModifyResourceMenu from "~/components/system-manage/modify-resource-menu.vue";
import { resourceMenuType } from "~/config/enum.config";

@Layout("workspace")
@Component({
  components: { DataTree }
})
export default class ModuleFunction extends Page {
  @Dependencies(SysModuleService) private sysModuleService: SysModuleService;

  private treeData: Array<any> = [];
  private treeColumns: any;
  private dataSet: Array<Object> = [];

  private selectedData: any;

  created() {
    this.treeColumns = [
      {
        align: "center",
        title: "操作",
        width: this.$common.getOperateWidth(1),
        fixed: "left",
        render: (h, { row, columns, index }) => {
          return [
            h(
              "i-button",
              {
                props: {
                  type: "text"
                },
                directives: this.$common.bindAuth(568),
                class: ["row-command-button"],
                on: {
                  click: () => this.editResourceName(row)
                }
              },
              "修改"
            )
          ];
        }
      },
      {
        align: "center",
        key: "resourceName",
        title: "菜单名称"
      },
    ];
  }

  mounted() {
    this.getTreeDate()
  }

  /**
   * 确定修改资源名称
   */
  private editResourceName(row) {
    let info = {
      id: row.id,
      menu: row.resourceName,
      module: this.selectedData.title
    }
    this.$dialog.show({
      title: "修改菜单名称",
      width: 500,
      footer: true,
      onOk: (modify: ModifyResourceMenu) => {
        return modify.save().then(v => {
          if (v) this.refreshData()
          return v
        })
      },
      render: h => h(ModifyResourceMenu, {
        props: {
          info: info
        }
      })
    })
  }


  /**
   * 获取树接口
   */
  private getTreeDate() {
    this.sysModuleService.getRoleMenu().subscribe(
      data => {
        data = data.filter(x => x.resourceFileType === resourceMenuType.module).map((v, index) => {
          return {
            id: v.id,
            title: v.resourceName,
            pid: -1,
            _selected: index === 0
          }
        })
        this.treeData = data
      },
      err => this.$Message.error(err.msg)
    );
  }

  private refreshData() {
    this.sysModuleService.findChildMenu(this.selectedData.id)
      .subscribe(
        data => this.dataSet = data,
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 节点改变
   */
  private onSelectChanged(data) {
    this.selectedData = data
    this.refreshData()
  }

}
</script>

<style lang="less" scoped>
.page.module-function {
  .module-function-container {
    display: flex;
  }
  .module-tree {
    min-width: 260px;
    overflow: auto;
    border-right: 1px solid #ccc;
  }
  .function-list {
    flex: 1;
  }
}
</style>
