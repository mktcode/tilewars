<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import Unit from './Unit.vue';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <Unit class="bg-purple-900" :unit="unit">
    <div>Base</div>
  </Unit>
</template>