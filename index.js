const { UnitedEventsEnvironment: UEE, WsTransport } = require('@ellementul/united-events-environment')
const { Ticker } = require('@ellementul/uee-timeticker')
const membersList = {
  roles: [
    {
      role: "Ticker",
      memberConstructor: Ticker
    }
  ]
}

env = new UEE({
  Transport: WsTransport,
  membersList,
  logging: console.log
})
env.run({
  isHost: true,
  signalServerAddress: "ws://localhost:8080",
})