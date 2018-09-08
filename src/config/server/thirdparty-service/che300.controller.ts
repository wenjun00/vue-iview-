import { requestType } from '~/config/enum.config'
const SERVICE = 'service-thirdparty'
const CONTROLLER = 'che300Controller'
export default {
  /**
   * 同步车300数据
   */
  che300DataSync: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'che300DataSync',
    type: requestType.Get
  }
}