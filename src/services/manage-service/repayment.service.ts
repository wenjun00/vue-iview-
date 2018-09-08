import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class RepaymentService {
  @Inject()
  private netService: NetService

  /**
   * 获取宝付绑卡URL
   */
  getBFUrl() {
    return this.netService.send({
      server: manageService.repaymentController.getBFUrl
    })
  }
  /**
   * 获取平安付绑卡URL
   */
  getPAFUrl(customId) {
    return this.netService.send({
      server: manageService.repaymentController.getPAFUrl,
      data: {
        customId: customId
      }
    })
  }
}