import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.clickCount = 0
    this.spaceSize = 10
    this.matrix = []
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width, height } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    this.drawBoard()
    // reset button
    const resetButton = this.add.text(0, 40, 'Reset', { fill: '#fff' }).setInteractive()
    resetButton.setX((gameConfig.width - resetButton.width) / 2)
    resetButton.on('pointerdown', () => this.resetGame())

    // players and score text
    const playerX = this.add.text(100, 80, 'PLAYER(X)')
    this.playerXWinCount = this.add.text(130, 110, '0', { fontSize: 20, fontStyle: 'bold' })

    const playerO = this.add.text(400, 80, 'PLAYER(O)')
    this.playerOWinCount = this.add.text(430, 110, '0', { fontSize: 20, fontStyle: 'bold' })

    const tie = this.add.text(0, 80, 'TIE')
    this.tieCount = this.add.text(0, 110, '0', { fontSize: 20, fontStyle: 'bold' })
    tie.setX((gameConfig.width - tie.width) / 2)
    this.tieCount.setX((gameConfig.width - tie.width) / 2 + 10)
  }

  drawBoard () {
    const boardSize = 3
    const group = this.add.group()

    const boardLeft = (gameConfig.width - (3 * this.getPlatformSize() + 2 * this.spaceSize)) / 2
    const boardTop = (gameConfig.height - (3 * this.getPlatformSize() + 2 * this.spaceSize)) / 2

    for (let i = 0; i < boardSize; i++) {
      // this.matrix.push([])

      // this.matrix[i] = null
      group.createMultiple({
        key: 'platform',
        repeat: boardSize - 1,
        setXY: {
          x: 0,
          y: i * (this.getPlatformSize() + this.spaceSize),
          stepX: this.getPlatformSize() + this.spaceSize,
        },
      })
      // this.x = boardLeft + i * this.getPlatformSize() + i * this.spaceSize + this.getPlatformSize() / 2
      // this.y = boardTop + i * this.getPlatformSize() + i * this.spaceSize + this.getPlatformSize() / 2
      this.x = 130
      this.y = 230
    }

    console.log(this.matrix)
    Phaser.Actions.IncX(group.getChildren(), this.x)
    Phaser.Actions.IncY(group.getChildren(), this.y)

    let children = group.getChildren()
    for (let i = 0; i < children.length; i++) {
      children[i].setInteractive()
      children[i].once('pointerdown', () => this.drawSymbol(children[i].x, children[i].y, this.getPlatformSize()))
    }
  }
  resetGame () {
    this.scene.restart()
  }

  getXSize () {
    this.xImg = this.add.image(0, 0, 'x')
    const { width, height } = this.xImg
    this.xImg.destroy()
    return width
  }
  getOSize () {
    this.oImg = this.add.image(0, 0, 'o')
    const { width, height } = this.oImg
    this.oImg.destroy()
    return width
  }

  drawSymbol (platformX, platformY, platformSize) {
    this.clickCount++

    const textX = platformX + (platformSize - this.getXSize()) / 2 - platformSize / 2
    const textY = platformY + (platformSize - this.getXSize()) / 2 - platformSize / 2

    if (this.clickCount % 2 === 1) {
      this.symbol = this.add.image(textX, textY, 'x')
    } else {
      this.symbol = this.add.image(textX, textY, 'o')
    }
  }

  // drawBoard = (squareSize) => {
  //   this.matrix = []
  //   const spaceSize = 10
  //   const boardLeft = (gameConfig.width - (3 * this.platformSize + 2 * spaceSize)) / 2
  //   const boardTop = (gameConfig.height - (3 * this.platformSize + 2 * spaceSize)) / 2
  //   for (let i = 0; i < 3; i++) {
  //     this.matrix.push([])
  //     for (let j = 0; j < 3; j++) {
  //       this.matrix[i][j] = null
  //       const x = boardLeft + j * this.platformSize + j * spaceSize + this.platformSize / 2
  //       const y = boardTop + i * this.platformSize + i * spaceSize + this.platformSize / 2
  //       const square = this.add.sprite(x, y, 'platform').setInteractive()
  //       square.once('pointerdown', () => this.drawSymbol(x, y, this.platformSize, i, j))
  //     }
  //   }
  // }

  // drawSymbol = (squareX, squareY, squareSize, i, j) => {
  //   this.clickCount++
  //   const symbol = this.clickCount % 2 === 1 ? 'X' : 'O'
  //   this.matrix[i][j] = symbol

  //   this.text = this.add.text(0, 0, symbol, { fontSize: 80, fontStyle: 'bold', color: '#fff' })
  //   const { width, height } = this.text
  //   const textX = squareX + (squareSize - width) / 2 - squareSize / 2
  //   const textY = squareY + (squareSize - height) / 2 - squareSize / 2
  //   this.text.x = textX
  //   this.text.y = textY
  // }
  // checkWinner = () => {
  //   let matrix = this.matrix
  //   // check rows
  //   for (let i = 0, j = 0; i <= 2; i++) {
  //     if (matrix[i][j] && matrix[i][j] === matrix[i][j + 1] && matrix[i][j + 1] === matrix[i][j + 2]) {
  //       if (matrix[i][j] === 'X') {
  //         console.log('x win')
  //         let setXscore = ++this.scoreX
  //         localStorage.setItem('xKey', setXscore)
  //         this.updateXScore()
  //         // this.resetGame()
  //       } else {
  //         console.log('o win')
  //         let setOscore = ++this.scoreO
  //         localStorage.setItem('oKey', setOscore)
  //         this.updateOScore()
  //         // this.resetGame()
  //       }
  //     }
  //   }
  //   // check columns
  //   for (let i = 0, j = 0; i <= 2; i++) {
  //     if (matrix[j][i] && matrix[j][i] === matrix[j + 1][i] && matrix[j + 1][i] === matrix[j + 2][i]) {
  //       if (matrix[j][i] === 'X') {
  //         console.log('x win')
  //         let setXscore = ++this.scoreX
  //         localStorage.setItem('xKey', setXscore)
  //         this.updateXScore()
  //         // this.resetGame()
  //       } else {
  //         console.log('o win')
  //         let setOscore = ++this.scoreO
  //         localStorage.setItem('oKey', setOscore)
  //         this.updateOScore()
  //         // this.resetGame()
  //       }
  //     }
  //   }
  //   // check diagonals
  //   if (matrix[0][0] && matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
  //     if (matrix[0][0] === 'X') {
  //       console.log('x win')
  //       let setXscore = ++this.scoreX
  //       localStorage.setItem('xKey', setXscore)
  //       this.updateXScore()
  //       // this.resetGame()
  //     } else {
  //       console.log('o win')
  //       let setOscore = ++this.scoreO
  //       localStorage.setItem('oKey', setOscore)
  //       this.updateOScore()
  //       // this.resetGame()
  //     }
  //   } else if (matrix[0][2] && matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
  //     if (matrix[0][2] === 'X') {
  //       console.log('x win')
  //       let setXscore = ++this.scoreX
  //       localStorage.setItem('xKey', setXscore)
  //       this.updateXScore()
  //       // this.resetGame()
  //     } else {
  //       console.log('o win')
  //       let setOscore = ++this.scoreO
  //       localStorage.setItem('oKey', setOscore)
  //       this.updateOScore()
  //       // this.resetGame()
  //     }
  //   }
  // }
  update () {

  }
}
