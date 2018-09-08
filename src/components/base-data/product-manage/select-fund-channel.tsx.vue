<!-- 选择资金渠道 -->
<template>
  <section class="component select-fund-channel">
    <data-form hidden-date-search :model="model" @on-search="refreshData" :page="pageService">
      <template slot="input">
        <i-form-item label="资金渠道编号：" prop="fundsCode">
          <i-input placeholder="请输入资金渠道编号" v-model="model.fundsCode" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item label="资金渠道名称：" prop="fundsName">
          <i-input placeholder="请输入资金渠道名称" v-model="model.fundsName" clearable :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="columns" :page="pageService" :data="dataSet" ref="databox" :highlightRow="true" @on-current-change="onCurrentChange" @on-selection-change="onSelectionChange" @on-page-change="isEdit ? getAllChannels() : getSelectedChannelsName()"></data-box>
  </section>
</template>
<script lang="tsx">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from '~/utils/page.service'
import { BasicFundsChannelService } from "~/services/manage-service/basic-funds-channel.service.ts";
import { RepaySchemeService } from "~/services/manage-service/basic-repay-scheme.service";

@Component({
  components: {
  }
})
export default class SelectFundChannel extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicFundsChannelService) private basicFundsChannelService: BasicFundsChannelService;
  @Dependencies(RepaySchemeService) private repaySchemeService: RepaySchemeService;

  @Prop() productId
  @Prop() selectedChannels
  @Prop({
    type: Boolean,
    default: true
  })
  isEdit

  private dataSet: Array<any> = [];
  private columns: Array<any> = [];
  private selectedData: any = null

  private model = {
    schemeId: this.productId,
    fundsCode: '',
    fundsName: '',
    channelStatus: 10253
  }

  created() {
    this.columns = [
      {
        align: "center",
        editable: true,
        title: "资金编号",
        key: "channelNo",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "资金名称",
        key: "channelName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "资金成本",
        key: "channelCost",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.percentFormat(row.channelCost)}</div>)
      },
      {
        align: "center",
        editable: true,
        title: "资金有效期",
        key: "endDate",
        minWidth: this.$common.getColumnWidth(8),
        render: (h, { row }) => (<div>{this.$filter.dateFormat(row.startDate) + ' 至 ' + this.$filter.dateFormat(row.endDate)}</div>)
      },
      {
        align: "center",
        editable: true,
        title: "资金规模",
        key: "channelScale",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.toThousands(row.channelScale)}</div>)
      }
    ]
    if (this.isEdit) {
      this.columns.unshift(
        {
          align: "center",
          type: "selection",
          width: 60
        }
      )
    }
  }

  mounted() {
    this.refreshData()
  }

  private refreshData() {
    this.isEdit ? this.getAllChannels() : this.getSelectedChannelsName()
  }
 
  /**
   * 获取所选资金渠道(详细信息)
   */
  private getSelectedChannelsName() {
    this.repaySchemeService.findSelectedChannelName(this.model, this.pageService).subscribe(
      data => this.dataSet = data,
      err => this.$Message.error(err.msg)
    )
  }

  /**
   * 查询所有资金渠道数据
   */
  private getAllChannels() {
    this.basicFundsChannelService.queryBasicSupplierPage(this.model, this.pageService).subscribe(
      data => {
        if (!this.selectedChannels) this.selectedChannels = new Set<Number>([])
        this.dataSet = data.map(v => {
          v._checked = this.selectedChannels.has(v.id)
          return v
        })
      },
      err => this.$Message.error(err.msg)
    );
  }

  /**
   * 当选中项变更的时候对缓存数据进行修正
   */
  private onSelectionChange(selection: any[]) {
    this.dataSet.forEach(v => {
      if (selection.findIndex(s => s.id === v.id) < 0) {
        if (this.selectedChannels.has(v.id)) this.selectedChannels.delete(v.id)
      } else {
        this.selectedChannels.add(v.id);
      }
    })
  }

  /**
   * 选中某一行事件
   */
  private onCurrentChange(currentRow, oldRow) {
    this.selectedData = {
      fundsChannelId: currentRow.id,
      fundsChannelName: currentRow.channelName
    }
  }

  submit() {
    return new Promise(resolve => {
      return this.isEdit ? resolve(this.selectedChannels) : resolve(this.selectedData)
    })
  }
}
</script>

<style lang="less">
</style>
