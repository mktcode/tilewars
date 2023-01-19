<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import Unit from './Unit.vue';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <Unit class="bg-sky-300" :unit="unit">
    <div>Soldier</div>
  </Unit>
</template>