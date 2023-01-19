<script setup lang="ts">
import type { AbstractUnit } from './game/objects';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <div class="grow flex flex-col">
    <slot />
    <div :class="`mt-auto bg-lime-300 h-2`" :style="`width: ${ Math.floor(unit.health / unit.maxHealth * 100) }%;`"></div>
  </div>
</template>