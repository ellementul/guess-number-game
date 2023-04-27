const { Member } = require('@ellementul/uee-core')

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

class GameMaster extends Member {
  constructor() {
    super()
    this.players = new Set
    this.min_players_limit = 2

    this.onEvent(timeEvent, () => this.waitingTime())
    this.onEvent(readyEvent, (payload) => this.readyPlayer(payload))
    this.onEvent(answerEvent, (payload) => this.answerPlayer(payload))
    
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

    if (this.players.size >= this.min_players_limit) {
      this.state = PLAY
      this.send(startEvent)
      this.askPlayer()
    }
  }

  askPlayer() {
    if (this.state != PLAY) return;
    this.answers.clear()

    this.send(askEvent)
  }

  answerPlayer({ uuid, state }) {
    if (this.state != PLAY) return;

    this.answers.set(uuid, state)

    if(this.areAllAnswers()) {
      this.whoWins()
      this.askPlayer()
    }
  }

  whoWins() {
    
    const winners = this.calculateWinners()
    
    this.players.forEach(player => {
      if(winners.has(player))
        this.send(winEvent, {
          uuid: player
        })
      else
        this.send(loseEvent, {
          uuid: player
        })
    })
  }

  areAllAnswers() {
    return [...this.players].every(playerUuid => this.answers.has(playerUuid))
  }

  calculateWinners() {
    const allNumbers = [...this.answers.values()]
    const maxNumber = Math.max(...allNumbers)
    const minWinNumber = Math.ceil(maxNumber / 2)
    
    const winPlayers = new Set
    let winAnswer = maxNumber
    
    for ( let [player, answer] of this.answers) {
      if(answer >= minWinNumber && winAnswer >= answer) {
        if(winAnswer > answer)
          winPlayers.clear()

        winPlayers.add(player)
        winAnswer = answer
      }
    }

    return winPlayers
  }
}

module.exports = { GameMaster }