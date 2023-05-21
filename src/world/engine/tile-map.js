import { calc, ipoint } from "@js-basics/vector";

class TileMap {
  constructor(widthMap, heightMap, tileSize) {

    this.tileSize = tileSize
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
    const row = Math.floor(x / this.tileSize)
    const column = Math.floor(y / this.tileSize)

    return { column, row }
  }

  getTile({ column, row }) {
    if(row >= this.rowCount || column >= this.columnCount)
      throw new TypeError(`Out limit of Tile Map, row: ${row}, column: ${column}`)

    return this.rows[row][column]
  }

  addBox({ uid, position: { column, row } }) {
    const tile = this.getTile({ column, row })
    tile.wall = { uid }
  }

  getCoordsVectors({ x, y }) {
    const { column, row } = this.toTiledCoordinates({ x, y })

    const right   = ipoint(((column + 1) * this.tileSize) - x,  0)
    const bottom  = ipoint(0,                                   ((row + 1) * this.tileSize) - y)
    const left    = ipoint((column * this.tileSize) - x,        0)
    const top     = ipoint(0,                                   (row * this.tileSize) - y)
    
    return [
      right,
      bottom,
      left,
      top
    ]
  }

  calcRatioDeepOfPenatrationToFullPath(coordVector, path) {
    const coordSign = coordVector.y === 0 ? Math.sign(coordVector.x) : Math.sign(coordVector.y)
    const coordProj = coordVector.y === 0 ? path.x : path.y

    return path.length / coordProj * coordSign
  }

  getCrosspoint({ lastPoint, nextPoint }) {
    const coordsVectors = this.getCoordsVectors(nextPoint)
    const path = ipoint(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y)

    
    let maxReverseVector = ipoint(0, 0)
    let normal = ipoint(0, 0)
    for (let direct in coordsVectors) {
      const dirVector = coordsVectors[direct]

      const ratio = this.calcRatioDeepOfPenatrationToFullPath(dirVector, path)

      if(ratio > 0)
        continue

      const reverseVector = calc(() => path * ratio)

      if(maxReverseVector.length < reverseVector.length) {
          maxReverseVector = reverseVector
          normal = dirVector
      }
    }

    return {
      crosspoint: calc(() => nextPoint + maxReverseVector),
      normal
    }
  }

  checkCollision({ lastPoint, nextPoint }) {
    const { column, row } = this.toTiledCoordinates({ x: nextPoint.x, y: nextPoint.y })
    const tile = this.getTile({ column, row })

    if(!tile.isWall())
      return { isCollision: false }

    const { crosspoint, normal} = this.getCrosspoint({ lastPoint, nextPoint })

    if(normal.x == 0 && normal.y == 0)
      return { isCollision: false }

    return {
      isCollision: true,
      wallUid: tile.wall.uid,
      crosspoint,
      reflectNormal: normal
    }
  }
}

class Tile {
  constructor() {
    this.floor = null // Can change speed of character
    this.wall = null // Collison, HP and damage
  }

  isWall() {
    return !!this.wall
  }
}

module.exports = { TileMap }