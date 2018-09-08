import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.clickCount = 0
    this.spaceSize = 10
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width, height } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    const boardSize = 3
    const group = this.add.group()
    // let xPlayer = this.add.sprite(0, 0, 'x')
    // let oPlayer = this.add.sprite(0, 0, 'o')
    for (let i = 0; i < boardSize; i++) {
      group.createMultiple({
        key: 'platform',
        repeat: boardSize - 1,
        setXY: {
          x: 0,
          y: i * 180,
          stepX: this.getPlatformSize() + this.spaceSize,
        },
      })
    }
    Phaser.Actions.IncX(group.getChildren(), 100)
    Phaser.Actions.IncY(group.getChildren(), 100)
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

  update () {

  }
}
