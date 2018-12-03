const startTime = Date.now() - 0
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
  if (window.performance.now) {
    return Math.floor(window.performance.now() )
  } else {
    const nowTime = Date.now() - 0
    return Math.floor(startTime - nowTime)
  }
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
