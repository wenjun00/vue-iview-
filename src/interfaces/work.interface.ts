/**
 * 选中车辆返回数据
 */
interface selectCar {
  /**
   * 车辆ID
   */
  carId: Number;
  /**
   * 车辆全名
   */
  carName: String;
  /**
   * 品牌名称
   */
  brandName: String;
  /**
   * 车系名称
   */
  seriesName: String;
  /**
   * 车型名称
   */
  modelName: String;
  /**
   * 品牌id
   */
  modelLinkId: number;
  /**
   * 车型id
   */
  modelId: number;
}

/**
 * 产品基本信息
 */
interface productInfo {
  id: number;
  schemeName: string;
  /**
   * 资金渠道名称
   */
  fundsChannel: string;
  /**
   * 还款方式
   */
  repayType: number;
  /**
   * 期数
   */
  periods: number;
  /**
   * 利率
   */
  interestRate: number;
}

/**
 * 二手车基本信息
 */
interface secondCarInfo {
  /**
   * 车辆ID
   */
  id: number;
  /**
   * 车架号
   */
  vin: string;
  /**
   * 品牌
   */
  brand: string;
  /**
   * 系列
   */
  series: string;
  /**
   * 车型
   */
  model: string;
  /**
   * 车牌号
   */
  cardNo: string;
  /**
   * 发动机号
   */
  engineNo: string;
  /**
   * 车型ID
   */
  modelId: number;
  /**
   * 精准估价
   */
  price: number;
  /**
   * 车身颜色
   */
  color: string;
}

/**
 * 选中的客户基本信息
 */
interface customerInfo {
  customerId: number;
  name: string;
  phone: string;
  idCard: string;
}

/**
 * 融资计划
 */
interface planData {
  /**
   * 订单总额
   */
  orderPay;
  /**
   * 首付金额
   */
  firstPay: number;
  /**
   * 融资金额
   */
  financingPay: number;
  /**
   * 利息金额
   */
  interestPay: number;
  /**
   * 每月还款额
   */
  monthPay: number;
  /**
   * 期数
   */
  periods: number;
}

/**
 * 选中机构
 */
interface selecOrgs{
  /**
   * 总公司名称
   */
  zCompany: string;
  /**
   * 分公司名称
   */
  fCompany: string;
  /**
   * 门店名称
   */
  store: string;
  /**
   * 机构性质
   */
  type: number;
  /**
   * 机构id
   */
  storeId: number
}
export {
  selectCar,
  productInfo,
  secondCarInfo,
  customerInfo,
  planData,
  selecOrgs
};
