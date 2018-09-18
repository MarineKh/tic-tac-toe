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
      }
    }
    this.input.on('gameobjectdown', this.drawSymbol, this)
    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2

    // // play button
    // this.playBtn = this.add.image(0, 0, 'playBtn').setInteractive()
    // this.playBtn.setX(gameConfig.width / 2)
    // this.playBtn.setY(gameConfig.width / 2)
  }

  drawSymbol (pointer, target) {
    this.clickCount++
    this.character = this.clickCount % 2 === 1 ? 'x' : 'o'
    const image = this.add.image(0, 0, this.character)
    target.add(image)
    target.removeInteractive()

    const [i, j] = target.getData(['i', 'j'])

    this.gameData.makeMove(this.character, i, j)

    const maxLength = this.gameData.getMaxLegth(this.character, i, j)
    const getFillBoardlength = this.gameData.getFillBoardlength()

    if (getFillBoardlength === this.boardSize * this.boardSize) {
      this.noWinner()
    }

    if (maxLength === this.boardSize) {
      this.winner()
    }
  }

  noWinner () {
    const noWinner = this.add.text(0, 100, 'No Winner', {
      font: '25px Arial',
      fill: '#fff',
    })
    noWinner.setStroke('#292929', 16)
    noWinner.setShadow(2, 2, '#743f4a', 2, true, true)
    noWinner.setX((gameConfig.width - noWinner.width) / 2)
  }

  winner () {
    const winner = this.add.text(0, 100, `The winner is ${this.character}`, {
      font: '25px Arial',
      fill: '#fff',
    })
    winner.setStroke('#292929', 16)
    winner.setShadow(2, 2, '#743f4a', 2, true, true)
    winner.setX((gameConfig.width - winner.width) / 2)

    this.scene.pause(SCENE_GAME)
  }

  update () {}
}
