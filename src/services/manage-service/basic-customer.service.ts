import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { manageService } from '~/config/server/manage-service'
import { FilterService } from '~/utils/filter.service'

export class BasicCustomerService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 根据ID查找客户
   */
  findCustomerById(customerId) {
    return this.netService.send({
      server: manageService.basicCustomerController.findCustomerById,
      append: customerId
    })
  }
  /**
   * 客户银行卡信息
   */
  findCustomerBankInfo(customerId) {
    return this.netService.send({
      server: manageService.basicCustomerController.getCustomerBankInfo,
      data: {
        customerId: customerId
      }
    })
  }
  /**
   * 获取客户签约列表
   * @param data 查询参数实体
   * @param page 分页参数实体
   */
  getCustomerSignList(data, page) {
    return this.netService.send({
      server: manageService.basicCustomerController.getCustomerSignList,
      data: {
        orderNo: data.orderNo,
        idCard: data.idCard
      },
      page: page,
      loading: true,
    })
  }
  /*
   * 新增客户
   */
  @Debounce()
  addBasicCustomer(data) {
    return this.netService.send({
      server: manageService.basicCustomerController.addBasicCustomer,
      data: {
        customerName: data.name,
        customerSex: data.sex,
        birthTime: FilterService.dateFormat(data.birthDate),
        customerAge: data.age,
        education: data.education,
        idCard: data.idCard,
        marital: data.marital,
        provideNum: data.provideNum,
        childsNum: data.childsNum,
        customerPhone: data.phone,
        customerPhoneMain: data.phone2,
        qq: data.qq,
        wechat: data.wechat,
        localHomeProvince: data.homeProvince,
        localHomeCity: data.homeCity,
        localHomeArea: data.homeArea,
        localHomeAddr: data.localHomeAddr,
        homeType: data.homeType,
        idCardProvince: data.idCardProvince,
        idCardCity: data.idCardCity,
        idCardArea: data.idCardArea,
        idCardAddress: data.idCardAddress,
        intentionType: data.intentionType,
        intentionLevel: data.intentionLevel,
        postalCode: data.postalCode
      },
      loading: true,
    })
  }
  /*
   * 修改客户
   */
  @Debounce()
  editBasicCustomer(data, customerId) {
    return this.netService.send({
      server: manageService.basicCustomerController.editBasicCustomer,
      data: {
        id: customerId,
        customerName: data.name,
        customerSex: data.sex,
        birthTime: FilterService.dateFormat(data.birthDate),
        customerAge: data.age,
        education: data.education,
        idCard: data.idCard,
        marital: data.marital,
        provideNum: data.provideNum,
        childsNum: data.childsNum,
        customerPhone: data.phone,
        customerPhoneMain: data.phone2,
        qq: data.qq,
        wechat: data.wechat,
        localHomeProvince: data.homeProvince,
        localHomeCity: data.homeCity,
        localHomeArea: data.homeArea,
        localHomeAddr: data.localHomeAddr,
        homeType: data.homeType,
        idCardProvince: data.idCardProvince,
        idCardCity: data.idCardCity,
        idCardArea: data.idCardArea,
        idCardAddress: data.idCardAddress,
        postalCode: data.postalCode
      },
      loading: true,
    })
  }
  /**
   * 新增银行卡
   * @param data 
   */
  @Debounce()
  addBasicCustomerBank(data) {
    return this.netService.send({
      server: manageService.basicCustomerController.addBasicCustomerBank,
      data: data,
      loading: true,
    })
  }

  /**
   * 编辑客户开户银行卡
   */
  @Debounce()
  updateCustomerBank(data) {
    return this.netService.send({
      server: manageService.basicCustomerController.updateCustomerBank,
      data: data,
      loading: true,
    })
  }
  /**
   * 删除银行卡信息
   */
  @Debounce()
  deleteCustomerBankInfo(bankCardId) {
    return this.netService.send({
      server: manageService.basicCustomerController.deleteCustomerBankInfo,
      data: {
        bankId: bankCardId
      }
    })
  }
  /**
   * 意向记录列表
   */
  findAllCustomerIntentionList(page) {
    return this.netService.send({
      server: manageService.basicCustomerController.findAllCustomerIntentionList,
      page: page
    })
  }
  /**
   * 根据客户id查找意向记录列表
   */
  findCustomerIntentionList(customerId) {
    return this.netService.send({
      server: manageService.basicCustomerController.findCustomerIntentionList,
      append: customerId
    })
  }
  /**
   * 根据意向id查找跟踪记录
   */
  findCustomerFollowList(intentionId) {
    return this.netService.send({
      server: manageService.basicCustomerController.findCustomerFollowList,
      append: intentionId
    })
  }
  /**
   * 新增跟进记录
   */
  @Debounce()
  addBasicCustomerFollow(data, intentionId) {
    return this.netService.send({
      server: manageService.basicCustomerController.addBasicCustomerFollow,
      data: {
        intentionId: intentionId,
        followType: data.followType,
        followResult: data.followResult,
        remark: data.remark
      },
      loading: true
    })
  }
  /**
   * 新增意向记录
   */
  @Debounce()
  addBasicIntentionalCustomer(data, customerId) {
    return this.netService.send({
      server: manageService.basicCustomerController.addBasicIntentionalCustomer,
      data: {
        customerId: customerId,
        intentionType: data.intentionType,
        intentionStatus: data.intentionStatus,
        intentionLevel: data.intentionLevel,
        remark: data.remark
      },
      loading: true
    })
  }
}