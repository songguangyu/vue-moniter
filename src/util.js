export function watcher (obj, name, fn) {
  let tmpVal = obj.name
  Object.defineProperty(obj, name, {
    set: function (newValue) {
      fn && fn(newValue)
      tmpVal = newValue
    },
    get: function () {
      return tmpVal
    }
  })
}

export function getLiveTime () {
  return Math.floor(window.performance.now())
}

export function allAsyncMount (cg) {
  let allComplete = true
  cg.forEach((item) => {
    if (item.asyncRouterMap.length !== 0) {
      allComplete = false
    }
  })
  return allComplete
}
