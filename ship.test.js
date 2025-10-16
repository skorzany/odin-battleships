import Ship from './ship';

describe('Ship', () => {
  let testShip;
  describe('instantiation', () => {
    describe('default ship', () => {
      beforeAll(() => {
        testShip = new Ship();
      });
      test('has required properties with correct values', () => {
        expect(testShip).toHaveProperty('length', 2);
        expect(testShip).toHaveProperty('hits', 0);
        expect(testShip).not.toHaveProperty('areaCodes'); // ship has no info about its area before it is placed on the board
      });
      test('has required methods', () => {
        expect(testShip).toHaveProperty('hit', expect.any(Function));
        expect(testShip).toHaveProperty('isSunk', expect.any(Function));
      });
    });
    describe('custom ship', () => {
      test('throws on non-integers', () => {
        const badInputs = [Math.PI, '5', null, [4], { length: 3 }];
        badInputs.forEach((input) => {
          expect(() => new Ship(input)).toThrow('Only integers are allowed');
        });
      });
      test('throws on numbers out of range', () => {
        const notInRange = [-3, 0, 1, 6];
        notInRange.forEach((number) => {
          expect(() => new Ship(number)).toThrow(
            'Ships length must be in range 2 to 5'
          );
        });
      });
      test('whole numbers in range are OK', () => {
        const wholeNumbersInRange = [2.0, 3.0, 4, 5];
        wholeNumbersInRange.forEach((number) => {
          expect(() => {
            testShip = new Ship(number);
          }).not.toThrow();
          expect(testShip.length).toBe(number);
        });
      });
    });
  });
  describe('Public interface', () => {
    beforeAll(() => {
      testShip = new Ship();
    });
    beforeEach(() => {
      testShip.hits = 0;
    });
    describe('.hit()', () => {
      test('updates hit count when not sunk', () => {
        testShip.hit();
        expect(testShip.hits).toBe(1);
      });
      test('ignores hits when already sunk', () => {
        for (let n = 0; n < testShip.length; n += 1) testShip.hit(); // hit it as many times as necessary to sink it...
        testShip.hit(); // ...then hit it again
        expect(testShip.hits).toBe(testShip.length);
      });
    });
    describe('.isSunk()', () => {
      test('new ships are not sunk', () => {
        expect(testShip.isSunk()).toBe(false);
      });
      test('damaged ships are not sunk', () => {
        testShip.hit();
        expect(testShip.isSunk()).toBe(false);
      });
      test('recognizes sunken ships', () => {
        for (let n = 0; n < testShip.length; n += 1) testShip.hit();
        expect(testShip.isSunk()).toBe(true);
      });
    });
  });
});
