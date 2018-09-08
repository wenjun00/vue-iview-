import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { requestType } from "~/config/enum.config";
import { manageService } from '~/config/server/manage-service'
import { PageService } from '~/utils/page.service';

export class SysOrgService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 新增组织机构
   */
  addOrganization(data) {
    return this.netService.send({
      server: manageService.sysOrgController.addOrganization,
      data: data,
      loading: true
    })
  }
  /**
   * 删除组织机构
   */
  deleteOrganization(orgId) {
    return this.netService.send({
      server: manageService.sysOrgController.deleteOrganization,
      append: orgId,
      loading: true
    })
  }
  /**
   * 更新组织机构
   */
  editOrganization(data) {
    return this.netService.send({
      server: manageService.sysOrgController.editOrganization,
      data: {
        id: data.id,
        orgPid: data.orgPid,
        orgName: data.orgName,
        orgRemark: data.orgRemark,
        orgStatus: data.orgStatus,
        orgType: data.orgType,
        orgKind: data.orgKind
      },
      loading: true
    })
  }

  /**
   * 根据机构查询公司
   */
  findAllOrganizationByAuth() {
    return this.netService.send({
      server: manageService.sysOrgController.findAllOrganizationByAuth
    })
  }

  /**
   * 分页查询所有的门店和外部机构
   */
  queryStoreAndExternal(model, page: PageService) {
    return this.netService.send({
      server: manageService.sysOrgController.queryStoreAndExternal,
      data: model,
      page
    })
  }
}