<template>
	<section class="component modify-customer-assessment">
		<i-form :label-width="110" :model="model" :rules="rules" ref="form" inline>
			<i-card title="客户信息">
				<a slot="extra" @click="onCreatePotentialClick" v-show="!isView">
					<i-icon type="plus"></i-icon>
					新增意向客户
				</a>
				<i-form-item label="客户姓名" prop="name">
					<i-input v-model="model.name" placeholder="请选择客户" readonly>
						<i-button icon="search" slot="append" :disabled="isView" @click="onSelectCustomer"></i-button>
					</i-input>
				</i-form-item>
				<i-form-item label="联系电话" prop="phone">
					<i-input v-model="model.phone" placeholder="请选择手机号" :maxlength="11" readonly></i-input>
				</i-form-item>
			</i-card>
			<i-card title="车辆信息">
				<add-assessment-car-info ref="add-assessment-car-info" v-model="model.regDate"></add-assessment-car-info>
			</i-card>
			<i-card title="车辆评估单">
				<car-assessment-list ref="car-assessment-list" :regDate="model.regDate"></car-assessment-list>
			</i-card>
			<car-appraisal ref="car-appraisal" :carAppraisal="save" :lowAssessmentPrice="appraisal.lowAssessmentPrice" :highAssessmentPrice="appraisal.highAssessmentPrice"></car-appraisal>
			<car-test-report ref="car-test-report"></car-test-report>
		</i-form>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Form } from "iview";
import { Prop, Watch } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";
import ChooseCustomer from "~/components/operate-center/choose-customer.vue";
import AddAssessmentCarInfo from "~/components/finance-detain/add-assessment-car-info.vue";
import CarAssessmentList from "~/components/finance-detain/car-assessment-list.vue";
import CarAppraisal from "~/components/finance-detain/car-appraisal.vue";
import CarTestReport from "~/components/finance-detain/car-test-report.tsx.vue";
import ModifyCustomerInfoBasedata from "~/components/customer-center/customer-info-base/modify-customer-info-basedata.vue";
import { BasicAssessmentCarPriceAnalysisService } from "~/services/manage-service/basic-assessment-car-price-analysis.service"

@Component({
	components: {
		ChooseCustomer,
		AddAssessmentCarInfo,
		CarAssessmentList,
		CarAppraisal,
		CarTestReport
	}
})
export default class ModifyCustomerAssessment extends Vue {
	@Dependencies(BasicAssessmentCarPriceAnalysisService) private basicAssessmentCarPriceAnalysisService: BasicAssessmentCarPriceAnalysisService

	@Prop({
		default: false,
		type: Boolean
	})
	isView: boolean;

	private assessment = "Asessment"
	private workComponents: any[] = []

	private appraisal: any = {
		lowAssessmentPrice: null, // 最低估价
		highAssessmentPrice: null // 最高估价
	}

	private model: any = {
		name: "",
		phone: "",
		customerId: "", // 客户id
		regDate: null // 上牌日期
	};

	private rules = {
		name: {
			required: true,
			type: "string",
			message: "请选择客户",
			trigger: "change"
		},
		phone: {
			required: true,
			type: "string",
			message: "请选择手机号",
			trigger: "change"
		}
	};

	mounted() {
		this.workComponents.push(this.$refs['add-assessment-car-info'] as AddAssessmentCarInfo)
		this.workComponents.push(this.$refs['car-assessment-list'] as CarAssessmentList)
		this.workComponents.push(this.$refs['car-appraisal'] as CarAppraisal)
		this.workComponents.push(this.$refs['car-test-report'] as CarTestReport)
		console.log(this.workComponents,"组合子组件数据")
	}

	/**
     * 新增意向客户
     */
	private onCreatePotentialClick() {
		this.$dialog.show({
			title: "新增意向客户",
			footer: true,
			width: 1100,
			onOk: (addCustomerInfoBasedata: ModifyCustomerInfoBasedata) => {
				return addCustomerInfoBasedata.addCustomerData().then(v => v);
			},
			render: h =>
				h(ModifyCustomerInfoBasedata, {
					props: {
						customerInfo: ""
					}
				})
		});
	}

	/**
	 * 选择客户
	 */
	onSelectCustomer() {
		this.$dialog.show({
			title: "客户选择",
			footer: true,
			width: 1100,
			onOk: (chooseCustomer: ChooseCustomer) => {
				this.model.name = chooseCustomer.selectedData.customerName;
				this.model.phone = chooseCustomer.selectedData.customerPhone;
				this.model.customerId = chooseCustomer.selectedData.customerId;
			},
			render: h =>
				h(ChooseCustomer, {
					props: {
						type: this.assessment,
						customerId: this.model.customerId
					}
				})
		});
	}

	/**
   * 计算数据 用于提交
   * @param values 提交数据
   * @param type 提交方式 0:保存 1:提交
   */
	private computerData(values: any[]) {
		let data = {
			customerId: this.model.customerId, // 客户id
			modelId: null,
			modelLinkId: null,
			color: '',
			zone: null,
			regDate: '',
			issueDate:'',  
			registerDate:'',
			isSecondHand: null,
			stockCarNo: '',
			carNo: '',
			interior: null,
			surface: null,
			workState: null,
			transferTimes: null,
			makeDate: '',
			mile: null,
			lowAssessmentPrice: null,
			highAssessmentPrice: null,
			assessmentPrice: null,
			assessmentCarStatus: '',
			basicAssessmentFileModels: []
		};
		values.forEach((v, index) => {
			if (index === 0) {
				data.modelId = v.modelId
				data.modelLinkId = v.modelLinkId
				data.color = v.color
				data.zone = v.zone
				data.regDate = v.regDate
				data.issueDate  = v.issueDate
				data.registerDate = v.registerDate
				data.isSecondHand = v.isSecondHand
				data.stockCarNo = v.stockCarNo
				data.carNo = v.carNo
				data.assessmentCarStatus = v.assessmentCarStatus
			} else if (index === 1) {
				data.interior = v.interior
				data.surface = v.surface
				data.workState = v.workState
				data.transferTimes = v.transferTimes
				data.makeDate = v.makeDate
				data.mile = v.mile
			} else if (index === 2) {
				data.highAssessmentPrice = v.inputHighAssessmentPrice
				data.lowAssessmentPrice = v.inputLowAssessmentPrice
				data.assessmentPrice = v.assessmentPrice
			} else {
				data.basicAssessmentFileModels = v
			}
		})
		return data
	}

	private async submit(data: any, type: number) {
		if (type === 0) {
			return await new Promise((resolve) => {
				this.basicAssessmentCarPriceAnalysisService.addAssessmentCarPriceReport(data).subscribe(
					data => {
						this.$Message.success("操作成功")
						resolve(true)
					},
					err => {
						this.$Message.error(err.msg)
						resolve(false)
					}
				)
			})
		}
		if (type === 1) {
			return new Promise((resolve, reject) => {
				this.basicAssessmentCarPriceAnalysisService.assessmentByChe300PricesAnalysis(data).subscribe(
					data => {
						this.$Message.success("估价成功")
						this.appraisal.lowAssessmentPrice = data.c2bPrice || 0;
						this.appraisal.highAssessmentPrice = data.b2bPrice || 0;
					},
					err => this.$Message.error("第三方评估接口暂未提供该车型的定价信息!")
				);
			});
		}
	}

  /**
   * 保存操作
   */
	async save(type: number = 0) {
		if (!this.model.customerId) {
			this.$Message.info("请选择客户信息")
			return false
		}
		let tempData = type === 1 ? this.workComponents.slice(0, 2) : this.workComponents
		// 验证所有表单的数据
		let result = await Promise.all([...tempData.map(v => v.submit())])
			.then((values: any[]) => {
				let data = this.computerData(values)
				return this.submit(data, type).then((v: boolean) => v)
			}
			).catch(err => {
				return false
			})
		return result
	}
}
</script>

<style lang="less">
</style>
