import type { Unit } from '@/game/objects'

export enum Direction {
  Up,
  Down,
}

const MAX_SPEED = 3

const moveUnits = (turnCount: number, direction: Direction, units: Unit[], enemyUnits: Unit[]) => {
  units.forEach(unit => {
    const speedAllowsMove = unit.speed > 0 && turnCount % (1 + MAX_SPEED - unit.speed) === 0
    if (speedAllowsMove) {
      const targetY = unit.y + (direction === Direction.Up ? 1 : -1)
      const isBlockedByUnit = [...units, ...enemyUnits].find(otherUnit => otherUnit.x === unit.x && otherUnit.y === targetY)
      if (!isBlockedByUnit) {
        unit.y = targetY
      }
    }
  })
}

const dealDamage = (units: Unit[], enemyUnits: Unit[]) => {
  units.forEach(unit => {
    const closestLivingEnemyInRange = enemyUnits
      .filter(enemy => enemy.health > 0)
      .filter(enemy => enemy.x <= unit.x + unit.range && enemy.x >= unit.x - unit.range)
      .filter(enemy => enemy.y <= unit.y + unit.range && enemy.y >= unit.y - unit.range)
      .sort((a, b) => {
        const aDistance = Math.abs(a.x - unit.x) + Math.abs(a.y - unit.y)
        const bDistance = Math.abs(b.x - unit.x) + Math.abs(b.y - unit.y)
        return aDistance - bDistance
      })[0]
    
    if (closestLivingEnemyInRange) {
      closestLivingEnemyInRange.health -= unit.damage
      if (closestLivingEnemyInRange.health < 0) closestLivingEnemyInRange.health = 0
    }
  })
}

const playHalfTurn = (turnCount: number, direction: Direction, units: Unit[], enemyUnits: Unit[]) => {
  moveUnits(turnCount, direction, units, enemyUnits)
  dealDamage(units, enemyUnits)
  dealDamage(enemyUnits, units)
}

export const playTurn = (turnCount: number, player1Units: Unit[], player2Units: Unit[]) => {
  playHalfTurn(turnCount, Direction.Up, player1Units, player2Units)
  playHalfTurn(turnCount, Direction.Down, player2Units, player1Units)
}