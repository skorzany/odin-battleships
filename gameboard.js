import Ship from './ship.js';

export default class GameBoard {
  constructor() {
    this.shotRegistry = new Set();
    this.placedShips = [];
    this.board = [];
    for (let n = 0; n < 10; n += 1) this.board.push(new Array(10).fill(null));
  }

  placeShip({ row, col, length, horizontal }) {
    const shipFitsTheBoard =
      row >= 0 &&
      col >= 0 &&
      ((horizontal && col + length <= 10) ||
        (!horizontal && row + length <= 10));
    if (shipFitsTheBoard) {
      const area = this._generateAreaInfo({ row, col, length, horizontal });
      if (area.isEmpty) {
        const ship = new Ship(length);
        ship.areaCodes = area.codes;
        if (horizontal) {
          for (let i = col; i < col + length; i += 1) this.board[row][i] = ship;
        } else {
          for (let i = row; i < row + length; i += 1) this.board[i][col] = ship;
        }
        this.placedShips.push(ship);
        return true;
      }
    }
    return false;
  }

  undoLastShip() {
    if (this.placedShips.length) {
      const ship = this.placedShips.pop();
      ship.areaCodes.forEach((code) => {
        const [row, col] = code.split('').map(Number);
        this.board[row][col] = null;
      });
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
          const codesToRegister = target.areaCodes;
          codesToRegister.forEach((code) => this.shotRegistry.add(code));
        }
        return true;
      }
      return false;
    }
    return null;
  }

  hasShips() {
    return this.placedShips.some((ship) => !ship.isSunk());
  }

  // PRIVATE STUFF
  _generateAreaInfo({ row, col, length, horizontal }) {
    const [areaStartRowIdx, areaEndRowIdx] = [
      Math.max(row - 1, 0),
      horizontal ? Math.min(row + 1, 9) : Math.min(row + length, 9),
    ];
    const [areaStartColIdx, areaEndColIdx] = [
      Math.max(col - 1, 0),
      horizontal ? Math.min(col + length, 9) : Math.min(col + 1, 9),
    ];
    const codes = [];
    let isEmpty = true;
    for (let i = areaStartRowIdx; i <= areaEndRowIdx; i += 1) {
      for (let j = areaStartColIdx; j <= areaEndColIdx; j += 1) {
        codes.push(`${i}${j}`);
        if (this.board[i][j] !== null) isEmpty = false;
      }
    }
    return { codes, isEmpty };
  }
}
