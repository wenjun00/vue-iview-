<!--分配角色-->
<template>
  <section class="component user-role-manage">
    <data-form ref="user-search-form" hidden-date-search :model="queryParamsModel" @on-search="searchRolesByAuth">
      <template slot="input">
        <i-form-item prop="roleName" label="角色名：">
          <i-input v-model="queryParamsModel.roleName" placeholder="请输入角色名称" :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :data="dataSet" ref="databox" @on-selection-change="onSelectionChanged" @on-page-change="searchRolesByAuth" :page="pageService" :height="500"></data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { SysUserService } from "~/services/manage-service/sys-user.service";
import { SysRoleService } from "~/services/manage-service/sys-role.service";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { Object } from "core-js";
@Component({
  components: {}
})
export default class UserRoleManage extends Vue {
  @Dependencies(SysRoleService) private sysRoleService: SysRoleService;
  @Dependencies(SysUserService) private sysUserService:SysUserService;
  @Dependencies(PageService) private pageService: PageService;
  @Prop() userIds: any;

  // 用户所拥有的角色ID
  private userRoles: Set<Number> = new Set<Number>();
  private dataSet: Array<any> = [];
  private queryParamsModel: any = {
    roleName: ""
  };

  // 列配置
  private columns = [
    {
      align: "center",
      type: "selection",
      width: 60
    },
    {
      align: "center",
      title: "角色名称",
      key: "roleName",
      minWidth: this.$common.getColumnWidth(5)
    },
    {
      align: "center",
      title: "备注",
      key: "roleDesc",
      minWidth: this.$common.getColumnWidth(5)
    }
  ];

  /**
   * 选择项发生改变时
   */
  private onSelectionChanged(selections) {
    // 清空已选项
    this.userRoles=new Set<Number>();

    selections.forEach(v => this.userRoles.add(v.id));
  }

  /**
   * 获取自己所能分配的所有角色
   */
  private searchRolesByAuth() {
    this.sysRoleService
      .findAllEnableRoleByAuth(this.queryParamsModel, this.pageService)
      .subscribe(
        data => {
          this.dataSet = data;
        },
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 更新用户角色
   */
  updateUserRole() {
    return new Promise(resolve => {
      this.sysUserService
        .userBatchAllocateRoles(Array.from(this.userRoles), this.userIds)
        .subscribe(
          data => {
            this.$Message.success("更新成功");
            resolve(true);
          },
          err => {
            this.$Message.error(err.msg);
            resolve(false);
          }
        );
    });
  }

  mounted() {
    this.searchRolesByAuth();
  }
}
</script>
 <style lang="less" scoped>
</style>
