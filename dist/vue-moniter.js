/**
  * vue-moniter v1.0.2
  * (c) 2018 Evan You
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueRouter = factory());
}(this, (function () { 'use strict';

var startTime = Date.now() - 0;
function watcher (obj, name, fn) {
  var tmpVal = obj.name;
  Object.defineProperty(obj, name, {
    set: function (newValue) {
      fn && fn(newValue);
      tmpVal = newValue;
    },
    get: function () {
      return tmpVal
    }
  });
}

function getLiveTime () {
  if (window.performance.now) {
    return Math.floor(window.performance.now() )
  } else {
    var nowTime = Date.now() - 0;
    return Math.floor(startTime - nowTime)
  }
}

function allAsyncMount (cg) {
  var allComplete = true;
  cg.forEach(function (item) {
    if (item.asyncRouterMap.length !== 0) {
      allComplete = false;
    }
  });
  return allComplete
}

function getSyncComponentMountTime (cg, target) {
  var rcLength = cg.length;
  var mountCount = 0;
  cg.forEach(function (item) {
    watcher(item, '_isMounted', function (isMounted) {
      if (isMounted) {
        if (++mountCount === rcLength) {
          target.vueSyncLoadtime = getLiveTime();
        }
      }
    });
  });
}

function getAsyncComponentFromRouter (cg, target, Vue) {
  cg.forEach(function (item) {
    var asyncRouterMap = [];
    var router = item.$options.router;
    var currentLocation = router.history.getCurrentLocation();
    // 打平成一维数组
    asyncRouterMap = asyncRouterMap.concat(router.matcher.match(currentLocation, router.history.current).matched).filter(function (item) {
      var allComponentsName = Object.keys(item.components);
      for (var i = 0; i < allComponentsName.length; i++) {
        if (typeof item.components[allComponentsName[i]] === 'function') {
          return true
        }
      }
      return false
    });
    item.asyncRouterMap = asyncRouterMap;
  });

  Vue.mixin({
    mounted: function mounted () {
      var this$1 = this;

      cg.forEach(function (item) {
        if (this$1.$root === item) {
          var index = 0;
          item.asyncRouterMap.forEach(function (item, i) {
            if (item.instances[this$1.$options.name] === this$1) {
              index = i;
            }
          });
          item.asyncRouterMap.splice(index, 1);
          if (allAsyncMount(cg)) {
            target.vueAsyncLoadtime = getLiveTime();
          }
        }
      });
    }
  });
}

var routerGuard = function (cg, target) {
  var router;
  for (var i = 0; i < cg.length; i++) {
    if (cg[0].$options.router) {
      router = cg[0].$options.router;
      break
    }
  }
  watcher(router.app._route, 'fullPath', function(url) {
    target.routerChange.push({
      url: url,
      memory: performance.memory,
      time: getLiveTime()
    });
  });
};

var statistics = function(target, Vue) {
  target.componentNum = 0;
  Vue.mixin({
    created: function created() {
      this.moniterData = {
        startTime: getLiveTime()
      };
    },
    mounted: function mounted () {
      var moniterData = this.moniterData;
      moniterData.endTime = getLiveTime();
      moniterData.spendTime = moniterData.endTime - moniterData.startTime;
      target.componentNum++;
    }
  });
};

var target = {
  vueStartMounttime: 0,
  vueSyncLoadtime: 0,
  vueAsyncLoadtime: 0,
  routerChange: []
};
// vue开始渲染
target.vueStartMounttime = getLiveTime();

var index = {
  cg: [],
  init: function init (cg, Vue) {
    this.cg = this.cg.concat(cg);
    // 注册统计组件
    statistics(target, Vue);
    // 获取所有同步组件
    getSyncComponentMountTime(this.cg, target);
    // 获取所有异步组件
    getAsyncComponentFromRouter(this.cg, target, Vue);
    routerGuard(this.cg, target);
    return target
  },
  addComponent: function addComponent (component) {
    this.cg.push(component);
  }
};

return index;

})));
