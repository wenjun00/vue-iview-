// 开户支付接口controller
import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'repaymentController'

export default {
  /**
   * 获取宝付绑卡URL
   */
  getBFUrl: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBFUrl',
    type: requestType.Get
  },
  /**
   * 获取平安付绑卡URL
   */
  getPAFUrl: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPAFUrl',
    type: requestType.Get
  }
}