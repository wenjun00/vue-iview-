//合规检查
import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'basicOrderComplianceController'
export default {
  /**
   * 查看直租消费贷订单
   */
  queryOrderDirectRentList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderDirectRentList',
    type: requestType.Get
  },
  /**
   * 查看回租消费贷订单
   */
  queryOrderLeaseBackList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderLeaseBackList',
    type: requestType.Get
  },
  /**
   * 车辆匹配
   */
  queryCarMatchList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCarMatchList',
    type: requestType.Get
  },
  /**
   * 合同合规
   */
  basicContractCompliance: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicContractCompliance',
    type: requestType.Post
  },
  /**
   * 车辆合规
   */
  basicCarCompliance: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicCarCompliance',
    type: requestType.Post
  },
  /**
   * 确认匹配
   */
  basicCarConfirmMatch: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicCarConfirmMatch',
    type: requestType.Post
  },
  /**
   * 获取客户签约后订单列表
   */
  queryOrderList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderList',
    type: requestType.Get
  }
}