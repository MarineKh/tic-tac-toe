import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'
import Game from '../data/Game'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.boardSize = 3
    this.clickCount = 0
    this.spaceSize = 10
    this.gameData = new Game(this.boardSize)
    this.containersMatix = []
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    // main game
    this.boardContainer = this.add.container(0, 0)
    for (let i = 0; i < 3; ++i) {
      this.containersMatix.push([])
      for (let j = 0; j < 3; ++j) {
        const platformContainer = this.add.container(
          i * (this.getPlatformSize() + this.spaceSize),
          j * (this.getPlatformSize() + this.spaceSize),
        )
        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Rectangle(
            -platform.width / 2,
            -platform.height / 2,
            platform.width,
            platform.height,
          ),
          Phaser.Geom.Rectangle.Contains,
        )
        platformContainer.add(platform)
        this.boardContainer.add(platformContainer)
        platformContainer.setData({ i, j })
        this.containersMatix[i].push(platformContainer)
      }
    }
    this.input.on('gameobjectdown', this.drawSymbol.bind(this), false)

    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
  }

  drawSymbol (pointer, target) {
    const x = this.add.image(0, 0, 'x')
    const [i, j] = target.getData(['i', 'j'])
    target.add(x).removeInteractive()

    const a = this.findWinner('x', i, j)
    if (a < 9 && !this.win) {
      this.ai()
    }
  }

  findWinner (char, i, j) {
    this.gameData.makeMove(char, i, j)
    const maxLength = this.gameData.getMaxLegth(char, i, j)
    const getFilledBoardlength = this.gameData.getFilledBoardlength()

    if (getFilledBoardlength === this.boardSize * this.boardSize) {
      this.noWinner()
    }
    if (maxLength === this.boardSize) {
      this.winner(char)
      this.win = true
    }
    this.gameData.getCurrentBoard()
    return getFilledBoardlength
  }

  ai () {
    let i
    let j

    const oProbWin = this.probableWin('o')
    const matrix = this.getMatrix()

    if (oProbWin && matrix[oProbWin.i][oProbWin.j] === null) {
      i = oProbWin.i
      j = oProbWin.j
    } else {
      const xProbWin = this.probableWin('x')
      console.log(xProbWin, 'xProbWin')
      if (xProbWin && matrix[xProbWin.i][xProbWin.j] === null) {
        i = xProbWin.i
        j = xProbWin.j
      } else {
        if (matrix[1][1] === null) {
          i = 1
          j = 1
        } else {
          const corners = this.getCorners(matrix)
          if (corners) {
            i = corners.i
            j = corners.j
          } else {
            const random = this.getRandom(matrix)
            i = random.i
            j = random.j
          }
        }
      }
    }
    console.log(i, j)
    const o = this.add.image(0, 0, 'o')
    const container = this.containersMatix[j][i]

    const [containerI, containerJ] = container.getData(['i', 'j'])

    container.add(o).removeInteractive()

    this.findWinner('o', containerI, containerJ)

    // console.log('o', this.gameData.o)
    // console.log('x', this.gameData.x)
  }

  getRandom (matrix) {
    const i = Math.floor(Math.random() * this.boardSize)
    const j = Math.floor(Math.random() * this.boardSize)
    if (matrix[i][j] === null) {
      return { i, j }
    }
    return this.getRandom(matrix)
  }

  getMatrix () {
    const matrix = []
    const array = new Array(this.boardSize).fill(null)
    for (let i = 0; i < this.boardSize; i++) {
      matrix.push([...array])
    }
    this.setMatrixLetter(matrix, 'o')
    this.setMatrixLetter(matrix, 'x')
    return matrix
  }

  setMatrixLetter (matrix, letter) {
    for (let i in this.gameData[letter].rows) {
      const arrayJ = this.gameData[letter].rows[i]
      if (arrayJ.length) {
        for (let j = 0; j < arrayJ.length; j++) {
          matrix[i][arrayJ[j].j] = letter
        }
      }
    }
  }

  getCorners (matrix) {
    if (matrix[0][0] === null) {
      return { i: 0, j: 0 }
    }
    if (matrix[0][2] === null) {
      return { i: 0, j: 2 }
    }
    if (matrix[2][2] === null) {
      return { i: 2, j: 2 }
    }
    if (matrix[2][0] === null) {
      return { i: 2, j: 0 }
    }
    return null
  }
  probableWin (char) {
    const coordsColumn = this.columnRowsCheck(char, 'columns', 'i')
    if (coordsColumn) {
      console.log('coordsColumn')
      return coordsColumn
    }

    const coordsRow = this.columnRowsCheck(char, 'rows', 'j')
    if (coordsRow) {
      console.log('coordsRow')
      return coordsRow
    }

    const coordMainDiag = this.mainDiagonalCheck(char)
    if (coordMainDiag) {
      console.log('coordMainDiag')
      return coordMainDiag
    }

    const coordSecondDiag = this.secondaryDiagonalCheck(char)
    if (coordSecondDiag) {
      console.log('coordSecondDiag')
      return coordSecondDiag
    }
  }

  columnRowsCheck (char, rowOrColumn, iOrJ) {
    const charData = this.gameData[char][rowOrColumn]
    for (let key in charData) {
      const charValue = charData[key]
      if (charValue.length === 2) {
        const probableWinChar = 3 - (charValue[0][iOrJ] + charValue[1][iOrJ])
        const iOrJ2 = iOrJ === 'i' ? 'j' : 'i'
        return { [iOrJ]: probableWinChar, [iOrJ2]: charValue[0][iOrJ2] }
      }
    }
    return null
  }

  mainDiagonalCheck (char) {
    const mainDiagonal = this.gameData[char].mainDiagonal

    if (mainDiagonal.length === 2) {
      const probableWinMainDiag = 3 - (mainDiagonal[0].i + mainDiagonal[1].i)
      return { i: probableWinMainDiag, j: probableWinMainDiag }
    }
    return null
  }

  secondaryDiagonalCheck (char) {
    const secondDiagonal = this.gameData[char].secondaryDiagonal

    if (secondDiagonal.length === 2) {
      const probableWinSecondI = 3 - (secondDiagonal[0].i + secondDiagonal[1].i)
      const probableWinSecondJ = 3 - (secondDiagonal[0].j + secondDiagonal[1].j)
      return { i: probableWinSecondI, j: probableWinSecondJ }
    }
    return null
  }

  gameResult (res) {
    const result = this.add.text(0, 100, res, {
      font: '25px Arial',
      fill: '#fff',
    })
    result.setStroke('#292929', 16)
    result.setShadow(2, 2, '#743f4a', 2, true, true)
    result.setX((gameConfig.width - result.width) / 2)
  }

  noWinner () {
    this.gameResult('No Winner')
  }

  winner (char) {
    this.gameResult(`The winner is ${char}`)
    this.scene.pause(SCENE_GAME)
  }

  update () {}
}
