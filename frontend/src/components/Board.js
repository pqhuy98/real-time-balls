import { Unit } from "./Unit"

export function Board({ game, playerId }) {
    let units = []
    if (game) {
        for (const playerId in game.players) {
            let player = game.players[playerId]
            for (const unit of player.units) {
                units.push({
                    owner: player,
                    unit,
                })
            }
        }
    }

    return <div style={styles.container}>
        {units.map((unit) => <Unit
            unit={unit.unit}
            isMine={unit.owner.id === playerId}
        />)}
    </div>
}

const styles = {
    container: {
        position: "relative",
        width: "100vmin",
        height: "100vmin",
        backgroundColor: "black",
        margin: "auto",
        overflow: "hidden",
    }
}