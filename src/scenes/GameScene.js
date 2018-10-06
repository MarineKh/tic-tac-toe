import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'
import Game from '../data/Game'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.boardSize = 3
    this.clickCount = 0
    this.spaceSize = 10
    this.gameData = new Game(this.boardSize)
    this.containersMatix = []
    this.winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ]
    this.huPlayer = 'o'
    this.aiPlayer = 'x'
    this.platformsArray = []
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    // main game

    this.origBoard = Array.from(Array(9).keys())
    let nameCount = 0
    this.boardContainer = this.add.container(0, 0)

    for (let i = 0; i < 3; ++i) {
      this.containersMatix.push([])
      for (let j = 0; j < 3; ++j) {
        const platformContainer = this.add
          .container(
            j * (this.getPlatformSize() + this.spaceSize),
            i * (this.getPlatformSize() + this.spaceSize),
          )
          .setName(nameCount++)

        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Rectangle(
            -platform.width / 2,
            -platform.height / 2,
            platform.width,
            platform.height,
          ),
          Phaser.Geom.Rectangle.Contains,
        )
        platformContainer.add(platform)
        this.boardContainer.add(platformContainer)
        platformContainer.setData({ i, j })
        this.containersMatix[i].push(platformContainer)
        this.platformsArray.push(platformContainer)
      }
    }

    this.input.on('gameobjectdown', this.drawSymbol.bind(this), false)

    this.boardContainer.x =
      (gameConfig.width - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - 2 * (this.getPlatformSize() + this.spaceSize)) / 2
  }

  drawSymbol (pointer, target) {
    // const [i, j] = target.getData(['i', 'j'])

    if (typeof this.origBoard[target.name] === 'number') {
      this.turn(target.name, this.huPlayer, target)

      if (!this.checkTie()) {
        const bestSpot = this.bestSpot()
        this.turn(bestSpot, this.aiPlayer, this.platformsArray[bestSpot])
      }
    }
  }

  turn (squareId, player, target) {
    this.origBoard[squareId] = player

    target.add(this.add.image(0, 0, player)).removeInteractive()

    let gameWon = this.checkWin(this.origBoard, player)
    if (gameWon) this.gameOver(gameWon)
  }

  checkWin (board, player) {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), [])
    let gameWon = null
    for (let [index, win] of this.winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player }
        break
      }
    }
    return gameWon
  }

  getPlatformByName (name) {
    return this.platformsArray.filter(platform => platform.name === name)[0]
      .list[0]
  }

  gameOver (gameWon) {
    for (let index of this.winCombos[gameWon.index]) {
      const changeBgColor =
        gameWon.player === this.huPlayer ? 0xffff66 : 0x0000ff

      this.getPlatformByName(index).setTintFill(changeBgColor)
    }
  }

  declareWinner (who) {
    console.log(who)
    // document.querySelector('.endgame').style.display = 'block'
    // document.querySelector('.endgame .text').innerText = who
  }

  emptySquares () {
    return this.origBoard.filter(s => typeof s === 'number')
  }

  bestSpot () {
    return this.minmax(this.origBoard, this.aiPlayer).index
  }

  checkTie () {
    if (this.emptySquares().length === 0) {
      this.platformsArray.forEach(element => {
        element.list[0].setTintFill(0xcc00ff)
      })
      this.declareWinner('Tie Game!')
      return true
    }
    return false
  }

  minmax (newBoard, player) {
    let availSpots = this.emptySquares()

    if (this.checkWin(newBoard, this.huPlayer)) {
      return { score: -10 }
    } else if (this.checkWin(newBoard, this.aiPlayer)) {
      return { score: 10 }
    } else if (availSpots.length === 0) {
      return { score: 0 }
    }

    let moves = []
    for (let i = 0; i < availSpots.length; i++) {
      let move = {}
      move.index = newBoard[availSpots[i]]
      newBoard[availSpots[i]] = player

      if (player === this.aiPlayer) {
        let result = this.minmax(newBoard, this.huPlayer)
        move.score = result.score
      } else {
        let result = this.minmax(newBoard, this.aiPlayer)
        move.score = result.score
      }

      newBoard[availSpots[i]] = move.index

      moves.push(move)
    }

    let bestMove
    if (player === this.aiPlayer) {
      let bestScore = -10000
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    } else {
      let bestScore = 10000
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }
    return moves[bestMove]
  }
  update () {}
}
