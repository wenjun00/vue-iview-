// 工作流审批操作
import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'basicCustomerOrderApproveController'

export default {
  /**
   * 分页查询所有待当前登录人审核的订单
   */
  queryWaitApproval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryWaitApproval',
    type: requestType.Get
  },
  /**
   * 订单审核
   */
  approval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'approval',
    type: requestType.Post
  },
  /**
   * 删除审核附件
   */
  deleteApproveFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteApproveFile',
    type: requestType.Delete
  },
  /**
   * 查询审核附件
   */
  queryApprovalFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryApprovalFile',
    type: requestType.Get
  },
  /**
   * 查询审核原因
   */
  queryApprovalReason: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryApprovalReason',
    type: requestType.Get
  },
  /**
   * 根据类型获取审批原因
   */
  getApproveReasonByType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getApproveReasonByType',
    type: requestType.Get
  },
  /**
   * 上传审核附件
   */
  uploadApproveFile:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'uploadApproveFile',
    type: requestType.Post
  },
  /**
   * 查询订单审核历史
   */
  findApproveHistory:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findApproveHistory',
    type: requestType.Get
  }
}