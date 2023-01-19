import { ref } from 'vue';
import { Unit, Base, Tank, Soldier, Sniper } from '@/game/objects';

const player1Units = ref<Unit[]>([
  new Base(3, 1),
  new Tank(2, 2),
  new Tank(3, 2),
  new Tank(4, 2),
  new Soldier(2, 3),
  new Soldier(3, 3),
  new Soldier(4, 3),
  new Soldier(1, 2),
  new Soldier(5, 2),
  new Sniper(2, 1),
  new Sniper(4, 1),
])

const player2Units = ref<Unit[]>([
  new Base(3, 10),
  new Tank(2, 8),
  new Tank(3, 8),
  new Tank(4, 8),
  new Soldier(2, 9),
  new Soldier(3, 9),
  new Soldier(4, 9),
  new Soldier(1, 9),
  new Soldier(5, 9),
  new Sniper(2, 10),
  new Sniper(4, 10),
])

export function useState() {
  return {
    player1Units,
    player2Units,
  }
}