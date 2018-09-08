//合规检查
import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator"
import { PageService } from '~/utils/page.service'
import { requestType } from "~/config/enum.config"

export class BasicOrderComplianceService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 查看直租消费贷订单
   */
  queryOrderDirectRentList(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.queryOrderDirectRentList,
      data: {
        orderNo: model.orderNo,
        idCard: model.idCard
      },
      page: page
    })
  }
  /**
   * 查看回租消费贷订单
   */
  queryOrderLeaseBackList(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.queryOrderLeaseBackList,
      data: {
        orderNo: model.orderNo,
        idCard: model.idCard
      },
      page: page
    })
  }
  /**
   * 车辆匹配
   */
  queryCarMatchList(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.queryCarMatchList,
      data: {
        brandName: model.brandName,
        seriesName: model.seriesName,
        modelName: model.modelName,
        color: model.color,
        stockStatus: 10182
      },
      page: page
    })
  }
  /**
   * 合同合规
   */
  basicContractCompliance(orderId) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.basicContractCompliance,
      append: orderId,
      loading: true
    })
  }
  /**
   * 车辆合规
   */
  basicCarCompliance(orderId) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.basicCarCompliance,
      append: orderId,
      loading: true
    })
  }
  /**
   * 确认匹配
   */
  basicCarConfirmMatch(stockId, orderId) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.basicCarConfirmMatch,
      data: {
        stockId: stockId,
        orderId: orderId
      },
      loading: true
    })
  }
  /**
   * 获取客户签约后订单列表
   */
  queryOrderList(data, page: PageService) {
    return this.netService.send({
      server: manageService.basicOrderComplianceController.queryOrderList,
      data: data,
      page: page
    })
  }

}
