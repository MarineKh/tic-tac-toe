import Phaser from "phaser";
import {
  SCENE_GAME
} from "../constants/Constants";
import {
  gameConfig
} from "../constants/GameConfig";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME);
    this.clickCount = 0;
    this.spaceSize = 10;
    this.matrix = [];
  }

  getPlatformSize() {
    this.platform = this.add.image(0, 0, "platform");
    const {
      width,
      height
    } = this.platform;
    this.platform.destroy();
    return width;
  }

  create() {
    this.boardContainer = this.add.container(0, 0);
    this.matrix = []
    for (let i = 0; i < 3; ++i) {
      this.matrix.push([])
      for (let j = 0; j < 3; ++j) {
        this.matrix[i][j] = null

        const platformContainer = this.add.container(
          i * (this.getPlatformSize() + this.spaceSize),
          j * (this.getPlatformSize() + this.spaceSize)
        );
        const platform = this.add.image(0, 0, "platform");
        platformContainer.setInteractive(
          new Phaser.Geom.Circle(0, 0, platform.width / 2),
          Phaser.Geom.Circle.Contains
        );
        platformContainer.add(platform);
        this.boardContainer.add(platformContainer);
        platformContainer.once('pointerdown', () => this.drawSymbol(i, j))
      }
    }
    // this.input.on('gameobjectdown', this.drawSymbols, this)
    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2;
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2;
  }

  drawSymbol = (i, j) => {
    let symbol

    this.clickCount++
    this.clickCount % 2 === 1 ? (symbol = this.add.image(0, 0, 'x')) : (symbol = this.add.image(0, 0, 'o'))
    this.matrix[i][j] = symbol.texture.key

    this.checkWinner()
    console.log(this.matrix);
    // const {
    //   width,
    //   height
    // } = this.text
    // const textX = squareX + (squareSize - width) / 2 - squareSize / 2
    // const textY = squareY + (squareSize - height) / 2 - squareSize / 2
    // this.text.x = textX
    // this.text.y = textY
  }

  // drawSymbols(pointer, target, i, j) {
  //   if (target.data) {
  //     return
  //   }
  //   let symbol
  //   this.clickCount++
  //   this.clickCount % 2 === 1 ? (symbol = this.add.image(0, 0, 'x')) : (symbol = this.add.image(0, 0, 'o'))

  //   this.matrix.push(symbol.texture.key)
  //   target.data = true
  //   target.add(symbol)
  // }
  checkWinner() {
    let matrix = this.matrix
    // check rows
    for (let i = 0, j = 0; i <= 2; i++) {
      if (matrix[i][j] && matrix[i][j] === matrix[i][j + 1] && matrix[i][j + 1] === matrix[i][j + 2]) {
        if (matrix[i][j] === 'x') {
          console.log('x win')
        } else {
          console.log('o win')
        }
      }
    }
    // check columns
    for (let i = 0, j = 0; i <= 2; i++) {
      if (matrix[j][i] && matrix[j][i] === matrix[j + 1][i] && matrix[j + 1][i] === matrix[j + 2][i]) {
        if (matrix[j][i] === 'x') {
          console.log('x win')
        } else {
          console.log('o win')
        }
      }
    }
    // check diagonals
    if (matrix[0][0] && matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
      if (matrix[0][0] === 'x') {
        console.log('x win')
      } else {
        console.log('o win')
      }
    } else if (matrix[0][2] && matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
      if (matrix[0][2] === 'x') {
        console.log('x win')
      } else {
        console.log('o win')
      }
    }
  }

  update() {}
}