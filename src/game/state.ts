import { computed, ref } from 'vue';
import { AbstractUnit, Base, Tank, Soldier, Sniper } from '@/game/objects';

const level = ref(Number(localStorage.getItem('level') || '1'));

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

function randomizePlayer2Positions() {
  player2Units.value.forEach((unit) => {
    let isPositionTaken = false
    let randomPosition = { x: 0, y: 0 }
    do {
      randomPosition = {
        x: Math.floor(Math.random() * 5) + 1,
        y: Math.floor(Math.random() * 5) + 6,
      }
      isPositionTaken = !!player2Units.value.find((unit) => unit.x === randomPosition.x && unit.y === randomPosition.y);
    } while (isPositionTaken)
    unit.x = randomPosition.x
    unit.y = randomPosition.y
  })
}

randomizePlayer2Positions()

const player1Base = computed(() => player1Units.value.find((unit) => unit.tags.includes('base')) as Base);
const player2Base = computed(() => player2Units.value.find((unit) => unit.tags.includes('base')) as Base);
const player1BaseAlive = computed(() => player1Base.value.health > 0);
const player2BaseAlive = computed(() => player2Base.value.health > 0);

const focussedTarget = ref<AbstractUnit | null>(null);

export function useState() {
  return {
    level,
    player1Units,
    player2Units,
    player1Base,
    player2Base,
    player1BaseAlive,
    player2BaseAlive,
    focussedTarget,
  }
}