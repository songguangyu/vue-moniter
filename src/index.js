import { getLiveTime } from './util'
import { getSyncComponentMountTime } from './syncComponent'
import { getAsyncComponentFromRouter } from './asyncComponent'
import routerGuard from './routerGuard'
import statistics from './statistics'

const target = {
  vueStartMounttime: 0,
  vueSyncLoadtime: 0,
  vueAsyncLoadtime: 0,
  routerChange: []
}
// vue开始渲染
target.vueStartMounttime = getLiveTime()

export default {
  cg: [],
  init (cg, Vue) {
    this.cg = this.cg.concat(cg)
    // 注册统计组件
    statistics(target, Vue)
    // 获取所有同步组件
    getSyncComponentMountTime(this.cg, target)
    // 获取所有异步组件
    getAsyncComponentFromRouter(this.cg, target, Vue)
    routerGuard(this.cg, target)
    return target
  },
  addComponent (component) {
    this.cg.push(component)
  }
}
