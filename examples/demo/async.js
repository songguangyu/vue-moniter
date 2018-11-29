export default {
  name: 'abc',
  template: '<div class="bar"><div>async</div><router-view></router-view></div>',
  mounted () {
    console.log('异步组件加载完成')
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {})
  }
}
