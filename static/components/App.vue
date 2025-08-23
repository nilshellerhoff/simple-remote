<template>
  <div style="padding: 10px">
    <div style="width: 100%; margin: 5px 0 5px 0">
      <p-button label="ESC" />
      <p-button icon="pi pi-home" />
      <p-button>
        <b>␣</b>
      </p-button>
      <v-btn unelevated color="secondary" icon="keyboard_alt" @click="() => openKeyboardInput()"/>
    </div>
        <div style="width: 100%; margin: 5px 0 5px 0">
          <q-btn unelevated></q-btn>
    </div>
          <KeyboardInputPopup />

    <div class="parent">
      <div id="touchpad" @click="sendMouseClick"/>
      <div id="scroll-vertical"/>
      <div id="scroll-horizontal"/>
      <q-btn unelevated color="primary" style="grid-area: 1 / 4 / 2 / 5" @click="sendScrollVertical(1)" icon="arrow_drop_up" unelevated />
      <FontAwesomeButton style="grid-area: 3 / 4 / 4 / 5"
                         @click="sendScrollVertical(-1)"

                         icon="chevron-down"/>
      <FontAwesomeButton style="grid-area: 4 / 1 / 5 / 2"
                         @click="sendScrollHorizontal(1)"

                         icon="chevron-left"/>
      <FontAwesomeButton style="grid-area: 4 / 3 / 5 / 4"
                         @click="sendScrollHorizontal(-1)"

                         icon="chevron-right"/>
      <FontAwesomeButton style="grid-area: 4 / 4 / 5 / 5"
                         icon="gear"/>
    </div>
    <div style="width: 100%; padding: 10px; box-sizing: border-box">
      Touchpad speed {{ touchpadSpeed }}
      <input v-model="touchpadSpeedSetting"
             type="range"
             min="-1"
             max="1"
             step="0.1"
             style="width: 100%"/>
    </div>
  </div>
</template>

<script setup
        lang="ts"
        type="module">
import {computed, ref, onMounted} from 'vue';
import _ from 'static/lib/lodash.js';
import HelloWorld from './HelloWorld.vue'
import io from 'static/lib/socket.io.js';
import Hammer from 'static/lib/hammer.js';
import FontAwesomeButton from "./FontAwesomeButton.vue";
import KeyboardInputPopup from "./KeyboardInputPopup.vue";
// import Button from 'primevue';

// const { useQuasar } = Quasar;
// const $q = useQuasar()

const message = ref("Hello World");
const socket = io();

const touchpadSpeedSetting = ref(0)
const touchpadSpeed = computed(() => Math.round(10 ** touchpadSpeedSetting.value * 10) / 10)

setTimeout(() => message.value = 'Not anymore', 5000)

onMounted(() => {
  const touchpad = document.querySelector('#touchpad')
  const hammer = new Hammer(touchpad)
  hammer.get('pan').set({direction: Hammer.DIRECTION_ALL, threshold: 0});
  hammer.on('panmove', handleMouseMove)
  hammer.on('panstart', () => {
    lastTouchMove.deltaX = 0;
    lastTouchMove.deltaY = 0;
  })

  const scrollVert = document.querySelector('#scroll-vert')
  const hammerScrollVert = new Hammer(scrollVert)
  hammerScrollVert.on('pan', handlePan)
})

const mouseMoveCache: Record<string, number> = {x: 0, y: 0}
const lastTouchMove: Record<string, number> = {deltaX: 0, deltaY: 0}

const handleMouseMove = ev => {
  console.log(ev)
  const newDeltaX = ev.deltaX - lastTouchMove.deltaX
  const newDeltaY = ev.deltaY - lastTouchMove.deltaY
  lastTouchMove.deltaX = ev.deltaX
  lastTouchMove.deltaY = ev.deltaY

  mouseMoveCache.x += newDeltaX * touchpadSpeed.value
  mouseMoveCache.y += newDeltaY * touchpadSpeed.value
  sendCachedMouseMovements()
}

const sendCachedMouseMovements = _.throttle(() => {
  const deltaX = mouseMoveCache.x
  const deltaY = mouseMoveCache.y
  mouseMoveCache.x = 0
  mouseMoveCache.y = 0
  sendMouseMove(deltaX, deltaY)
}, 25)

const handlePan = _.throttle((ev) => {
  console.log(ev)
  const value = ev.deltaY > 0 ? 1 : -1
  sendScrollHorizontal(value)
}, 250)

const sendMouseMove = (dx: number, dy: number) => {
  socket.emit('mouse-move', [dx, dy])
}

const sendMouseClick = () => {
  socket.emit('mouse-click')
}

const sendScrollVertical = (units: number) => {
  socket.emit('vertical-scroll', units)
}

const sendScrollHorizontal = (units: number) => {
  socket.emit('horizontal-scroll', units)
}

const mousemoveHandler = _.throttle((evt: MouseEvent) => {
  console.log(evt)
  socket.emit('event', `${evt.screenX}`)
}, 1000);

const openKeyboardInput = () => {
  console.log('hello')
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  user-select: none;
  touch-action: manipulation;
  font-size: 16px !important;

}

.parent {
  display: grid;
  width: 100%;
  height: 500px;
  grid-template-columns: 50px 1fr 50px 50px;
  grid-template-rows: 50px 1fr 50px 50px;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

#touchpad {
  grid-area: 1 / 1 / 4 / 4;
  background-color: #aaa;
}

#scroll-vertical {
  grid-area: 2 / 4 / 3 / 5;
  background-color: #666;
}

#scroll-horizontal {
  grid-area: 4 / 2 / 5 / 3;
  background-color: #666;
}

.div4 {
  grid-area: 2 / 2 / 3 / 3;
}
</style>