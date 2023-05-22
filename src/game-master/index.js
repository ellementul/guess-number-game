const { Member, Types } = require('@ellementul/uee-core')

const timeEvent = require('../events/time_event')
const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const createBulletEvent = require('../events/create_bullet_event')
const createBoxEvent = require('../events/create_box_event')
const pingEvent = require('../events/ping_event')
const gameTickEvent = require('../events/game_tick_event')
const { nextTick } = require('process')

const WAIT = "WaitingOfPlayers"
const PLAY = "Playing" 

class GameMaster extends Member {
  constructor() {
    super()
    this.players = new Set
    this.players_limit = 2

    this.onEvent(timeEvent, () => this.waitingTime())
    this.onEvent(readyEvent, (payload) => this.readyPlayer(payload))
    this.onEvent(pingEvent, (payload) => this.pingPlayer(payload))
    
    this.role = "GameMaster"

    this.state = WAIT

    this.pings = new Map
    this.time = Date.now()
  }

  waitingTime () {
    if (this.state != WAIT) return;

    this.send(waitEvent)
  }

  readyPlayer ({ uuid }) {
    if (this.state != WAIT) return;

    this.players.add(uuid)
    this.pings.set(uuid, false)

    if (this.players.size == this.players_limit) {
      this.loadWorld()
      this.state = PLAY
      this.send(startEvent)
    }    
  }

  pingPlayer ({ uuid }) {
    this.pings.set(uuid, true)

    const allPings = Array.from(this.pings, ([name, value]) => value)
      .every(value => !!value)

    if(allPings) {
      for(let [key, value] of this.pings)
        this.pings.set(key, false)

      if(this.players_limit == 1)
        setTimeout(() => this.makeGameTick(), 0)
      else
        this.makeGameTick()
    }
  }

  makeGameTick() {
    this.send(gameTickEvent, {
      delta: Date.now() - this.time
    })
    this.time = Date.now()
  }

  loadWorld () {

    this.send(createBulletEvent, {
      uuid: Types.UUID.Def().rand(),
      position: {
        x: 296,
        y: 96
      },
      velocity: { x: -25*10, y: 0 },
      radius: 32,
      color: "Red"
    })

    this.send(createBulletEvent, {
      uuid: Types.UUID.Def().rand(),
      position: {
        x: 96,
        y: 416
      },
      velocity: { x: 45*10, y: -25*10 },
      radius: 32,
      color: "Green"
    })

    this.send(createBulletEvent, {
      uuid: Types.UUID.Def().rand(),
      position: {
        x: 256,
        y: 96
      },
      velocity: { x: 45*7, y: -25*7 },
      radius: 32,
      color: "Yellow"
    })

    for(let i = 7; i >= 0; i--){
      this.send(createBoxEvent, {
        entity: "Box",
        uuid: Types.UUID.Def().rand(),
        position: {
          column: 7,
          row: i
        }
      })

      this.send(createBoxEvent, {
        entity: "Box",
        uuid: Types.UUID.Def().rand(),
        position: {
          column: 0,
          row: i
        }
      })
    }

    for(let i = 6; i >= 1; i--){
      this.send(createBoxEvent, {
        entity: "Box",
        uuid: Types.UUID.Def().rand(),
        position: {
          column: i,
          row: 7
        }
      })

      this.send(createBoxEvent, {
        entity: "Box",
        uuid: Types.UUID.Def().rand(),
        position: {
          column: i,
          row: 0
        }
      })
    }
  }
}

module.exports = { GameMaster }