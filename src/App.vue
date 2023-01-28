<script setup lang="ts">
import { computed, ref } from 'vue';
import { useState } from './game/state';
import Game from './Game.vue';
import Tile from './Tile.vue';
import type { AbstractUnit } from './game/objects';
import HeartIcon from './icons/Heart.vue';
import CrosshairsIcon from './icons/Crosshairs.vue';
import PlayIcon from './icons/Play.vue';
import { predictTurn, mutateWeights } from './game/ai-model';

const { aiModel, aiIsThinking, allUnits, player1Units, player2Units, level, unitIsPositioned, unitIsNotPositioned } = useState();

const showTutorial = ref(true);
const hideTutorial = () => {
  showTutorial.value = false;
};

const canStart = computed(() => {
  return (
    player1Units.value.every(unitIsPositioned) &&
    player2Units.value.every(unitIsPositioned)
  );
});

const isGameStarted = ref(false);
const availablePlayer1Units = computed(() => player1Units.value.filter(unitIsNotPositioned));
const availablePlayer2Units = computed(() => player2Units.value.filter(unitIsNotPositioned));
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
  if (canStart.value) return;
  if (player1Units.value.find((unit) => unit.x === x && unit.y === y)) return;

  placeNextUnit(x, y, player1Units.value, availablePlayer1Units.value);
  randomlyPlaceNextUnitForPlayer2();
};

const prepareTilesInput = () => {
  const tilesInput = []
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 10; y++) {
      const unit = allUnits.value.find((u) => u.x === x && u.y === y);
      const isPlayer1 = player1Units.value.find((u) => u.x === x && u.y === y);
      const isPlayer2 = player2Units.value.find((u) => u.x === x && u.y === y);
      const isBase = unit?.tags.includes('base');
      const isTank = unit?.tags.includes('tank');
      const isSoldier = unit?.tags.includes('soldier');
      const isFighter = unit?.tags.includes('fighter');
      
      let tileValue = 0;
      if (isPlayer1 && isBase) tileValue = 0.1;
      if (isPlayer1 && isTank) tileValue = 0.2;
      if (isPlayer1 && isSoldier) tileValue = 0.3;
      if (isPlayer1 && isFighter) tileValue = 0.4;
      if (isPlayer2 && isBase) tileValue = 0.5;
      if (isPlayer2 && isTank) tileValue = 0.6;
      if (isPlayer2 && isSoldier) tileValue = 0.7;
      if (isPlayer2 && isFighter) tileValue = 0.8;

      tilesInput.push(tileValue);
    }  
  }

  return tilesInput;
};

const mutateAiUntilEmptyTileFound = async (): Promise<{x: number, y: number }> => {
  const tilesInput = prepareTilesInput();

  let isPositionTaken = false;
  let nextPosition = { x: 0, y: 0 };

  do {
    await new Promise(resolve => setTimeout(resolve, 0)); // UI-blocking workaround
    aiModel.setWeights(mutateWeights(aiModel.getWeights(), 0.02, 0.1)); // TODO: make adjustment increase with each try (clamped in a range)
    const nextPositionValue = Math.abs(predictTurn(aiModel, tilesInput));
    const nextPositionTileIndex = Math.floor(nextPositionValue * 25); // 25 fields (upper half)
    nextPosition = {
      x: nextPositionTileIndex % 5,
      y: 9 - Math.floor(nextPositionTileIndex / 5),
    };
    isPositionTaken = !!player2Units.value.find((unit) => unit.x === nextPosition.x && unit.y === nextPosition.y);
  } while (isPositionTaken)

  return nextPosition;
}

const randomlyPlaceNextUnitForPlayer2 = async () => {
  if (canStart.value) return;

  aiIsThinking.value = true;
  mutateAiUntilEmptyTileFound().then((nextPosition) => {
    placeNextUnit(nextPosition.x, nextPosition.y, player2Units.value, availablePlayer2Units.value);
    aiIsThinking.value = false;
  });
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
    <Transition>
      <div v-if="showTutorial" class="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div class="bg-white rounded p-5 shadow-xl text-sm text-gray-700 max-w-sm space-y-3">
          <div class="text-center mb-5">
            <h1 class="text-xl">Tilewars A.I.</h1>
            <div class="text-gray-400">
              A strategic mini-game against an evolving AI.
            </div>
          </div>
          <div>
            <div class="font-bold">Placing units:</div>
            <p class="text-xs">
              You have 11 units, with different properties, to place on the lower half of the board, in a given order, turn by turn.
            </p>
          </div>
          <div>
            <div class="font-bold">Running the simulation:</div>
            <p class="text-xs">
              All units move to the other end of the map and attack enemy units in their way, based on their range and damage. <strong>The goal is to destroy the opponent's base.</strong>
              Visual feedback is limited and not very game-like yet, but the simulation is working.
            </p>
            <p class="text-xs text-gray-300 mt-2">
              You as the player can click on an enemy unit to focus on. The AI can't do that (yet).
            </p>
          </div>
          <div>
            <div class="font-bold">Results:</div>
            <ul class="text-xs space-y-1">
              <li>The player who destroys the opponent's base wins.</li>
              <li>If both bases survive (out of enemy's range), their remaining health decides.</li>
              <li>If they are equal, all remaining units' health is compared.</li>
              <li>If they are equal too, the game is a draw.</li>
            </ul>
          </div>
          <div>
            <div class="font-bold">Mutation:</div>
            <p class="text-xs">
              What the AI will learn, is how to place its units, reacting to how you place yours.
              Each time you start the game, you'll start with an untrained neural network.
              It will mutate, when it picks an already taken tile and each time you win.
              Training a globally shared network is one of the next development steps.
            </p>
            <p class="text-center text-gray-300 mt-2">
              If you support experimental, fun development projects like this, hit the "Support This Game" button.
            </p>
          </div>

        </div>
        <div class="mt-5">
          <button @click="hideTutorial">Start game</button>
        </div>
      </div>
    </Transition>
    <Game v-if="isGameStarted" @game-ended="isGameStarted = false" />
    <template v-else>
      <Transition>
        <div v-if="aiIsThinking" class="absolute inset-0 flex items-start justify-center z-10">
          <div class="bg-white rounded px-3 py-1 mt-32 shadow-xl text-xs text-gray-400 animate-pulse">
            Let me think...
          </div>
        </div>
      </Transition>
      <div class="grid grid-cols-5 gap-1">
        <template v-for="y in [9, 8, 7, 6, 5]">
          <template v-for="x in [0, 1, 2, 3, 4]">
            <Tile :x="x" :y="y" :class="`pointer-events-none ${player2Units.find(u => u.x === x && u.y ===y) ? '' : 'opacity-50'}`" />
          </template>
        </template>
        <template v-for="y in [4, 3, 2, 1, 0]">
          <template v-for="x in [0, 1, 2, 3, 4]">
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
