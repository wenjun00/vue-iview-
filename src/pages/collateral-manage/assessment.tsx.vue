<!-- 车辆评估-->
<template>
  <section class="page assessment">
    <page-header title="车辆评估" hidden-print hidden-export>
      <command-button label="新增评估车辆" v-auth="533" @click="onModifyCustomerAssessment"></command-button>
    </page-header>
    <data-form hidden-date-search :model="model" @on-search="refreshCustomerAssessmentCar">
      <template slot="input">
        <i-form-item prop="brandName" label="选择品牌：">
          <i-select v-model="brandName" clearable>
            <i-option v-for="item in this.brandNameList" :key="item.id" :label="item.brandName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="seriesName" label="选择车系：">
          <i-select v-model="model.seriesName" :disabled="!model.brandName" clearable>
            <i-option v-for="item in this.seriesNameList" :key="item.id" :label="item.seriesName" :value="item.id"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="orgName" label="选择机构：">
          <i-select v-model="model.orgName" clearable>
            <i-option v-for="item in this.deptList" :key="item.id" :label="item.orgName" :value="item.orgName"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="assessmentStatus" label="评估状态：">
          <i-select v-model="model.assessmentStatus" clearable>
            <i-option v-for="{value,label} in $dict.getDictData(10021)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
        <i-form-item prop="customerName" label="客户姓名：">
          <i-input placeholder="请输入客户姓名" v-model="model.customerName" :maxlength="20"></i-input>
        </i-form-item>
        <i-form-item prop="stockCarNo" label="车架号：" style="width:264px">
          <i-input placeholder="请输入车架号" v-model="model.stockCarNo" :maxlength="17"></i-input>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="customerAssessmentCarColumns" :data="customerAssessmentCarDataSet" @on-page-change="refreshCustomerAssessmentCar" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import Component from "vue-class-component";
import CarInfos from "~/components/purchase-sales-inventory/car-infos.tsx.vue";
import ModifyCustomerAssessment from "~/components/finance-detain/modify-customer-assessment.vue";
import AssessmentReportList from "~/components/finance-detain/assessment-report-list.vue";
import AssessmentStorage from "~/components/finance-detain/assessment-storage.tsx.vue";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";
import CarParams from "~/components/base-data/car-manage/car-params.vue";
import AssessmentReportDetails from "~/components/finance-detain/assessment-report-details.vue";
import { Button } from "iview";
import { Layout } from "~/core/decorator";
import { namespace } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { BasicAssessmentCarPriceAnalysisService } from "~/services/manage-service/basic-assessment-car-price-analysis.service.ts";
import { PageService } from "~/utils/page.service";
import { BasicCustomerCarCenterService } from "~/services/manage-service/basic-customer-car-center.service";
import { BasicCustomerAssessmentCarService } from "~/services/manage-service/basic-customer-assessment-car.service";
import { BasicCarManageService } from "~/services/manage-service/basic-car-manage.service";

const CustomerOrderModule = namespace("customerOrderSpace")

@Layout("workspace")
@Component({
  components: {
    ChooseVehicleModel
  }
})
export default class Assessment extends Page {
  @Dependencies(BasicAssessmentCarPriceAnalysisService)
  basicAssessmentCarPriceAnalysisService: BasicAssessmentCarPriceAnalysisService;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicCustomerCarCenterService) private basicCustomerCarCenterService: BasicCustomerCarCenterService;
  @Dependencies(BasicCustomerAssessmentCarService)
  private basicCustomerAssessmentCarService: BasicCustomerAssessmentCarService;
  @Dependencies(BasicCarManageService) private basicCarManageService: BasicCarManageService;
  @CustomerOrderModule.Action showCustomerInfo;

  private customerAssessmentCarColumns: any;
  private customerAssessmentCarDataSet: Array<any> = [];
  private deptList: Array<any> = [];
  private carReport: Array<any> = [];
  private brandNameList: Array<any> = [];
  private seriesNameList: Array<any> = [];

  private model: any = {
    brandName: "",
    seriesName: "",
    orgName: "",
    assessmentStatus: "",
    customerName: "",
    stockCarNo: "",
    modelId: ""
  };

  created() {
    this.customerAssessmentCarColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        fixed: "left",
        align: "center",
        render: (h, { row, column, index }) => {
          //评估状态[10021] 10062 : 待评估 ; 10061 : 已评估
          if (row.assessmentStatus == 10061) {
            return h("div", [
              h("i-button",
                {
                  props: {
                    type: "text"
                  },
                  directives: this.$common.bindAuth(534),
                  style: {
                    color: "#265EA2"
                  },
                  on: {
                    click: () => {
                      this.onCustomerStorage(row.assessmentId, row.id);
                    }
                  }
                },
                "评估入库")
            ]
            );
          }
        }
      },
      {
        align: "center",
        editable: true,
        title: "评估单号",
        key: "assessmentNo",
        minWidth: this.$common.getColumnWidth(5),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetAssessmentReportInfo(row.assessmentId)}>{row.assessmentNo}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "品牌",
        key: "brandName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "车系",
        key: "seriesName",
        minWidth: this.$common.getColumnWidth(2)
      },
      {
        align: "center",
        editable: true,
        title: "车型",
        key: "modelName",
        minWidth: this.$common.getColumnWidth(12),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetCarParams(row.modelId)}>{row.modelName}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "车架号",
        key: "stockCarNo",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetVehicleInfo({ carId: row.carId })}>{row.stockCarNo}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showCustomerInfo({ id: row.customerId })}>{row.customerName}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "联系方式",
        key: "customerPhone",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "是否二手车",
        key: "isSecondHand",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, column, index }) => {
          return h("span", {}, this.$filter.dictConvert(row.isSecondHand));
        }
      },
      {
        align: "center",
        editable: true,
        title: "评估状态",
        key: "assessmentStatus",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) =>
          h("p", {}, row.assessmentStatus ? this.$filter.dictConvert(row.assessmentStatus) : "待评估")
      },
      {
        align: "center",
        editable: true,
        title: "申请时间",
        key: "assessmentDate",
        minWidth: this.$common.getColumnWidth(2),
        render: (h, { row, columns, index }) =>
          h(
            "span",
            {},
            this.$filter.dateFormat(row.assessmentDate)
          )
      }
    ];
  }

  mounted() {
    // 加载数据
    this.refreshCustomerAssessmentCar();
    this.getDeptList();
    this.refreshData();
  }

  /**
   * keep-alive生命周期钩子函数
   */
  activated() {
    // 加载数据
    this.refreshCustomerAssessmentCar();
  }

  /**
   * 刷新列表
   */
  refreshCustomerAssessmentCar() {
    this.basicAssessmentCarPriceAnalysisService
      .queryCustomerAssessmentList(this.model, this.pageService)
      .subscribe(
        data => (this.customerAssessmentCarDataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  get brandName() {
    return this.model.brandName
  }

  set brandName(val: number) {
    if (!val) return
    this.model.brandName = val
    this.basicCarManageService
      .getAllSeriesByBrandId(val)
      .subscribe(
        data => (this.seriesNameList = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 获取车辆列表
   */
  private refreshData() {
    this.basicCarManageService
      .getAllBrand()
      .subscribe(
        data => (
          this.brandNameList = data
        ),
        err => this.$Message.error(err.msg)
      );
  }
  /**
   * 获取机构列表
   */
  private getDeptList() {
    this.basicCustomerCarCenterService
      .queryDeptList()
      .subscribe(
        data => (this.deptList = data),
        err => this.$Message.error(err.msg)
      );

  }

  /**
   * 查看车型信息
   */
  onGetCarParams(modelId) {
    this.$dialog.show({
      title: "车型信息",
      isView: true,
      width: 1050,
      footer: true,
      render: h =>
        h(CarParams, {
          props: {
            carId: modelId,
            isView: true
          }
        })
    });
  }
  /**
   * 查看车辆详情 
   */
  private onGetVehicleInfo({ carId }) {
    this.$dialog.show({
      title: "车辆详情",
      isView: true,
      width: 1050,
      footer: true,
      render: h =>
        h(CarInfos, {
          props: {
            carId: carId,
            isView: true
          }
        })
    });
  }


  /**
   * 新增评估车辆
   * @param val
   */
  onModifyCustomerAssessment() {
    this.$dialog.show({
      title: "新增评估车辆",
      width: 1100,
      footer: true,
      onOk: modifyCustomerAssessment => {
        return modifyCustomerAssessment.save().then(v => {
          if (v) this.refreshCustomerAssessmentCar();
          return v;
        });
      },
      render: h =>
        h(ModifyCustomerAssessment)
    });
  }

  /**
   * 评估入库
   * @param assessmentId 评估报告Id
   */
  onCustomerStorage(assessmentId, id) {
    this.$dialog.show({
      title: "评估入库",
      footer: true,
      width: 1100,
      onOk: assessmentStorage => {
        return assessmentStorage.submit().then(v => {
          if (v) this.refreshCustomerAssessmentCar();
          return v;
        });
      },
      render: h => <AssessmentStorage assessmentId={assessmentId} id={id}></AssessmentStorage>
    });
  }

  /**
   * 获取评估详情
   * @param assessmentReportId 评估报告Id
   */
  onGetAssessmentReportInfo(assessmentReportId: number) {
    this.$dialog.show({
      title: "评估详情",
      isView: true,
      footer: true,
      width: 1000,
      render: h =>
        h(AssessmentReportDetails, {
          props: {
            assessmentReportId: assessmentReportId
          }
        })
    });
  }
}
</script>

<style lang="less" scoped>
</style>
