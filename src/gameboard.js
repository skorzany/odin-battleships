import Ship from './ship.js';

export default class GameBoard {
  constructor() {
    this.shotRegistry = new Set();
    this.shipMap = {};
    this.board = [];
    for (let n = 0; n < 10; n += 1) this.board.push(new Array(10).fill(null));
  }

  placeShip({ row, col, length, horizontal }) {
    const ship = new Ship(length);
    ship.horizontal = horizontal;
    ship.code = `${row}${col}`;
    const areaToCheck = this._generateAreaMap(ship);
    if (GameBoard.allEmpty(areaToCheck)) {
      if (horizontal && col + length <= 10) {
        for (let i = col; i < col + length; i += 1) this.board[row][i] = ship;
        this.shipMap[length] = { ship };
      } else if (!horizontal && row + length <= 10) {
        for (let i = row; i < row + length; i += 1) this.board[i][col] = ship;
        this.shipMap[length] = { ship };
      }
    }
  }

  receiveAttack({ row, col }) {
    const codeInFocus = `${row}${col}`;
    if (!this.shotRegistry.has(codeInFocus)) {
      this.shotRegistry.add(codeInFocus);
      const target = this.board[row][col];
      if (target !== null) {
        target.hit();
        if (target.isSunk()) {
          const codesToRegister = Object.keys(this._generateAreaMap(target));
          codesToRegister.forEach((code) => this.shotRegistry.add(code));
        }
      }
    }
  }

  hasShips() {
    const shipData = Object.values(this.shipMap);
    if (shipData.some((data) => data.ship.isSunk() === false)) return true;
    return false;
  }

  // PRIVATE METHODS
  _generateAreaMap({ code, length, horizontal }) {
    const [row, col] = [...code].map(Number);
    const [areaStartRowIdx, areaEndRowIdx] = [
      Math.max(row - 1, 0),
      horizontal ? Math.min(row + 1, 9) : Math.min(row + length, 9),
    ];
    const [areaStartColIdx, areaEndColIdx] = [
      Math.max(col - 1, 0),
      horizontal ? Math.min(col + length, 9) : Math.min(col + 1, 9),
    ];
    const areaMap = {};
    for (let i = areaStartRowIdx; i <= areaEndRowIdx; i += 1) {
      for (let j = areaStartColIdx; j <= areaEndColIdx; j += 1)
        areaMap[`${i}${j}`] = this.board[i][j] === null;
    }
    return areaMap;
  }

  static allEmpty(areaMap) {
    return Object.values(areaMap).every((value) => value === true);
  }
}
