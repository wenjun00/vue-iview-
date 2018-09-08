import { OrderCurrentState } from "./enum.config";
/**
 * 工作环节配置
 */




/**
 * 审核流程
 */
let orderOpeater:any = {
  submit: {
    // 当前订单状态
    status: [OrderCurrentState.SUNMIT, OrderCurrentState.FIRST_RETURN],
    // 下一步操作
    desc: "提交"
  },
  first: {
    status: [OrderCurrentState.FIRST, OrderCurrentState.FIRST_RETURN, OrderCurrentState.SECOND_RETURN], desc: "初审"
  },
  second: {
    status: [OrderCurrentState.SECOND, OrderCurrentState.LAST_RETURN], desc: "复审"
  },
  last: {
    status: [OrderCurrentState.LAST], desc: "终审"
  }
};

/**
 * 审核记录用配置
 */
let approvalRecord:Array<any> = [
  {
    name: "通过",
    type: "checkmark-circled",
    color: "#00FF00",
    value: 10278
  },
  {
    name: "退回",
    type: "information-circled",
    color: "#ffcc00",
    value: 10279
  },
  {
    name: "拒绝",
    type: "minus-circled",
    color: "#f60f0f",
    value: 10280
  }
];

export {
  orderOpeater,
  approvalRecord
};
