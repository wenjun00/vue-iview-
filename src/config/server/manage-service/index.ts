import sysOrgController from '~/config/server/manage-service/sys-org.controller'
import sysRoleController from '~/config/server/manage-service/sys-role.controller'
import sysUserController from '~/config/server/manage-service/sys-user.controller'
import sysLogsController from '~/config/server/manage-service/sys-logs.controller'
import systemBackupController from '~/config/server/manage-service/system-backup.controller'
import companyController from '~/config/server/manage-service/company.controller'
import sysDictController from '~/config/server/manage-service/sys-dict.controller'
import sysModuleController from '~/config/server/manage-service/sys-module.controller'
import loginController from '~/config/server/manage-service/login.controller'
import fileUploadController from '~/config/server/manage-service/file-upload-controller.controller'
import userDeviceController from '~/config/server/manage-service/user-device.controller'
import backLogController from '~/config/server/manage-service/back-log.controller'
import sysParameterController from '~/config/server/manage-service/sys-parameter.controller'
import basicExpenseController from '~/config/server/manage-service/basic-expense.controller'
import basicOffsetController from '~/config/server/manage-service/basic-offset.controller'
import basicCarManagecontroller from '~/config/server/manage-service/basic-car-manage.controller'
import basicSupplierController from "~/config/server/manage-service/basic-supplier-controller";
import basicRepaySchemeController from '~/config/server/manage-service/basic-repay-scheme.controller'
import basicCustomerController from "~/config/server/manage-service/basic-customer.controller";
import basicStockCarManageController from '~/config/server/manage-service/basic-stock-car.controller'
import basicCustomerCenterController from "~/config/server/manage-service/basic-customer-center.controller";
import basicProductController from "~/config/server/manage-service/basic-product.controller";
import basicCustomerAssessmentCarController from "~/config/server/manage-service/basic-customer-assessment-car.controller";
import basicEnterShellSaveController from '~/config/server/manage-service/basic-enter-shell-save.controller'
import basicCustomerAccountController from '~/config/server/manage-service/basic-customer-account.controller'
import basicCustomHouseController from "~/config/server/manage-service/basic-customer-house.controller";
import basicPersonalJobController from "~/config/server/manage-service/basic-customer-job.controller";
import basicCustomContactController from "~/config/server/manage-service/basic-customer-contact.controller";
import basicCustomerDataController from "~/config/server/manage-service/basic-customer-data.controller";
import basicCustomerOrderController from "~/config/server/manage-service/basic-customer-order.controller";
import financeDetainController from "~/config/server/manage-service/finance-detain.controller";
import basicOrderFileController from '~/config/server/manage-service/basic-order-file.controller'
import basicProductRepayTemplateController from '~/config/server/manage-service/basic-product-repay-template.controller'
import basicCustomerOrderApproveController from '~/config/server/manage-service/basic-customer-order-approve.controller'
import financialManagementController from '~/config/server/manage-service/financial-management.controller'
import financialQueryController from '~/config/server/manage-service/financial-query.controller'
import basicAssessmentCarPriceAnalysisController from '~/config/server/manage-service/basic-assessment-car-price-analysis.controller'
import basicFundsChannelController from '~/config/server/manage-service/basic-funds-channel.controller'
import basicCustomerCarCenterController from '~/config/server/manage-service/basic-customer-car-center.controller'
import basicOrderComplianceController from '~/config/server/manage-service/basic-order-compliance.controller'
import basicCarDetailController from '~/config/server/manage-service/basic-car-detail.controller'
import contractBusinessController from '~/config/server/manage-service/contract-business-controller'
import repaymentController from '~/config/server/manage-service/repayment.controller'


export const manageService = {
  sysOrgController,
  sysRoleController,
  sysUserController,
  sysLogsController,
  systemBackupController,
  companyController,
  sysDictController,
  sysModuleController,
  loginController,
  fileUploadController,
  userDeviceController,
  backLogController,
  sysParameterController,
  basicExpenseController,
  basicOffsetController,
  basicCarManagecontroller,
  basicSupplierController,
  basicCustomerController,
  basicRepaySchemeController,
  basicStockCarManageController,
  basicCustomerCenterController,
  basicProductController,
  basicCustomerAssessmentCarController,
  basicCustomHouseController,
  basicEnterShellSaveController,
  basicCustomerAccountController,
  basicPersonalJobController,
  basicCustomContactController,
  basicCustomerDataController,
  basicCustomerOrderController,
  financeDetainController,
  basicOrderFileController,
  basicProductRepayTemplateController,
  basicCustomerOrderApproveController,
  financialManagementController,
  financialQueryController,
  basicAssessmentCarPriceAnalysisController,
  basicFundsChannelController,
  basicCustomerCarCenterController,
  basicOrderComplianceController,
  basicCarDetailController,
  contractBusinessController,
  repaymentController
}
