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
</script>

<template>
  <main class="max-w-5xl mx-auto">
    <h1 class="text-5xl font-bold text-center my-10">Tile Wars!</h1>
    <div class="flex flex-col items-center">
      <div v-for="y in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" class="flex">
        <div v-for="x in [1, 2, 3, 4, 5]">
          <Tile class="m-1" :x="x" :y="y" />
        </div>
      </div>
    </div>
    <div class="text-center mt-5 space-x-1">
      <button @click="nextTurn">>|</button>
      <button @click="toggleIsPlaying()">
        <template v-if="isPlaying">||</template>
        <template v-else>></template>
      </button>
      <button v-if="isPlaying" @click="toggleSpeed()">
        <template v-if="playSpeed === PLAYSPEED.Slow">x2</template>
        <template v-else-if="playSpeed === PLAYSPEED.Medium">x3</template>
        <template v-else>x1</template>
      </button>
    </div>
    <div class="text-center">
      Turn: {{ turnCount }}
    </div>
  </main>
</template>
