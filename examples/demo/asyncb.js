export default {
  template: '<div class="asyncb">asyncb</div>',
  mounted () {
    console.log('异步组件加载完成')
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {})
  }
}
