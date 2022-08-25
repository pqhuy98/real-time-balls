const { add, normalize, clip, mul } = require("../lib/linear_algebra")
const Player = require("./player")

class Game {
    constructor({ id }) {
        this.id = id
        this.players = {}
        this.connectedPlayer = {}
        this.disconnectedPlayer = {}
        this.step = 0

        // all public methods will trigger event handlers
        this.eventHandlers = []
        this._bootstrapPublicMethodHandlers()
    }

    get publicMethods() {
        return [
            this.addPlayer,
            this.playerConnect,
            this.playerDisconnect,
            this.serverTick,
        ]
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

    addPlayer({ playerId, name, unitCount }) {
        if (playerId in this.players) {
            throw new Error("Player is already connected!")
        }
        let player = new Player({
            id: playerId,
            name,
            unitCount: unitCount || 2,
        })
        this.players[player.id] = player
    }

    playerConnect({ playerId }) {
        this.connectedPlayer[playerId] = true
        delete this.disconnectedPlayer[playerId]
    }

    playerDisconnect({ playerId }) {
        delete this.connectedPlayer[playerId]
        // this.disconnectedPlayer[playerId] = true
        delete this.players[playerId]
    }

    serverTick(deltaT) {
        for (const playerId in this.players) {
            let player = this.players[playerId]
            for (const unit of player.units) {
                let radius = 2 / 2
                unit.pos = add(unit.pos, mul(unit.velocity, deltaT))
                if (unit.pos.x + radius > 100 || unit.pos.x - radius < 0) {
                    unit.velocity.x *= -1
                }
                if (unit.pos.y + radius > 100 || unit.pos.y - radius < 0) {
                    unit.velocity.y *= -1
                }
                unit.pos = {
                    x: clip(unit.pos.x, radius, 100 - radius),
                    y: clip(unit.pos.y, radius, 100 - radius),
                }
            }
        }
    }

    // Event controllers

    _bootstrapPublicMethodHandlers() {
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