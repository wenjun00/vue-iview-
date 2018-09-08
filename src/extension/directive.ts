import Vue from 'vue'

export default ({ store }): Object => ({
  /**
   * 资源认证
   */
  auth: {
    bind(el, binding, vnode) {
      // 获取权限编码
      let authCode = Number(binding.value || binding.expression)
      // 验证权限码
      if (!authCode) {
        console.error('未传入权限')
        return
      }
      let hasAuth = store.state.controlResource.find(v => v.id === authCode)

      // 验证权限
      if (!hasAuth) {
        let parent = (el as HTMLElement).parentElement
        if (parent) {
          // 使用删除元素。隐藏可能会被用户修改Style显示出来
          parent.removeChild(el)
        }
      }
    }
  }
})
