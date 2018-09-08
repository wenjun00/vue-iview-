import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { PageService } from '~/utils/page.service'

export class BasicCustomerOrderApprove {
  @Inject(NetService)
  private netService: NetService


  /**
   * 分页查询所有待当前登录人审核的订单
   * @param queryParamsModel 查询参数实体
   * @param page 分页参数实体
   */
  queryWaitApproval(queryParamsModel: any, page: PageService): any {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.queryWaitApproval,
      data: {
        orderType:queryParamsModel.orderType,
        customerName: queryParamsModel.customerName,
        userStatus: queryParamsModel.idCard,
        customerPhone: queryParamsModel.customerPhone,
        orderNo: queryParamsModel.orderNo,
        orderStatus: queryParamsModel.orderStatus
      },
      page: page
    })
  }

  /**
   * 订单审核
   * @param data 
   */
  @Debounce()
  approval(data: any): any {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.approval,
      data: data,
      loading: true
    });
  }


  /**
   * 删除审核附件
   * @param id 附件ID
   */
  @Debounce()
  deleteApproveFile(id: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.deleteApproveFile,
      data: {
        id: id,
      },
      loading: true
    });
  }
  /**
   * 查询审核附件
   */
  queryApprovalFile(orderId: number, processName: string) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.queryApprovalFile,
      data: {
        orderId,
        processName
      }
    });
  }
  /**
   * 查询审核原因
   * @param reasonLevel 查询原因级别 1-1级原因 2-2级原因 3-3级原因
   * @param reasonResult 审核结果 1-拒绝 2-退件
   * @param reasonSuperName 上级原因名称
   */
  queryApprovalReason(reasonLevel: number, reasonResult: number, reasonSuperName: string) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.queryApprovalFile,
      data: {
        reasonLevel,
        reasonResult,
        reasonSuperName
      }
    });
  }
  /**
   * 上传审核附件
   * @param orderId 
   * @param processName 
   * @param fileList 文件列表
   */
  @Debounce()
  uploadApproveFile(orderId: number, processName: string, fileList: any[]) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.uploadApproveFile,
      data: {
        approveFileList: fileList,
        orderId,
        processName
      },
      loading: true
    });
  }

  /**
   * 审核原因列表获取
   * @param type 类型 1-退件，2-拒绝
   */
  getApproveReasonByType(type: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.getApproveReasonByType,
      data: {
        type
      }
    });
  }

  /**
   * 根据订单ID获取订单审批记录
   * @param orderId 
   */
  findApproveHistory(orderId: number) {
    return this.netService.send({
      server: manageService.basicCustomerOrderApproveController.findApproveHistory,
      append: orderId
    });
  }
}
