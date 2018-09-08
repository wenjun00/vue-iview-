<!--数据字典-->
<template>
  <section class="page user-data-dict">
    <page-header title="用户字典" hiddenPrint hiddenExport>
      <command-button label="新增字典项" @click="createDictItem" v-auth="571"></command-button>
    </page-header>
    <i-row class="data-form">
      <i-row type="flex" align="top" justify="start">
        <i-col :span="4">
          <div class="data-form-item">
            <div class="user-data container-height">
              <data-tree ref="data-tree" :data="dataType" @on-select-change="onTreeNodeChanged"></data-tree>
            </div>
          </div>
        </i-col>
        <i-col class="command" :span="20">
          <data-form hidden-date-search :model="dictAguments" @on-search="getUserDictItems">
            <template slot="input">
              <i-form-item prop="dictItemName" label="数据名称">
                <i-input v-model="dictAguments.dictItemName" :maxlength="50"></i-input>
              </i-form-item>
            </template>
          </data-form>
          <data-box :columns="columns1" :data="dataNames" :noDefaultRow="true"></data-box>
        </i-col>
      </i-row>
    </i-row>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import Component from "vue-class-component";
import { Button } from "iview";
import { Dependencies } from "~/core/decorator";
import { Layout } from "~/core/decorator";
import DataTree from "~/components/common/data-tree.vue";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import CreateModifyDict from "~/components/system-manage/create-modify-dict.vue";

@Layout("workspace")
@Component({
  components: {
    DataTree
  }
})
export default class SysDict extends Page {
  @Dependencies(SysDictService) private sysDictService: SysDictService;
  private dataType: Array<any> = [];
  private dataNames: Array<any> = [];
  private item: any;
  private columns1: any;
  private dictAguments: any = null;

  /**
   * 新增用户字典项
   */
  createDictItem() {
    this.$dialog.show({
      title: "新增数据",
      footer: true,
      width: 700,
      onOk: (createModifyDict: CreateModifyDict) => {
        return createModifyDict.create().then(v => {
          if (v) this.getUserDictItems();
          return v;
        });
      },
      render: h => <CreateModifyDict typeId={this.dictAguments.id}></CreateModifyDict>

    });
  }
  /**
   * 编辑用户字典项
   */
  private editDictItem(row: any) {
    this.$dialog.show({
      title: "编辑数据",
      footer: true,
      width: 700,
      onOk: (createModifyDict: CreateModifyDict) => {
        return createModifyDict.edit().then(v => {
          if (v) this.getUserDictItems();
          return v;
        });
      },
      render: h => <CreateModifyDict dictData={row}></CreateModifyDict>
    });
  }

  created() {
    this.dictAguments = {
      dictItemName: "",
      id: ""
    };

    this.columns1 = [
      {
        title: "操作",
        fixed: "left",
        align: "center",
        width: this.$common.getOperateWidth(2),
        render: (h, { row, column, index }) => (
          <div>
            <i-button type="text" class="row-command-button" v-auth={572} onClick={() => this.editDictItem(row)}>修改</i-button>
            <i-button type="text" class="row-command-button" v-auth={573} onClick={() => this.deleteDataDict(row.id)}>删除</i-button>
          </div>
        )
      },
      {
        align: "center",
        title: " 名称",
        key: "dictItemName",
        minWidth: this.$common.getColumnWidth(5)
      },
      {
        align: "center",
        title: "编号",
        key: "id",
        minWidth: this.$common.getColumnWidth(5)
      }
    ];
  }

  mounted() {
    this.getAllDictType();
  }

  /**
   * 查询所有数据字典类型
   */
  getAllDictType() {
    this.sysDictService.getAllUserDictType().subscribe(val => {
      this.dataType = val.map((v, index) => {
        let data = {
          id: v.id,
          title: v.dictName,
          dictCode: v.dictCode,
          _selected: false
        };
        if (index === 0) {
          data._selected = true
          this.dictAguments.id = data.id
        }
        return data
      });
      this.getUserDictItems();
    });
  }

  // 点击树当前节点
  private onTreeNodeChanged(data) {
    this.dictAguments.id = data.id
    this.getUserDictItems();
  }

  /**
   * 根据数字字典查询对应的数据字典
   */
  private getUserDictItems() {
    this.sysDictService
      .getDataDictByTypeCode(this.dictAguments)
      .subscribe(val => {
        this.dataNames = val;
      });
  }

  /**
   *  删除
   */
  deleteDataDict(itemId: number) {
    this.$Modal.confirm({
      title: "提示",
      content: "确定删除吗？",
      onOk: () => {
        this.sysDictService.deleteDataDict(itemId).subscribe(
          val => {
            this.$Message.success("操作成功！");
            this.getUserDictItems()
          },
          err => {
            this.$Message.error(err.msg);
          }
        );
      }
    });
  }
}
</script>
<style lang="less" scoped>
.page.user-data-dict {
  .data-form {
    // margin-top: 10px;
    .data-form-item {
      display: flex;
      flex-direction: row;
      flex: 1;
      .user-data {
        width: 260px;
        flex-basis: 260px;
        border-right: solid 1px #ccc;
        overflow-y: auto;
      }
      .data-form-item-add {
        float: right;
        margin-right: 12px;
        color: #265ea2;
      }
    }
    .command {
      .command-item {
        width: 20%;
      }
      .command-add {
        margin-left: 10px;
        position: absolute;
        right: 13px;
      }
    }
    .data-form-list {
      width: 100%;
      height: 600px;
      border: 1px solid #dddd;
      border-top: 0;
      overflow: auto;
      .data-form-datatypelist {
        cursor: pointer;
        width: 100%;
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        position: relative;
        margin: auto;
      }
    }
  }
}

.dataTypeCss {
  background: #e4f4fa;
}
</style>
<style lang="less">
.page.user-data-dict {
  .toViewModalClass {
    .ivu-modal-footer {
      display: none !important;
    }
  }
  .ivu-select.ivu-select-single.ivu-select-small,
  .ivu-select-single .ivu-select-selection {
    width: 80px !important;
    display: inline-block;
  }
  .component.dialog .dialog-modal .ivu-modal .ivu-modal-content {
    min-width: 520px;
  }
}
</style>
