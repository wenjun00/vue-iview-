<!--新增用户字典项-->
<template>
  <section class="component create-modify-dict">
    <i-form ref="form" :model="model" :label-width="110" :rules="rules">
      <i-form-item label="名称" prop="dictItemName">
        <i-input v-model="model.dictItemName" :maxlength="50"></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { SysDictService } from "~/services/manage-service/sys-dict.service";
import { PageService } from "~/utils/page.service";
import { Form } from 'iview';
@Component({
  components: {}
})
export default class CreateModifyDict extends Vue {
  @Prop() dictData
  @Prop() typeId
  @Dependencies(SysDictService) private sysDictService: SysDictService;
  @Dependencies(PageService) private pageService: PageService;
  private model: any = {
    dictId: '',
    dictItemName: '',
    id: ''
  }

  private rules = {
    dictItemName: { required: true, message: "请输入数据名称", trigger: "change" }
  }
  mounted() {
    if (this.dictData) {
      this.model.dictItemName = this.dictData.dictItemName;
      this.model.dictId = this.dictData.dictId;
      this.model.id = this.dictData.id;
    } else {
      this.model.dictId = this.typeId
    }
  }
  /**
 * 添加用户字典项
 */
  create() {
    return new Promise((resolve) => {
      let form = <Form>this.$refs.form
      form.validate(valid => {
        if (!valid) return resolve(false);
        this.sysDictService.createUserDataDict(this.model).subscribe(
          val => {
            this.$Message.success("操作成功！");
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg);
            resolve(false)
          }
        );
      })
    })
  }

  /**
   * 编辑数据
   */
  edit() {
    return new Promise((resolve) => {
      let form = <Form>this.$refs.form
      form.validate(valid => {
        if (!valid) return resolve(false);
        this.sysDictService.updateDataDict(this.model).subscribe(
          val => {
            this.$Message.success("操作成功！");
            resolve(true)
          },
          err => {
            this.$Message.error(err.msg);
            resolve(false)
          }
        );
      })
    });
  }
}
</script>

<style lang="less">
.component.create-modify-dict {
  .ivu-form-item {
    margin: 20px 0;
    .ivu-input-wrapper.ivu-input-type {
      width: 100% !important;
    }
  }
}
</style>

