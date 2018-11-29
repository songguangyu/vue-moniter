export default function (cg) {
  let router
  for (let i = 0; i < cg.length; i++) {
    if (cg[0].$options.router) {
      router = cg[0].$options.router
      break
    }
  }
  const mode = router.mode
  if (mode === 'history') {
    window.addEventListener('popstate', e => {
      console.log(e)
    })
  } else if (mode === 'hash') {

  }
}
