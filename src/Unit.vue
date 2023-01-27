<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import { useState } from './game/state';
import CrosshairsIcon from './icons/Crosshairs.vue';

const { focussedTarget, player1Units } = useState();

const props = defineProps<{
  unit: AbstractUnit;
}>();

function toggleFocus() {
  if (focussedTarget.value === props.unit) {
    focussedTarget.value = null;
  } else if (!player1Units.value.includes(props.unit)) {
    focussedTarget.value = props.unit;
  }
}
</script>

<template>
  <div class="flex rounded-xl overflow-hidden text-white text-xs w-14 h-11 border-b-4 shadow-md shadow-gray-600 hover:shadow-lg hover:shadow-gray-400 transition-all">
    <div
      :class="`grow flex flex-col items-center justify-center rounded-xl border-4 border-white text-white text-opacity-70 font-bold bg-gradient-to-t cursor-pointer`"
      @click="toggleFocus"
    >
      <div class="text-xs leading-none capitalize">{{ unit.tags[0] }}</div>
      <div class="w-10 mt-1">
        <div class="h-1 bg-white opacity-50 rounded-full" :style="`width: ${Math.floor(unit.health / unit.maxHealth * 100)}%`"></div>
      </div>
      <CrosshairsIcon
        v-if="focussedTarget && unit === focussedTarget"
        class="absolute text-white text-opacity-50 animate-ping duration-1000"
        width="32"
        height="32"
      />
    </div>
  </div>
</template>