<script setup lang="ts">
import { useState } from '@/game/state';
import { computed } from 'vue';
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

const unit = computed(() => {
  const unit = player1Units.value.find((unit) => unit.x === props.x && unit.y === props.y);
  if (unit) return unit;
  return player2Units.value.find((unit) => unit.x === props.x && unit.y === props.y);
});
</script>

<template>
  <div class="flex rounded-xl text-white text-xs w-14 h-14">
    <template v-if="unit && unit.health > 0">
      <Tank v-if="unit.tags.includes('tank')">{{ unit.health }}</Tank>
      <Soldier v-if="unit.tags.includes('soldier')">{{ unit.health }}</Soldier>
      <Sniper v-if="unit.tags.includes('sniper')">{{ unit.health }}</Sniper>
      <Base v-if="unit.tags.includes('base')">{{ unit.health }}</Base>
    </template>
    <Empty v-else />
  </div>
</template>