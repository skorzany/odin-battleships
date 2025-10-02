import Gameboard from './gameboard.js';

const randomIntInRange = (max) => Math.floor(Math.random() * max);

describe('Gameboard', () => {
  describe('instantiation', () => {
    const emptyBoard = new Gameboard();
    const [randomX, randomY] = [randomIntInRange(10), randomIntInRange(10)];
    const randomRow = emptyBoard.board[randomX];

    test('has expected type', () => {
      expect(Array.isArray(emptyBoard.board)).toBe(true);
      expect(Array.isArray(randomRow)).toBe(true);
    });

    test('has expected size', () => {
      expect(emptyBoard.board.length).toBe(10);
      expect(randomRow.length).toBe(10);
    });

    test('has required methods', () => {
      expect(typeof emptyBoard.placeShip).toBe('function');
      expect(typeof emptyBoard.receiveAttack).toBe('function');
      expect(typeof emptyBoard.hasShips).toBe('function');
    });

    test('new board is empty', () => {
      expect(randomRow).toEqual(new Array(10).fill(null));
      expect(emptyBoard.board[randomX][randomY]).toBe(null);
    });
  });

  describe('.placeShip', () => {
    const testingBoard = new Gameboard();
    const carrier = { horizontal: true, length: 5, row: 2, col: 3 };
    const destroyer = { horizontal: true, length: 3, row: 9, col: 7 };
    const battleship = { horizontal: false, length: 4, row: 4, col: 2 };
    const submarine = { horizontal: false, length: 3, row: 2, col: 0 };

    test('throws on invalid ship size', () => {
      expect(() => {
        testingBoard.placeShip({
          row: 0,
          col: 0,
          length: -3,
          horizontal: true,
        });
      }).toThrow();
    });

    test('places horizontal ships', () => {
      testingBoard.placeShip(carrier);
      testingBoard.placeShip(destroyer);
      /* expected board state:
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ C C C C C _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ D D D
       */
      const carrierRow = testingBoard.board[carrier.row];
      expect(carrierRow).toEqual([
        null,
        null,
        null,
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        null,
        null,
      ]);

      const destroyerRow = testingBoard.board[destroyer.row];
      expect(destroyerRow).toEqual([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        expect.objectContaining({ hits: 0, length: destroyer.length }),
        expect.objectContaining({ hits: 0, length: destroyer.length }),
        expect.objectContaining({ hits: 0, length: destroyer.length }),
      ]);
    });

    test('places vertical ships', () => {
      testingBoard.placeShip(battleship);
      testingBoard.placeShip(submarine);
      /* expected board state:
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         S _ _ C C C C C _ _
         S _ _ _ _ _ _ _ _ _
         S _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ D D D
       */
      const battleshipCol = [];
      for (let n = 0; n < testingBoard.board.length; n += 1)
        battleshipCol.push(testingBoard.board[n][battleship.col]);
      expect(battleshipCol).toEqual([
        null,
        null,
        null,
        null,
        expect.objectContaining({ hits: 0, length: battleship.length }),
        expect.objectContaining({ hits: 0, length: battleship.length }),
        expect.objectContaining({ hits: 0, length: battleship.length }),
        expect.objectContaining({ hits: 0, length: battleship.length }),
        null,
        null,
      ]);

      const battleshipRow = testingBoard.board[battleship.row];
      expect(battleshipRow).toEqual([
        expect.objectContaining({ hits: 0, length: submarine.length }),
        null,
        expect.objectContaining({ hits: 0, length: battleship.length }),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);

      const submarineCol = [];
      for (let n = 0; n < testingBoard.board.length; n += 1)
        submarineCol.push(testingBoard.board[n][submarine.col]);
      expect(submarineCol).toEqual([
        null,
        null,
        expect.objectContaining({ hits: 0, length: submarine.length }),
        expect.objectContaining({ hits: 0, length: submarine.length }),
        expect.objectContaining({ hits: 0, length: submarine.length }),
        null,
        null,
        null,
        null,
        null,
      ]);

      const submarineRow = testingBoard.board[submarine.row];
      expect(submarineRow).toEqual([
        expect.objectContaining({ hits: 0, length: submarine.length }),
        null,
        null,
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        expect.objectContaining({ hits: 0, length: carrier.length }),
        null,
        null,
      ]);
    });

    describe('collisions', () => {
      const presetBoard = new Gameboard();
      [carrier, destroyer, battleship, submarine].forEach((data) =>
        presetBoard.placeShip(data)
      );
      /* presetBoard state, should remain UNCHANGED during all collision tests:
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         S _ _ C C C C C _ _
         S _ _ _ _ _ _ _ _ _
         S _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ B _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ D D D
       */
      const expectedBoard = [];
      presetBoard.board.forEach((row) => expectedBoard.push([...row]));
      describe('areas out of bounds', () => {
        test('handles horizontal out-of-bounds', () => {
          const bad1 = { horizontal: true, length: 2, row: 0, col: 9 };
          presetBoard.placeShip(bad1);
          expect(presetBoard.board).toEqual(expectedBoard);
        });
        test('handles vertical out-of-bounds', () => {
          const bad2 = { horizontal: false, length: 2, row: 9, col: 0 };
          presetBoard.placeShip(bad2);
          expect(presetBoard.board).toEqual(expectedBoard);
        });
      });
      describe('areas already occupied/unavailable', () => {
        test('handles horizontally overlapping ships', () => {
          const overlappingHorizontalStarts = [
            [2, 2], // would overlap the carrier from the left side
            [2, 7], // would overlap the carrier from the right side
            [2, 0], // would overlap the submarine from top-right
            [7, 1], // would overlap the battleship from bottom-left
            [9, 7], // would be entirely on top of the destroyer
          ];
          overlappingHorizontalStarts.forEach(([row, col]) => {
            presetBoard.placeShip({ row, col, length: 2, horizontal: true });
          });
          expect(presetBoard.board).toEqual(expectedBoard);
        });
        test('handles vertically overlapping ships', () => {
          const overlappingVerticalStarts = [
            [1, 3], // would overlap the carrier from the top-left
            [2, 7], // would overlap the carrier from the bottom-right
            [3, 2], // would overlap the battleship from the top
            [7, 2], // would overlap the battleship from the bottom
            [2, 0], // would be entirely on top of the submarine
          ];
          overlappingVerticalStarts.forEach(([row, col]) => {
            presetBoard.placeShip({ row, col, length: 2, horizontal: false });
          });
          expect(presetBoard.board).toEqual(expectedBoard);
        });

        test('handles gaps between ships', () => {
          // According to the modern rules of the game, ships cannot 'touch' each other
          const gapViolatingHorizontalStarts = [
            [8, 8], // would be directly above the destroyer
            [9, 5], // would be directly to the left of the destroyer
            [2, 8], // would be directly to the right of the carrier
            [3, 4], // would be directly under the carrier
            [8, 3], // would touch the bottom-right corner of the battleship
            [1, 1], // would touch top-right corner of the submarine & top-left corner of the carrier
          ];
          const gapViolatingVerticalStarts = [
            [0, 0], // would be directly above the submarine
            [8, 2], // would be directly under the battleship
            [5, 3], // would be right next to the battleship
            [3, 1], // would be squeezed between the submarine and the battleship
            [7, 6], // would touch the top-left corner of the destroyer
            [0, 8], // would touch the top-right corner of the carrier
          ];
          gapViolatingHorizontalStarts.forEach(([row, col]) =>
            presetBoard.placeShip({ row, col, horizontal: true, length: 2 })
          );
          gapViolatingVerticalStarts.forEach(([row, col]) =>
            presetBoard.placeShip({ row, col, horizontal: false, length: 2 })
          );
          expect(presetBoard.board).toEqual(expectedBoard);
        });
      });
    });
  });

  describe('.receive attack', () => {
    test('registers missed shots', () => {});
    test('registers hits', () => {});
  });

  describe('.hasShips', () => {
    test('empty board', () => {});
    test('all ships are alive', () => {});
    test('some ships are alive', () => {});
    test('all ships are sunk', () => {});
  });
});
