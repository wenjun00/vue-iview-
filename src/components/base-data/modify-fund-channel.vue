<!--维护资金渠道-->
<template>
  <section class="component modify-fund-channel">
    <i-form ref="form" :model="model" :label-width="110" :rules="rules" inline>
      <i-form-item label="资金编号" prop="channelNo">
        <i-input v-model="model.channelNo" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="资金名称" prop="channelName">
        <i-input v-model="model.channelName" :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="资金成本" prop="channelCost">
        <i-input-number v-model="model.channelCost" :min="0" :max="100" :formatter="$filter.percentFormat" :parser="$filter.percentParse"></i-input-number>
      </i-form-item>
      <i-form-item label="资金规模" prop="channelScale">
        <i-input-number v-model="model.channelScale" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
      </i-form-item>
      <i-form-item label="资金有效期" prop="endDate">
        <i-date-picker type="daterange" class="form-picker" v-model="model.endDate" clearable placeholder="选择时间"></i-date-picker>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicFundsChannelService } from "~/services/manage-service/basic-funds-channel.service.ts";
import { Form } from "iview";

@Component({})
export default class ModifyFundChannel extends Vue {
  @Dependencies(BasicFundsChannelService) private basicFundsChannelService: BasicFundsChannelService;
  @Prop() fundChannelData;

  private model: any = {
    channelNo: "", // 资金编号
    channelName: "", // 资金名称
    channelCost: null, // 资金成本
    endDate: [], // 资金有效期
    channelScale: null, // 资金规模
  };

  private rules = {
    channelNo: { required: true, message: "请输入资金编号", trigger: "blur" },
    channelName: { required: true, message: "请输入资金名称", trigger: "blur" },
    channelCost: { required: true, message: "请输入资金成本", trigger: "blur", type: "number" },
    channelScale: { required: true, message: "请输入资金规模", trigger: "blur", type: "number" },
    endDate: { required: true,validator: this.$validator.validateArray, trigger: "blur" }
  };

  /**
   *
   */
  mounted() {
    if (this.fundChannelData) {
      let endDate = [];
      endDate.push(new Date(this.fundChannelData.startDate));
      endDate.push(new Date(this.fundChannelData.endDate));
      this.model.id = this.fundChannelData.id;
      this.model.channelNo = this.fundChannelData.channelNo;
      this.model.channelName = this.fundChannelData.channelName;
      this.model.channelCost = this.fundChannelData.channelCost;
      this.model.endDate = endDate;
      this.model.channelScale = this.fundChannelData.channelScale;
    }
  }

  /**
   * 添加资金渠道
   */
  private addSupplier() {
    return new Promise((resolve, reject) => {
      this.basicFundsChannelService
        .addBasicFundsChannel(this.model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }

  /**
   * 修改资金渠道
   */
  private modifySupplier() {
    return new Promise((resolve, reject) => {
      this.basicFundsChannelService
        .editBasicFundsChannel(this.model)
        .subscribe(data => resolve(true), err => reject(err));
    });
  }

  /**
   * 提交数据
   */
  submit() {
    let form = this.$refs["form"] as Form;
    return new Promise(resolve => {
      form.validate(v => {
        if (!v) return resolve(false);
        let result = this.fundChannelData ? this.modifySupplier() : this.addSupplier();
        result.then(v => {
          this.$Message.success("操作成功！");
          resolve(true);
        }).catch(err => {
          this.$Message.error(err.msg);
          resolve(false);
        });
      });
    });
  }
}
</script>
<style lang="less">
</style>
