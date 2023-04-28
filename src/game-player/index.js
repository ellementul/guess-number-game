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

const WAIT = "WaitingOtherPlayers"
const READY = "Ready" 

class Player extends Member {
  constructor() {
    super()

    this.state = WAIT
    
    this.onEvent(waitEvent, () => this.waitingPlayers())
    this.onEvent(startEvent, () => this.print('***Start Game***'))
    this.onEvent(askEvent, () => this.asking())
    this.onEvent(loseEvent, payload => this.lose(payload))
    this.onEvent(winEvent, payload => this.win(payload))
  }

  waitingPlayers() {
    if(this.state == WAIT) {
      this.print('Wait for other players...')
      this.state = READY
      this.send(readyEvent, {
        uuid: this.uuid
      })
    }
  }

  asking() {
    cq.ask("Your number?", { callback: answer => this.answering(answer) })
  }

  answering(answer) {
    let number = parseInt(answer)
    
    if(isNaN(number))
      number = Types.Index.Def(100).rand()

    this.print('Your number is ', number)

    this.send(answerEvent, {
      uuid: this.uuid,
      state: number
    })
  }

  lose({ uuid }) {
    if(this.uuid == uuid)
      this.print("))You're loser((")
  }

  win({ uuid }) {
    if(this.uuid == uuid)
      this.print("!!You're winner!!")
  }

  print() {
    console.log(...arguments)
  }
}

module.exports = { Player }