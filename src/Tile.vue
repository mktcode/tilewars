<script setup lang="ts">
import { useState } from '@/game/state';
import { computed, ref } from 'vue';
import Tank from '@/Tank.vue';
import Soldier from '@/Soldier.vue';
import Sniper from '@/Sniper.vue';
import Base from '@/Base.vue';
import Empty from '@/Empty.vue';

const props = defineProps<{
  x: number;
  y: number;
}>();

const { player1Units, player2Units } = useState();

const borderColor = ref('border-gray-300');

const unit = computed(() => {
  const player1Unit = player1Units.value.find((unit) => unit.x === props.x && unit.y === props.y && unit.health > 0);
  if (player1Unit) {
    borderColor.value = 'border-blue-500';
    return player1Unit;
  }
  const player2Unit = player2Units.value.find((unit) => unit.x === props.x && unit.y === props.y && unit.health > 0);
  if (player2Unit) {
    borderColor.value = 'border-red-500';
    return player2Unit;
  }

  borderColor.value = 'border-gray-300';
  return null;
});
</script>

<template>
  <div :class="`flex rounded-xl overflow-hidden text-white text-xs w-14 h-14 border-2 ${borderColor}`">
    <template v-if="unit">
      <Tank v-if="unit.tags.includes('tank')" :unit="unit" />
      <Soldier v-if="unit.tags.includes('soldier')" :unit="unit" />
      <Sniper v-if="unit.tags.includes('sniper')" :unit="unit" />
      <Base v-if="unit.tags.includes('base')" :unit="unit" />
    </template>
    <Empty v-else />
  </div>
</template>