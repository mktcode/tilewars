<script setup lang="ts">
import { computed, ref } from 'vue';
import { useState } from './game/state';
import Game from './Game.vue';
import Tile from './Tile.vue';
import type { AbstractUnit } from './game/objects';

const { player1Units, player2Units, level } = useState();

const canStart = computed(() => {
  return (
    player1Units.value.every((unit) => unit.x !== 0 && unit.y !== 0) &&
    player2Units.value.every((unit) => unit.x !== 0 && unit.y !== 0)
  );
});

const isGameStarted = ref(false);
const availablePlayer1Units = computed(() => player1Units.value.filter((unit) => unit.x === 0 || unit.y === 0));
const availablePlayer2Units = computed(() => player2Units.value.filter((unit) => unit.x === 0 || unit.y === 0));
const availablePlayer1BasesCount = computed(() => availablePlayer1Units.value.filter((unit) => unit.tags.includes('base')).length);
const availablePlayer1TanksCount = computed(() => availablePlayer1Units.value.filter((unit) => unit.tags.includes('tank')).length);
const availablePlayer1SoldiersCount = computed(() => availablePlayer1Units.value.filter((unit) => unit.tags.includes('soldier')).length);
const availablePlayer1SnipersCount = computed(() => availablePlayer1Units.value.filter((unit) => unit.tags.includes('sniper')).length);

const placeNextUnitForPlayer1 = (x: number, y: number) => {
  placeNextUnit(x, y, player1Units.value, availablePlayer1Units.value);
  randomlyPlaceNextUnitForPlayer2();
};

const randomlyPlaceNextUnitForPlayer2 = () => {
  let isPositionTaken = false
  let randomPosition = { x: 0, y: 0 }
  do {
    randomPosition = {
      x: Math.floor(Math.random() * 5) + 1,
      y: Math.floor(Math.random() * 5) + 6,
    }
    isPositionTaken = !!player2Units.value.find((unit) => unit.x === randomPosition.x && unit.y === randomPosition.y);
  } while (isPositionTaken)
  setTimeout(() => {
    placeNextUnit(randomPosition.x, randomPosition.y, player2Units.value, availablePlayer2Units.value);
  }, 200);
};

const placeNextUnit = (x: number, y: number, units: AbstractUnit[], availableUnits: AbstractUnit[]) => {
  const currentUnit = units.find((unit) => unit.x === x && unit.y === y);
  if (currentUnit) return;

  const nextUnit = availableUnits[0];

  if (nextUnit) {
    nextUnit.x = x;
    nextUnit.y = y;
  }
};

const start = () => {
  isGameStarted.value = true;
};

const resetUnits = () => {
  player1Units.value.forEach((unit) => {
    unit.x = 0;
    unit.y = 0;
  });
  player2Units.value.forEach((unit) => {
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
      <div class="grid grid-cols-5 gap-2">
        <template v-for="y in [10, 9, 8, 7, 6]">
          <template v-for="x in [1, 2, 3, 4, 5]">
            <Tile :x="x" :y="y" />
          </template>
        </template>
        <template v-for="y in [5, 4, 3, 2, 1]">
          <template v-for="x in [1, 2, 3, 4, 5]">
            <Tile :x="x" :y="y" @click="placeNextUnitForPlayer1(x, y)" />
          </template>
        </template>
      </div>
      <div class="rounded-xl border-b-2 shadow-md">
        <div class="flex rounded-xl mt-5 overflow-hidden border-2 border-white">
          <div :class="`${availablePlayer1BasesCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-900 to-orange-800 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availablePlayer1BasesCount }}</span>
            <span>Base</span>
          </div>
          <div :class="`${availablePlayer1TanksCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-700 to-orange-600 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availablePlayer1TanksCount }}</span>
            <span>Tank</span>
          </div>
          <div :class="`${availablePlayer1SoldiersCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-500 to-orange-400 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availablePlayer1SoldiersCount}}</span>
            <span>Soldier</span>
          </div>
          <div :class="`${availablePlayer1SnipersCount ? '' : 'opacity-30'} bg-gradient-to-t from-orange-300 to-orange-200 flex flex-col items-center justify-center p-2 font-bold text-sm text-white leading-4`">
            <span>&times;{{ availablePlayer1SnipersCount }}</span>
            <span>Sniper</span>
          </div>
        </div>
      </div>
      <div class="flex space-x-3 text-center mt-3">
        <button @click="start" :disabled="!canStart">Start</button>
        <button @click="resetUnits" :disabled="player1Units.every(u => u.x === 0 && u.y === 0)">Reset</button>
      </div>
    </template>
  </main>
</template>
