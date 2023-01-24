<script setup lang="ts">
import { useState } from '@/game/state';
import { computed } from 'vue';
import Unit from '@/Unit.vue';
import Empty from '@/Empty.vue';

const props = defineProps<{
  x: number;
  y: number;
}>();

const { player1Units, player2Units } = useState();

const player1Unit = computed(() => player1Units.value.find((unit) => unit.x === props.x && unit.y === props.y && unit.health > 0));
const player2Unit = computed(() => player2Units.value.find((unit) => unit.x === props.x && unit.y === props.y && unit.health > 0));
const unit = computed(() => player1Unit.value || player2Unit.value);

const isBase = computed(() => unit.value?.tags.includes('base'));
const isTank = computed(() => unit.value?.tags.includes('tank'));
const isSoldier = computed(() => unit.value?.tags.includes('soldier'));
const isSniper = computed(() => unit.value?.tags.includes('sniper'));

const baseColor = computed(() => player1Unit.value ? 'from-orange-900 to-orange-800' : 'from-indigo-900 to-indigo-800');
const tankColor = computed(() => player1Unit.value ? 'from-orange-700 to-orange-600' : 'from-indigo-700 to-indigo-600');
const soldierColor = computed(() => player1Unit.value ? 'from-orange-500 to-orange-400' : 'from-indigo-500 to-indigo-400');
const sniperColor = computed(() => player1Unit.value ? 'from-orange-300 to-orange-200' : 'from-indigo-300 to-indigo-200');
</script>

<template>
  <div class="flex rounded-xl overflow-hidden bg-white text-white text-xs w-14 h-12 border-b-4 mt-0.5 shadow-md shadow-gray-600 hover:-mt-0.5 hover:shadow-lg hover:shadow-gray-400 transition-all">
    <template v-if="unit">
      <Unit v-if="isBase" :unit="unit" :class="baseColor" />
      <Unit v-if="isTank" :unit="unit" :class="tankColor" />
      <Unit v-if="isSoldier" :unit="unit" :class="soldierColor" />
      <Unit v-if="isSniper" :unit="unit" :class="sniperColor" />
    </template>
    <Empty v-else />
  </div>
</template>