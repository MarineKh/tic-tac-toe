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
      for (let j = 0; j < 3; ++j) {
        const platformContainer = this.add.container(
          i * (this.getPlatformSize() + this.spaceSize),
          j * (this.getPlatformSize() + this.spaceSize)
        )
        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Rectangle(
            -platform.width / 2,
            -platform.height / 2,
            platform.width,
            platform.height
          ),
          Phaser.Geom.Rectangle.Contains
        )
        platformContainer.add(platform)
        this.boardContainer.add(platformContainer)
        platformContainer.setData({ i, j })
      }
    }
    this.input.on('gameobjectdown', this.drawSymbol.bind(this), false)

    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
  }

  drawSymbol (pointer, target) {
    // this.clickCount++
    // this.character = this.clickCount % 2 === 1 ? 'x' : 'o'
    const x = this.add.image(0, 0, 'x')
    const [i, j] = target.getData(['i', 'j'])

    target.add(x)
    target.removeInteractive()

    this.findWinner('x', i, j)
    this.ai()
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
    // console.log(this.gameData.getCurrentBoard())
  }

  ai () {
    const currentBoard = this.gameData.getCurrentBoard()
    if (currentBoard.length === 0 || this.win) {
      return
    }
    let random = Math.floor(Math.random() * currentBoard.length)
    let countBoard
    this.boardContainer.list.forEach((item, index) => {
      if (
        currentBoard[random] &&
        item.data.list.i === currentBoard[random][0] &&
        item.data.list.j === currentBoard[random][1]
      ) {
        countBoard = index
      }
    })

    const o = this.add.image(0, 0, 'o')
    this.boardContainer.list[countBoard].add(o).removeInteractive()

    this.findWinner('o', currentBoard[random][0], currentBoard[random][1])
  }

  gameResult (res) {
    const result = this.add.text(0, 100, res, {
      font: '25px Arial',
      fill: '#fff'
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
