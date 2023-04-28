const { UnitedEventsEnvironment: UEE, WsTransport } = require('@ellementul/united-events-environment')
const { Ticker } = require('@ellementul/uee-timeticker')
const { GameMaster } = require('./src/game-master')
const { Player } = require('./src/game-player')

const cq = require('console-questions')

const membersList = {
  roles: [
    {
      role: "Ticker",
      memberConstructor: Ticker
    },
    {
      role: "GameMaster",
      memberConstructor: GameMaster
    },
    {
      role: "Player",
      memberConstructor: Player,
      local: true
    }
  ]
}

env = new UEE({
  Transport: WsTransport,
  membersList
})
cq.ask("Are you host?",
  { 
    callback: answer => { 
      env.run({
        isHost: answer == 'y',
        signalServerAddress: "ws://localhost:8080",
      })
    }
  }
)