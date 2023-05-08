const { Member } = require('@ellementul/uee-core')

const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')

import World from '../pixi-render'

const WAIT = "WaitingOtherPlayers"
const LOAD = "Ready" 
const READY = "Ready" 

class Player extends Member {
  constructor() {
    super()

    this.state = WAIT
    
    this.onEvent(waitEvent, () => this.waitingPlayers())
    this.onEvent(startEvent, () => this.print('***Start Game***'))
  }

  waitingPlayers() {
    if(this.state == WAIT) {
      this.print('Loading world...')
      this.state = LOAD
      this.setupWorld()
    }
  }

  setupWorld() {
    this.world = new World(this.onEvent.bind(this))

    this.print('Wait for other players...')
      this.state = READY
      this.send(readyEvent, {
        uuid: this.uuid
      })
  }

  print() {
    console.log(...arguments)
  }
}

module.exports = { Player }