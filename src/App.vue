<script setup lang="ts">
import Tile from '@/Tile.vue';
import { PLAYSPEED, playTurn } from '@/game';
import { useState } from '@/game/state';
import { ref } from 'vue';

const { player1Units, player2Units } = useState();

const turnCount = ref(0);
const isPlaying = ref(false);
const playSpeed = ref(PLAYSPEED.Slow)

const nextTurn = async() => {
  turnCount.value += 1;
  playTurn(turnCount.value, player1Units.value, player2Units.value);
  if (isPlaying.value) {
    await new Promise((resolve) => setTimeout(resolve, playSpeed.value));
    nextTurn();
  }
};

const toggleSpeed = () => {
  if (playSpeed.value === PLAYSPEED.Slow) {
    playSpeed.value = PLAYSPEED.Medium;
  } else if (playSpeed.value === PLAYSPEED.Medium) {
    playSpeed.value = PLAYSPEED.Fast;
  } else {
    playSpeed.value = PLAYSPEED.Slow;
  }
};

const toggleIsPlaying = () => {
  isPlaying.value = !isPlaying.value;
  
  if (isPlaying.value) {
    nextTurn();
  }
};

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <main class="flex flex-col max-w-5xl mx-auto min-h-screen items-center justify-center">
    <div class="flex flex-col items-center">
      <div v-for="y in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile class="my-[1px] mx-1" :x="x" :y="y" />
        </div>
      </div>
    </div>
    <div class="flex text-center mt-5 w-80 p-1">
      <div class="flex space-x-2">
        <button v-if="!isPlaying" @click="nextTurn">next turn</button>
        <button @click="toggleIsPlaying()">
          <template v-if="isPlaying">pause</template>
          <template v-else>play</template>
        </button>
        <button v-if="isPlaying" @click="toggleSpeed()">
          <template v-if="playSpeed === PLAYSPEED.Slow">x2</template>
          <template v-else-if="playSpeed === PLAYSPEED.Medium">x3</template>
          <template v-else>x1</template>
        </button>
        <button @click="reload">new</button>
      </div>
      <div class="text-right font-bold ml-auto">
        <div class="text-xs text-gray-500">Turn</div>
        <div class="text-xl text-gray-300">{{ turnCount }}</div>
      </div>
    </div>
  </main>
</template>
