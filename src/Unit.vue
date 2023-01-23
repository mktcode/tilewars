<script setup lang="ts">
import type { AbstractUnit } from './game/objects';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <div :class="`grow flex flex-col items-center justify-center rounded-xl border-4 border-white text-white text-opacity-70 font-bold bg-gradient-to-t`">
    <div class="text-xs leading-none capitalize">{{ unit.tags[0] }}</div>
    <div class="w-10 mt-1">
      <div class="h-1 bg-white opacity-50 rounded-full" :style="`width: ${Math.floor(unit.health / unit.maxHealth * 100)}%`"></div>
    </div>
  </div>
</template>