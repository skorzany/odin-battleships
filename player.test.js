import Player from './player';
import GameBoard from './gameboard';

describe('Player', () => {
  let testPlayer;
  describe('instantiation', () => {
    beforeAll(() => {
      testPlayer = new Player();
    });
    test('has required properties', () => {
      expect(testPlayer.myBoard).toBeInstanceOf(GameBoard);
    });
    test('has required methods', () => {
      expect(testPlayer).toHaveProperty('registerAttack', expect.any(Function));
    });
  });
  describe('public interface', () => {
    describe('.registerAttack()', () => {
      beforeEach(() => {
        testPlayer = new Player();
      });
      test('takes correct input', () => {
        const badInputs = [
          [2, 4], // not an object
          { aRow: 3, someColumn: 5 }, // bad property names
          { row: 0, col: 10 }, // properties out of bounds
          { row: 10, col: 0 }, // properties out of bounds 2
          { row: '4', col: Math.PI }, // invalid property type
        ];
        badInputs.forEach((input) => {
          expect(() => testPlayer.registerAttack(input)).toThrow(
            'Invalid arguments'
          );
        });
      });
      test('forwards the command to its board', () => {
        const boardSpy = jest.spyOn(testPlayer.myBoard, 'receiveAttack');
        testPlayer.registerAttack({ row: 5, col: 5 });
        expect(boardSpy).toHaveBeenCalledTimes(1);
        expect(boardSpy).toHaveBeenCalledWith({ row: 5, col: 5 });
        boardSpy.mockRestore();
      });
      test('returns correct value', () => {
        const boardFake = {
          board: [[null, { length: 5, hits: 2 }]],
          receiveAttack: jest.fn(),
        };
        testPlayer.myBoard = boardFake;
        expect(testPlayer.registerAttack({ row: 0, col: 0 })).toBe(false);
        expect(testPlayer.registerAttack({ row: 0, col: 1 })).toBe(true);
      });
    });
  });
});
