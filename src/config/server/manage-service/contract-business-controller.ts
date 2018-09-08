import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'contractBusinessController'
export default {
  /**
   * 查询合同列表
   */
  getContractListByOrderId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getContractListByOrderId',
    type: requestType.Get
  },
  /**
   * 生成合同
   */
  createAllContracts: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createAllContracts',
    type: requestType.Get
  },
  /**
   * 查看合同列表
   */
  getContractViewByContractId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getContractViewByContractId',
    type: requestType.Get
  },
  /**
   * 下载合同列表
   */
  downLoadConract: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'downLoadConract',
    type: requestType.Get
  },
  


}