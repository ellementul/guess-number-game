const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Question",
  state: "Your number?"
}, true) 
module.exports = EventFactory(type)