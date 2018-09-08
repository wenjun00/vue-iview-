import { manageService } from '~/config/server/manage-service'
import { Inject, Debounce } from '~/core/decorator'
import { NetService } from '~/utils/net.service'
import { FilterService } from '~/utils/filter.service';
import { PageService } from '~/utils/page.service'

export class ContractBusinessService {
  @Inject()
  private netService: NetService;

  /**
   * 查询合同列表
   */
  getContractListByOrderId(orderId): any {
    return this.netService.send({
      server: manageService.contractBusinessController.getContractListByOrderId,
      data: {
        orderId: orderId
      }
    })
  }
  /**
   * 生成合同
   */
  createAllContracts(orderId): any {
    return this.netService.send({
      server: manageService.contractBusinessController.createAllContracts,
      data: {
        orderId: orderId
      },
      loading: true,
    })
  }
/**
 * 查看合同列表
 */
getContractViewByContractId(contractId): any {
  return this.netService.send({
    server: manageService.contractBusinessController.getContractViewByContractId,
    data: {
      contractId : contractId
    },
    loading: true,
  })
}
/**
 * 下载合同列表
 */
downLoadConract(contranctId ): any {
  return this.netService.send({
    server: manageService.contractBusinessController.downLoadConract,
    data: {
      contranctId :contranctId 
    },
    loading: true,
  })
}




}
