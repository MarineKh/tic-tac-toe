import Phaser from 'phaser'
import { SCENE_GAME, SCENE_UI } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'
// import { GameScene } from '../scenes/GameScene'

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
    window.location.href = window.location.href
    // this.scene.reset()
    // GameScene.scene.restart()
    // this.scene.restart(GameScene)
    this.scene.pause(SCENE_GAME)

    console.log('Reset')
  }
}
