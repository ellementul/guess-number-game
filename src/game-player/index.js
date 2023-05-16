const { Member } = require('@ellementul/uee-core')

const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const pingEvent = require('../events/ping_event')
const gameTickEvent = require('../events/game_tick_event')

import World from '../pixi-render'

const WAIT = "WaitingOtherPlayers"
const LOAD = "Ready" 
const READY = "Ready" 

class Player extends Member {
  constructor() {
    super()

    this.state = WAIT
    
    this.onEvent(waitEvent, () => this.waitingPlayers())
    this.onEvent(startEvent, () => this.startGame())
    this.onEvent(gameTickEvent, payload => this.gameTick(payload))

    this.setupFPSWidget()
  }

  setupFPSWidget() {
    this.maxDelta = 0
    this.averageDelta = 0

    setInterval(() => this.print(this.averageDelta.toFixed(2), this.maxDelta), 250)


    this.message = document.createElement("div")
    this.message.innerHTML = "Empty"

    var theFirstChild = document.body.firstChild;
    document.body.insertBefore(this.message, theFirstChild);
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

  startGame() {
    this.print('***Start Game***')
    this.send(pingEvent, {
      uuid: this.uuid
    })
  }

  gameTick({ delta }) {
    this.send(pingEvent, {
      uuid: this.uuid
    })

    this.averageDelta = (this.averageDelta + delta) * 0.5

    if (this.maxDelta == 0)
      this.maxDelta = 1
    else if(delta > this.maxDelta)
      this.maxDelta = delta
  }

  print() {
    this.message.innerHTML = `${[...arguments].join(', ')}`
  }
}

module.exports = { Player }