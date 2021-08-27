const Unit = require("./unit")

class Player {
    constructor({ id, name, startingPos }) {
        this.id = id
        this.name = name
        this.unit = new Unit({ startingPos })
    }
}
module.exports = Player
