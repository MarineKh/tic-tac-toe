import BootScene from '../scenes/BootScene'
import GameScene from '../scenes/GameScene'
import Phaser from 'phaser'

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: '#707070',
  parent: 'gameContainer',
  scene: [BootScene, GameScene]
}
