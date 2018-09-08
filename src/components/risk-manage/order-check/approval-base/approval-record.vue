<!-- 审核记录 -->
<template>
  <section class="component approval-record">
    <div class="no-data-notice" v-if="!dataList.length">
      暂无记录
    </div>
    <div v-else v-for="(item,index) of dataList" :key="item.id">
      <i-row>
        <i-col :span="8">
          <i-card :title="item.workFlowLinkName">
            <i-row class="result">
              <i-col :span="8">
                <i-icon :type="item.result.type" size="40" :color="item.result.color"></i-icon>
              </i-col>
              <i-col :span="16" class="result-content">
                <p>
                  <b>{{`审批${item.result.name}`}}</b>
                </p>
                <p>{{item.operatorTime | dateFormat}}</p>
                <p>{{item.operatorName}}</p>
              </i-col>
            </i-row>
          </i-card>
        </i-col>
        <i-col :span="16">
          <i-row v-if="showRightContent(item)">
            <i-col :span="4" class="item-right-icon">
              <i-icon type="arrow-right-a" size="40"></i-icon>
            </i-col>
            <i-col :span="20">
              <i-card title="审批内容">
                <data-grid v-if="item.result.value === passValue" :labelWidth="110" labelAlign="right" contentAlign="left" key="pass">
                  <data-grid-item :span="12" v-if="item.approveStatus === $enum.OrderCurrentState.LAST" label="允许融资金额">{{item.orderFinancingPrice| toThousands}}</data-grid-item>
                  <data-grid-item :span="12" label="备注">{{item.remark}}</data-grid-item>
                </data-grid>
                <data-grid v-else :labelWidth="110" labelAlign="right" contentAlign="left" key="back">
                  <data-grid-item :span="12" :label="`${item.result.name}原因`">{{`${item.refuseReason1} ${item.refuseReason2} ${item.refuseReason3}`}}</data-grid-item>
                  <data-grid-item :span="12" label="备注">{{item.remark}}</data-grid-item>
                </data-grid>
              </i-card>
            </i-col>
          </i-row>

        </i-col>
      </i-row>
      <div class="next-icon" v-show="index !== dataList.length - 1">
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCustomerOrderApprove } from "~/services/manage-service/basic-customer-order-approve.service";
import { Form } from "iview";
import { approvalRecord } from "~/config/work-flow.config";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class ApprovalRecord extends Vue {
  @Dependencies(BasicCustomerOrderApprove) private basicCustomerOrderApprove: BasicCustomerOrderApprove;
  @Prop({ required: true }) orderId: number

  private dataList: Array<any> = [];
  private passValue = 10278

  mounted() {
    // GET LIST BY ORDERID
    this.basicCustomerOrderApprove.findApproveHistory(this.orderId).subscribe(
      data => {
        this.dataList = data.map(v => {
          return { result: this.getApprovalResult(v.approveResult), ...v }
        })
      },
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 获取审批结果记录
   */
  private getApprovalResult(approveResult: number) {
    return approvalRecord.find(v => v.value === approveResult) || {}
  }

  private showRightContent(item: any) {
    let result = false;
    // 不是审批通过 必须显示
    if (item.approveResult !== this.passValue) {
      result = true
    }
    if (item.refuseReason1 || item.refuseReason2 || item.refuseReason3) {
      result = true
    }
    if (item.remark) result = true;
    if (item.orderFinancingPrice) result = true;
    return result
  }

}
</script>

<style lang="less" scoped>
.component.approval-record {
  @item-min-height: 80px;
  .result {
    height: @item-min-height;
    line-height: @item-min-height;
    text-align: center;
    &-content {
      height: 25px;
      line-height: 25px;
    }
  }
  .item-right-icon {
    text-align: center;
    padding-top: @item-min-height;
  }
  .next-icon {
    height: 113px;
    border: solid 2px #0187ad;
    width: 1px;
    margin-left: @item-min-height * 2;
  }
}
</style>
