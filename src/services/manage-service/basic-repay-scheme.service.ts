import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { requestType } from "~/config/enum.config";
import { manageService } from '~/config/server/manage-service'
import { PageService } from '~/utils/page.service';

export class RepaySchemeService {
  @Inject(NetService)
  private netService: NetService


  /**
   * 新增业务
   */
  @Debounce()
  addBusiness(model) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.addBusiness,
      data: model,
      loading: true
    })
  }

  /**
   * 修改业务
   */
  @Debounce()
  updateBusiness(id: Number, model) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.updateBusiness,
      data: Object.assign({ id: id }, model),
      loading: true
    })
  }
  /**
    * 删除业务
    */
  @Debounce()
  deleteBusinessById(id: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.deleteBusinessById,
      append: id,
      loading: true
    })
  }

  /**
   * 查询所有业务
   */
  findBusinessList() {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findBusinessList
    })
  }

  /**
   * 根据进件类型查询进件业务
   */
  findByBusinessType(businessType: number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findByBusinessType,
      data: {
        businessType: businessType
      }
    })
  }
  /**
   * 查询某项业务
   */
  findBusinessById(id: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findBusinessById,
      append: id
    })
  }

  /**
   * 分页查询业务下的产品数据
   * @param businessId 业务ID
   * @param model 
   * @param page 
   */
  querySchemeByBusiness(businessId: Number, model: any, page: PageService) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.querySchemeByBusiness,
      data: {
        businessId: businessId,
        schemeName: model.schemeName,
        repayType: model.repayType,
        schemeStatus: model.schemeStatus
      },
      page: page
    })
  }

  /**
   * 根据ID查询产品信息
   */
  findSchemeById(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSchemeById,
      append: productId,
    })
  }
  /**
   * 新增产品
   */
  addRepayScheme(model) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.addRepayScheme,
      data: {
        businessId: model.businessId,
        accountDay: model.accountDay,  // 还款日
        accountPeriodType: model.accountPeriodType,  // 还款日类型
        channelIds: model.channelIds,  // 资金渠道
        cycleType: model.cycleType,  // 周期类型
        downPayment: model.downPayment,  // 首付比例
        interestRate: model.interestRate,  // 月利率
        offsetId: model.offsetId,  // 冲抵ID
        overdueDays: model.overdueDays,  // 逾期宽限天数
        periods: model.periods,  // 期数
        remar: model.remark,  // 备注
        repayType: model.repayType,  // 还款方式
        schemeName: model.schemeName,  // 产品名称
        workFlowKey: model.workFlowKey, // 工作流KEY
        moneyMax: model.moneyMax,
        moneyMin: model.moneyMin
      },
      loading: true
    })
  }
  /**
   * 修改产品
   */
  updateRepayScheme(productId: Number, model) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.updateRepayScheme,
      data: {
        id: productId,
        businessId: model.businessId,
        accountDay: model.accountDay,  // 还款日
        accountPeriodType: model.accountPeriodType,  // 还款日类型
        channelIds: model.channelIds,  // 资金渠道
        cycleType: model.cycleType,  // 周期类型
        downPayment: model.downPayment,  // 首付比例
        interestRate: model.interestRate,  // 月利率
        offsetId: model.offsetId,  // 冲抵ID
        overdueDays: model.overdueDays,  // 逾期宽限天数
        periods: model.periods,  // 期数
        remar: model.remark,  // 备注
        repayType: model.repayType,  // 还款方式
        schemeName: model.schemeName,  // 产品名称
        workFlowKey: model.workFlowKey, // 工作流KEY
        moneyMax: model.moneyMax,
        moneyMin: model.moneyMin
      },
      loading: true
    })
  }
  /**
   * 删除产品
   */
  deleteRepayScheme(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.deleteRepayScheme,
      append: productId,
      loading: true
    })
  }
  /**
   * 发布/取消发布产品
   */
  releaseRepayScheme(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.releaseRepayScheme,
      append: productId,
      loading: true
    })
  }

  /**
   * 维护产品适配车型
   * @param productId 产品ID
   * @param modelsArray 车型ID数组
   */
  schemeModel(productId, isAll: Boolean, modelsArray: Number[]) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.schemeModel,
      data: {
        schemeId: productId,
        isAll: isAll ? 1 : 0,
        modelIds: modelsArray
      },
      loading: true
    })
  }
  /**
   * 添加 修改产品费用项
   */
  schemeExpense(model) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.schemeExpense,
      data: {
        id: model.id,
        schemeId: model.schemeId,
        paymentType: model.paymentType,
        fixedCost: model.fixedCost,
        repayProportion: model.repayProportion,
        expenseId: model.expenseId, // 费用项名称ID
        isRefund: model.isRefund, // 是否退款,默认退款
        repayType: model.repayType, // 支付方式
        costType: model.costType // 费用项类型
      },
      loading: true
    })
  }
  /**
   * 维护产品适配机构
   * @param productId 产品ID
   * @param modelsArray 机构ID数组
   */
  schemeOrg(productId, isAll: Boolean, modelsArray: Number[]) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.schemeOrg,
      data: {
        schemeId: productId,
        isAll: isAll ? 1 : 0,
        orgIds: modelsArray
      }
    })
  }
  /**
   * 查询产品适配的车型ID 用于回显
   */
  findSchemeModel(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSchemeModel,
      append: productId
    })
  }
  /**
   * 查询产品已经配置的车辆
   * @param productId 产品ID
   * @param model 查询条件
   */
  querySchemeModel(productId: Number, model, page: PageService) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.querySchemeModel,
      data: {
        schemeId: productId,
        brandName: model.brand,
        seriesName: model.series,
        modelName: model.model
      },
      page
    })
  }
  /**
  * 查询产品适配的机构 ID 用于回显
  */
  findSchemeOrg(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSchemeOrg,
      append: productId
    })
  }

  /**
   * 查询产品已经配置的机构
   * @param productId 
   * @param model 
   * @param page 
   */
  querySchemeOrg(productId: Number, model, page: PageService) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.querySchemeOrg,
      data: Object.assign({ schemeId: productId }, model),
      page
    })
  }
  /**
  * 查询产品费用项
  */
  findSchemeExpenseBySchemeId(productId: Number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSchemeExpenseBySchemeId,
      append: productId
    })
  }

  /**
   * 根据获取费用项明细
   */
  getSchemeExpenseById(feeItemId: number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.getSchemeExpenseById,
      append: feeItemId
    })
  }

  /**
   * 删除费用项
   */
  deleteRepaySchemeExpense(feeItemId: number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.deleteRepaySchemeExpense,
      append: feeItemId,
      loading: true
    })
  }

  /**
   * 获取产品费用项(多种支付方式/多种费用项类型适用数组返回
   * 用于进件填写费用项
   */
  findInputSchemeExpenseBySchemeId(productId: number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findInputSchemeExpenseBySchemeId,
      append: productId
    })
  }

  /**
   * 查询产品选中的资金渠道
   */
  findSelectedChannel(schemeId: number) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSelectedChannel,
      data: {
        schemeId: schemeId
      }
    })
  }

  /**
   * 查询产品选中的资金渠道
   */
  // findSelectedChannelName(schemeId: number) {
  //   return this.netService.send({
  //     server: manageService.basicRepaySchemeController.findSelectedChannelName,
  //     append: schemeId
  //   })
  // }

  /**
  * 查询产品选中的资金渠道
  */
  findSelectedChannelName(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicRepaySchemeController.findSelectedChannelName,
      data: {
        schemeId: model.schemeId,
        fundsCode: model.fundsCode,
        fundsName: model.fundsName
      },
      page
    })
  }
}