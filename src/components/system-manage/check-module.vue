<!--查看模块功能-->
<template>
  <section class="component check-module">
    <i-form :label-width="110" :model="ToviewrowData" class="data-form">
      <i-form-item label="资源名称" prop="resourceName">
        <i-input v-model="ToviewrowData.resourceName" readonly></i-input>
      </i-form-item>
      <i-form-item label="资源图标" prop="resourceIcoUrl">
        <i-input v-model="ToviewrowData.resourceIcoUrl" readonly></i-input>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component'
  import {
    Prop
  } from "vue-property-decorator";

  @Component({})
  export default class CheckModule extends Vue {
    private ToviewrowData: any = {
      resoInitName: '',
      resoName: '',
      resoInitIcon: '',
      resoIcon: '',
      resoStatus: '',
      resoRemark: ''
    };

    created() {}
    getData(row) {
      this.ToviewrowData = row
    }
  }

</script>
<style lang="less" scoped>
  .component.check-module {
    .data-form {
      margin-top: 20px;
    }
  }

</style>
