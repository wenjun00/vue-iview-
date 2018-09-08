import { NetService } from "~/utils/net.service";
import { Inject, Debounce } from "~/core/decorator";
import { manageService } from "~/config/server/manage-service";
import { PageService } from "~/utils/page.service";
import { FilterService } from "~/utils/filter.service";

export class BasicCustomerCarCenterService {
  @Inject(NetService)
  private netService: NetService;

  /**
   * 车辆列表
   *  @param model 查询参数实体
   *  @param page 分页参数实体
   */
  queryCustomerCarList(model, page) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryCustomerCarList,
      data: {
        brandId: model.brandName,
        orgName: model.orgName,
        plateNo: model.plateNo,
        seriesId: model.seriesName,
        stockCarNo: model.stockCarNo,
        stockStatus: model.stockStatus
      },
      page
    });
  }

  /**
   * 手动入库/新增库存车辆
   */
  @Debounce()
  addCustomerStorage(data) {
    let model = Object.assign({}, data);
    model.licensingDate = FilterService.dateFormat(model.licensingDate);
    model.stockInDate = FilterService.dateFormat(model.stockInDate);
    model.makeDate = FilterService.dateFormat(model.makeDate);
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.addCustomerStorage,
      data: model,
      loading: true
    });
  }

  /**
   * 编辑入库车辆
   */
  @Debounce()
  editCustomerStorage(data) {
    let model = Object.assign({}, data);
    model.licensingDate = FilterService.dateFormat(model.licensingDate);
    model.stockInDate = FilterService.dateFormat(model.stockInDate);
    model.makeDate = FilterService.dateFormat(model.makeDate);
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.editCustomerStorage,
      data: model,
      loading: true
    });
  }

  /**
   * 删除入库信息
   */
  @Debounce()
  deleteCustomerStorage(id) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.deleteCustomerStorage,
      append: id,
      loading: true
    });
  }

  /**
   * 删除车辆图片
   */
  @Debounce()
  deleteStorageByFile(id) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.deleteStorageByFile,
      append: id,
      loading: true
    });
  }

  /**
   * 库存车辆信息
   */
  queryCustomerCarStorage(stockId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryCustomerCarStorage,
      append: stockId
    });
  }

  /**
   * 获取门店列表
   */
  queryDeptList() {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.queryDeptList,
      loading: true
    });
  }

  /**
   * 调拨门店列表
   */
  queryTransferDeptList() {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryTransferDeptList,
      loading: true
    });
  }

  /**
   * 评估入库
   */
  @Debounce()
  assessmentInstorage(data) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.assessmentInstorage,
      data,
      loading: true
    });
  }

  /**
   * 抵押出库
   */
  @Debounce()
  mortgageOutstorage(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.mortgageOutstorage,
      data,
      loading: true
    });
  }

  /**
   * 租赁出库
   */
  @Debounce()
  leaseOutstorage(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.leaseOutstorage,
      data,
      loading: true
    });
  }

  /**
   * 查询所有可选择二手车进件的车辆
   */
  queryStockCar(model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.queryStockCar,
      data: model,
      page
    });
  }

  /**
   * 获取关联订单信息
   */
  queryOrderByCarInfo(stockId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryOrderByCarInfo,
      data: {
        stockId: stockId
      }
    });
  }

  /**
   * 获取车辆整备状态
   */

  queryStockCarPrepareInfo(stockId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryStockCarPrepareInfo,
      data: {
        stockId: stockId
      }
    });
  }

  /**
   * 手动入库
   */
  @Debounce()
  addPutInStorageByCar(data) {
    let model = Object.assign({}, data);
    model.licensingDate = FilterService.dateFormat(model.licensingDate);
    model.stockInDate = FilterService.dateFormat(model.stockInDate);
    model.makeDate = FilterService.dateFormat(model.makeDate);
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.addPutInStorageByCar,
      data: model,
      loading: true
    });
  }

  /**
   * 车辆整备
   */
  @Debounce()
  basicCarPrepare(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.basicCarPrepare,
      data: data,
      loading: true
    });
  }

  /**
   * 重新整备
   */
  @Debounce()
  basicCarAgainPrepare(data) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.basicCarAgainPrepare,
      data: data,
      loading: true
    });
  }

  /**
   * 出库车辆列表
   */
  queryOutOfStockCarList(model, page: PageService) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryOutOfStockCarList,
      data: {
        brandId: model.brandName,
        orgName: model.orgName,
        plateNo: model.plateNo,
        seriesId: model.seriesName,
        stockCarNo: model.stockCarNo,
        stockStatus: model.stockStatus
      },
      page
    });
  }

  /**
   * 拖车入库
   */
  @Debounce()
  basicPullStockCar(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.basicPullStockCar,
      data: data,
      loading: true
    });
  }

  /**
   * 车辆过户
   */
  @Debounce()
  carTransfer(stockId, remark, dataSet) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.carTransfer,
      data: {
        addStorageCarModel: dataSet,
        remark: remark,
        stockId: stockId
      },
      loading: true
    });
  }

  /**
   * 调拨入库
   */
  @Debounce()
  basicTransferCarInStorage(id, outOrgId, stockId, remark, dataSet) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController
          .basicTransferCarInStorage,
      data: {
        id: id,
        outOrgId: outOrgId,
        stockId: stockId,
        remark: remark,
        addStorageCarModels: dataSet
      },
      loading: true
    });
  }

  /**
   * 调拨出库
   */
  @Debounce()
  basicTransferCarStorage(data, dataSet) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.basicTransferCarStorage,
      data: {
        outOrgId: data.outOrgId,
        inOrgId: data.inOrgId,
        logisticsWay: data.logisticsWay,
        allocationReason: data.allocationReason,
        remark: data.remark,
        stockId: data.stockId,
        addStorageCarModels: dataSet
      },
      loading: true
    });
  }

  /**
   * 获取车辆调拨计划
   */
  vehicleTransferPlan(stockId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.vehicleTransferPlan,
      data: {
        stockId: stockId
      },
      loading: true
    });
  }

  /**
   * 修改整备状态
   */
  updatePrepareStatus(stockId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.updatePrepareStatus,
      data: { stockId: stockId },
      loading: true
    });
  }

  /**
   * 修改车辆公里数
   */
  @Debounce()
  editCarMileage(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.editCarMileage,
      data: data,
      loading: true
    });
  }

  /**
   * 采购车辆列表
   *  @param model 查询参数实体
   *  @param page 分页参数实体
   */
  queryPurchaseList(data, page) {
    let model = Object.assign({}, data);
    model.startDate = FilterService.dateFormat(model.startEndDate[0]);
    model.endDate = FilterService.dateFormat(model.startEndDate[1]);
    delete model.startEndDate;
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.queryPurchaseList,
      data: model,
      page,
      loading: true
    });
  }
  /**
   * 新增采购登记
   */
  @Debounce()
  addPurchaseInfo(data) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.addPurchaseInfo,
      data,
      loading: true
    });
  }

  /**
   * 获取采购进度
   */
  queryPurchaseProgress(purchaseId?) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryPurchaseProgress,
      data: {
        purchaseId: purchaseId
      }
    });
  }

  /**
   * 获取采购供应商
   */
  queryPurchaseRegistration(purchaseId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController
          .queryPurchaseRegistration,
      data: {
        purchaseId: purchaseId
      }
    });
  }

  /**
   * 查看采购登记车辆
   */
  queryPurchaseCarInfo(purchaseId) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.queryPurchaseCarInfo,
      data: {
        purchaseId: purchaseId
      }
    });
  }
  /**
   * 获取入库金额详情
   */
  queryPriceInfo(purchaseId) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.queryPriceInfo,
      data: {
        purchaseId: purchaseId
      }
    });
  }
  /**
   * 获取采购登记材料
   */
  queryPurchaseFile(purchaseId) {
    return this.netService.send({
      server: manageService.basicCustomerCarCenterController.queryPurchaseFile,
      data: {
        purchaseId: purchaseId
      }
    });
  }
  /**
   * 采购入库
   */
  @Debounce()
  basicPurchaseStorage(data) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.basicPurchaseStorage,
      data: data,
      loading: true
    });
  }

  /**
   * 采购复核
   */
  @Debounce()
  basicPurchaseReview(data) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.basicPurchaseReview,
      data: {
        purchaseId: data.purchaseId,
        reviewRemark: data.reviewRemark,
        type: data.type
      },
      loading: true
    });
  }
  /**
   * 编辑采购登记信息
   */
  @Debounce()
  updatePurchaseCarInfo(data) {
    return this.netService.send({
      server:
        manageService.basicCustomerCarCenterController.updatePurchaseCarInfo,
      data,
      loading: true
    });
  }
}
