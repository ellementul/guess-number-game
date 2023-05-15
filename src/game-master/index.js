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
      this.loadWorld()
      this.state = PLAY
      this.send(startEvent)
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