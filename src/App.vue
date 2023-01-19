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

const cycleUnit = (x: number, y: number) => {
  const currentUnit = player1Units.value.find((unit) => unit.x === x && unit.y === y);

  if (currentUnit) {
    const x = currentUnit.x;
    const y = currentUnit.y;
    const nextUnit = availableUnits.value[0];
    
    currentUnit.x = 0;
    currentUnit.y = 0;
    
    if (nextUnit) {
      if (currentUnit.tags.includes('sniper')) { // Toggle to empty tile after sniper
        return;
      }
      nextUnit.x = x;
      nextUnit.y = y;
    }
  } else {
    const nextUnit = availableUnits.value[0];
    if (nextUnit) {
      nextUnit.x = x;
      nextUnit.y = y;
    }
  }
};
</script>

<template>
  <main class="flex flex-col max-w-5xl mx-auto min-h-screen items-center justify-center">
    <Game v-if="isGameStarted" />
    <template v-else>
      <div class="flex flex-col items-center mb-1">
        <div v-for="y in [5, 4, 3, 2, 1]" class="flex">
          <div v-for="x in [1, 2, 3, 4, 5]">
            <div class="flex rounded-xl w-14 h-14 m-1 opacity-40 justify-center items-center font-extrabold text-gray-300 text-2xl">
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
      <div class="text-center mt-5">
        <button @click="isGameStarted = true" :disabled="!canStart">Start game</button>
      </div>
    </template>
  </main>
</template>
