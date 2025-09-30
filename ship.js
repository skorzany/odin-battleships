export default class Ship {
  constructor(length = 2) {
    if (!Number.isInteger(length)) throw new Error('Only integers are allowed');
    if (length < 2 || length > 5)
      throw new Error('Ships length must be in range 2 to 5');
    this.length = length;
    this.hits = 0;
  }

  hit() {
    if (!this.isSunk()) this.hits += 1;
  }

  isSunk() {
    return this.length === this.hits;
  }
}
