export abstract class GameObject {
  x: number = 0
  y: number = 0
  tags: string[] = []

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export abstract class Unit extends GameObject {
  health: number = 0
  damage: number = 0
  firerate: number = 0
  range: number = 0
  speed: number = 0
}

export class Tank extends Unit {
  health = 1000
  damage = 30
  firerate = 1
  range = 3
  speed = 2
  tags = ['tank']
}

export class Soldier extends Unit {
  health = 500
  damage = 5
  firerate = 3
  range = 1
  speed = 3
  tags = ['soldier']
}

export class Sniper extends Unit {
  health = 400
  damage = 25
  firerate = 2
  range = 5
  speed = 1
  tags = ['sniper']
}

export class Base extends Unit {
  health = 10000
  damage = 10
  firerate = 1
  range = 1
  tags = ['base']
}