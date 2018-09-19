import BootScene from '../scenes/BootScene'
import GameScene from '../scenes/GameScene'
import Phaser from 'phaser'
import UIScene from '../scenes/UIScene'

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: '#707070',
  parent: 'gameContainer',
  scene: [BootScene, GameScene, UIScene],
}
