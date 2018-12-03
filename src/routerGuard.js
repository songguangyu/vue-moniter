import { watcher, getLiveTime } from './util'

export default function (cg, target) {
  let router
  for (let i = 0; i < cg.length; i++) {
    if (cg[0].$options.router) {
      router = cg[0].$options.router
      break
    }
  }
  const mode = router.mode
  // 监控fullpath变化 包括hash的变化
  watcher(router.app._route, 'fullPath', function(url) {
    target.routerChange.push({
      url: url,
      memory: performance.memory,
      time: getLiveTime()
    })
  })
}
