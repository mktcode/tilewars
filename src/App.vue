<script setup lang="ts">
import Tile from '@/Tile.vue';
import { playTurn } from '@/game';
import { useState } from '@/game/state';
import { ref } from 'vue';

const { player1Units, player2Units } = useState();

const turnCount = ref(0);

const next = () => {
  turnCount.value += 1;
  playTurn(turnCount.value, player1Units.value, player2Units.value);
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
    <div class="text-center mt-5">
      <button @click="next">next</button>
      <div>
        Turn: {{ turnCount }}
      </div>
    </div>
  </main>
</template>
