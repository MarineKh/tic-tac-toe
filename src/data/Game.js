export default class Game {
  constructor (boardSize) {
    this.boardSize = boardSize
    this.x = new PlayerData(boardSize)
    this.o = new PlayerData(boardSize)
  }

  makeMove (character, i, j) {
    this[character].rows[i].push([i, j])
    this[character].columns[j].push([i, j])

    if (i === j) {
      this[character].mainDiagonal.push([i, j])
    }

    if (i + j === this.boardSize - 1) {
      this[character].secondaryDiagonal.push([i, j])
    }
  }

  getFilledBoardlength () {
    return this.filledBoardLoop(this.x) + this.filledBoardLoop(this.o)
  }

  filledBoardLoop (char) {
    let boardLength = 0

    for (let el in char.rows) {
      boardLength += char.rows[el].length
    }
    return boardLength
  }

  board (n) {
    const board = []
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        board.push([i, j])
      }
    }
    return board
  }

  delBordEl (char, boardArr) {
    for (let el in char.rows) {
      char.rows[el].forEach(item => {
        // let index = boardArr.findIndex(a =>
        //   a.every((val, i) => char.rows[el] === val)
        // )
        // if (index !== -1) {
        //   boardArr.splice(index, 1)
        // }
        // console.log(char.rows[el])
        boardArr.forEach(el => {
          if (el[0] === item[0] && el[1] === item[1]) {
            boardArr.splice(boardArr.indexOf(el), 1)
          }
        })
      })
    }
  }

  getCurrentBoard () {
    const board = this.board(this.boardSize)
    this.delBordEl(this.x, board)
    this.delBordEl(this.o, board)
    return board
  }

  getMaxLegth (character, i, j) {
    return Math.max(
      this[character].rows[i].length,
      this[character].columns[j].length,
      this[character].mainDiagonal.length,
      this[character].secondaryDiagonal.length
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
