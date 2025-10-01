import Gameboard from './gameboard.js';

const randomIntInRange = (max) => Math.floor(Math.random() * max);

describe('Gameboard', () => {
  const emptyBoard = new Gameboard();
  describe('instantiation', () => {
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
    const placementTestingBoard = new Gameboard();

    test('throws on invalid ship size', () => {
      const [x, y] = [0, 0];
      const badLength = -3;
      expect(() => {
        placementTestingBoard.placeShip([x, y], badLength);
      }).toThrow();
    });

    test('places horizontal ships', () => {
      const [x, y] = [3, 4];
      const hLength = 5;
      placementTestingBoard.placeShip([x, y], hLength, true);
      /* expected board state:
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ h h h h h _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
       */
      for (let i = y; i < y + hLength; i += 1) {
        expect(placementTestingBoard.board[x][i]).not.toBe(null);
        expect(placementTestingBoard.board[x][i].constructor.name).toBe('Ship');
      }
    });

    test('places vertical ships', () => {
      const [x, y] = [5, 2];
      const vLength = 4;
      placementTestingBoard.placeShip([x, y], vLength, false);
      /* expected board state:
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
         _ _ _ _ h h h h h _
         _ _ _ _ _ _ _ _ _ _
         _ _ v _ _ _ _ _ _ _
         _ _ v _ _ _ _ _ _ _
         _ _ v _ _ _ _ _ _ _
         _ _ v _ _ _ _ _ _ _
         _ _ _ _ _ _ _ _ _ _
       */
      for (let i = x; i < x + vLength; i += 1) {
        expect(placementTestingBoard.board[i][y]).not.toBe(null);
        expect(placementTestingBoard.board[i][y].constructor.name).toBe('Ship');
      }
    });

    describe('collisions', () => {
      const frozenBoardState = structuredClone(placementTestingBoard); // expect it to stay as-is

      describe('areas out of bounds', () => {
        test('horizontal out of bounds', () => {
          const [x, y] = [0, 8]; // top right corner left-to-right
          const badHLength = 4;
          placementTestingBoard.placeShip([x, y], badHLength, true);
          expect(placementTestingBoard).toEqual(frozenBoardState);
        });

        test('vertical out of bounds', () => {
          const [x, y] = [8, 0]; // bottom left corner top-to-down
          const badVLength = 3;
          placementTestingBoard.placeShip([x, y], badVLength, false);
          expect(placementTestingBoard).toEqual(frozenBoardState);
        });
      });

      describe('areas already occupied', () => {
        test('handles ship overlapping', () => {
          const L = 3;
          const badHorizontalStartCases = [
            [3, 2],
            [3, 7],
            [5, 0],
            [6, 1],
            [7, 2],
          ];
          const badVerticalStartCases = [
            [1, 4],
            [2, 6],
            [3, 8],
            [3, 2],
            [7, 2],
          ];

          badHorizontalStartCases.forEach((coords) => {
            placementTestingBoard.placeShip(coords, L, true);
          });
          expect(placementTestingBoard).toEqual(frozenBoardState);

          badVerticalStartCases.forEach((coords) => {
            placementTestingBoard.placeShip(coords, L, false);
          });
          expect(placementTestingBoard).toEqual(frozenBoardState);
        });

        test('handles gaps between ships', () => {});

        test('prevents overwriting occupied slots', () => {});
      });
    });
  });

  describe('.receive attack', () => {
    test('keeps track of missed shots', () => {});
    test('reports whether or not all ships have been sunk', () => {});
  });
});
