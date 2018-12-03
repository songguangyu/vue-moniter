import Vue from 'vue'
import VueRouter from 'vue-router'
import moniter from 'vue-moniter'
// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
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

const Ren = {
  data () {
    return {
      c: 123
    }
  },
  methods: {
    clickHandler () {
      this.c = 222
    }
  },
  render (createElement) {
    return createElement('h1', {
      domProps: {
        innerHTML: this.c
      },
      on: {
        click: this.clickHandler
      }
    })
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
      component: () =>import('./async.js'),
      children: [
        {
          path: 'b',
          component: () => import('./asyncb.js')
        }
      ]
    },
    { path: '/bar/b', component: Foo }
  ]
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
const cc = new Vue({
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
      <router-view class="view"></router-view>
    </div>
  `
})
console.log(moniter.init(cc, Vue))
cc.$mount('#app')
