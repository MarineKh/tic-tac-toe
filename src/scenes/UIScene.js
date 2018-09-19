import Phaser from 'phaser'
import { SCENE_UI } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super(SCENE_UI)
  }

  create () {
    this.playBtn = this.add
      .image(gameConfig.width / 2, 700, 'reset')
      .setInteractive()
    this.playBtn.on('pointerdown', () => this.resetBtn())
  }

  resetBtn () {
    // this.scene.reset()
    console.log('Reset')
  }
}
