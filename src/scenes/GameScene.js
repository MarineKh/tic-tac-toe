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
    const boardContainer = this.add.container(0, 0)

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        const platformContainer = this.add.container(i * (this.getPlatformSize() + this.spaceSize), j * (this.getPlatformSize() + this.spaceSize))
        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Circle(0, 0, platform.width / 2),
          Phaser.Geom.Circle.Contains,
        )
        platformContainer.add(platform)
        boardContainer.add(platformContainer)
      }
    }
    this.input.on('gameobjectdown', this.drawSymbols, this)
    boardContainer.x = (gameConfig.width - 2 * ((this.getPlatformSize() + this.spaceSize))) / 2
    boardContainer.y = (gameConfig.height - 2 * ((this.getPlatformSize() + this.spaceSize))) / 2
  }

  drawSymbols (pointer, target) {
    if (target.data) {
      return
    }
    this.clickCount++
    this.clickCount % 2 === 1 ? this.symbol = this.add.image(0, 0, 'x') : this.symbol = this.add.image(0, 0, 'o')
    target.data = true
    target.add(this.symbol)
  }

  update () {}
}
