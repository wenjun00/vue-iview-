import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'basicOrderFileController'

export default {
  /**
   * 新增上传资料
   */
  addUploadBasicOrderFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addUploadBasicOrderFile',
    type: requestType.Post
  },
  /**
   * 查询上传资料
   */
  getOrderFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOrderFile',
    type: requestType.Get
  },
  /**
   * 查询合同附件
   */
  getContractFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getContractFile',
    type: requestType.Get
  }

}