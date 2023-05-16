const { Member, Types } = require('@ellementul/uee-core')

const timeEvent = require('../events/time_event')
const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const createObjectEvent = require('../events/create_object_event')
const pingEvent = require('../events/ping_event')
const pongEvent = require('../events/pong_event')
const gameTickEvent = require('../events/game_tick_event')

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

    this.answers = new Map
    this.time = Date.now()
  }

  waitingTime () {
    if (this.state != WAIT) return;

    this.send(waitEvent)
  }

  readyPlayer ({ uuid }) {
    if (this.state != WAIT) return;

    this.players.add(uuid)
    this.answers.set(uuid, false)

    if (this.players.size == this.players_limit) {
      // this.loadWorld()
      this.state = PLAY
      this.send(startEvent)
    }    
  }

  pingPlayer ({ uuid }) {
    this.answers.set(uuid, true)

    const allPings = Array.from(this.answers, ([name, value]) => value)
      .every(value => !!value)

    if(allPings) {
      this.send(gameTickEvent, {
        delta: Date.now() - this.time
      })

      for(let [key, value] of this.answers)
        this.answers.set(key, false)

      this.time = Date.now()
      this.send(pongEvent)
    }
  }

  loadWorld () {

    this.send(createObjectEvent, {
      state: {
        uuid: Types.UUID.Def().rand(),
        position: {
          x: 60,
          y: 60
        },
        radius: 30
      }
    })
  }
}

module.exports = { GameMaster }