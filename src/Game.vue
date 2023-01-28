<script setup lang="ts">
import Tile from '@/Tile.vue';
import { PLAYSPEED, playTurn } from '@/game';
import { useState } from '@/game/state';
import { ref } from 'vue';
import FastForwardIcon from './icons/FastForward.vue';
import PlayIcon from './icons/Play.vue';
import PauseIcon from './icons/Pause.vue';
import NextTurnIcon from './icons/NextTurn.vue';

const { allUnits, player1Units, player2Units, player1Base, player1BaseAlive, player2Base, player2BaseAlive, focussedTarget } = useState();

const turnCount = ref(0);
const isPlaying = ref(true);
const playSpeed = ref(PLAYSPEED.Slow)
const player1Wins = ref(false);
const player2Wins = ref(false);
const gameEnded = ref(false);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const nextTurn = async() => {
  if (turnCount.value === 0) {
    await wait(1000);
  }
  turnCount.value += 1;
  playTurn(turnCount.value, player1Units.value, player2Units.value);

  // move to state.ts?
  const player1UnitsHealthSum = player1Units.value.reduce((sum, unit) => sum + unit.health, 0);
  const player2UnitsHealthSum = player2Units.value.reduce((sum, unit) => sum + unit.health, 0);

  const player1UnitsInRangeOfPlayer2Units = player1Units.value.filter((unit) => unit.health > 0 && player2Units.value.some((unit2) => unit2.health > 0 && unit.range >= Math.abs(unit.x - unit2.x) && unit.range >= Math.abs(unit.y - unit2.y)));
  const player2UnitsInRangeOfPlayer1Units = player2Units.value.filter((unit) => unit.health > 0 && player1Units.value.some((unit2) => unit2.health > 0 && unit.range >= Math.abs(unit.x - unit2.x) && unit.range >= Math.abs(unit.y - unit2.y)));

  const movingPlayer1UnitsWithFreeTilesOnTheirLane = player1Units.value.filter((unit) => {
    const unitsOnSameLane = allUnits.value.filter((unit2) => unit2.x === unit.x && unit2.y > unit.y);
    const baseOnSameLane = player1Base.value.x === unit.x && player1Base.value.y > unit.y;
    return unit.health > 0 && unit.speed > 0 && unitsOnSameLane.length < 10 - unit.y && !baseOnSameLane;
  });
  const movingPlayer2UnitsWithFreeTilesOnTheirLane = player2Units.value.filter((unit) => {
    const unitsOnSameLane = allUnits.value.filter((unit2) => unit2.x === unit.x && unit2.y < unit.y);
    const baseOnSameLane = player2Base.value.x === unit.x && player2Base.value.y < unit.y;
    return unit.health > 0 && unit.speed > 0 && unitsOnSameLane.length < unit.y - 1 && !baseOnSameLane;
  });
  
  // when the game was perfectly balanced
  if (player1UnitsHealthSum + player2UnitsHealthSum === 0) {
    isPlaying.value = false;
    gameEnded.value = true;
  }
  
  // when one player won due to base destruction
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

  // when game ends due to units being stuck
  if (
    player1UnitsInRangeOfPlayer2Units.length === 0 &&
    player2UnitsInRangeOfPlayer1Units.length === 0 &&
    movingPlayer1UnitsWithFreeTilesOnTheirLane.length === 0 &&
    movingPlayer2UnitsWithFreeTilesOnTheirLane.length === 0
  ) {
    if (player1Base.value.health > player2Base.value.health) {
      player1Wins.value = true;
    } else if (player2Base.value.health > player1Base.value.health) {
      player2Wins.value = true;
    } else if (player1UnitsHealthSum > player2UnitsHealthSum) {
      player1Wins.value = true;
    } else if (player2UnitsHealthSum > player1UnitsHealthSum) {
      player2Wins.value = true;
    }

    isPlaying.value = false;
    gameEnded.value = true;
  }

  if (gameEnded.value) focussedTarget.value = null;
  
  if (isPlaying.value && !gameEnded.value) {
    await wait(playSpeed.value);
    nextTurn();
  }
};
nextTurn();

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
  reload();
}
</script>

<template>
  <div>
    <div class="grid grid-cols-5 gap-1">
      <template v-for="y in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]">
        <template v-for="x in [1, 2, 3, 4, 5]">
          <Tile :x="x" :y="y" :class="`${allUnits.find(u => u.x === x && u.y === y) ? '' : 'pointer-events-none'}`" />
        </template>
      </template>
    </div>

    <div v-if="!gameEnded" class="flex space-x-2 p-1 mt-3">
      <button class="grow" @click="toggleIsPlaying()">
        <template v-if="isPlaying"><PauseIcon width="20" height="20" /></template>
        <template v-else><PlayIcon width="20" height="20" /></template>
      </button>
      <button v-if="!isPlaying" @click="nextTurn"><NextTurnIcon width="20" height="20" /></button>
      <button v-if="isPlaying" @click="toggleSpeed()">
        <FastForwardIcon width="20" height="20" />
      </button>
      <button @click="reload">new game</button>
    </div>

    <div class="text-center font-bold ml-auto mt-3">
      <div class="text-xs text-slate-600">Turn</div>
      <div class="text-4xl text-slate-400">{{ turnCount }}</div>
    </div>

    <div v-if="gameEnded" class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="rounded-xl bg-slate-100 shadow-2xl shadow-gray-800 p-5">
        <div class="text-gray-400 text-sm mb-5">
          <div class="flex justify-between">
            <div>Your base's health:</div>
            <div>{{ player1Base.health }}</div>
          </div>
          <div class="flex justify-between">
            <div>Enemy base's health:</div>
            <div>{{ player2Base.health }}</div>
          </div>
        </div>
        <div v-if="player1Base.health === player2Base.health">
          Bases have equal health. Units' health will be used to determine the winner.<br />
          TODO: Display units' health.
        </div>
        <template v-if="player1Wins">
          <div class="text-4xl text-slate-400">You won! :)</div>
          <button class="mt-3 w-full" @click="nextLevel">next level</button>
        </template>
        <template v-if="player2Wins">
          <div class="text-4xl text-slate-400">You lost! :(</div>
          <button class="mt-3 w-full" @click="reload">try again</button>
        </template>
        <template v-if="!player1Wins && !player2Wins">
          <div class="text-4xl text-slate-400">Draw! :|</div>
          <button class="mt-3 w-full" @click="reload">try again</button>
        </template>
      </div>
    </div>
  </div>
</template>
