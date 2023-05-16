const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Player",
  state: "Pong",
})
module.exports = EventFactory(type)