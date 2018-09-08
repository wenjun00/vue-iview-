import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'basicAssessmentCarPriceAnalysisController'

export default {
  /**
   * 上传附件
   */
  uploadAssessmentFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'uploadAssessmentFile',
    type: requestType.Post
  },

  /**
   * 保存评估信息
   */
  addAssessmentCarPriceReport: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addAssessmentCarPriceReport',
    type: requestType.Post
  },

  /**
   * 对接车300评估接口
   */
  assessmentByChe300PricesAnalysis: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assessmentByChe300PricesAnalysis',
    type: requestType.Post
  },
  /**
   * 对接车300城市列表
   */
  che300CityList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'che300CityList',
    type: requestType.Get
  },
  
  /**
   * 查看附件
   */
  getAssessmentFileInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAssessmentFileInfo',
    type: requestType.Get
  },

  /**
   * 删除附件
   */
  deleteAssessmentFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteAssessmentFile',
    type: requestType.Delete
  },
  /**
   * 获取评估客户列表
   */
  queryCustomerByAssessment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCustomerByAssessment',
    type: requestType.Get
  },

  /**
   * 客户评估列表
   */
  queryCustomerAssessmentList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCustomerAssessmentList',
    type: requestType.Get
  },

  /**
   * 查询车产信息
   */
  queryAssessmentCarInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAssessmentCarInfo',
    type: requestType.Get
  }
}