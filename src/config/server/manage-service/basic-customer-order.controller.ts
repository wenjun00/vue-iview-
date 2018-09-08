import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'basicCustomerOrderController'

export default {
  /**
   * 根据订单获取客户信息
   */
  getCustomerInfoByOrderId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCustomerInfoByOrderId',
    type: requestType.Get
  },
  /**
   * 获取订单基本资料
   */
  findCustomerOrderInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderInfo',
    type: requestType.Get
  },
  /**
   * 融资租赁贷款计算器
   */
  findFinancingRepayDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findFinancingRepayDetail',
    type: requestType.Get
  },
  /**
   * 获取押品资料
   */
  findCustomerCollateral: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerCollateral',
    type: requestType.Get
  },
  /**
   * 还款计划
   */
  findCustomerOrderSchedule: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderSchedule',
    type: requestType.Get
  },
  /**
   * 订单操作记录
   */
  findCustomerOrderRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderRecord',
    type: requestType.Get
  },
  /**
   * 收款记录
   */
  findCustomerOrderFinancialSituationList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderFinancialSituationList',
    type: requestType.Get
  },
  /**
   * 放款记录
   */
  findCustomerOrderFinanceLoanList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderFinanceLoanList',
    type: requestType.Get
  },
  /**
   * 提前收回记录
   */
  findCustomerOrderFinanceTakeBack: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderFinanceTakeBack',
    type: requestType.Get
  },
  /**
   * 提前结清记录
   */
  findCustomerOrderFinanceSettleList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCustomerOrderFinanceSettleList',
    type: requestType.Get
  },
  /*
   * 抵押贷款计算器
   */
  findMortgageRepayDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findMortgageRepayDetail',
    type: requestType.Get
  },
  /**
   * 查询待补填资料订单
   */
  queryCustomerOrderFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCustomerOrderFile',
    type: requestType.Get
  },
  /**
   * 更改订单金额
   */
  updateOrderPrice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateOrderPrice',
    type: requestType.Put
  },
  /**
   * 订单结案操作
   */
  updateOrderStatus: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateOrderStatus',
    type: requestType.Post
  },
  /**
   * 分页查询消费贷直租订单
   */
  queryOrderConsumeDirectPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderConsumeDirectPage',
    type: requestType.Get
  },
  /**
   * 分页查询消费贷回租订单
   */
  queryOrderConsumeReturnPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderConsumeReturnPage',
    type: requestType.Get
  },
  /**
   * 分页查询现金贷回租订单
   */
  queryOrderCashReturnPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrderCashReturnPage',
    type: requestType.Get
  },
  /**
   * 查询新车订单车辆
   */
  findOrderNewCar: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderNewCar',
    type: requestType.Get
  },
  /***
   * 查询订单二手车
   */
  findOrderOldCar: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderOldCar',
    type: requestType.Get
  },
  /**
   * 查询订单的费用项
   */
  findOrderSchemeExpanseList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderSchemeExpanseList',
    type: requestType.Get
  },
  /**
   * 查询产品系列下既适用于车型又适用于机构的产品
   */
  findSuitableScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findSuitableScheme',
    type: requestType.Get
  },
  /**
   * 直租/回租消费贷新车进件申请
   */
  newCarIncomingApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'newCarIncomingApply',
    type: requestType.Post
  },
  /**
   * 根据订单ID查询担保人信息
   */
  findOrderGuarantor: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderGuarantor',
    type: requestType.Get
  },
  /**
   * 查看融资计划
   */
  findFinancingPlan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findFinancingPlan',
    type: requestType.Post
  },
  /**
   * 查询订单附件
   */
  findOrderFile: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderFile',
    type: requestType.Get
  },
  /**
   * 删除订单
   */
  deleteOrder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteOrder',
    type: requestType.Delete
  },
  /**
   * 二手车进件
   */
  oldCarIncomingApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'oldCarIncomingApply',
    type: requestType.Post
  },
  /**
   * 客户签约保存/提交
   */
  sign: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'sign',
    type: requestType.Post
  },
  /**
   * 进件检查客户信息是否完善
   */
  checkCustomerInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkCustomerInfo',
    type: requestType.Get
  },
  /**
   * 订单查询
   */
  queryOrder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOrder',
    type: requestType.Get
  }
}