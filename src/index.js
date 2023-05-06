const { UnitedEventsEnvironment: UEE } = require('@ellementul/united-events-environment')
const { WsTransport } = require('@ellementul/uee-ws-browser-transport')

const { Ticker } = require('@ellementul/uee-timeticker')
const { GameMaster } = require('./game-master')
const { Player } = require('./game-player')

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
  membersList,
  isShowErrors: true
})

const url = new URL(window.location.href)
const hostAddress = url.searchParams.get('host_address')
env.run({
  isHost: !hostAddress,
  signalServerAddress: "ws://localhost:8080",
})

url.searchParams.set('host_address', true)
alert(url)