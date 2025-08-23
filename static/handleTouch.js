const handleMouseMove = (ev) => {
  console.log(ev)
  const newDeltaX = ev.deltaX - lastTouchMove.deltaX
  const newDeltaY = ev.deltaY - lastTouchMove.deltaY
  lastTouchMove.deltaX = ev.deltaX
  lastTouchMove.deltaY = ev.deltaY

  const acceleration = Alpine.store('settings').touchpadAcceleration;
  const speed = Alpine.store('settings').touchpadSpeed;
  const accelerationFactor = Math.abs(ev.velocity) + acceleration
  mouseMoveCache.x += newDeltaX * (speed + accelerationFactor)
  mouseMoveCache.y += newDeltaY * (speed + accelerationFactor)
  sendCachedMouseMovements()
}

const sendCachedMouseMovements = _.throttle(() => {
  const deltaX = mouseMoveCache.x
  const deltaY = mouseMoveCache.y
  mouseMoveCache.x = 0
  mouseMoveCache.y = 0
  sendMouseMove(deltaX, deltaY)
}, 25)

const mouseMoveCache = {x: 0, y: 0}
const lastTouchMove = {deltaX: 0, deltaY: 0}

const touchpad = document.querySelector('#touchpad')
const hammer = new Hammer(touchpad)
hammer.get('pan').set({direction: Hammer.DIRECTION_ALL, threshold: 0});
hammer.on('panmove', handleMouseMove)
hammer.on('panstart', () => {
  lastTouchMove.deltaX = 0;
  lastTouchMove.deltaY = 0;
})

// const scrollVert = document.querySelector('#scroll-vertical')
// const hammerScrollVert = new Hammer(scrollVert)
// hammerScrollVert.on('pan', handlePan)
