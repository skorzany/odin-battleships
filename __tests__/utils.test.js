import { generateIntInRange, coinFlip } from '../utils';

describe('utils', () => {
  describe('generateIntInRange()', () => {
    test('creates random integers in range 0 <= i < upperLimit ', () => {
      const generated = [];
      const upperLimit = 100;
      for (let n = 0; n < 50; n += 1)
        generated.push(generateIntInRange(upperLimit));
      expect(generated.every((num) => Number.isInteger(num) === true));
      expect(Math.max(...generated)).toBeLessThanOrEqual(upperLimit - 1);
      expect(Math.min(...generated)).toBeGreaterThanOrEqual(0);
    });
  });
  describe('coinFlip()', () => {
    test('returns true or false at random', () => {
      const flips = [];
      for (let n = 0; n < 50; n += 1) flips.push(coinFlip());
      expect(flips.every((val) => typeof val === 'boolean'));
      expect(flips.some((val) => val === true));
      expect(flips.some((val) => val === false));
    });
  });
});
