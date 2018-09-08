<!--修改菜单名称-->
<template>
  <section class="component modify-resource-menu">
    <i-form :label-width="140" :model="model" :rules="rules" ref="form">
      <i-form-item label="模块名称" prop="module">
        <i-input v-model="model.module" readonly></i-input>
      </i-form-item>
      <i-form-item label="菜单名称" prop="menu">
        <i-input v-model="model.menu" :maxlength="20"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { SysModuleService } from "~/services/manage-service/sys-module.service";
import { Form } from "iview";

@Component({
  components: {}
})
export default class ModifyResourceMenu extends Vue {
  @Dependencies(SysModuleService) private sysModuleService: SysModuleService;
  @Prop({ required: true }) info: any;

  private model: any = {
    module: "",
    menu: "",
    id: ""
  }

  mounted() {
    this.model = { ...this.info }
  }

  /**
   * 修改菜单名称
   */
  save() {
    return new Promise((resolve) => {
      this.sysModuleService.editResourceName(this.model.id, this.model.menu).subscribe(
        data => {
          this.$Message.success("操作成功")
          resolve(true)
        },
        err => {
          this.$Message.error(err.msg)
          resolve(false)
        }
      )
    })
  }


}
</script>

<style lang="less" scoped>
</style>
