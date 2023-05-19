class TileMap {
  constructor(widthMap, heightMap, tileSize) {

    this.columnCount = Math.round(widthMap / tileSize)
    this.rowCount = Math.round(heightMap / tileSize)

    this.clear()
  }

  clear() {
    this.rows = []
    for(let i = 0; i < this.rowCount; i++) {

      const columns = []
      for(let j = 0; j < this.columnCount; j++)
        columns.push(new Tile)

      this.rows.push(columns)
    }
  }

  toTiledCoordinates({ x, y }) {
    const row = Math.round(x / tileSize)
    const column = Math.round(y / tileSize)

    return { column, row }
  }

  getTile({ column, row }) {
    return this.rows[row][column]
  }

  addBox({ uid, position: { column, row } }) {
    if(row >= this.rowCount || column >= this.columnCount)
      throw new TypeError("Out limit of Tile Map")

    const tile = this.getTile({ column, row })
    tile.wall = { uid }
  }
}

class Tile {
  constructor() {
    this.floor = null // Can change speed of character
    this.wall = null // Collison, HP and damage
  }
}

module.exports = { TileMap }