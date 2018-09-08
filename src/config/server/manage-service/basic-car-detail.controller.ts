import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'basicCarDetailController'

export default {
  /**
   * 新增GPS记录
   */
  addCarGps: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addCarGps',
    type: requestType.Post
  },
  /**
   * 修改GPS记录
   */
  editCarGps: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editCarGps',
    type: requestType.Put
  },
  /**
   * 查看GPS记录列表
   */
  queryCarGpsPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCarGpsPage',
    type: requestType.Get
  },
  

  /**
   * 新增保险记录
   */
  addInsuranceRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addInsuranceRecord',
    type: requestType.Post
  },
  /**
   * 修改保险记录
   */
  editInsuranceRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editInsuranceRecord',
    type: requestType.Put
  },
  /**
   * 查看保险记录列表
   */
  queryInsuranceRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryInsuranceRecord',
    type: requestType.Get
  },
  

  /**
   * 新增车检记录
   */
  addCarInspectionRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addCarInspectionRecord',
    type: requestType.Post
  },
  /**
   * 修改车检记录
   */
  editCarInspectionRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editCarInspectionRecord',
    type: requestType.Put
  },
  /**
   * 查看车检记录列表
   */
  queryCarInspectionRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCarInspectionRecord',
    type: requestType.Get
  },


  /**
   * 上传图片
   */
  uploadCarPhoto: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'uploadCarPhoto',
    type: requestType.Post
  },

  /**
   * 上传评估入库图片
   */
  uploadAssessmentInstoragePhoto: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'uploadAssessmentInstoragePhoto',
    type: requestType.Post
  },
  
  /**
   * 删除图片
   */
  deleteFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteFile',
    type: requestType.Delete
  },
  
  /**
   * 查询图片
   */
  selectCarPhoto:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'selectCarPhoto',
    type: requestType.Get
  },

  /**
     * 获取评估入库图片
     */
    selectCarAssessmentPhoto:{
      service: SERVICE,
      controller: CONTROLLER,
      action: 'selectCarAssessmentPhoto',
      type: requestType.Get
    },
}