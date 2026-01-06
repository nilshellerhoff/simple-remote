const calculateAdjustedDistance = (delta, velocity) => {
  const acceleration = Alpine.store('settings').touchpadAcceleration;
  const speed = Alpine.store('settings').touchpadSpeed;
  const accelerationFactor = Math.abs(velocity) + acceleration
  return delta * (speed + accelerationFactor)
}

const handleMouseMove = (ev) => {
  console.log(ev)
  const newDeltaX = ev.deltaX - touchpadLastMove.deltaX
  const newDeltaY = ev.deltaY - touchpadLastMove.deltaY
  touchpadLastMove.deltaX = ev.deltaX
  touchpadLastMove.deltaY = ev.deltaY

  touchpadCache.x += calculateAdjustedDistance(newDeltaX, ev.velocityX)
  touchpadCache.y += calculateAdjustedDistance(newDeltaY, ev.velocityY)
  sendCachedMouseMovements()
}

/**
 * Throttled function for sending the mouse movements stored in mouseMoveCache
 * @type {(function(): (function(Object, (Array|string), *=): *))|*}
 */
const sendCachedMouseMovements = _.throttle(() => {
  const deltaX = touchpadCache.x
  const deltaY = touchpadCache.y
  touchpadCache.x = 0
  touchpadCache.y = 0
  sendMouseMove(deltaX, deltaY)
}, 25)

const handleVerticalScroll = (ev) => {
  const newDeltaY = ev.deltaY - verticalScrollLastMove.deltaY;
  verticalScrollLastMove.deltaY = ev.deltaY
  const scrollFactor = Alpine.store('settings').touchScrollSpeed;
  verticalScrollCache.y += newDeltaY / 100 * scrollFactor
  sendCachedVerticalScroll()
}

const sendCachedVerticalScroll = _.throttle(() => {
  const deltaY = Math.ceil(verticalScrollCache.y);
  verticalScrollCache.y = 0
  sendScrollVertical(deltaY)
})

const handleHorizontalScroll = (ev) => {
  const newDeltaX = ev.deltaX - horizontalScrollLastMove.deltaX;
  horizontalScrollLastMove.deltaX = ev.deltaX;
  const scrollFactor = Alpine.store('settings').touchScrollSpeed;
  horizontalScrollCache.x += newDeltaX / 100 * scrollFactor
  sendCachedHorizontalScroll()
}

const sendCachedHorizontalScroll = _.throttle(() => {
  const deltaX = Math.ceil(horizontalScrollCache.x);
  horizontalScrollCache.x = 0
  sendScrollHorizontal(deltaX)
})

const createTouchTracker = (selector, handler) => {
  const cache = {x: 0, y: 0}
  const lastMove = {deltaX: 0, deltaY: 0}
  const touchpad = document.querySelector(selector)
  const hammerTouchpad = new Hammer(touchpad)
  hammerTouchpad.get('pan').set({direction: Hammer.DIRECTION_ALL, threshold: 0});
  hammerTouchpad.on('panmove', handler)
  hammerTouchpad.on('panstart', () => {
    lastMove.deltaX = 0;
    lastMove.deltaY = 0;
  })

  return { lastMove, cache }
}

const { lastMove: touchpadLastMove, cache: touchpadCache } = createTouchTracker('#touchpad', handleMouseMove)
const { lastMove: verticalScrollLastMove, cache: verticalScrollCache } = createTouchTracker('#scroll-vertical', handleVerticalScroll)
const { lastMove: horizontalScrollLastMove, cache: horizontalScrollCache } = createTouchTracker('#scroll-horizontal', handleHorizontalScroll)