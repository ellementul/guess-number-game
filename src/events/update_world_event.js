const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "Moving",
  entity: "World"
}, true) 
module.exports = EventFactory(type)