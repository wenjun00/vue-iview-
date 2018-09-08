import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class BasicOrderFileService {
  @Inject()
  private netService: NetService

  /**
   * 查询订单附件
   */
  getOrderFile(orderId) {
    return this.netService.send({
      server: manageService.basicOrderFileController.getOrderFile,
      append: orderId
    })
  }

  /**
   * 合同资料上传
   * @param 资料实体
   */
  @Debounce()
  addUploadBasicOrderFile(orderId: number, fileList: Array<any>) {
    return this.netService.send({
      server: manageService.basicOrderFileController.addUploadBasicOrderFile,
      data: {
        orderId: orderId,
        customerOrderFileModels: fileList
      },
      loading: true
    })
  }
  /**
   * 查询合同附件
   */
  getContractFile(orderId) {
    return this.netService.send({
      server: manageService.basicOrderFileController.getContractFile,
      append: orderId
    })
  }

}