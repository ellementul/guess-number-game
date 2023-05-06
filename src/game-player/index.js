const { Member } = require('@ellementul/uee-core')

const timeEvent = require('../events/time_event')
const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const updateWorldEvent = require('../events/update_world_event')

import WorldFactory from '../pixi-render'

const WAIT = "WaitingOtherPlayers"
const LOAD = "Ready" 
const READY = "Ready" 

class Player extends Member {
  constructor() {
    super()

    this.state = WAIT
    
    this.onEvent(waitEvent, () => this.waitingPlayers())
    this.onEvent(startEvent, () => this.print('***Start Game***'))
    this.onEvent(updateWorldEvent, payload => this.updateWorld(payload))
  }

  waitingPlayers() {
    if(this.state == WAIT) {
      this.print('Loading world...')
      this.state = LOAD
      WorldFactory()
      .then(world => this.setupWorld(world))
      .reject(error => this.print('Loading error:', error))
    }
  }

  setupWorld(world) {
    this.world = world

    this.print('Wait for other players...')
      this.state = READY
      this.send(readyEvent, {
        uuid: this.uuid
      })
  }

  updateWorld(payload) {
    this.world.update(payload)
  }

  print() {
    console.log(...arguments)
  }
}

module.exports = { Player }