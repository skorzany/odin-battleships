import GameBoard from './gameboard.js';

export default class Player {
  constructor() {
    this.myBoard = new GameBoard();
  }

  registerAttack({ row, col }) {
    if (
      row === undefined ||
      col === undefined ||
      !Number.isInteger(row) ||
      !Number.isInteger(col) ||
      row < 0 ||
      row > 9 ||
      col < 0 ||
      col > 9
    )
      throw new Error('Invalid arguments');
    this.myBoard.receiveAttack({ row, col });
    return this.myBoard.board[row][col] !== null;
  }
}
