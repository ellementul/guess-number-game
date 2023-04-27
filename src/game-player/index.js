const { Member, Types } = require('@ellementul/uee-core')
const cq = require('console-questions')

const timeEvent = require('../events/time_event')
const waitEvent = require('../events/wait_event')
const readyEvent = require('../events/player_ready_event')
const startEvent = require('../events/game_start_event')
const askEvent = require('../events/game_ask_event')
const answerEvent = require('../events/player_answer_event')
const winEvent = require('../events/player_won_event')
const loseEvent = require('../events/player_lost_event')

const WAIT = "WaitingOfPlayers"
const PLAY = "Playing" 

class Player extends Member {
  constructor() {
    super()
    
    this.onEvent(waitEvent, () => this.waitingPlayers())
    this.onEvent(askEvent, () => this.asking())
  }

  waitingPlayers() {
    this.send(readyEvent, {
      uuid: this.uuid
    })
  }

  asking() {
    cq.ask("Your number?", { callback: answer => this.answering(answer) })
  }

  answering(answer) {
    let number = parseInt(answer)
    
    if(isNaN(number))
      number = Types.Index.Def(100).rand()

    console.log('Your number is ', number)

    this.send(answerEvent, {
      uuid: this.uuid,
      state: number
    })
  }
}

module.exports = { Player }