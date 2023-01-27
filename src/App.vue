<script setup lang="ts">
import { computed, ref } from 'vue';
import { useState } from './game/state';
import Game from './Game.vue';
import Tile from './Tile.vue';
import type { AbstractUnit } from './game/objects';
import HeartIcon from './icons/Heart.vue';
import CrosshairsIcon from './icons/Crosshairs.vue';
import PlayIcon from './icons/Play.vue';

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
const availablePlayer1FighterCount = computed(() => availablePlayer1Units.value.filter((unit) => unit.tags.includes('fighter')).length);

const availablePlayer1UnitsDisplayColor = computed(() => {
  if (availablePlayer1BasesCount.value > 0) return 'from-orange-900 to-orange-800';
  if (availablePlayer1TanksCount.value > 0) return 'from-orange-700 to-orange-600';
  if (availablePlayer1SoldiersCount.value > 0) return 'from-orange-500 to-orange-400';
  return 'from-orange-300 to-orange-200';
});

const placeNextUnitForPlayer1 = (x: number, y: number) => {
  if (player1Units.value.find((unit) => unit.x === x && unit.y === y)) return;

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
</script>

<template>
  <main class="flex flex-col max-w-5xl mx-auto items-center justify-center pt-5">
    <Game v-if="isGameStarted" />
    <template v-else>
      <div class="grid grid-cols-5 gap-1 bg-blend-soft-light bg-slate-300" style="background-image: url('/crazygames-logo.png'); background-size: 85%; background-repeat: no-repeat; background-position: center 90px;">
        <template v-for="y in [10, 9, 8, 7, 6]">
          <template v-for="x in [1, 2, 3, 4, 5]">
            <Tile :x="x" :y="y" :class="`pointer-events-none ${player2Units.find(u => u.x === x && u.y ===y) ? '' : 'opacity-50'}`" />
          </template>
        </template>
        <template v-for="y in [5, 4, 3, 2, 1]">
          <template v-for="x in [1, 2, 3, 4, 5]">
            <Tile :x="x" :y="y" @click="placeNextUnitForPlayer1(x, y)" />
          </template>
        </template>
      </div>
      <div class="flex items-center justify-center mt-3">
        <div class="flex flex-col items-center justify-center px-5">
          <div class="text-xs font-bold text-slate-400">Level</div>
          <div class="text-slate-600 text-xl font-bold">{{ level }}</div>
        </div>
        <div v-if="availablePlayer1Units.length" class="rounded-xl border-b-2 shadow-md w-56">
          <div :class="`flex flex-col rounded-xl border-4 border-white bg-gradient-to-t text-white text-opacity-75 text-sm px-2 py-1 ${availablePlayer1UnitsDisplayColor}`">
            <div class="flex justify-between">
              <div class="mr-auto text-base font-bold">
                <span class="capitalize">{{ availablePlayer1Units[0].tags[0] }}</span>
                &times;{{
                  availablePlayer1Units[0].tags.includes('base')
                    ? 1
                    : availablePlayer1Units[0].tags.includes('tank')
                      ? availablePlayer1TanksCount
                      : availablePlayer1Units[0].tags.includes('soldier')
                        ? availablePlayer1SoldiersCount
                        : availablePlayer1FighterCount
                }}
              </div>
              <div class="mr-2">
                <HeartIcon class="inline-block w-4 h-4" />  
                {{ availablePlayer1Units[0].health }}
              </div>
              <div>
                <CrosshairsIcon class="inline-block w-4 h-4" />
                {{ availablePlayer1Units[0].damage }}
              </div>
            </div>
            <div class="flex justify-between space-x-2">
              <div>
                Firerate:
                {{ availablePlayer1Units[0].firerate }}
              </div>
              <div>
                Range:
                {{ availablePlayer1Units[0].range }}
              </div>
              <div>
                Speed:
                {{ availablePlayer1Units[0].speed }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-64">
          <button @click="start" :disabled="!canStart" class="w-full">
            <PlayIcon class="inline-block w-6 h-6" />
          </button>
        </div>
      </div>
    </template>
  </main>
</template>
