<template>
  <section class="page fund-channel-manage">
    <page-header title="资金渠道管理" hidden-print hidden-export>
      <command-button label="新增资金渠道" @click="modifyFundChannel()" v-auth="585"></command-button>
    </page-header>
    <data-form :model="model" @on-search="refreshData" hidden-date-search>
      <template slot="input">
        <i-form-item prop="channelNo" label="资金编号：">
          <i-input placeholder="请输入资金编号" v-model="model.channelNo" clearable :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="channelName" label="资金名称：">
          <i-input placeholder="请输入资金名称" v-model="model.channelName" clearable :maxlength="50"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :id="20" :columns="columns" :page="pageService" :data="dataSet" ref="databox"></data-box>
  </section>
</template>
<script lang="tsx">
import Page from "~/core/page";
import DataBox from "~/components/common/data-box.vue";
import Component from "vue-class-component";
import ModifyFundChannel from "~/components/base-data/modify-fund-channel.vue";
import { Dependencies } from "~/core/decorator";
import { BasicFundsChannelService } from "~/services/manage-service/basic-funds-channel.service.ts";
import { PageService } from '~/utils/page.service'
import { Layout } from "~/core/decorator";
import { Button } from "iview"
import { ChannelState } from "~/config/enum.config";

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class FundChannelManage extends Page {
  @Dependencies(BasicFundsChannelService) private basicFundsChannelService: BasicFundsChannelService;
  @Dependencies(PageService) private pageService: PageService;

  private columns: any;
  private dataSet: any = [];

  private model = {
    channelNo: "", // 资金编号
    channelName: "" // 资金名称
  }


  mounted() {
    this.refreshData();
  }

  created() {
    this.columns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          if (row.channelStatus === ChannelState.Enable) {
            return (<div>
              <i-button type="text" class="row-command-button" v-auth={588} onClick={() => this.modifyFundChannel(row)}>编辑</i-button>
              <i-button type="text" class="row-command-button" v-auth={587} onClick={() => this.startFundChannel(row)}>启用</i-button>
            </div>
            )
          } else {
            return (
              <i-button type="text" class="row-command-button" v-auth={586} onClick={() => this.stopFundChannel(row)}>停用</i-button>
            )
          }
        }
      },
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
      },
      {
        align: "center",
        editable: true,
        title: "操作时间",
        key: "operatorTime",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<div>{this.$filter.dateFormat(row.operatorTime, 'YYYY-MM-DD HH:mm:ss')}</div>)
      },
      {
        align: "center",
        editable: true,
        title: "操作人",
        key: "userRealName",
        minWidth: this.$common.getColumnWidth(4)
      }
    ];
  }

  /**
   * 维护
   * @param val 新增不传，修改传维护的数据
   */
  private modifyFundChannel(val?: Object) {
    this.$dialog.show({
      title: val ? "修改资金渠道" : "新增资金渠道",
      footer: true,
      onOk: modifyFundChannel => {
        return modifyFundChannel.submit().then(v => {
          if (v) this.refreshData();
          return v;
        });
      },
      render: h =>
        h(ModifyFundChannel, {
          props: {
            fundChannelData: val
          }
        })
    });
  }

  /**
   * 停用
   */
  stopFundChannel(row) {
    let fundChannelName = row.channelName
    this.$Modal.confirm({
      title: "提示",
      content: `确定停用资金渠道 <b>${fundChannelName}</b> 吗？`,
      onOk: () => {
        this.basicFundsChannelService.stopBasicFundsChannel(row.id).subscribe(
          val => {
            this.$Message.success("操作成功！");
            this.refreshData();
          },
          err => this.$Message.error(err.msg)
        );
      }
    });
  }
  /**
   * 启用
   */
  startFundChannel(row) {
    let fundChannelName = row.channelName
    this.$Modal.confirm({
      title: "提示",
      content: `确定启用资金渠道 <b>${fundChannelName}</b> 吗？`,
      onOk: () => {
        this.basicFundsChannelService.startBasicFundsChannel(row.id).subscribe(
          val => {
            this.$Message.success("操作成功！");
            this.refreshData();
          },
          err => this.$Message.error(err.msg)
        );
      }
    });
  }
  /**
   * 查询资金渠道数据
   */
  private refreshData() {
    this.basicFundsChannelService.queryBasicSupplierPage(this.model, this.pageService)
      .subscribe(
        data => (this.dataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

}
</script>

<style lang="less" scoped>
</style>