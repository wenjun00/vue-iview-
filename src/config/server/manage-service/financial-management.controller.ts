import { requestType } from '~/config/enum.config'

const SERVICE = 'service-manage'
const CONTROLLER = 'financialManagementController'

export default {
  /**
   * 客户放款
   */
  customerOrderLoan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'customerOrderLoan',
    type: requestType.Post
  },
  /**
   * 提前收回
   */
  earlyRecycle: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'earlyRecycle',
    type: requestType.Post
  },
  /**
   * 提前还清
   */
  earlyRepayMoney: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'earlyRepayMoney',
    type: requestType.Post
  },
  /**
   * 确定开票
   */
  financialInvoice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'financialInvoice',
    type: requestType.Post
  },
  /**
   * 退款
   */
  financialRefund: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'financialRefund',
    type: requestType.Post
  },
  /**
   * 客户还款
   */
  saveCustomerRepayment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveCustomerRepayment',
    type: requestType.Post
  },
  /**
   * 供应商放款
   */
  supplierOrderLoan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'supplierOrderLoan',
    type: requestType.Post
  },
  /**
   * 客户还款 首付款
   */
  financialAffirm: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'financialAffirm',
    type: requestType.Post
  },
  /**
   * 供应商开票
   */
  financialAffirmInvoice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'financialAffirmInvoice',
    type: requestType.Post
  },
  /**
   * 分页查询待放款订单
   */
  queryPendingLoan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPendingLoan',
    type: requestType.Get
  },
  /**
   * 分页查询待收款订单
   */
  queryPendingPayment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPendingPayment',
    type: requestType.Get
  },
  /**
   * 分页查询待还款订单
   */
  queryPendingRepay: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryPendingRepay',
    type: requestType.Get
  },
  /**
   * 分页查询退款订单
   */
  queryFinancialRefundOrder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryFinancialRefundOrder',
    type: requestType.Get
  },
  /**
   * 分页查询供应商待放款的订单
   */
  querySupplierPendingLoan: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySupplierPendingLoan',
    type: requestType.Get
  },
  /**
   * 分页查询提前结清订单
   */
  querySettleOrder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'querySettleOrder',
    type: requestType.Get
  },
  /**
   * 分页查询提前收回订单
   */
  queryBackOrder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryBackOrder',
    type: requestType.Get
  },
  /**
   * 查询订单首付款项列表
   */
  findOrderFirstPayList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOrderFirstPayList',
    type: requestType.Get
  },
  /**
   * 查询收款记录
   */
  findRepayRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayRecord',
    type: requestType.Get
  },
  /**
   * 查询订单凭证
   */
  findFinanceFileList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findFinanceFileList',
    type: requestType.Get
  },
  /**
   * 查询还款列表
   */
  findRepayList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayList',
    type: requestType.Get
  },
  /**
   * 查询还款列表对应的费用项
   */
  findRepayExpenseList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayExpenseList',
    type: requestType.Get
  },
  /**
   * 查询还款方案
   */
  findRepayPlanList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayPlanList',
    type: requestType.Get
  },
  /**
   * 查询还款记录 
   */
  findRepayRecordList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayRecordList',
    type: requestType.Get
  },
  /**
   * 查询还款明细
   */
  findRepayRecordDetailList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRepayRecordDetailList',
    type: requestType.Get
  },
  /**
   * 查询提前收回/提前结清费用项列表
   */
  findEarlyExpenseList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findEarlyExpenseList',
    type: requestType.Get
  },
  /**
   * 查询订单退款项
   */
  findRefundList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findRefundList',
    type: requestType.Get
  },
  /**
   * 查询订单提前收回记录
   */
  findOderTakebackRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOderTakebackRecord',
    type: requestType.Get
  },
  /**
   * 查询订单提前结清记录
   */
  findOderSettleRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOderSettleRecord',
    type: requestType.Get
  },
  /**
   * 查询放款记录
   */
  findOderLoanRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOderLoanRecord',
    type: requestType.Get
  },
  /**
   * 查询退款记录
   */
  findOderRefundRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findOderRefundRecord',
    type: requestType.Get
  }
}