const { Provider, Types } = require('@ellementul/uee-core')
const { GameMaster } = require('./index')

describe('GameMaster', () => {

  test('constructor', () => {
    const gameMaster = new GameMaster
    expect(gameMaster).toBeDefined();
  });

  test('wait event', () => {

    // Member connect to test provider
    const provider = new Provider
    const gameMaster = new GameMaster
    gameMaster.setProvider(provider)

    // Subscribe to testing event
    const waitEvent = require('../events/wait_event')
    const waitEventCallback = jest.fn()
    provider.onEvent(waitEvent, waitEventCallback)

    // Run the event to has to run the testing event
    const timeEvent = require('../events/time_event')
    provider.sendEvent(timeEvent.create())

    // Check calling of the testing event
    expect(waitEventCallback).toHaveBeenCalled();
  });

  test('coonecting of players', () => {

    // Member connect to test provider
    const provider = new Provider
    const gameMaster = new GameMaster
    gameMaster.setProvider(provider)

    // Subscribe to testing event
    const startEvent = require('../events/game_start_event')
    const startEventCallback = jest.fn()
    provider.onEvent(startEvent, startEventCallback)

    // Run the event to has to run the testing event
    const readyEvent = require('../events/player_ready_event')
    provider.sendEvent(readyEvent.create())
    provider.sendEvent(readyEvent.create())

    // Check calling of the testing event
    expect(startEventCallback).toHaveBeenCalledTimes(1);

    //End of waiting of players
    const waitEvent = require('../events/wait_event')
    const waitEventCallback = jest.fn()
    provider.onEvent(waitEvent, waitEventCallback)

    // Run the event to has to run the testing event
    const timeEvent = require('../events/time_event')
    provider.sendEvent(timeEvent.create())
    provider.sendEvent(readyEvent.create())

    // Check calling of the testing event
    expect(waitEventCallback).toHaveBeenCalledTimes(0)
    expect(startEventCallback).toHaveBeenCalledTimes(1)
  });

  test('asking', () => {

    // Member connect to test provider
    const provider = new Provider
    const gameMaster = new GameMaster
    gameMaster.setProvider(provider)

    // Subscribe to testing event
    const askEvent = require('../events/game_ask_event')
    const askEventCallback = jest.fn()
    provider.onEvent(askEvent, askEventCallback)

    // Run the event to has to run the testing event
    const readyEvent = require('../events/player_ready_event')
    provider.sendEvent(readyEvent.create())
    provider.sendEvent(readyEvent.create())

    // Check calling of the testing event
    expect(askEventCallback).toHaveBeenCalledTimes(1);
  });

  test('answer of players', () => {

    // Member connect to test provider
    const provider = new Provider
    const gameMaster = new GameMaster
    gameMaster.setProvider(provider)

    // Subscribe to testing event
    const askEvent = require('../events/game_ask_event')
    const askEventCallback = jest.fn()
    provider.onEvent(askEvent, askEventCallback)

    // Players are ready
    const onePlayerUuid = Types.UUID.Def().rand()
    const twoPlayerUuid = Types.UUID.Def().rand()
    const readyEvent = require('../events/player_ready_event')
    provider.sendEvent({
      ...readyEvent.create(),
      uuid: onePlayerUuid
    })
    provider.sendEvent({
      ...readyEvent.create(),
      uuid: twoPlayerUuid
    })

    // Players are giving answers
    const answerEvent = require('../events/player_answer_event')
    provider.sendEvent({
      ...answerEvent.create(),
      uuid: onePlayerUuid
    })
    provider.sendEvent({
      ...answerEvent.create(),
      uuid: twoPlayerUuid
    })

    // Check calling of the testing event
    expect(askEventCallback).toHaveBeenCalledTimes(2);
  });

  test('win and lose', () => {

    // Member connect to test provider
    const provider = new Provider
    const gameMaster = new GameMaster
    gameMaster.setProvider(provider)

    // Subscribe to testing event
    const winEvent = require('../events/player_won_event')
    const loseEvent = require('../events/player_lost_event')
    const winEventCallback = jest.fn()
    const loseEventCallback = jest.fn()
    provider.onEvent(winEvent, winEventCallback)
    provider.onEvent(loseEvent, loseEventCallback)

    // Players are ready
    const onePlayerUuid = Types.UUID.Def().rand()
    const twoPlayerUuid = Types.UUID.Def().rand()
    const readyEvent = require('../events/player_ready_event')
    provider.sendEvent({
      ...readyEvent.create(),
      uuid: onePlayerUuid
    })
    provider.sendEvent({
      ...readyEvent.create(),
      uuid: twoPlayerUuid
    })

    // Players are giving answers
    const answerEvent = require('../events/player_answer_event')
    provider.sendEvent({
      ...answerEvent.create(),
      uuid: onePlayerUuid,
      state: 25
    })
    provider.sendEvent({
      ...answerEvent.create(),
      uuid: twoPlayerUuid,
      state: 26
    })

    // Check calling of the testing event
    expect(winEventCallback).toHaveBeenCalledWith({
      ...winEvent.create(),
      uuid: onePlayerUuid
    });
    expect(loseEventCallback).toHaveBeenCalledWith({
      ...loseEvent.create(),
      uuid: twoPlayerUuid
    });
  });
});