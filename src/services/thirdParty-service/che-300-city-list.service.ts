import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { thirdpartyService } from '~/config/server/thirdparty-service'
import { PageService } from '~/utils/page.service';

export class Che300CityListService {
  @Inject(NetService)
  private netService: NetService

  
  /**
     * 对接车300城市列表
     */
    che300CityList() {
      return this.netService.send({
          server: thirdpartyService.che300CityListController.che300CityList
      })
  }

}