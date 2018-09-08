import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator"
import { manageService } from '~/config/server/manage-service'
import { PageService } from '~/utils/page.service'
import { FilterService } from '~/utils/filter.service'

export class BasicCarManageService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 查询车系下的车型 分页
   * @param seriesId 车系ID
   * @param model 查询实体
   * @param page 分页对象
   */
  queryModelBySeriesId(seriesId, model, page: PageService) {
    return this.netService.send({
      server: manageService.basicCarManagecontroller.queryModelBySeriesId,
      data: {
        seriesId: seriesId,
        modelName: model.modelName
      },
      page: page,
      loading: true
    })
  }

  /**
   * 获取当前登录人机构下的车辆树
   */
  getAllCarTreeAnotherList() {
    return this.netService.send({
      server: manageService.basicCarManagecontroller.getAllCarTreeAnotherList
    })
  }

  /**
   * 车辆维护树
   */
  getAllCarTreeList() {
    return this.netService.send({
      server: manageService.basicCarManagecontroller.getAllCarTreeList,
    })
  }
  /**
   * 新增品牌
   */
  @Debounce()
  addCarBrand(brandName, url) {
    return this.netService.send({
      data: {
        brandName: brandName,
        brandPhotoUrl: url,
      },
      loading: true,
      server: manageService.basicCarManagecontroller.addCarBrand,
    })
  }
  /**
   * 修改车辆品牌
   */
  @Debounce()
  editCarBrand(data) {
    return this.netService.send({
      data: data,
      loading: true,
      server: manageService.basicCarManagecontroller.editCarBrand,
    })
  }
  /**
   * 车辆品牌查看
   */
  getCarBrandById(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.getCarBrandById,
    })
  }
  /**
   * 删除车辆品牌
   */
  @Debounce()
  deleteCarBrand(id) {
    return this.netService.send({
      append: id,
      server: manageService.basicCarManagecontroller.deleteCarBrand,
    })
  }
  /**
   * 新增车系
   */
  @Debounce()
  addCarSeries(data) {
    return this.netService.send({
      data: data,
      loading: true,
      server: manageService.basicCarManagecontroller.addCarSeries,
    })
  }
  /**
   * 删除车系
   */
  @Debounce()
  deleteCarSeries(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.deleteCarSeries,
    })
  }
  /**
   * 根据id 查找车系
   */
  getCarSeriesById(id) {
    return this.netService.send({
      append: id,
      server: manageService.basicCarManagecontroller.getCarSeriesById,
    })
  }
  /**
   * 修改车系
   */
  @Debounce()
  editCarSeries(data) {
    return this.netService.send({
      data: data,
      loading: true,
      server: manageService.basicCarManagecontroller.editCarSeries,
    })
  }
  /**
   * 新增车型
   */
  @Debounce()
  addCarModel(series,data) {
    return this.netService.send({
      data: {
        modelName: data.modelName,
        dischargeStandard: data.dischargeStandard,
        gearType: data.gearType,
        liter: data.liter,
        maxRegYear: FilterService.dateFormat(data.maxRegYear, 'YYYY'),
        minRegYear: FilterService.dateFormat(data.minRegYear, 'YYYY'),
        modelYear: FilterService.dateFormat(data.modelYear, 'YYYY'),
        referencePrice: data.referencePrice,
        seatNumber: data.seatNumber,
        remark: data.remark,
        seriesId: series
      },
      loading: true,
      server: manageService.basicCarManagecontroller.addCarModel,
    })
  }
  /**
   * 删除车型
   */
  @Debounce()
  deleteCarModel(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.deleteCarModel,
    })
  }
  /**
   * 修改车型
   */
  editCarModel(carId, data) {
    return this.netService.send({
      data: {
        id: carId,
        modelName: data.modelName,
        dischargeStandard: data.dischargeStandard,
        gearType: data.gearType,
        liter: data.liter,
        maxRegYear: FilterService.dateFormat(data.maxRegYear, 'YYYY'),
        minRegYear: FilterService.dateFormat(data.minRegYear, 'YYYY'),
        modelYear: FilterService.dateFormat(data.modelYear, 'YYYY'),
        referencePrice: data.referencePrice,
        seatNumber: data.seatNumber,
        remark: data.remark
      },
      loading: true,
      server: manageService.basicCarManagecontroller.editCarModel,
    })
  }
  /**
   * 查看车型
   */
  getCarModelById(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.getCarModelById,
    })
  }
  /**
   * 根据车系id查找品牌
   */
  getCarSeriesByCarName(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.getCarSeriesByCarName,
    })
  }
  /**
   * 查找车辆配置参数列表
   */
  findCarConfigParamList(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.findCarConfigParamList,
    })
  }
  /**
   * 添加车辆配置参数
   */
  @Debounce()
  addCarConfigParamInfo(data) {
    return this.netService.send({
      data: {
        paramTypeCode: data.paramTypeCode,
        carParamName: data.name,
        carParamValue: data.comment,
        modelId: data.modelId,
      },
      loading: true,
      server: manageService.basicCarManagecontroller.addCarConfigParamInfo,
    })
  }

   /**
   * 修改车辆配置参数
   */
  @Debounce()
  updateModelParam(data) {
    return this.netService.send({
      data: {
        // paramTypeCode: data.paramTypeCode,
        // carParamName: data.name,
        paramValue: data.comment,
        modelParamId: data.id,
      },
      loading: true,
      server: manageService.basicCarManagecontroller.updateModelParam,
    })
  }

  /**
   * 新增 车型介绍
   */
  @Debounce()
  addCarIntenduceInfo(data) {
    return this.netService.send({
      data: {
        introduceName: data.name,
        introduceUrl: data.imgall,
        remark: data.comment,
        modelId: data.id
      },
      loading: true,
      server: manageService.basicCarManagecontroller.addCarIntenduceInfo,
    })
  }
  /**
  *  查看车型介绍
  */
  findCarIntroduceList(id) {
    return this.netService.send({
      append: id,
      server: manageService.basicCarManagecontroller.findCarIntroduceList,
    })
  }
  /**
   * 删除车型介绍
   */
  @Debounce()
  deleteCarIntenduceInfo(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.deleteCarIntenduceInfo,
    })
  }
  /**
  *  添加车辆主图
  */
  @Debounce()
  addCarModelPhoto(data) {
    return this.netService.send({
      data: data,
      loading: true,
      server: manageService.basicCarManagecontroller.addCarModelPhoto,
    })
  }
  /**
   * 查看车辆基本参数
   */
  getCarParams(id) {
    return this.netService.send({
      append: id,
      server: manageService.basicCarManagecontroller.getCarParams,
    })
  }
  /**
  * 删除配置参数
  */
  @Debounce()
  deleteCarConfigParam(id) {
    return this.netService.send({
      append: id,
      loading: true,
      server: manageService.basicCarManagecontroller.deleteCarConfigParam,
    })
  }
  /**
   * 查看车辆主图
   */
  getCarModelPhotoList(id) {
    return this.netService.send({
      append: id,
      server: manageService.basicCarManagecontroller.getCarModelPhotoList,
    })
  }

  /**
   * 全部车辆查询
   */
  queryCarModel(data, page: PageService) {
    return this.netService.send({
      server: manageService.basicCarManagecontroller.queryCarModel,
      data: {
        brandName: data.brand, //品牌
        seriesName: data.series, //系列
        modelName: data.model // 车型
      },
      page
    })
  }

  /**
   * 获取车型信息
   */
  carModelInfo(modelId) {
    return this.netService.send({
      server: manageService.basicCarManagecontroller.carModelInfo,
      append: modelId
    })
  }

  /**
   * 获取当前登录用户所能看到的所有品牌
   */
  getAllBrand(){
    return this.netService.send({
      server: manageService.basicCarManagecontroller.getAllBrand
    })
  }

  /**
   * 根据品牌ID获取所能看到的所有车系 不分页
   * @param brandId 品牌ID
   */
  getAllSeriesByBrandId(brandId:Number){
    return this.netService.send({
      server: manageService.basicCarManagecontroller.getAllSeriesByBrandId,
      append: brandId
    })
  }
}