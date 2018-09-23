export default class Game {
  constructor (boardSize) {
    this.boardSize = boardSize
    this.x = new PlayerData(boardSize)
    this.o = new PlayerData(boardSize)
  }

  makeMove (character, i, j) {
    this[character].rows[i].push([j, i])
    this[character].columns[j].push([j, i])

    if (i === j) {
      this[character].mainDiagonal.push([j, i])
    }

    if (i + j === this.boardSize - 1) {
      this[character].secondaryDiagonal.push([j, i])
    }
  }

  getFillBoardlength () {
    const a = this.fillBoardLoop(this.x) + this.fillBoardLoop(this.o)
    return a
  }

  fillBoardLoop (char) {
    let boardLenght = 0

    for (let el in char.rows) {
      boardLenght += char.rows[el].length
    }
    return boardLenght
  }

  getMaxLegth (character, i, j) {
    return Math.max(
      this[character].rows[i].length,
      this[character].columns[j].length,
      this[character].mainDiagonal.length,
      this[character].secondaryDiagonal.length,
    )
  }
}

class PlayerData {
  constructor (boardSize) {
    this.rows = this.getRowsColumnsData(boardSize)
    this.columns = this.getRowsColumnsData(boardSize)
    this.mainDiagonal = []
    this.secondaryDiagonal = []
  }

  getRowsColumnsData (boardSize) {
    const object = {}
    for (let i = 0; i < boardSize; i++) {
      object[i] = []
    }
    return object
  }
}
