<script setup lang="ts">
import Tile from '@/Tile.vue';
import { PLAYSPEED, playTurn } from '@/game';
import { useState } from '@/game/state';
import { ref } from 'vue';

const { player1Units, player2Units, player1HasBase, player2HasBase } = useState();

const turnCount = ref(0);
const isPlaying = ref(false);
const playSpeed = ref(PLAYSPEED.Slow)

const nextTurn = async() => {
  turnCount.value += 1;
  playTurn(turnCount.value, player1Units.value, player2Units.value);
  if (player1HasBase.value && player2HasBase.value && isPlaying.value) {
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
  <div>
    <div class="flex flex-col items-center">
      <div v-for="y in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile class="my-[1px] mx-1" :x="x" :y="y" />
        </div>
      </div>
    </div>
    <div class="flex space-x-2 w-80 p-1">
      <button class="grow" @click="toggleIsPlaying()">
        <template v-if="isPlaying">pause</template>
        <template v-else>play</template>
      </button>
      <button v-if="!isPlaying" @click="nextTurn">next turn</button>
      <button v-if="isPlaying" @click="toggleSpeed()">
        <template v-if="playSpeed === PLAYSPEED.Slow">faster</template>
        <template v-else-if="playSpeed === PLAYSPEED.Medium">fastest</template>
        <template v-else>slow</template>
      </button>
      <button @click="reload">new game</button>
    </div>
    <div class="text-center font-bold ml-auto mt-5">
      <div class="text-xs text-slate-600">Turn</div>
      <div class="text-4xl text-slate-400">{{ turnCount }}</div>
    </div>
  </div>
</template>
