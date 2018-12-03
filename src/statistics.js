import { getLiveTime } from './util'

export default function(target, Vue) {
  target.componentNum = 0
  Vue.mixin({
    created() {
      this.moniterData = {
        startTime: getLiveTime()
      }
    },
    mounted () {
      const moniterData = this.moniterData
      moniterData.endTime = getLiveTime()
      moniterData.spendTime = moniterData.endTime - moniterData.startTime
      target.componentNum++
    }
  })
}
