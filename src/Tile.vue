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
const baseColor = computed(() => player1Unit.value ? 'from-orange-900 to-orange-800' : 'from-violet-900 to-violet-800');
const tankColor = computed(() => player1Unit.value ? 'from-orange-500 to-orange-400' : 'from-violet-500 to-violet-400');
const soldierColor = computed(() => player1Unit.value ? 'from-orange-400 to-orange-300' : 'from-violet-400 to-violet-300');
const sniperColor = computed(() => player1Unit.value ? 'from-orange-300 to-orange-200' : 'from-violet-300 to-violet-200');
</script>

<template>
  <div class="flex rounded-xl overflow-hidden bg-white text-white text-xs w-14 h-14 shadow-md border-b-4">
    <template v-if="unit">
      <Unit v-if="unit.tags.includes('base')" :unit="unit" :class="baseColor" />
      <Unit v-if="unit.tags.includes('tank')" :unit="unit" :class="tankColor" />
      <Unit v-if="unit.tags.includes('soldier')" :unit="unit" :class="soldierColor" />
      <Unit v-if="unit.tags.includes('sniper')" :unit="unit" :class="sniperColor" />
    </template>
    <Empty v-else />
  </div>
</template>