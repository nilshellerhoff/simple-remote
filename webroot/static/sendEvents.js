const sendMouseMove = (dx, dy) => {
  socket.emit('mouse-move', [dx, dy])
}

const sendMouseClick = () => {
  socket.emit('mouse-click')
}

const sendScrollVertical = (units) => {
  console.log("scroll vertical")
  socket.emit('vertical-scroll', units)
}

const sendScrollHorizontal = (units) => {
  socket.emit('horizontal-scroll', units)
}

const sendSpecialKey = (key) => {
  socket.emit('special-key', key)
}
