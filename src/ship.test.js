import Ship from './ship.js';

describe('Ship', () => {
  const defaultShip = new Ship();
  test('has required properties', () => {
    expect(defaultShip).toHaveProperty('length');
    expect(defaultShip).toHaveProperty('hits');
  });

  test('has correct default values', () => {
    expect(defaultShip.length).toBe(2);
    expect(defaultShip.hits).toBe(0);
  });

  test('has required methods', () => {
    expect(typeof defaultShip.hit).toBe('function');
    expect(typeof defaultShip.isSunk).toBe('function');
  });

  describe('instantiation', () => {
    test('throws on non-integers', () => {
      expect(() => new Ship(Math.PI)).toThrow('Only integers are allowed');
      expect(() => new Ship('five')).toThrow('Only integers are allowed');
      expect(() => new Ship([4])).toThrow('Only integers are allowed');
      expect(() => new Ship({ length: 3 })).toThrow(
        'Only integers are allowed'
      );
    });

    test('throws on values out of range', () => {
      expect(() => new Ship(1)).toThrow('Ships length must be in range 2 to 5');
      expect(() => new Ship(6)).toThrow('Ships length must be in range 2 to 5');
      expect(() => new Ship(-5)).toThrow(
        'Ships length must be in range 2 to 5'
      );
    });

    test('allows empty/valid constructor', () => {
      expect(() => new Ship()).not.toThrow();
      expect(() => new Ship(4.0)).not.toThrow();
    });
  });

  describe('.length', () => {
    test('sets value provided by constructor', () => {
      const cruiser = new Ship(5);
      expect(cruiser.length).toBe(5);
    });
  });

  describe('.hit', () => {
    const practiceTarget = new Ship(3);
    test('updates hits count when not sunk', () => {
      practiceTarget.hit();
      expect(practiceTarget.hits).toBe(1);
      practiceTarget.hit();
      expect(practiceTarget.hits).toBe(2);
      practiceTarget.hit();
      expect(practiceTarget.hits).toBe(3);
    });

    test('does not update if the ship is sunk already', () => {
      practiceTarget.hit();
      expect(practiceTarget.hits).not.toBe(4);
      expect(practiceTarget.hits).toBe(3);
    });
  });

  describe('.isSunk', () => {
    const testShip = new Ship(2);
    test('new ships are not sunk', () => {
      expect(defaultShip.isSunk()).toBe(false);
      expect(testShip.isSunk()).toBe(false);
    });

    test('damaged ships are not sunk', () => {
      testShip.hits = 1;
      expect(testShip.isSunk()).toBe(false);
    });

    test('sunk after a fatal hit', () => {
      testShip.hits += 1;
      expect(testShip.isSunk()).toBe(true);
    });

    test('sunk deliberately', () => {
      const sunkenShip = new Ship(5);
      sunkenShip.hits = sunkenShip.length;
      expect(sunkenShip.isSunk()).toBe(true);
    });
  });
});
