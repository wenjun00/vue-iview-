import validator from 'async-validator'
import { Form } from 'iview'
export class ValidatorService {
  /**
   * 自定义验证器
   * @param data
   * @param descriptor
   * @param callback
   */
  static validate(data: any, descriptor: any) {
    let schema = new validator(descriptor);
    let process = new Promise((reslove, reject) => {
      schema.validate(data, (errors, fields) => {
        if (errors && errors.length) {
          let [error] = errors
          // 验证成功
          reslove(error.message)
        } else {
          reslove()
        }
      });
    })
    return process
  }

  // 验证正则列表
  static regex = {
    // 用户名
    userName: /^[a-zA-Z0-9_-]{6,16}$/,
    // 手机号
    phoneNumber: /^1([^1,2])\d{9}$/,
    // 身份证18位
    idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/,
    // 金额
    money: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/,
    // 邮编
    zipCode: /^[1-9]\d{5}(?!\d)$/,
    // 车牌照正则表达式
    carCardNo: /^(([\u4e00-\u9fa5][a-zA-Z]|[\u4e00-\u9fa5]{2}\d{2}|[\u4e00-\u9fa5]{2}[a-zA-Z])[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/,
    //验证银行卡号
    bankNumber: /^([1-9]{1})(\d{15}|\d{18})$/,
    // 常规的字符串组合
    nomarlStr: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
    // 中文姓名
    chineseName: /^[\u4e00-\u9fa5]{2,5}$/,
    // 车架号
    carVIN: /^[A-HJ-NPR-Z0-9]{17}$/,
    // 邮箱
    email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    //座机号
    localHomePhone: /^0\d{2,3}-\d{7,8}$/,
    // 检验负数
    minus: /^-/
  }

  /**
   * 验证银行卡号
   */
  static bankNumber(rule, value, callback) {
    if (ValidatorService.regex.bankNumber.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确银行卡号"));
    }
  }

  /**
   * 验证手机号
   */
  static phoneNumber(rule, value, callback) {
    if (ValidatorService.regex.phoneNumber.test(value) || !value) {
      callback();
    } else {
      callback(ValidatorService.localHomePhone(rule, value, callback));
    }
  }

  /**
   * 验证座机号
   */
  static localHomePhone(rule, value, callback) {
    if (ValidatorService.regex.localHomePhone.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确的手机号或座机号"));
    }
  }

  /**
   * 验证身份证
   */
  static idCard(rule, value, callback) {
    if (ValidatorService.regex.idCard.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确的身份证号码"));
    }
  }

  /**
   * 验证金额
   */
  static money(rule, value, callback) {
    if (ValidatorService.regex.money.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确格式的金额"));
    }
  }

  /**
  * 验证邮编
  */
  static zipCode(rule, value, callback) {
    if (ValidatorService.regex.zipCode.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确的邮政编码"));
    }
  }
  /**
   * 验证车牌号
   */
  static carCardNo(rule, value, callback) {
    if (ValidatorService.regex.carCardNo.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确的车牌照号码"));
    }
  }
  /**
   * 验证用户名
   */
  static userName(rule, value, callback) {
    if (ValidatorService.regex.userName.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入6-16位[字母,数字,下划线,减号]"));
    }
  }
  /**
  * 验证常态化字符串
  */
  static nomalStr(rule, value, callback) {
    if (ValidatorService.regex.nomarlStr.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入汉字、字母、数字"));
    }
  }

  /**
   * 验证中文名字
   */
  static chineseName(rule, value, callback) {
    if (ValidatorService.regex.chineseName.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入2-5位长度汉字"));
    }
  }
  /**
   * 车架号
   */
  static carVIN(rule, value, callback) {
    if (ValidatorService.regex.carVIN.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入17位正确的车架号"));
    }
  }

  /**
   * 邮箱
   */
  static email(rule, value, callback) {
    if (ValidatorService.regex.email.test(value) || !value) {
      callback();
    } else {
      callback(new Error("请输入正确的邮箱"));
    }
  }
  
  /**
   * 检验负数
   */
  static minus(rule, value, callback) {
    if (ValidatorService.regex.minus.test(value) || !value) {
      callback(new Error("请输入非负数"));
    } else {
      callback();
    }
  }

  /**
   * 对数组进行校验
   * @param rule 
   * @param value 验证的数据：Array<any> 
   * @param callback 
   */
  static validateArray(rule, value: any[], callback) {
    let result = value.some(v => !v)
    if (result) {
      callback(new Error('请选择资金有效期'));
    } else {
      callback();
    }
  }

  /**
   * 表单验证
   * @param rule
   * @param value
   * @param callback
   */
  static formValidate(rule, value, callback) {
    if (!value) {
      return callback()
    }

    value.validate((valid) => {
      if (valid) {
        callback()
      } else {
        callback(new Error(rule.message || "输入项填写错误"));
      }
    })
  }
}
