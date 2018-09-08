import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'basicCustomerCarCenterController'
export default {
  /**
   * 车辆列表
   */
  queryCustomerCarList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCustomerCarList',
    type: requestType.Get
  },
  /**
   * 手动入库/新增库存车辆
   */
  addCustomerStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addCustomerStorage',
    type: requestType.Post
  },
  /**
   * 编辑入库车辆
   */
  editCustomerStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editCustomerStorage',
    type: requestType.Put
  },
  /**
   * 删除入库信息
   */
  deleteCustomerStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteCustomerStorage',
    type: requestType.Delete
  },
   /**
   * 删除车辆图片
   */
  deleteStorageByFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteStorageByFile',
    type: requestType.Delete
  },
  /**
   * 库存车辆信息
   */
  queryCustomerCarStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCustomerCarStorage',
    type: requestType.Get
  },
  /**
   * 获取门店列表
   */
  queryDeptList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryDeptList',
    type: requestType.Get
  },
  /**
   * 调拨门店列表
   */
  queryTransferDeptList:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryTransferDeptList',
    type: requestType.Get
  },

  /**
   * 评估入库
   */
  assessmentInstorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assessmentInstorage',
    type: requestType.Put
  },
  /**
   * 查询所有可选择二手车进件的车辆
   */
  queryStockCar: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryStockCar',
    type: requestType.Get
  },
   /*
   * 租赁出库
   */
  leaseOutstorage:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaseOutstorage',
    type: requestType.Put
  },
  /**
   * 抵押出库
   */
  mortgageOutstorage:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'mortgageOutstorage',
    type: requestType.Put
  },

  /**
   * 获取车辆整备信息
   */
  queryStockCarPrepareInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryStockCarPrepareInfo',
    type: requestType.Get
  },

   /**
   * 获取关联订单信息
   */
  queryOrderByCarInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderByCarInfo',
    type: requestType.Get
  },
  /**
   * 手动入库
   */
  addPutInStorageByCar: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addPutInStorageByCar',
    type: requestType.Post
  },
  /**
   * 车辆整备
   */
  basicCarPrepare: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicCarPrepare',
    type: requestType.Post
  },
  /**
   * 重新整备
   */
  basicCarAgainPrepare: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicCarAgainPrepare',
    type: requestType.Post
  },
  /**
   * 出库车辆列表
   */
  queryOutOfStockCarList:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOutOfStockCarList',
    type: requestType.Get
  },
  /**
   * 拖车入库
   */
  basicPullStockCar: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicPullStockCar',
    type: requestType.Put
  },
  /**
   * 车辆过户
   */
  carTransfer: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'carTransfer',
    type: requestType.Put
  },
  /**
   * 调拨入库
   */
  basicTransferCarInStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicTransferCarInStorage',
    type: requestType.Put
  },
  /**
   * 调拨出库
   */
  basicTransferCarStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicTransferCarStorage',
    type: requestType.Put
  },
  /**
   * 获取车辆调拨计划
   */
  vehicleTransferPlan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'vehicleTransferPlan',
    type: requestType.Get
  },
  /**
   * 修改整备状态
   */
  updatePrepareStatus: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updatePrepareStatus',
    type: requestType.Get
  },
  /**
   * 编辑公里数值
   */
  editCarMileage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editCarMileage',
    type: requestType.Put
  },
  /**
   * 采购车辆列表
   */
  queryPurchaseList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPurchaseList',
    type: requestType.Get
  },
  /**
   * 新增采购登记
   */
  addPurchaseInfo:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addPurchaseInfo',
    type: requestType.Post
  },
  /**
   * 获取采购进度
   */
  queryPurchaseProgress:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPurchaseProgress',
    type: requestType.Get
  },
  /**
   * 查看采购登记供应商
   */
  queryPurchaseRegistration: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPurchaseRegistration',
    type: requestType.Get
  },
  /**
   * 查看采购登记车辆
   */
  queryPurchaseCarInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPurchaseCarInfo',
    type: requestType.Get
  },
  /**
   * 获取入库金额详情
   */
  queryPriceInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPriceInfo',
    type: requestType.Get
  },
  /**
   * 采购登记材料
   */
  queryPurchaseFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPurchaseFile',
    type: requestType.Get
  },
  /**
   * 采购入库
   */
  basicPurchaseStorage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicPurchaseStorage',
    type: requestType.Post
  },
  /**
   * 采购复核
   */
  basicPurchaseReview: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'basicPurchaseReview',
    type: requestType.Post
  },
  /**
   * 编辑采购登记信息
   */
  updatePurchaseCarInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updatePurchaseCarInfo',
    type: requestType.Put
  },
}