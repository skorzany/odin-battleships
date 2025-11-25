import CpuPlayer from '../cpuPlayer';
import Player from '../player';
import GameBoard from '../gameboard';

describe('cpuPlayer', () => {
  let testPlayer;
  describe('instantiation', () => {
    beforeAll(() => {
      testPlayer = new CpuPlayer();
    });
    test('has required properties', () => {
      expect(testPlayer.myBoard).toBeInstanceOf(GameBoard);
    });
    test('has required methods', () => {
      const methodNames = ['placeShips', 'registerAttack'];
      methodNames.forEach((name) => {
        expect(testPlayer).toHaveProperty(name, expect.any(Function));
      });
    });
    test('has required static method', () => {
      expect(CpuPlayer.sendAttack).toBeDefined();
      expect(typeof CpuPlayer.sendAttack).toBe('function');
    });
  });
  describe('public interface', () => {
    describe('.placeShips()', () => {
      beforeEach(() => {
        testPlayer = new CpuPlayer();
      });
      test('manipulates the board', () => {
        const expectedArgs = {
          horizontal: expect.any(Boolean),
          length: expect.any(Number),
          row: expect.any(Number),
          col: expect.any(Number),
        };
        const spy = jest.spyOn(testPlayer.myBoard, 'placeShip');
        testPlayer.placeShips();
        expect(spy).toHaveBeenCalledWith(expectedArgs);
        spy.mockRestore();
      });
      test('places ships onto the board', () => {
        const emptyBoard = [
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
        ];
        const result = testPlayer.placeShips();
        expect(result).toBe(true);
        expect(testPlayer.myBoard.board).not.toEqual(emptyBoard);
        expect(testPlayer.myBoard.hasShips()).toBe(true);
      });
      test('places correct number of ships', () => {
        const lengthCounts = { 2: 1, 3: 2, 4: 1, 5: 1 };
        testPlayer.placeShips();
        expect(testPlayer.myBoard.placedShips).toHaveLength(5);
        Object.entries(lengthCounts).forEach(([shipsLength, howMany]) => {
          const filtered = testPlayer.myBoard.placedShips.filter(
            (ship) => ship.length === Number(shipsLength)
          );
          expect(filtered).toHaveLength(howMany);
        });
      });
      test('placements are different each time', () => {
        testPlayer.placeShips();
        const oldBoardState = testPlayer.myBoard.board;
        testPlayer.myBoard = new GameBoard();
        testPlayer.placeShips();
        const freshBoardState = testPlayer.myBoard.board;
        expect(oldBoardState).not.toEqual(freshBoardState);
      });
    });
    describe('.sendAttack()', () => {
      let enemyPlayer;
      beforeAll(() => {
        enemyPlayer = new Player();
      });
      test('has access to enemy shot registry', () => {
        const spy = jest.spyOn(enemyPlayer.myBoard.shotRegistry, 'has');
        CpuPlayer.sendAttack(enemyPlayer);
        expect(spy).toHaveBeenCalledWith(expect.any(String));
        spy.mockRestore();
      });
      test('manipulates the enemy board', () => {
        const expectedArgs = {
          row: expect.any(Number),
          col: expect.any(Number),
        };
        const spy = jest.spyOn(enemyPlayer.myBoard, 'receiveAttack');
        CpuPlayer.sendAttack(enemyPlayer);
        expect(spy).toHaveBeenCalledWith(expectedArgs);
        spy.mockRestore();
      });
    });
  });
});
