import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { thirdpartyService } from '~/config/server/thirdparty-service'

export class ThirdpartyManageService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 同步车300数据
   */
  che300DataSync() {
    return this.netService.send({
      server: thirdpartyService.che300Controller.che300DataSync,
    })
  }
}