const { UnitedEventsEnvironment: UEE } = require('@ellementul/united-events-environment')
const { WsTransport } = require('@ellementul/uee-ws-browser-transport')

const { Ticker } = require('@ellementul/uee-timeticker')
const { GameMaster } = require('./game-master')
const { Player } = require('./game-player')
import World from './world'

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
      role: "World",
      memberConstructor: World
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
  membersList,
  // logging: payload => {
  //   if(payload.message.entity === "Player")
  //     console.log(payload.message)
  // },
  isShowErrors: true
})

const url = new URL(window.location.href)
const hostAddress = url.searchParams.get('host_address')
env.run({
  isHost: !hostAddress,
  signalServerAddress: "ws://127.0.0.1:8080",
})

url.searchParams.set('host_address', true)
// history.pushState({ isHost: true }, "Guess Game", url)
console.log(url.href)