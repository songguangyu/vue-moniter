import { getLiveTime, allAsyncMount } from './util'

export function getAsyncComponentFromRouter (cg, target, Vue) {
  cg.forEach((item) => {
    let asyncRouterMap = []
    const router = item.$options.router
    const currentLocation = router.history.getCurrentLocation()
    // 打平成一维数组
    asyncRouterMap = asyncRouterMap.concat(router.matcher.match(currentLocation, router.history.current).matched).filter((item) => {
      const allComponentsName = Object.keys(item.components)
      for (let i = 0; i < allComponentsName.length; i++) {
        if (typeof item.components[allComponentsName[i]] === 'function') {
          return true
        }
      }
      return false
    })
    item.asyncRouterMap = asyncRouterMap
  })

  Vue.mixin({
    mounted () {
      cg.forEach((item) => {
        if (this.$root === item) {
          let index = 0
          item.asyncRouterMap.forEach((item, i) => {
            if (item.instances[this.$options.name] === this) {
              index = i
            }
          })
          item.asyncRouterMap.splice(index, 1)
          if (allAsyncMount(cg)) {
            target.vueAsyncLoadtime = getLiveTime()
          }
        }
      })
    }
  })
}
