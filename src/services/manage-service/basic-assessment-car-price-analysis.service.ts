import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { requestType } from "~/config/enum.config";
import { manageService } from '~/config/server/manage-service'
import { FilterService } from '~/utils/filter.service'
import { PageService } from '~/utils/page.service';

export class BasicAssessmentCarPriceAnalysisService {
	@Inject(NetService)
	private netService: NetService

	/**
	 * 保存评估信息
	 */
	@Debounce()
	addAssessmentCarPriceReport(data: any): any {
		var model = Object.assign({}, data)
		model.makeDate = FilterService.dateFormat(model.makeDate)
		model.regDate = FilterService.dateFormat(model.regDate)
		model.issueDate = FilterService.dateFormat(model.issueDate)
		model.registerDate = FilterService.dateFormat(model.registerDate)
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.addAssessmentCarPriceReport,
			data: model,
			loading: true
		})
	}

	/**
	 * 对接车300评估接口
	 */
	@Debounce()
	assessmentByChe300PricesAnalysis(data: any): any {
		var model = Object.assign({}, data)
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.assessmentByChe300PricesAnalysis,
			data: {
				color: model.color,
				interior: model.interior,
				makeDate: FilterService.dateFormat(model.makeDate, 'YYYY-MM'),
				mile: model.mile,
				modelId: model.modelLinkId,
				transferTimes: model.transferTimes,
				regDate: FilterService.dateFormat(model.regDate, 'YYYY-MM'),
				surface: model.surface,
				workState: model.workState,
				zone: model.zone,
			},
			loading: true
		})
	}

	/**
	 * 对接车300城市列表
	 */
	che300CityList() {
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.che300CityList
		})
	}

	/**
	 * 上传附件
	 */
	@Debounce()
	uploadAssessmentFile(data: any): any {
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.uploadAssessmentFile,
			data: {
				assessmentId: data.assessmentId,
				fileName: data.fileName,
				fileUrl: data.fileUrl
			},
			loading: true
		})
	}
	/**
	 * 查看附件
	 */
	getAssessmentFileInfo({ assessmentId }) {
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.getAssessmentFileInfo,
			data: {
				assessmentId: assessmentId
			}
		})
	}
	/**
	 * 删除文件
	 */
	deleteAssessmentFile({ fileId }) {
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.deleteAssessmentFile,
			data: {
				fileId: fileId
			}
		})
	}
	/**
	 * 获取评估客户列表
	 */
	queryCustomerByAssessment(data, page: PageService) {
		return this.netService.send({
			server: manageService.basicAssessmentCarPriceAnalysisController.queryCustomerByAssessment,
			data: {
				customerName: data.name,
				customerPhone: data.phone,
				idCard: data.idCard
			},
			page
		})
	}

    /**
     * 客户评估列表
     */
    queryCustomerAssessmentList(data,page:PageService){
        return this.netService.send({
            server: manageService.basicAssessmentCarPriceAnalysisController.queryCustomerAssessmentList,
            data: {
                brandId: data.brandName,
                seriesId: data.seriesName,
                orgName: data.orgName,
                assessmentStatus: data.assessmentStatus,
                customerName: data.customerName,
                stockCarNo: data.stockCarNo,
                modelId: data.modelId
              },
              page
        })
	}
	
	/**
	 * 车产信息
	 */
	queryAssessmentCarInfo(carId){
        return this.netService.send({
            server: manageService.basicAssessmentCarPriceAnalysisController.queryAssessmentCarInfo,
            data: {
                carId: carId
              },
        })
	}
}