<template>
  <button @click="$emit('click')">
    <i :class="classes"></i>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

interface Props {
  icon: string;
}
interface Emits {
  click: () => void;
}
const { icon } = defineProps<Props>();
defineEmits<Emits>();

const classes = computed(() => ["fa", `fa-${icon}`])
</script>

<style scoped>

</style>