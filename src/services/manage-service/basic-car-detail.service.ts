import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator"
import { manageService } from '~/config/server/manage-service'
import { PageService } from '~/utils/page.service'
import { FilterService } from '~/utils/filter.service'

export class BasicCarDetailService {
  @Inject(NetService)
  private netService: NetService


  /**
   * 新增GPS记录
   */
  @Debounce()
  addCarGps(data, stockId) {
    return this.netService.send({
      data: {
        gpsManufactor: data.gpsManufactor,
        gpsNo: data.gpsNo,
        gpsStatus: data.gpsStatus,
        stockId: stockId
      },
      loading: true,
      server: manageService.basicCarDetailController.addCarGps,
    })
  }
  /**
   * 修改GPS记录
   */
  @Debounce()
  editCarGps(data, id) {
    return this.netService.send({
      data: data,
      id: id,
      loading: true,
      server: manageService.basicCarDetailController.editCarGps,
    })
  }
  /**
   * 查看GPS列表
   */
  queryCarGpsPage(stockId) {
    return this.netService.send({
      append: stockId,
      server: manageService.basicCarDetailController.queryCarGpsPage,
    })
  }


  /**
   * 新增保险记录
   */
  @Debounce()
  addInsuranceRecord(data, BaiscStockCarFileModel, stockId) {
    return this.netService.send({
      data: {
        id: data.id,
        insuranceCompany: data.insuranceCompany,
        insuranceEndDate: FilterService.dateFormat(data.insuranceEndDate),
        jqxNo: data.jqxNo,
        insuranceRemark: data.insuranceRemark,
        stockId: stockId,
        syNo: data.syNo,
        totalAmount: data.totalAmount,
        basicStockCarFileModels: BaiscStockCarFileModel
      },
      loading: true,
      server: manageService.basicCarDetailController.addInsuranceRecord,
    })
  }
  /**
   * 修改保险记录
   */
  @Debounce()
  editInsuranceRecord(data, id) {
    let model = Object.assign({}, data)
    model.insuranceEndDate = FilterService.dateFormat(model.insuranceEndDate)
    return this.netService.send({
      data: model,
      id: id,
      loading: true,
      server: manageService.basicCarDetailController.editInsuranceRecord,
    })
  }
  /**
   *  查看保险记录
   */
  queryInsuranceRecord(stockId) {
    return this.netService.send({
      append: stockId,
      server: manageService.basicCarDetailController.queryInsuranceRecord,
    })
  }

  /**
   * 新增车检记录
   */
  @Debounce()
  addCarInspectionRecord(data, stockId) {
    return this.netService.send({
      data: {
        inspectCost: data.inspectCost,
        inspectEndDate: FilterService.dateFormat(data.inspectEndDate),
        inspectResult: data.inspectResult,
        remark: data.remark,
        stockId: stockId
      },
      loading: true,
      server: manageService.basicCarDetailController.addCarInspectionRecord,
    })
  }
  /**
   * 修改车检记录
   */
  @Debounce()
  editCarInspectionRecord(data, id) {
    let model = Object.assign({}, data)
    model.inspectEndDate = FilterService.dateFormat(model.inspectEndDate)
    return this.netService.send({
      data: model,
      id: id,
      loading: true,
      server: manageService.basicCarDetailController.editCarInspectionRecord,
    })
  }
  /**
   *  查看车检记录
   */
  queryCarInspectionRecord(stockId) {
    return this.netService.send({
      append: stockId,
      server: manageService.basicCarDetailController.queryCarInspectionRecord,
    })
  }

  /**
   * 上传图片
   */
  @Debounce()
  uploadCarPhoto(data, stockId) {
    return this.netService.send({
      data: {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        carImageType: data.carImageType,
        stockId: stockId
      },
      loading: true,
      server: manageService.basicCarDetailController.uploadCarPhoto,
    })
  }

  /**
   * 上传评估入库图片
   */
  @Debounce()
  uploadAssessmentInstoragePhoto(data, id) {
    return this.netService.send({
      data: {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        carImageType: data.dataType,
        id: id
      },
      loading: true,
      server: manageService.basicCarDetailController.uploadAssessmentInstoragePhoto,
    })
  }

  /**
   * 删除图片
   */
  @Debounce()
  deleteFile(fileId) {
    return this.netService.send({
      data: { fileId: fileId },
      loading: true,
      server: manageService.basicCarDetailController.deleteFile,
    })
  }

  /**
   * 获取图片列表
   */
  selectCarPhoto(stockId) {
    return this.netService.send({
      data: {
        stockId: stockId
      },
      server: manageService.basicCarDetailController.selectCarPhoto,
    })
  }

  /**
   * 获取评估入库图片
   */
  selectCarAssessmentPhoto(id) {
    return this.netService.send({
      data: {
        id: id
      },
      server: manageService.basicCarDetailController.selectCarAssessmentPhoto,
    })
  }
}