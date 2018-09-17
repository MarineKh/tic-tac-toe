import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.boardSize = 3
    this.clickCount = 0
    this.spaceSize = 10
    this.gameData = {
      x: {
        rows: this.getRowsColumnsData(),
        columns: this.getRowsColumnsData(),
        mainDiagonal: [],
        secondaryDiagonal: []
      },
      o: {
        rows: this.getRowsColumnsData(),
        columns: this.getRowsColumnsData(),
        mainDiagonal: [],
        secondaryDiagonal: []
      }
    }
  }

  getRowsColumnsData () {
    const object = {}
    for (let i = 0; i < this.boardSize; i++) {
      object[i] = []
    }
    return object
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    this.boardContainer = this.add.container(0, 0)
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        const platformContainer = this.add.container(
          i * (this.getPlatformSize() + this.spaceSize),
          j * (this.getPlatformSize() + this.spaceSize)
        )
        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Rectangle(
            -platform.width / 2,
            -platform.height / 2,
            platform.width,
            platform.height
          ),
          Phaser.Geom.Rectangle.Contains
        )
        platformContainer.add(platform)
        this.boardContainer.add(platformContainer)
        platformContainer.setData({ i, j })
      }
    }
    this.input.on('gameobjectdown', this.drawSymbol, this)
    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
  }

  drawSymbol (pointer, target) {
    this.clickCount++
    this.character = this.clickCount % 2 === 1 ? 'x' : 'o'
    const image = this.add.image(0, 0, this.character)
    target.add(image)
    target.removeInteractive()

    const [i, j] = target.getData(['i', 'j'])

    this.gameData[this.character].rows[i].push(j)
    this.gameData[this.character].columns[j].push(i)

    if (i === j) {
      this.gameData[this.character].mainDiagonal.push(i)
    }

    if (i + j === this.boardSize - 1) {
      this.gameData[this.character].secondaryDiagonal.push(i)
    }

    const maxLength = Math.max(
      this.gameData[this.character].rows[i].length,
      this.gameData[this.character].columns[j].length,
      this.gameData[this.character].mainDiagonal.length,
      this.gameData[this.character].secondaryDiagonal.length
    )

    if (maxLength === this.boardSize) {
      this.winner()
    } else {
      console.log('nobody')
    }

    // this.gameData = {
    //   x: {
    //     rows: {
    //       0: ["a"],
    //       1: ["a"],
    //       2: []
    //     },
    //     columns: { ...initialData },
    //     mainDiagonal: [],
    //     secondaryDiagonal: [],
    //   },
    //   o: {
    //     rows: { ...initialData },
    //     columns: { ...initialData },
    //     mainDiagonal: [],
    //     secondaryDiagonal: [],
    //   },
    // }
  }

  winner () {
    const winner = this.add.text(0, 100, `The winner is ${this.character}`, {
      font: '25px Arial',
      fill: '#fff'
    })
    winner.setStroke('#292929', 16)
    winner.setShadow(2, 2, '#743f4a', 2, true, true)
    winner.setX((gameConfig.width - winner.width) / 2)

    this.scene.pause(SCENE_GAME)
  }

  update () {}
}
