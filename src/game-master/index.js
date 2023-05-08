const { Member, Types } = require('@ellementul/uee-core')

const timeEvent = require('../events/time_event')
const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const createObjectEvent = require('../events/create_object_event')

const WAIT = "WaitingOfPlayers"
const PLAY = "Playing" 

class GameMaster extends Member {
  constructor() {
    super()
    this.players = new Set
    this.players_limit = 1

    this.onEvent(timeEvent, () => this.waitingTime())
    this.onEvent(readyEvent, (payload) => this.readyPlayer(payload))
    
    this.role = "GameMaster"

    this.state = WAIT

    this.answers = new Map
  }

  waitingTime () {
    if (this.state != WAIT) return;

    this.send(waitEvent)
  }

  readyPlayer ({ uuid }) {
    if (this.state != WAIT) return;

    this.players.add(uuid)

    if (this.players.size == this.players_limit) {
      this.state = PLAY
      this.send(startEvent)
      this.loadWorld()
    }
  }

  loadWorld () {

    this.send(createObjectEvent, {
      state: {
        uuid: Types.UUID.Def().rand(),
        x: 5,
        y: 5,
        dynamic: false,
        shape: {
          type: "Box",
          w: 5,
          h: 0.2
        }
      }
    })

    this.send(createObjectEvent, {
      state: {
        uuid: Types.UUID.Def().rand(),
        x: 5,
        y: 1.5,
        dynamic: true,
        shape: {
          type: "Box",
          w: 0.5,
          h: 0.5
        }
      }
    })
  }
}

module.exports = { GameMaster }