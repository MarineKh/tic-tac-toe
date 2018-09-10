import Phaser from 'phaser'
import { gameConfig } from '../constants/GameConfig'

const DrawBoard = () => {
  const boardSize = 3
  const group = this.add.group()

  const boardLeft = (gameConfig.width - (3 * this.getPlatformSize() + 2 * this.spaceSize)) / 2
  const boardTop = (gameConfig.height - (3 * this.getPlatformSize() + 2 * this.spaceSize)) / 2

  for (let i = 0; i < boardSize; i++) {
    this.matrix.push([])
    group.createMultiple({
      key: 'platform',
      repeat: boardSize - 1,
      setXY: {
        x: 0,
        y: i * (this.getPlatformSize() + this.spaceSize),
        stepX: this.getPlatformSize() + this.spaceSize,
      },
    })
    // this.x = boardLeft + i * this.getPlatformSize() + i * this.spaceSize + this.getPlatformSize() / 2
    // this.y = boardTop + i * this.getPlatformSize() + i * this.spaceSize + this.getPlatformSize() / 2
    this.x = 130
    this.y = 230
  }

  Phaser.Actions.IncX(group.getChildren(), this.x)
  Phaser.Actions.IncY(group.getChildren(), this.y)

  let children = group.getChildren()
  for (let i = 0; i < children.length; i++) {
    children[i].setInteractive()
    children[i].once('pointerdown', () => this.drawSymbol(children[i].x, children[i].y, this.getPlatformSize()))
  }
}

export default DrawBoard
