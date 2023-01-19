<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import Unit from './Unit.vue';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <Unit class="bg-sky-600" :unit="unit">
    <div>Tank</div>
  </Unit>
</template>