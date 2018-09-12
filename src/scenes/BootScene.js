import Phaser from 'phaser'
import {
  SCENE_BOOT,
  SCENE_GAME
} from '../constants/Constants'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_BOOT)
  }

  preload() {
    this.platform = this.load.image('platform', 'assets/imgs/platform.png')
    this.load.image('x', 'assets/imgs/x.png')
    this.load.image('o', 'assets/imgs/o.png')
  }

  create() {
    this.scene.start(SCENE_GAME)
  }
}