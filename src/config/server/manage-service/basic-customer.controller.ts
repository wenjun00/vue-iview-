import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'BasicCustomerController'

export default {
  /**
   * 查找客户信息
   */
  findCustomerById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerById',
    type: requestType.Get
  },
  /**
   * 客户银行卡信息
   */
  getCustomerBankInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCustomerBankInfo',
    type: requestType.Get
  },
  /**
   * 获取客户签约列表
   */
  getCustomerSignList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCustomerSignList',
    type: requestType.Get
  },
  /*
   * 新增客户
   */
  addBasicCustomer: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicCustomer',
    type: requestType.Post
  },
  /**
   * 修改客户信息
   */
  editBasicCustomer:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editBasicCustomer',
    type: requestType.Put
  },
  /**
   * 新增银行卡
   */
  addBasicCustomerBank: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicCustomerBank',
    type: requestType.Post
  },
  /**
   * 编辑客户开户银行卡
   */
  updateCustomerBank: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateCustomerBank',
    type: requestType.Put
  },
  /**
   * 删除银行卡信息
   */
  deleteCustomerBankInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteCustomerBankInfo',
    type: requestType.Delete
  },
  /**
   * 意向记录列表
   */
  findAllCustomerIntentionList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllCustomerIntentionList',
    type: requestType.Get
  },
  /**
   * 根据客户id查找意向记录列表
   */
  findCustomerIntentionList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerIntentionList',
    type: requestType.Get
  },
  /**
   * 根据意向id查找跟踪记录
   */
  findCustomerFollowList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerFollowList',
    type: requestType.Get
  },
  /**
   * 新增跟进记录
   */
  addBasicCustomerFollow: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicCustomerFollow',
    type: requestType.Post
  },
  /**
   * 新增意向记录
   */
  addBasicIntentionalCustomer: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicIntentionalCustomer',
    type: requestType.Post
  }
}