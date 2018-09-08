import store from '~/store'
import * as enumData from '~/config/enum.config'
import { endOfDay as DateFnsEndOfDay, startOfDay as DateFnsStartOfDay, format as DateFnsFormat } from "date-fns";
import { LodashService } from '~/utils/lodash.service'
import { DictService } from '~/utils/dict.service';

export class FilterService {
  /**
   * 转换枚举数据
   * @param value
   * @param key
   */
  static enumConvert(value: number | string, key) {
    // 排除空字典或者空key
    if (!enumData || !key || !enumData[key]) {
      return ''
    }

    let data = enumData[key] instanceof Array ? enumData[key] : Object.values(enumData[key])

    let target = data.find(x => x.value === value)

    return target ? target.name : ""
  }
  /**
   * 转换字典数据
   * @param id
   */
  static dictConvert(id) {
    return DictService.getDictName(id)
  }

  /**
  * 日期时间范围转换
  * @param dateRange
  * @param fmt
  */
  static dateTimeRanageFormat(dateRange, fmt = "YYYY-MM-DD HH:mm:ss") {
    let target: any = {
      start: '',
      end: ''
    }
    // 检测非法输入
    if (!dateRange || dateRange.length === 0 || !(dateRange instanceof Array)) {
      return target
    }

    // 获取开始时间
    target.start = FilterService.dateFormat(dateRange[0], fmt)

    // 获取当前的最后时间点
    target.end = FilterService.dateFormat(dateRange[1], fmt)

    return target
  }

  /**
   * 日期范围转换
   * @param dateRange
   * @param fmt
   */
  static dateRanageFormat(dateRange, fmt = "YYYY-MM-DD HH:mm:ss") {
    let target: any = {
      start: '',
      end: ''
    }
    // 检测非法输入
    if (!dateRange || dateRange.length === 0 || !(dateRange instanceof Array)) {
      return target
    }

    // 获取开始时间
    let tmpDate = DateFnsStartOfDay(dateRange[0])
    target.start = FilterService.dateFormat(tmpDate, fmt)

    // 获取当前的最后时间点
    tmpDate = DateFnsEndOfDay(dateRange[1])
    target.end = FilterService.dateFormat(tmpDate, fmt)

    return target
  }

  /**
   * 日期格式化
   * @param date
   */
  static dateFormat(date, fmt = "YYYY-MM-DD"): string {
    // 空数据处理
    if (date === null || date === undefined || date === '') {
      return ''
    }
    return DateFnsFormat(date, fmt)
  }

   /**
   * 日期格式化
   * @param date
   */
  static dateMonthFormat(date, fmt = "YYYY-MM"): string {
    // 空数据处理
    if (date === null || date === undefined || date === '') {
      return ''
    }
    return DateFnsFormat(date, fmt)
  }

  /**
   * 日期时间格式化
   * @param date
   * @param fmt
   */
  static dateTimeFormat(date, fmt = "YYYY-MM-DD HH:mm:ss"): string {
    return FilterService.dateFormat(date, fmt)
  }
  /**
   * 千分位转换
   * @param number
   */
  static toThousands(number): string {
    let num: any = ''

    if (number === null || number === '') {
      num = number | 0
    } else {
      num = Number(number).toFixed(2)
      if (isNaN(num) || num === '' || num === undefined || num === null) {
        return '0'
      }
      num = num + ''
      if (/^.*\..*$/.test(num)) {
        let pointIndex = num.lastIndexOf('.')
        let intPart = num.substring(0, pointIndex)
        let pointPart = num.substring(pointIndex + 1, num.length)
        intPart = intPart + ''
        let re = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
          intPart = intPart.replace(re, '$1,$2')
        }
        num = intPart + '.' + pointPart
      } else {
        num = num + ''
        let re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
          num = num.replace(re, '$1,$2')
        }
      }
    }
    return num
  }
  /**
   * 手机号脱敏显示转换器
   */
  static encryptPhone(value) {
    if (!value || value === '') {
      return ''
    }
    return value.substr(0, 3) + '****' + value.substr(7)
  }
  /**
   * 身份证脱敏显示转换器(后四位脱敏)
   */
  static encryptIDCardFour(value) {
    if (!value || value === '') {
      return ''
    }
    // return value.substr(0, 3).padEnd(value.length - 4, '*') + value.substr(-4)
    return value.substr(0, 14) + '****'
  }

  /**
   * 字符串截取
   * @param str 要截取的字符串
   * @param subIndex 截取长度,默认6位
   */
  static subString(str: string, subIndex: number = 6) {
    if (!str) { return '' }
    return str.length > subIndex ? str.substring(0, subIndex) + '...' : str
  }

  /**
   * 对字符串进行格式化
   * @param str 要格式化的字符串
   * @param length 每行字符长度
   * @param appendStr 要插入的字符串
   */
  static strSplit(str: string, length: number = 4, appendStr: string = '-') {
    if (!str) return ''
    let r = new RegExp(`.{${length}}`, 'g')
    let s = new RegExp(`${appendStr}\$`, 'g')
    return str.replace(r, $0 => $0 + appendStr).replace(s, '')
  }

  /**
   * 
   * @param value 要解析的金额字符串
   */
  static moneyParse(value: string) {
    return value.replace(/,*/g, '')
  }

  /**
   * 
   * @param value 要格式化的金额字符串
   * @param roundPre 精度 默认为2
   */
  static moneyFormat(value: number, roundPre: Number = 2) {
    let result = LodashService.round(value as number, roundPre)
    return `${result}`.replace(/^\d+/g, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
  }


  static safeNumber(value) {
    if (isNaN(value) || value == undefined) {
      return null
    } else {
      return value
    }
  }

  /**
   * 格式化显示金额追加百分比符号
   * @param value 要格式化的金额
   */
  static percentFormat(value) {
    if (!value && value !== 0) return null
    let result = LodashService.round(value as number, 4)
    return `${result}%`
  }

  /**
   * 格式化去掉百分比的符号
   * @param value 要去掉%的数值
   */
  static percentParse(value) {
    if (!value) return ''
    return value.replace('%', '')
  }

  /**
   * 
   * @param value 要格式化的金额或字符串
   * @param d 要保留的小数位数
   */
  static decimalToPrecent(value, d: number = 2) {
    if (!value) {
      return '0'
    }
    let f = 0
    let result = ''
    f = parseFloat(value) || f
    result = LodashService.round(f * 100, d)
    return FilterService.percentFormat(result)
  }

  /**
   * 银行卡号码格式化
   * @param value 要格式化的银行卡号
   */
  static formatBankCardNumber(value) {
    let result = new String(value)
    return result.replace(/(\d{4})(?=\d)/g, "$1" + "-")
  }

  /**
   * 格式化万元
   * @param val 
   */
  static toTenThousands(val: number): string {
    if (!val) return ""
    return FilterService.toThousands(val / 10000);
  }
}
