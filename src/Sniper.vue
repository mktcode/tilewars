<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import Unit from './Unit.vue';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <Unit class="bg-lime-600" :unit="unit">
    <div>Sniper</div>
  </Unit>
</template>