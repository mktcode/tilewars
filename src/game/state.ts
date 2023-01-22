import { computed, ref } from 'vue';
import { AbstractUnit, Base, Tank, Soldier, Sniper } from '@/game/objects';

const player1Units = ref<AbstractUnit[]>([
  new Base(),
  new Tank(),
  new Tank(),
  new Tank(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Sniper(),
  new Sniper(),
])

const player2Units = ref<AbstractUnit[]>([
  new Base(),
  new Tank(),
  new Tank(),
  new Tank(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Soldier(),
  new Sniper(),
  new Sniper(),
])

function randomizePositions(units: AbstractUnit[]) {
  units.forEach((unit) => {
    let isPositionTaken = false
    let randomPosition = { x: 0, y: 0 }
    do {
      randomPosition = {
        x: Math.floor(Math.random() * 5) + 1,
        y: Math.floor(Math.random() * 5) + 6,
      }
      isPositionTaken = !!units.find((unit) => unit.x === randomPosition.x && unit.y === randomPosition.y);
    } while (isPositionTaken)
    unit.x = randomPosition.x
    unit.y = randomPosition.y
  })
}

randomizePositions(player2Units.value)

const player1HasBase = computed(() => player1Units.value.find((unit) => unit.health > 0 && unit.tags.includes('base')));
const player2HasBase = computed(() => player2Units.value.find((unit) => unit.health > 0 && unit.tags.includes('base')));

export function useState() {
  return {
    player1Units,
    player2Units,
    player1HasBase,
    player2HasBase,
  }
}