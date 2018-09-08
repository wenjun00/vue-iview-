<!--新增组织-->
<template>
  <section class="component modify-org">
    <i-form :label-width="110" ref="form" :model="orgModel" :rules="rules">
      <i-form-item label="机构名称" prop="orgName">
        <i-input v-model="orgModel.orgName" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="机构性质" prop="orgKind" v-if="isView">
        <i-select v-model="orgModel.orgKind">
          <i-option v-for="{value,label} in $dict.getDictData(10095)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="机构类型" prop="orgType">
        <i-select v-model="orgModel.orgType">
          <i-option v-for="{value,label} in $dict.getDictData(10002)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="上级机构" prop="pid" v-if="isView">
        <i-input v-model="orgModel.orgPname" readonly></i-input>
      </i-form-item>
      <i-form-item label="是否启用" prop="orgStatus">
        <i-select v-model="orgModel.orgStatus">
          <i-option v-for="{value,label} in $dict.getDictData(10007)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="备注" prop="orgRemark">
        <i-input v-model="orgModel.orgRemark" type="textarea" :maxlength="100"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { SysOrgService } from "~/services/manage-service/sys-org.service";
import { Dependencies } from "~/core/decorator";
import { Form } from "iview";

@Component({
  components: {}
})
export default class ModifyOrg extends Vue {
  @Dependencies(SysOrgService) private sysOrgService: SysOrgService;
  // 修改机构时候传过来的数据
  @Prop() orgData
  // 增加机构时候的pid
  @Prop() pid
  @Prop({
    type: String,
    default: ''
  }) orgPname

  private isView: Boolean = true
  private form: Form
  private rules = {
    orgName: { required: true, message: "请输入机构名称", trigger: "blur" },
    orgKind: { required: true, message: "请选择机构类型", trigger: "blur", type: "number" },
    orgType: { required: true, message: "请选择机构性质", trigger: "blur", type: "number" }
  }

  private orgModel = {
    id: '',
    orgPid: '',
    orgPname: '',
    orgKind: '',
    orgName: '',
    orgRemark: '',
    orgStatus: 10022,
    orgType: 10006
  }

  update() {
    return new Promise((resolve) => {
      this.form.validate(v => {
        if (!v) return resolve(false)
        this.sysOrgService.editOrganization(this.orgModel)
          .subscribe(
            data => {
              this.$Message.success('修改成功')
              resolve(true)
            },
            err => {
              this.$Message.error(err.msg)
              resolve(false)
            }
          )
      })
    })
  }


  create() {
    return new Promise((resolve) => {
      this.orgModel.orgPid = this.pid

      this.form.validate(v => {
        if (!v) return resolve(false)
        this.sysOrgService.addOrganization(this.orgModel)
          .subscribe(
            data => {
              this.$Message.success('新增成功')
              resolve(true)
            },
            err => {
              this.$Message.error(err.msg)
              resolve(false)
            }
          )
      })
    })
  }

  mounted() {
    this.form = this.$refs.form
    if (this.orgPname) this.orgModel.orgPname = this.orgPname
    if (this.orgData) {
      this.orgModel = this.orgData
      if(!this.orgData.orgPid) this.isView = false
    }
  }

}
</script>
<style lang="less" scoped>
</style>
