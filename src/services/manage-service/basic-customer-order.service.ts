import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { manageService } from '~/config/server/manage-service'
import { PageService } from '~/utils/page.service';

export class BasicCustomerOrderService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 根据订单获取客户信息
   * @param orderId 订单id
   */
  getCustomerInfoByOrderId(orderId): any {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.getCustomerInfoByOrderId,
      data: {
        orderId: orderId
      }
    })
  }


  /**
   * 获取订单基本资料
   */
  findCustomerOrderInfo(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderInfo,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 融资租赁贷款计算器
   * @param productId 产品Id
   */
  findFinancingRepayDetail(productId: number): any {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findFinancingRepayDetail,
      data: {
        productId
      }
    })
  }
  /**
   * 获取押品资料
   */
  findCustomerCollateral(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerCollateral,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 还款计划
   */
  findCustomerOrderSchedule(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderSchedule,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 订单操作记录
   */
  findCustomerOrderRecord(orderId, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderRecord,
      data: {
        orderId: orderId
      },
      page: page
    })
  }
  /**
   * 收款记录
   */
  findCustomerOrderFinancialSituationList(orderId, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderFinancialSituationList,
      data: {
        orderId: orderId
      },
      page: page
    })
  }
  /**
   * 放款记录
   */
  findCustomerOrderFinanceLoanList(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderFinanceLoanList,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 提前收回记录
   */
  findCustomerOrderFinanceTakeBack(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderFinanceTakeBack,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 提前结清记录
   */
  findCustomerOrderFinanceSettleList(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findCustomerOrderFinanceSettleList,
      data: {
        orderId: orderId
      }
    })
  }
  /*
   * 抵押贷款计算器
   */
  findMortgageRepayDetail(schemeId: Number, loanAmt: Number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findMortgageRepayDetail,
      data: {
        schemeId: schemeId,
        amount: loanAmt
      }
    })
  }

  /**
   * 查询待补填资料订单
   */
  queryCustomerOrderFile(data, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.queryCustomerOrderFile,
      data: {
        customerName: data.name,
        orderNo: data.orderNo,
        idCard: data.idCard,
        customerPhone: data.phone
      },
      page
    })
  }

  /**
   * 修改订单金额
   * @param orderId 订单ID
   * @param orderAmt 订单金额
   */
  @Debounce()
  updateOrderPrice(orderId: Number, orderAmt: Number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.updateOrderPrice,
      data: {
        orderId: orderId,
        price: orderAmt,
      }
    })
  }

  /**
   * 订单结案操作
   */
  @Debounce()
  updateOrderStatus(orderId) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.updateOrderStatus,
      data: {
        orderId: orderId
      }
    })
  }

  /**
   * 分页查询消费贷直租订单
   */
  queryOrderConsumeDirectPage(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.queryOrderConsumeDirectPage,
      data: {
        orderNo: model.orderNo,
        idCard: model.idCard,
        orderStatus: model.orderStatus
      },
      page
    })
  }
  /**
   * 分页查询消费贷回租订单
   */
  queryOrderConsumeReturnPage(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.queryOrderConsumeReturnPage,
      data: {
        orderNo: model.orderNo,
        idCard: model.idCard,
        orderStatus: model.orderStatus
      },
      page
    })
  }
  /**
   * 分页查询现金贷回租订单
   */
  queryOrderCashReturnPage(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.queryOrderCashReturnPage,
      data: {
        orderNo: model.orderNo,
        idCard: model.idCard,
        orderStatus: model.orderStatus
      },
      page
    })
  }

  /**
   * 根据订单ID 查询新车信息
   * @param orderId 订单ID
   */
  findOrderNewCar(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findOrderNewCar,
      append: orderId
    })
  }

  /**
   * 根据订单号 查询二手车信息
   * @param orderId 
   */
  findOrderOldCar(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findOrderOldCar,
      append: orderId
    })
  }

  /**
   * 查询订单的费用项
   */
  findOrderSchemeExpanseList(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findOrderSchemeExpanseList,
      append: orderId
    })
  }

  /**
   * 查询产品系列下既适用于车型又适用于机构的产品
   */
  findSuitableScheme(businessId: number, modelId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findSuitableScheme,
      data: {
        businessId: businessId,
        modelId: modelId,
      }
    })
  }

  /**
   * 直租/回租消费贷新车进件申请
   */
  newCarIncomingApply(model: any) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.newCarIncomingApply,
      data: model,
      loading: true
    })
  }

  /**
   * 根据订单ID查询担保人信息
   */
  findOrderGuarantor(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findOrderGuarantor,
      append: orderId
    })
  }

  /**
   * 查看融资计划
   */
  findFinancingPlan(expenseList: any[], schemeId: number, orderPrice: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findFinancingPlan,
      data: {
        expenseList,
        schemeId,
        orderPrice
      },
      loading: true
    })
  }

  /**
   * 根据订单号获取上传的资料
   * @param orderId 订单ID
   */
  findOrderFiles(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.findOrderFile,
      append: orderId
    })
  }

  /**
   * 删除订单
   */
  deleteOrder(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.deleteOrder,
      append: orderId,
      loading: true
    })
  }

  /**
   * 直租/回租消费贷/回租现金贷二手车进件申请
   */
  oldCarIncomingApply(model: any) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.oldCarIncomingApply,
      data: model,
      loading: true
    })
  }

  /**
   * 客户签约保存/提交
   */
  @Debounce()
  sign(data: any, type: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.sign,
      data: {
        expenseList: data.expenseList,
        orderId: data.orderId,
        orderPrice: data.incomingOrderInfo.orderPrice,
        type: type
      },
      loading: true
    })
  }

  /**
   * 进件检查客户信息是否完善
   */
  checkCustomerInfo(customerId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.checkCustomerInfo,
      append: customerId,
      loading: true
    })
  }

  /**
   * 订单查询
   */
  queryOrder(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerOrderController.queryOrder,
      data: model,
      page: page
    })
  }
}
