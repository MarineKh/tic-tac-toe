import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
  }

  create () {
    const boardContainer = this.add.container(0, 0)

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        const tile = this.add.container(i * 80, j * 80)
        const mushroom = this.add.image(0, 0, 'mushroom')
        tile.setInteractive(
          new Phaser.Geom.Circle(0, 0, mushroom.width / 2),
          Phaser.Geom.Circle.Contains,
        )
        tile.add(mushroom)
        boardContainer.add(tile)
      }
    }
    this.input.on('gameobjectdown', this.onClick, this)
    boardContainer.x = (gameConfig.width - 140) / 2
    boardContainer.y = (gameConfig.height - 140) / 2
  }

  onClick (pointer, target) {
    console.log('target :', target.data)
    if (target.data) {
      return
    }
    const mushroom = this.add.image(0, 0, 'mushroom')
    mushroom.setScale(0.5)
    mushroom.rotation = 90
    target.data = true
    target.add(mushroom)
  }

  update () {}
}
