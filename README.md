# vue-moniter

欢迎使用 vue-moniter

## 为什么我们使用 vue moniter

在使用vue项目中，我们使用传统的 **dom.ready** 或者 **preformance** 根本无法统计到真正的vue项目首屏时间
甚至很多vue使用者使用了非常多的异步模块在项目中，这些该怎么统计呢？

## demo
```
import Vue from 'vue'
import VueRouter from 'vue-router'
import moniter from 'vue-moniter'

Vue.use(VueRouter)

// 2. Define route components
const Home = {
  template: '<div>home</div>',
  mounted () {
    console.log('Home mounted')
  }
}
const Foo = {
  template: '<div class="foo">foo</div>',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log(vm)
    })
  },
  mounted () {
    console.log('children mounted')
  },
  data () {
    return {
      hook: {
        prepatch: (_, vnode) => {
          window.alert(1)
        }
      }
    }
  }
}

// 3. Create the router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    {
      path: '/bar/a',
      components: {
        abc: () => import('./async.js'),
        bbb: Ren
      },
      children: [
        {
          path: 'b',
          component: () => import('./asyncb.js')
        }
      ]
    },
    { path: '/bar/a', component: Foo }
  ]
})

const rootVue = new Vue({
  router,
  mounted () {
    console.log('main mounted')
  },
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/bar/a">/bar/a</router-link></li>
        <li><router-link to="/bar/b">/bar/b</router-link></li>        
        <router-link tag="li" to="/bar" :event="['mousedown', 'touchstart']">
          <a>/bar</a>
        </router-link>
      </ul>
      <router-view class="view" name="abc"></router-view>
    </div>
  `
})
moniter.init(rootVue, Vue)
rootVue.$mount('#app')
```

## api

### moniter.push

如果在多入口的vue项目中 可以把多个rootVue对象push进来

### moniter.init(rootVue, Vue)

rootVue vue项目的根节点可以是数组
Vue import的Vue对象

## TODO
还计划做一些比如路由切换之间组件的渲染时间（而且可以针对异步），还有针对于路由切换长时间使用的场景进行内存增长分析 总之就是对vue的各种上报。
欢迎有兴趣的小伙伴提提建议。
