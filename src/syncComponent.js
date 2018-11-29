import { getLiveTime, watcher } from './util'

export function getSyncComponentMountTime (cg, target) {
  const rcLength = cg.length
  let mountCount = 0
  cg.forEach((item) => {
    watcher(item, '_isMounted', function (isMounted) {
      if (isMounted) {
        if (++mountCount === rcLength) {
          target.vueSyncLoadtime = getLiveTime()
        }
      }
    })
  })
}
