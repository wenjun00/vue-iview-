import baseInit from '~/core/bootstrap/base.init'
import pluginInit from '~/core/bootstrap/plugin.init'
import componentInit from '~/core/bootstrap/component.init'
export default async function ({ store, router }) {
  // 基础功能初始化
  await baseInit({ store })
  // 第三方插件初始化
  await pluginInit({ store })
  // 初始化组件
  await componentInit()
}
