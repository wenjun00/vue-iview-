import { manageService } from '~/config/server/manage-service'
import { Inject, Debounce } from '~/core/decorator'
import { NetService } from '~/utils/net.service'
import { PageService } from '~/utils/page.service';

export class FinancialManagementService {
  @Inject()
  private netService: NetService;

  /**
   * 客户放款
   */
  @Debounce()
  customerOrderLoan(data) {
    return this.netService.send({
      server: manageService.financialManagementController.customerOrderLoan,
      data: data,
      loading: true
    })
  }
  /**
   * 提前收回
   */
  @Debounce()
  earlyRecycle(data) {
    return this.netService.send({
      server: manageService.financialManagementController.earlyRecycle,
      data: data,
      loading: true
    })
  }
  /**
   * 提前还清
   */
  @Debounce()
  earlyRepayMoney(data) {
    return this.netService.send({
      server: manageService.financialManagementController.earlyRepayMoney,
      data: data,
      loading: true
    })
  }
  /**
   * 确定开票
   */
  @Debounce()
  financialInvoice(id) {
    return this.netService.send({
      server: manageService.financialManagementController.financialInvoice,
      append: id
    })
  }
  /**
   * 退款
   */
  @Debounce()
  financialRefund(data) {
    return this.netService.send({
      server: manageService.financialManagementController.financialRefund,
      data: data,
      loading: true
    })
  }
  /**
   * 客户还款
   */
  @Debounce()
  saveCustomerRepayment(data, orderId: Number) {
    return this.netService.send({
      server: manageService.financialManagementController.saveCustomerRepayment,
      data: {
        fileParamList: data.fileParamList,
        money: data.payMoney,
        orderId: orderId,
        receivableChannel: data.receivableChannel
      },
      loading: true
    })
  }
  /**
   * 供应商放款
   */
  @Debounce()
  supplierOrderLoan(data) {
    return this.netService.send({
      server: manageService.financialManagementController.supplierOrderLoan,
      data: data,
      loading: true
    })
  }

  /**
   * 客户还款 首付款 
   * @param orderId 订单ID
   */
  @Debounce()
  financialAffirm(data) {
    return this.netService.send({
      server: manageService.financialManagementController.financialAffirm,
      data: data,
      loading: true
    })
  }

  /**
   * 供应商开票
   * @param model 开票实体
   */
  @Debounce()
  financialAffirmInvoice(model: any): any {
    return this.netService.send({
      server: manageService.financialManagementController.financialAffirmInvoice,
      data: {
        id: model.id,
        url: model.url
      },
      loading: true
    })
  }

  /**
   * 分页查询待放款订单
   */
  queryPendingLoan(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.queryPendingLoan,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   * 分页查询待收款订单
   */
  queryPendingPayment(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.queryPendingPayment,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   * 分页查询待还款订单
   */
  queryPendingRepay(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.queryPendingRepay,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone,
        orderStatus: queryData.orderStatus,
        businessType: queryData.orderType
      },
      page
    })
  }

  /**
   * 分页查询退款订单
   */
  queryFinancialRefundOrder(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.queryFinancialRefundOrder,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   * 分页查询供应商待放款的订单
   */
  querySupplierPendingLoan(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.querySupplierPendingLoan,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   * 分页查询提前结清订单
   */
  querySettleOrder(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.querySettleOrder,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   * 分页查询提前收回订单
   */
  queryBackOrder(queryData, page: PageService) {
    return this.netService.send({
      server: manageService.financialManagementController.queryBackOrder,
      data: {
        customerName: queryData.name,
        orderNo: queryData.orderNo,
        idCard: queryData.idCard,
        customerPhone: queryData.phone
      },
      page
    })
  }

  /**
   *查询订单首付款项列表
   */
  findOrderFirstPayList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findOrderFirstPayList,
      append: orderId
    })
  }

  /**
   * 查询收款记录
   */
  findRepayRecord(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayRecord,
      append: orderId
    })
  }

  /**
   * 查询订单凭证
   */
  findFinanceFileList(orderId, type) {
    return this.netService.send({
      server: manageService.financialManagementController.findFinanceFileList,
      data: {
        orderId: orderId,
        type: type
      }
    })
  }

  /**
   * 查询还款列表
   */
  findRepayList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayList,
      append: orderId
    })
  }

  /**
   * 查询还款列表对应的费用项
   */
  findRepayExpenseList(orderId, periods) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayExpenseList,
      data: {
        orderId: orderId,
        periods: periods
      }
    })
  }

  /**
   * 查询还款方案
   */
  findRepayPlanList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayPlanList,
      data: {
        orderId: orderId
      }
    })
  }

  /**
   * 查询还款记录
   */
  findRepayRecordList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayRecordList,
      data: {
        orderId: orderId
      }
    })
  }

  /**
   * 查询还款明细
   */
  findRepayRecordDetailList(receivableId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRepayRecordDetailList,
      data: {
        receivableId: receivableId
      }
    })
  }

  /**
   * 查询提前收回/提前结清费用项列表
   */
  findEarlyExpenseList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findEarlyExpenseList,
      append: orderId
    })
  }

  /**
   * 查询订单退款项
   */
  findRefundList(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findRefundList,
      append: orderId
    })
  }

  /**
   * 查询订单提前收回记录
   */
  findOderTakebackRecord(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findOderTakebackRecord,
      append: orderId
    })
  }

  /**
   * 查询订单提前结清记录
   */
  findOderSettleRecord(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findOderSettleRecord,
      append: orderId
    })
  }

  /**
   * 查询放款记录
   */
  findOderLoanRecord(orderId) {
    return this.netService.send({
      server: manageService.financialManagementController.findOderLoanRecord,
      append: orderId
    })
  }

  /**
   * 查询退款记录
   */
  findOderRefundRecord(orderId){
    return this.netService.send({
      server: manageService.financialManagementController.findOderRefundRecord,
      append: orderId
    })
  }
}
