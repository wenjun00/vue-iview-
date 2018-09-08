import store from '~/store'

export class DictService {
  /**
   * 获取字典数据
   * @param id
   */
  static getDictData(...ids) {
    let results: Array<string> = []

    // 获取字典项
    ids.forEach(id => {
      let items = store.state.dictData
        .filter(x => x.dictId === id)
        .map(x => ({
          value: x.id,
          label: x.dictItemName,
        }))

      results.push(...items)
    })

    // 获取用户字典项
    ids.forEach(id => {
      let items = store.state.userDictData
        .filter(x => x.dictId === id)
        .map(x => ({
          value: x.id,
          label: x.dictItemName,
        }))

      results.push(...items)
    })

    return results
  }

  static getDictName(value) {
    let val: number = null;
    if (typeof value === "string") {
      val = new Number(value).valueOf();
    } else {
      val = value
    }
    let data = store.state.dictData.find(x => val === x.id)
    if (!data) data = store.state.userDictData.find(x => val === x.id)
    if (data) {
      return data.dictItemName
    } else {
      return value
    }
  }

  /**
   * 格式化拼接的字典项名称
   * @param value 拼接的字典ID字符串
   * @param split 拼接符
   */
  static getDictNameForAppendStr(value, split?: string) {
    value = value || "";
    split = split || ",";
    let arr = value.split(split)
    return arr.map(v => DictService.getDictName(v)).join(split)
  }
}
