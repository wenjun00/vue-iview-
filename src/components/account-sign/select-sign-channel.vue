<!--选择签约渠道-->
<template>
  <section class="component select-sign-channel">
    <i-form :model="model" :rules="rules" ref="form" :label-width="110" inline>
      <i-form-item label="签约渠道" prop="signChannel">
        <i-select v-model="model.signChannel" clearable>
          <i-option v-for="{label,value} of channelList" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
    </i-form>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { Dependencies } from '~/core/decorator';
import { RepaymentService } from "~/services/manage-service/repayment.service";
import { Form } from "iview";

@Component({
  components: {
  }
})
export default class SelectSignChannel extends Vue {
  @Dependencies(RepaymentService) private repaymentService: RepaymentService;

  @Prop() customerId

  private channelList = [
    {
      label: '平安付',
      value: 0
    },
    {
      label: '宝付',
      value: 1
    }
  ]

  private model = {
    signChannel: null
  }

  private rules = {
    signChannel: { required: true, message: '请选择签约渠道', trigger: 'blur', type: "number" }
  }

  /**
   * 点击确定
   */
  submit() {
    return new Promise(resolve => {
      (this.$refs['form'] as Form).validate(v => {
        if (!v) return resolve(false)
        if (this.model.signChannel === 0) {
          this.repaymentService.getPAFUrl(this.customerId).subscribe(
            data => {
              window.open(data.result)
              return resolve(true)
            },
            err => {
              this.$Message.error(err.msg)
              return resolve(false)
            }
          )
        } else {
          this.repaymentService.getBFUrl().subscribe(
            data => {
              window.open(data.result)
              return resolve(true)
            },
            err => {
              this.$Message.error(err.msg)
              return resolve(false)
            }
          )
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
</style>
