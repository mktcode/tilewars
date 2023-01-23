<script setup lang="ts">
import Tile from '@/Tile.vue';
import { PLAYSPEED, playTurn } from '@/game';
import { useState } from '@/game/state';
import { ref } from 'vue';
import FastForwardIcon from './icons/FastForward.vue';
import Play from './icons/Play.vue';
import Pause from './icons/Pause.vue';

const { player1Units, player2Units, player1Base, player1BaseAlive, player2Base, player2BaseAlive } = useState();

const turnCount = ref(0);
const isPlaying = ref(false);
const playSpeed = ref(PLAYSPEED.Slow)
const player1Wins = ref(false);
const player2Wins = ref(false);
const gameEnded = ref(false);

const nextTurn = async() => {
  turnCount.value += 1;
  playTurn(turnCount.value, player1Units.value, player2Units.value);

  // move to state.ts
  const player1UnitsHealthSum = player1Units.value.reduce((sum, unit) => sum + unit.health, 0);
  const player2UnitsHealthSum = player2Units.value.reduce((sum, unit) => sum + unit.health, 0);

  const player1UnitsInXRangeOfPlayer2Base = player1Units.value.filter((unit) => unit.range >= Math.abs(unit.x - player2Base.value.x));
  const player2UnitsInXRangeOfPlayer1Base = player2Units.value.filter((unit) => unit.range >= Math.abs(unit.x - player1Base.value.x));
  
  if (player1UnitsHealthSum + player2UnitsHealthSum === 0) {
    isPlaying.value = false;
    gameEnded.value = true;
  }
  
  if (player1BaseAlive.value && !player2BaseAlive.value) {
    player1Wins.value = true;
    isPlaying.value = false;
    gameEnded.value = true;
  }
  
  if (!player1BaseAlive.value && player2BaseAlive.value) {
    player2Wins.value = true;
    isPlaying.value = false;
    gameEnded.value = true;
  }

  if (
    player1Units.value.every((unit) => unit.y === 10) &&
    player2Units.value.every((unit) => unit.y === 1) &&
    player1UnitsInXRangeOfPlayer2Base.length === 0 &&
    player2UnitsInXRangeOfPlayer1Base.length === 0
  ) {
    player1Wins.value = player1UnitsHealthSum > player2UnitsHealthSum;
    player2Wins.value = player2UnitsHealthSum > player1UnitsHealthSum;
    isPlaying.value = false;
    gameEnded.value = true;
  }
  
  if (isPlaying.value && !gameEnded.value) {
    await new Promise((resolve) => setTimeout(resolve, playSpeed.value));
    nextTurn();
  }
};

const toggleSpeed = () => {
  if (playSpeed.value === PLAYSPEED.Slow) {
    playSpeed.value = PLAYSPEED.Medium;
  } else if (playSpeed.value === PLAYSPEED.Medium) {
    playSpeed.value = PLAYSPEED.Fast;
  } else if (playSpeed.value === PLAYSPEED.Fast) {
    playSpeed.value = PLAYSPEED.Plaid;
  } else if (playSpeed.value === PLAYSPEED.Plaid) {
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

const nextLevel = () => {
  localStorage.setItem('level', (Number(localStorage.getItem('level')) + 1).toString());
  window.location.reload();
}
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

    <div v-if="gameEnded" class="flex flex-col items-center space-y-3 mt-5">
      <template v-if="player1Wins">
        <div class="text-4xl text-slate-400">You won! :)</div>
        <button @click="nextLevel">next level</button>
      </template>
      <template v-if="player2Wins">
        <div class="text-4xl text-slate-400">You lost! :(</div>
        <button @click="reload">try again</button>
      </template>
      <template v-if="!player1Wins && !player2Wins">
        <div class="text-4xl text-slate-400">Draw! :|</div>
        <button @click="reload">try again</button>
      </template>
    </div>

    <div v-if="!gameEnded" class="flex space-x-2 w-80 p-1 mt-3">
      <button class="grow" @click="toggleIsPlaying()">
        <template v-if="isPlaying"><Pause width="24" height="24" /></template>
        <template v-else><Play width="24" height="24" /></template>
      </button>
      <button v-if="!isPlaying" @click="nextTurn">next turn</button>
      <button v-if="isPlaying" @click="toggleSpeed()">
        <FastForwardIcon width="24" height="24" />
      </button>
      <button @click="reload">new game</button>
    </div>

    <div class="text-center font-bold ml-auto mt-5">
      <div class="text-xs text-slate-600">Turn</div>
      <div class="text-4xl text-slate-400">{{ turnCount }}</div>
    </div>
  </div>
</template>
