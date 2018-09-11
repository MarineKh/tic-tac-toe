import BootScene from '../scenes/BootScene'
import GameScene from '../scenes/GameScene'
import Phaser from 'phaser'

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1c1c1c',
  parent: 'gameContainer',
  scene: [BootScene, GameScene],
}
