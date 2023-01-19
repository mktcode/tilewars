<script setup lang="ts">
import type { AbstractUnit } from './game/objects';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <div :class="`grow flex flex-col items-center justify-center rounded-xl border-4 border-white text-white text-opacity-70 font-bold bg-gradient-to-t`">
    <slot />
    <div>
      {{ unit.health }}
    </div>
  </div>
</template>