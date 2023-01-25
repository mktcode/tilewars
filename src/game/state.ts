import { computed, ref } from 'vue';
import { AbstractUnit, Base, Tank, Soldier, Fighter } from '@/game/objects';

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
  new Fighter(),
  new Fighter(),
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
  new Fighter(),
  new Fighter(),
])

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