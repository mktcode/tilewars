<script setup lang="ts">
import type { AbstractUnit } from './game/objects';
import Unit from './Unit.vue';

defineProps<{
  unit: AbstractUnit;
}>();
</script>

<template>
  <Unit :unit="unit"></Unit>
</template>