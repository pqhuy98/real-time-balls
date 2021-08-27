const { add, normalize, clip } = require("../lib/linear_algebra")
const Player = require("./player")

class Game {
    constructor({ id }) {
        this.id = id
        this.players = {}
        this.connectedPlayer = {}
        this.disconnectedPlayer = {}
        this.step = 0

        // all public methods will trigger event handlers
        this.publicMethods = []
        this.eventHandlers = []
        this._bootstrapPublicMethodHandlers()
    }

    get dataAttributes() {
        return [
            "id",
            "players",
            "connectedPlayer",
            "disconnectedPlayer",
            "step",
        ]
    }

    addPlayer({ playerId, name }) {
        if (playerId in this.players) {
            throw new Error("Player is already connected!")
        }
        let seed = parseInt(playerId.slice(-9), 16)
        seed = seed ^ (seed >> 4)
        let player = new Player({
            id: playerId,
            name,
            startingPos: {
                x: seed % 100,
                y: (seed / 100) % 100,
            }
        })
        this.players[player.id] = player
    }

    playerMove({ playerId, dir }) {
        if (!(playerId in this.players)) return
        let unit = this.players[playerId].unit
        unit.pos = add(unit.pos, normalize(dir))
        unit.pos = {
            x: clip(unit.pos.x, 0, 100),
            y: clip(unit.pos.y, 0, 100),
        }
    }

    playerConnect({ playerId }) {
        this.connectedPlayer[playerId] = true
        delete this.disconnectedPlayer[playerId]
    }

    playerDisconnect({ playerId }) {
        delete this.connectedPlayer[playerId]
        this.disconnectedPlayer[playerId] = true
    }

    // Event controllers

    _bootstrapPublicMethodHandlers() {
        this.publicMethods = [
            this.addPlayer,
            this.playerMove,
            this.playerConnect,
            this.playerDisconnect,
        ]
        // wrap public methods by a event handler
        let _this = this
        for (const method of this.publicMethods) {
            this["__original__" + method.name] = method
            this[method.name] = (args) => {
                method.apply(this, [args])
                _this.step++
                for (const handler of this.eventHandlers) {
                    let { methodRegexp, handlerFn } = handler
                    if (handlerFn && methodRegexp.test(method.name)) {
                        handlerFn({
                            type: method.name,
                            args,
                            step: _this.step,
                        })
                    }
                }
            }
        }
    }

    registerEventHandler({ id, methodRegexp, handler }) {
        this.eventHandlers.push({ id, methodRegexp, handlerFn: handler })
    }

    deregisterEventHandler({ id }) {
        this.eventHandlers = this.eventHandlers.filter(handler => handler.id !== id)
    }

    applyEvent(event) {
        this[event.type](event.args)
    }

    getData() {
        let result = {}
        for (const attr of this.dataAttributes) {
            result[attr] = this[attr]
        }
        return result
    }
}

module.exports = Game