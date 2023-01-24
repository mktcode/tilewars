<script setup lang="ts">
import { computed, ref } from 'vue';
import { useState } from './game/state';
import Game from './Game.vue';
import Tile from './Tile.vue';

const { player1Units, player2Units, level } = useState();

const getRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const twoRandomPlayer2Units = computed(() => {
  if (player2Units.value.length < 2) return player2Units.value;
  
  let randomIndex1;
  let randomIndex2;

  do {
    randomIndex1 = getRandomNumberBetween(0, player2Units.value.length - 1);
    randomIndex2 = getRandomNumberBetween(0, player2Units.value.length - 1);
  } while (randomIndex1 === randomIndex2);

  return [player2Units.value[randomIndex1], player2Units.value[randomIndex2]];
});



const lastUnitPlacement = localStorage.getItem('lastUnitPlacement');
if (lastUnitPlacement) {
  try {
    player1Units.value = JSON.parse(lastUnitPlacement);
  } catch (e) {
    console.error(e);
  }
}

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

const start = () => {
  isGameStarted.value = true;
  localStorage.setItem('lastUnitPlacement', JSON.stringify(player1Units.value));
};

const resetPlayer1Units = () => {
  player1Units.value.forEach((unit) => {
    unit.x = 0;
    unit.y = 0;
  });
};
</script>

<template>
  <main class="flex flex-col max-w-5xl mx-auto items-center justify-center pt-5">
    <h1 class="text-xl font-bold text-slate-400 mb-3">Level {{ level }}</h1>
    <Game v-if="isGameStarted" />
    <template v-else>
      <div v-for="y in [10, 9, 8, 7, 6]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile
          v-if="twoRandomPlayer2Units.some((unit) => unit.x === x && unit.y === y)"
          class="my-[1px] mx-1"
          :x="x"
          :y="y"
          @click="cycleUnit(x, y)"
          />
          <div v-else class="flex justify-center items-center text-slate-400 text-opacity-20 text-2xl font-bold w-14 h-12 border-b-4 border-b-transparent mt-0.5 my-[1px] mx-1">
            ?
          </div>
        </div>
      </div>
      <div v-for="y in [5, 4, 3, 2, 1]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile class="my-[1px] mx-1" :x="x" :y="y" @click="cycleUnit(x, y)" />
        </div>
      </div>
      <div class="rounded-xl border-b-2 shadow-md">
        <div class="flex rounded-xl mt-5 overflow-hidden border-2 border-white">
          <div :class="`${availableBasesCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-900 to-orange-800 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availableBasesCount }}</span>
            <span>Base</span>
          </div>
          <div :class="`${availableTanksCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-700 to-orange-600 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availableTanksCount }}</span>
            <span>Tank</span>
          </div>
          <div :class="`${availableSoldiersCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-500 to-orange-400 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availableSoldiersCount}}</span>
            <span>Soldier</span>
          </div>
          <div :class="`${availableSnipersCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-300 to-orange-200 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availableSnipersCount }}</span>
            <span>Sniper</span>
          </div>
        </div>
      </div>
      <div class="flex space-x-3 text-center mt-3">
        <button @click="start" :disabled="!canStart">Start</button>
        <button @click="resetPlayer1Units" :disabled="player1Units.every(u => u.x === 0 && u.y === 0)">Reset</button>
      </div>
    </template>
  </main>
</template>
