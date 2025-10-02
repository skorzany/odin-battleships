import Ship from './ship.js';

export default class Gameboard {
  // PUBLIC INTERFACE START
  constructor() {
    this.board = [];
    for (let n = 0; n < 10; n += 1) this.board.push(new Array(10).fill(null));
  }

  placeShip({ row, col, length, horizontal }) {
    const ship = new Ship(length);
    const areaIsEmpty = this._validateArea({ row, col, length, horizontal });
    if (areaIsEmpty) {
      if (horizontal && col + length <= 10)
        for (let i = col; i < col + length; i += 1) this.board[row][i] = ship;
      else if (!horizontal && row + length <= 10)
        for (let i = row; i < row + length; i += 1) this.board[i][col] = ship;
    }
  }

  receiveAttack() {}

  hasShips() {}
  // PUBLIC INTERFACE END

  _validateArea({ row, col, length, horizontal }) {
    const [areaStartRowIdx, areaEndRowIdx] = [
      Math.max(row - 1, 0),
      horizontal ? Math.min(row + 1, 9) : Math.min(row + length, 9),
    ];
    const [areaStartColIdx, areaEndColIdx] = [
      Math.max(col - 1, 0),
      horizontal ? Math.min(col + length, 9) : Math.min(col + 1, 9),
    ];

    for (let i = areaStartRowIdx; i <= areaEndRowIdx; i += 1) {
      const cells = this.board[i].slice(areaStartColIdx, areaEndColIdx + 1);
      if (cells.some((cell) => cell !== null)) return false;
    }
    return true;
  }
}
