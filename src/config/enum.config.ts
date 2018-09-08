/**
 * 菜单资源类型
 */
enum resourceMenuType {
  /**
   * 模块
   */
  module = 10029,
  /**
   * 菜单
   */
  menu = 10028,
  /**
   * 控件按钮 -- 权限功能
   */
  control = 10035
}


enum requestType {
  /**
   * 删除
   */
  Delete = "DELETE",
  /**
   * 获取
   */
  Get = "GET",
  /**
   * 修改
   */
  Post = "POST",
  /**
   * 修改
   */
  Put = "PUT"
}

/**
 * 车辆主要参数类型
 */
enum CarPropertyType {
  /**
   * 品牌
   */
  BRAND,
  /**
   * 系列
   */
  SERIES,
  /**
   * 车型
   */
  MODEL
}

/**
 * 客户详情 | 订单详情
 */
enum InfoCompontentType {
  /**
   * 客户详情
   */
  CUSTOMER,
  /**
   * 订单详情
   */
  ORDER
}

/**
 * 编辑类型
 */
enum EditType {
  /**
   * 增加
   */
  ADD,
  /**
   * 编辑
   */
  MODIFY,
  /**
   * 删除
   */
  DELETE
}

/**
 * 产品方案/计算详情类型
 */
enum ProdSchemeDetailType {
  /**
   * 产品配置
   */
  PRODUCT,
  /**
   * 融资租赁
   */
  FINANCE = 10049,
  /**
   * 抵押贷款
   */
  MORTGAGE = 10050
}

/**
 * 支持的图片类型
 */
enum ImageType {
  jpeg,
  jpg,
  gif,
  png,
  bmp
}

/**
 * 订单车辆类型
 */
enum OrderCarType {
  /**
   * 新车
   */
  NEW = 10306,
  /**
   * 旧车
   */
  OLD = 10307
}

/**
 * 进件业务类型
 */
enum BusinessType {
  /**
   * 现金贷回租
   */
  CASH_BACK = 10237,
  /**
   * 消费贷回租
   */
  CONSUME_BACK = 10236,
  /**
   * 消费贷直租
   */
  CONSUME_DIRECT = 10235,

}

/**
 * 订单状态
 * 10032
 */
enum OrderCurrentState {
  NOTHING = 0,
  /**
   * 待提交
   */
  SUNMIT = 10107,
  /**
   * 待初审
   */
  FIRST = 10108,
  /**
   * 待复审
   */
  SECOND = 10109,
  /**
   * 待终审
   */
  LAST = 10110,
  /**
   * 初审退回
   */
  FIRST_RETURN = 10111,
  /**
   * 复审退回
   */
  SECOND_RETURN = 10112,
  /**
   * 终审退回
   */
  LAST_RETURN = 10113,
  /**
   * 待匹配车辆
   */
  MATCH = 10114,
  /**
   * 待开户签约
   */
  OPEN_ACCOUNT = 10115,
  /**
   * 待合同合规
   */
  CONTRACT_COMPLIANCE = 10116,
  /**
   * 待车辆合规
   */
  CAR_COMPLIANCE = 10144
}

/**
 * 车辆整备状态
 */
enum Prepare {
  /**
   * 已整备
   */
  PREPARE_SUCCESS = 10301,
  /**
   * 未整备
   */
  PREPARE_NO = 10302
}

/**
 * 审核原因类型
 */
enum ApprovalReasonType {
  /**
   * 退件
   */
  BACK = 1,
  /**
   * 拒绝
   */
  DENY = 2
}

/**
 * 车辆锁定状态
 */
enum CarLockState {
  /**
   * 调拨锁定
   */
  ALLOT = 10238,
  /**
   * 租赁锁定
   */
  LEASE = 10239,
  /**
   * 抵押锁定
   */
  GUARANTY = 10252
}

/**
 * 车辆库存状态
 */
enum CarStorageState {
  /**
   * 租赁出库
   */
  OutRent = 10240,
  /**
   * 抵押出库
   */
  OutGuaranty = 10241,
  /**
   * 调拨出库
   */
  OutAllot = 10249,
  /**
   * 调拨入库
   */
  InTransfer = 10248,
  /**
   * 拖车入库
   */
  InTrailer = 10250,
  /**
   * 采购入库
   */
  InPurchase = 10180,
  /**
   * 评估入库
   */
  InAssess = 10181,
  /**
   * 手动入库
   */
  InManual = 10182
}

/**
 * 车辆整备状态
 */
enum PreparState {
  Yes = 10301,
  No = 10302
}

/**
 * 资金渠道状态
 */
enum ChannelState {
  /**
   * 启用
   */
  Enable = 10254,
  /**
   * 禁用
   */
  Disabled = 10253
}

/**
 * 业务提交类型
 */
enum SubmitType {
  /**
   * 保存
   */
  Save = 0,
  /**
   * 提交
   */
  Submit = 1

}

/**
 * 开户状态
 */
enum AccountState {
  /**
   * 未开户
   */
  UnOpen = 10094,
  /**
   * 已开户
   */
  Open = 10093
}

/**
 * 车辆状况
 */
enum CarState {
  /**
   * 新车
   */
  NewCar = 10210,
  /**
   * 二手车
   */
  OldCar = 10211
}

/**
 * 订单凭证类型
 */
enum OrderVoucherType {
  /**
   * 收款凭证
   */
  Proceeds = 10479,
  /**
   * 还款凭证
   */
  Repay = 10480,
  /**
   * 客户放款凭证
   */
  CustomerLoan = 10481,
  /**
   * 供应商放款凭证
   */
  SupplierLoan = 10482,
  /**
   * 提前结清凭证
   */
  EarlySettlement = 10483,
  /**
   * 提前收回凭证
   */
  AheadRecover = 10484,
  /**
   * 退款凭证
   */
  Refund = 10485
}

export {
  resourceMenuType,
  OrderCarType,
  ImageType,
  ProdSchemeDetailType,
  EditType,
  InfoCompontentType,
  requestType,
  CarPropertyType,
  BusinessType,
  OrderCurrentState,
  Prepare,
  ApprovalReasonType,
  CarLockState,
  ChannelState,
  SubmitType,
  AccountState,
  PreparState,
  CarStorageState,
  CarState,
  OrderVoucherType
};