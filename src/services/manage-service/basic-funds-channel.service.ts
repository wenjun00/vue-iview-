import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator"
import { FilterService } from "~/utils/filter.service"

export class BasicFundsChannelService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 分页查询资金渠道列表
   */
  queryBasicSupplierPage(model, page) {
    return this.netService.send({
      server: manageService.basicFundsChannelController.queryBasicSupplierPage,
      data: {
        channelNo: model.fundsCode,
        channelName: model.fundsName,
        channelStatus: model.channelStatus // 启用的资金渠道
      },
      page: page
    })
  }
  /**
   * 新增资金渠道
   */
  @Debounce()
  addBasicFundsChannel(data) {
    let result = Object.assign({}, data)
    result.startDate = FilterService.dateFormat(result.endDate[0], 'YYYY-MM-DD')
    result.endDate = FilterService.dateFormat(result.endDate[1], 'YYYY-MM-DD')
    return this.netService.send({
      server: manageService.basicFundsChannelController.addBasicFundsChannel,
      data: result,
      loading: true
    })
  }
  /** 
   * 修改资金渠道
  */
  @Debounce()
  editBasicFundsChannel(data) {
    let result = Object.assign({}, data)
    result.startDate = FilterService.dateFormat(result.endDate[0], 'YYYY-MM-DD')
    result.endDate = FilterService.dateFormat(result.endDate[1], 'YYYY-MM-DD')
    return this.netService.send({
      server: manageService.basicFundsChannelController.editBasicFundsChannel,
      data: result,
      loading: true
    })
  }
  /**
   * 删除资金渠道
   */
  @Debounce()
  deleteBasicFundsChannel(id) {
    return this.netService.send({
      server: manageService.basicFundsChannelController.deleteBasicFundsChannel,
      append: id,
      loading: true
    })
  }
  /**
  * 停用资金渠道
  */
  @Debounce()
  stopBasicFundsChannel(id) {
    return this.netService.send({
      server: manageService.basicFundsChannelController.stopBasicFundsChannel,
      append: id,
      loading: true
    })
  }
  /**
    * 启用资金渠道
    */
  @Debounce()
  startBasicFundsChannel(id) {
    return this.netService.send({
      server: manageService.basicFundsChannelController.startBasicFundsChannel,
      append: id,
      loading: true
    })
  }

  /**
   * 获取启用的资金渠道列表
   */
  findAllEnableChannelListByOrg(){
    return this.netService.send({
      server: manageService.basicFundsChannelController.findAllEnableChannelListByOrg
    })
  }
  /**
   * 查询订单所选产品下的资金渠道列表
   */
  queryChannelNameByOrder(orderId){
    return this.netService.send({
      server: manageService.basicFundsChannelController.queryChannelNameByOrder,
      data: {orderId: orderId}
    })
  }
}
