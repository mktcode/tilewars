<script setup lang="ts">
import { computed, ref } from 'vue';
import { useState } from './game/state';
import Game from './Game.vue';
import Tile from './Tile.vue';

const { player1Units, player2Units } = useState();

const canStart = computed(() => {
  return (
    player1Units.value.every((unit) => unit.x !== 0 && unit.y !== 0) &&
    player2Units.value.every((unit) => unit.x !== 0 && unit.y !== 0)
  );
});

const isGameStarted = ref(false);
const availableUnits = computed(() => player1Units.value.filter((unit) => unit.x === 0 || unit.y === 0));
const availableBasesCount = computed(() => availableUnits.value.filter((unit) => unit.tags.includes('base')).length);
const availableTanksCount = computed(() => availableUnits.value.filter((unit) => unit.tags.includes('tank')).length);
const availableSoldiersCount = computed(() => availableUnits.value.filter((unit) => unit.tags.includes('soldier')).length);
const availableSnipersCount = computed(() => availableUnits.value.filter((unit) => unit.tags.includes('sniper')).length);

const cycleUnit = (x: number, y: number) => {
  const currentUnit = player1Units.value.find((unit) => unit.x === x && unit.y === y);
  const nextUnit = availableUnits.value[0];

  if (currentUnit) {
    const x = currentUnit.x;
    const y = currentUnit.y;
    
    currentUnit.x = 0;
    currentUnit.y = 0;
    
    if (nextUnit) {
      nextUnit.x = x;
      nextUnit.y = y;
    }
  } else {
    if (nextUnit) {
      nextUnit.x = x;
      nextUnit.y = y;
    }
  }
};
</script>

<template>
  <main class="flex flex-col max-w-5xl mx-auto items-center justify-center pt-24">
    <Game v-if="isGameStarted" />
    <template v-else>
      <div class="flex flex-col items-center">
        <div v-for="y in [5, 4, 3, 2, 1]" class="flex">
          <div v-for="x in [1, 2, 3, 4, 5]">
            <div class="flex rounded-xl w-14 h-14 mx-1 my-[1px] opacity-40 justify-center items-center font-extrabold text-slate-400 text-2xl">
              ?
            </div>
          </div>
        </div>
      </div>
      <div v-for="y in [5, 4, 3, 2, 1]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile class="my-[1px] mx-1" :x="x" :y="y" @click="cycleUnit(x, y)" />
        </div>
      </div>
      <div class="flex border rounded-xl p-2 mt-5 space-x-2">
        <div :class="`${availableBasesCount ? '' : 'opacity-50'} bg-gradient-to-t from-orange-900 to-orange-800 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm text-white`">{{ availableBasesCount }}</div>
        <div :class="`${availableTanksCount ? '' : 'opacity-50'} bg-gradient-to-t from-orange-700 to-orange-600 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm text-white`">{{ availableTanksCount }}</div>
        <div :class="`${availableSoldiersCount ? '' : 'opacity-50'} bg-gradient-to-t from-orange-500 to-orange-400 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm text-white`">{{ availableSoldiersCount}}</div>
        <div :class="`${availableSnipersCount ? '' : 'opacity-50'} bg-gradient-to-t from-orange-300 to-orange-200 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm text-white`">{{ availableSnipersCount }}</div>
      </div>
      <div class="text-center mt-5">
        <button @click="isGameStarted = true" :disabled="!canStart">Start game</button>
      </div>
    </template>
  </main>
</template>
