<!--系统参数管理-->
<template>
  <section class="page system-param-manage">
    <page-header title="系统参数管理" hidden-print hidden-export></page-header>
    <data-form hidden-date-search :model="systemParameterModel" @on-search="getSystemParam" :page="pageService">
      <template slot="input">
        <i-form-item prop="paramName" label="参数名称：">
          <i-input v-model="systemParameterModel.paramName" :maxlength="50"></i-input>
        </i-form-item>
        <i-form-item prop="paramStatus" label="是否启用：">
          <i-select v-model="systemParameterModel.paramStatus" clearable>
            <i-option label="启用" :value="10002" :key="10002"></i-option>
            <i-option label="停用" :value="10003" :key="10003"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>

    <data-box :id="77" :columns="columns1" :data="systemParamsData" @on-page-change="getSystemParam" :page="pageService"></data-box>

    <template>
      <i-modal v-model="editSysParamsModal" title="修改系统参数">
        <modify-system-params :modifySysParamsModel="modifySysParamsModel" ref="modify-sys-param" @close="closeBtn"></modify-system-params>
        <div slot="footer">
          <i-button @click="editSysParamsModal=false">取消</i-button>
          <i-button @click="confirmModifySysParams" class="form-button">确定</i-button>
        </div>
      </i-modal>
    </template>
  </section>
</template>

<script lang="ts">
import Page from '~/core/page'
import Component from 'vue-class-component'
import DataBox from '~/components/common/data-box.vue'
import { PageService } from '~/utils/page.service'
import { Dependencies } from '~/core/decorator'
import SvgIcon from '~/components/common/svg-icon.vue'
import { Layout } from '~/core/decorator'
import ModifySystemParams from '~/components/system-manage/modify-system-params.vue'
import { SysParameterService } from '~/services/manage-service/sys-parameter.service'


@Layout('workspace')
@Component({
  components: {
    DataBox,
    SvgIcon,
    ModifySystemParams
  }
})
export default class OrderTransfer extends Page {
  @Dependencies() private pageService: PageService
  @Dependencies(SysParameterService)
  private systemParameterService: SysParameterService
  private columns1: any
  private columns2: any
  private systemParamsData: Array<Object> = []
  private customName: String = ''
  private openColumnsConfig: Boolean = false
  private openOneKeyToConnect: Boolean = false
  private editSysParamsModal: Boolean = false
  private systemParameterModel: any = {
    paramName: '',
    paramStatus: ''
  }
  private checkRadio: String = ''
  private modifySysParamsModel: any
  mounted() {
    this.getSystemParam()
  }
  created() {
    this.modifySysParamsModel = {
      paramCode: '',
      paramName: '',
      paramValue: '',
      paramStatus: ''
    }
    this.columns1 = [
      {
        title: '操作',
        align: 'center',
        fixed: 'left',
        width: this.$common.getOperateWidth(1),
        render: (h, { row, columns, index }) => {
          if (row.isReadonly === 10003) {
            return h(
              'i-button',
              {
                props: {
                  type: 'text'
                },
                directives: this.$common.bindAuth(570),
                on: {
                  click: () => {
                    this.modifySysParams(row)
                  }
                },
                style: {
                  color: '#265EA2'
                }
              },
              '修改'
            )
          }
        }
      },
      {
        title: '参数代码',
        editable: true,
        key: 'paramCode',
        align: 'center',
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        title: '参数名称',
        editable: true,
        key: 'paramName',
        align: 'center',
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        title: '参数值',
        editable: true,
        key: 'paramValue',
        align: 'center',
        minWidth: this.$common.getColumnWidth(6),
      },
      {
        title: '是否启用',
        editable: true,
        key: 'paramStatus',
        align: 'center',
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, columns, index }) => {
          return h('span', {}, row.paramStatus === 10002 ? '启用' : '停用')
        }
      },
      {
        title: '说明',
        editable: true,
        key: 'remark',
        align: 'center',
        minWidth: this.$common.getColumnWidth(10),
      }
    ]
  }
  getOrderInfoByTime() { }
  oneKeyToConnect() {
    this.openOneKeyToConnect = true
  }
  /**
   * 列配置
   */
  columnsConfig() {
    this.openColumnsConfig = true
  }
  /**
   * 多选
   */
  multipleSelect(selection) { }
  /**
   * 修改按钮
   */
  modifySysParams(row) {
    this.editSysParamsModal = true
    this.modifySysParamsModel = row
    let _sysParams: any = this.$refs['modify-sys-param']
    _sysParams.makeData(row)
  }
  /**
   * 获取分页查询系统参数
   */
  getSystemParam() {
    this.systemParameterService
      .querySysParameterPage(this.systemParameterModel, this.pageService)
      .subscribe(
        val => {
          this.systemParamsData = val
        },
        ({ msg }) => {
          this.$Message.error(msg)
        }
      )
  }
  confirmModifySysParams() {
    let _modify: any = this.$refs['modify-sys-param']
    _modify.confirmModify()
  }
  closeBtn() {
    this.editSysParamsModal = false
    this.getSystemParam()
  }
  /**
   * 重置搜索
   */
  refreshRoleList() {
    // this.systemParameterModel = {
    //   paramName: "",
    //   paramStatus: ""
    // };
    this.systemParameterModel.paramName = ''
    this.systemParameterModel.paramStatus = ''
  }
}
</script>
<style lang="less" scoped>
.page.system-param-manage {
  .form-button {
    background: #265ea2;
    color: #fff;
  }
}
</style>
