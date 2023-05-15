class SectionCoordinates {
  constructor(width, height) {
    this.mapWidth = width
    this.mapHeight = height
    this.sizeSection = 1

    this.columnCount = Math.round(this.mapWidth / this.sizeSection)
    this.rowsCount = Math.round(this.mapHeight / this.sizeSection)

    this.tiles = []
  }

  clear() {
    this.tiles = []
  }
  
  transformCoordinateX(x) {
    return Math.floor(x / this.sizeSection)
  }

  transformCoordinateY(y) {
    return Math.floor(y / this.sizeSection)
  }

  getSection(column, row) {
    if(!this.tiles[column + row * this.columnCount])
      this.tiles[column + row * this.columnCount] = new Set

    return this.tiles[column + row * this.columnCount]
  }

  upsert(uid, position) {
    const column = this.transformCoordinateX(position.x)
    const row = this.transformCoordinateX(position.x)
    const section = this.getSection(column, row)
    section.add(uid)
  }

  getObjectListByTile(row, colum) {

  }

  getTileByObject(uid) {
    
  }

  getNearerObjects(uuid) {

  }
}

module.exports = { SectionCoordinates }