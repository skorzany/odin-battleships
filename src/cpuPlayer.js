import Player from './player.js';
import { coinFlip, generateIntInRange } from './utils.js';

export default class CpuPlayer extends Player {
  placeShips() {
    const availableShipLengths = [5, 4, 3, 3, 2];
    availableShipLengths.forEach((length) => {
      let wasPlaced = false;
      while (!wasPlaced) {
        const horizontal = coinFlip();
        const [row, col] = [generateIntInRange(10), generateIntInRange(10)];
        wasPlaced = this.myBoard.placeShip({ row, col, length, horizontal });
      }
    });
    return true;
  }

  static sendAttack(otherPlayer) {
    const usedCodes = otherPlayer.myBoard.shotRegistry;
    let correct = false;
    let [row, col] = [];
    while (!correct) {
      [row, col] = [generateIntInRange(10), generateIntInRange(10)];
      correct = !usedCodes.has(`${row}${col}`);
    }
    return otherPlayer.registerAttack({ row, col });
  }
}
