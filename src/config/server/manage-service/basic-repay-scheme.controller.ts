//还款方案管理controller
import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'basicRepaySchemeController'
export default {

  /**
   * 新增业务
   */
  addBusiness: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBusiness',
    type: requestType.Post
  },
  /**
   * 修改业务
   */
  updateBusiness: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateBusiness',
    type: requestType.Put
  },
  /**
   * 删除业务
   */
  deleteBusinessById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteBusinessById',
    type: requestType.Delete
  },
  /**
   * 查询所有业务
   */
  findBusinessList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findBusinessList',
    type: requestType.Get
  },
  /**
   * 查询进件业务类型
   */
  findByBusinessType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findByBusinessType',
    type: requestType.Get
  },
  /**
   * 查询某项业务
   */
  findBusinessById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findBusinessById',
    type: requestType.Get
  },
  /**
   * 分页查询业务数据
   */
  querySchemeByBusiness: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySchemeByBusiness',
    type: requestType.Get
  },
  /**
   * 根据ID查询产品信息
   */
  findSchemeById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSchemeById',
    type: requestType.Get
  },
  /**
   * 新增产品
   */
  addRepayScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addRepayScheme',
    type: requestType.Post
  },
  /**
   * 修改产品
   */
  updateRepayScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateRepayScheme',
    type: requestType.Put
  },
  /**
   * 删除产品
   */
  deleteRepayScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteRepayScheme',
    type: requestType.Delete
  },
  /**
   * 发布/取消发布产品
   */
  releaseRepayScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'releaseRepayScheme',
    type: requestType.Put
  },
  /**
   * 维护产品适配车型
   */
  schemeModel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'schemeModel',
    type: requestType.Post
  },
  /**
   * 添加 修改产品费用项
   */
  schemeExpense: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'schemeExpense',
    type: requestType.Post
  },
  /**
   * 维护产品适配机构
   */
  schemeOrg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'schemeOrg',
    type: requestType.Post
  },
  /**
   * 查询产品适配的车型ID
   */
  findSchemeModel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSchemeModel',
    type: requestType.Get
  },
  /**
  * 查询产品已经配置的车辆
  */
  querySchemeModel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySchemeModel',
    type: requestType.Get
  },
  /**
  * 查询产品适配的机构 ID
  */
  findSchemeOrg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSchemeOrg',
    type: requestType.Get
  },
  /**
  * 查询产品已经配置的机构
  */
  querySchemeOrg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySchemeOrg',
    type: requestType.Get
  },
  /**
  * 查询产品费用项
  */
  findSchemeExpenseBySchemeId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSchemeExpenseBySchemeId',
    type: requestType.Get
  },
  /**
   * 根据获取费用项明细
   */
  getSchemeExpenseById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getSchemeExpenseById',
    type: requestType.Get
  },
  /**
   * 删除费用项
   */
  deleteRepaySchemeExpense: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteRepaySchemeExpense',
    type: requestType.Delete
  },
  /**
   * 获取产品费用项(多种支付方式/多种费用项类型适用数组返回
   */
  findInputSchemeExpenseBySchemeId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findInputSchemeExpenseBySchemeId',
    type: requestType.Get
  },
  /**
   * 查询产品选中的资金渠道
   */
  findSelectedChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSelectedChannel',
    type: requestType.Get
  },
  /**
   * 查询产品选中的资金渠道(详细信息)
   */
  findSelectedChannelName: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSelectedChannelName',
    type: requestType.Get
  }
}