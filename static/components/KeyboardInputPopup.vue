<template>
  <h1>Hello orld</h1>
  <p-button @click="visible = !visible">Show dialog</p-button>
  visible: {{ visible }}
  <p-dialog v-model:visible="visible" header="Edit Profile" :style="{ width: '25rem' }">
    <div style="background-color: red">
      <h1>Hello World</h1>
    </div>
  </p-dialog>
</template>

<script setup
        lang="ts">
import {ref} from 'vue';

const visible = ref(false)
</script>