import { requestType } from '~/config/enum.config'
const SERVICE = 'service-thirdparty'
const CONTROLLER = 'che300CityListController'
export default {
 
  /**
   * 对接车300城市列表
   */
  che300CityList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'che300CityList',
    type: requestType.Get
  },
}