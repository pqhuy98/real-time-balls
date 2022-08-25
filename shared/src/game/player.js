const { mul } = require("../lib/linear_algebra")
const Unit = require("./unit")

class Player {
    constructor({ id, name, unitCount, startingPos, startingVelocity }) {
        this.id = id
        this.name = name

        let seed = parseInt(id.slice(-9), 16)
        this.units = []
        for (let i = 0; i < unitCount; i++) {
            seed = (seed ^ (seed >> 5)) + (0x1337BEEF)
            let startingPos = {
                x: seed % 100,
                y: (seed / 100) % 100,
            }

            let startingVelocity = {
                x: ((seed / 10000) % 100) - 50,
                y: ((seed / 10000 / 100) % 100) - 50,
            }
            startingVelocity = mul(startingVelocity, 0.5)

            this.units.push(new Unit({
                startingPos,
                startingVelocity,
            }))
        }
    }
}
module.exports = Player
