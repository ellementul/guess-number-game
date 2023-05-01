const { Member, Types } = require('@ellementul/uee-core')

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
    const answer = prompt("Your number?", Types.Index.Def(100).rand())
    this.answering(answer)
  }

  answering(answer) {
    let number = parseInt(answer)
    const typeNumber = Types.Index.Def(100)

    if(typeNumber.test(number))
      number = typeNumber.rand()

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

class Bot extends Player {

  waitingPlayers() {
    if(this.state == WAIT) {
      this.state = READY
      this.send(readyEvent, {
        uuid: this.uuid
      })
    }
  }

  asking() {
    this.answering()
  }

  answering() {
    const number = Types.Index.Def(100).rand()
    
    this.send(answerEvent, {
      uuid: this.uuid,
      state: number
    })
  }

  lose({ uuid }) {}

  win({ uuid }) {
    if(this.uuid == uuid)
      this.print("BOT: !!I won!!")
  }

  print() {
    console.log(...arguments)
  }
}

module.exports = { Player, Bot }