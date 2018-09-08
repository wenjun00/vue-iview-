//资金渠道管理controller
import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'basicFundsChannelController'
export default {
  /**
   * 分页查询资金渠道列表
   */
  queryBasicSupplierPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryBasicSupplierPage',
    type: requestType.Get
  },
  /**
   * 新增资金渠道
   */
  addBasicFundsChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicFundsChannel',
    type: requestType.Post
  },
  /**
   * 修改资金渠道
   */
  editBasicFundsChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editBasicFundsChannel',
    type: requestType.Put
  },
  /**
   * 删除资金渠道
   */
  deleteBasicFundsChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteBasicFundsChannel',
    type: requestType.Delete
  },
  /**
   * 停用资金渠道
   */
  stopBasicFundsChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'stopBasicFundsChannel',
    type: requestType.Put
  },
  /**
   * 停用资金渠道
   */
  startBasicFundsChannel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'startBasicFundsChannel',
    type: requestType.Put
  },
  /**
   * 查询启用的资金渠道
   */
  findAllEnableChannelListByOrg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllEnableChannelListByOrg',
    type: requestType.Get
  },
  /**
   * 查询订单所选产品下的资金渠道
   */
  queryChannelNameByOrder:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryChannelNameByOrder',
    type: requestType.Get
  }
}