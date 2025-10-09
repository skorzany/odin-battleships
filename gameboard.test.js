import GameBoard from './gameboard.js';

const randomIntInRange = (max) => Math.floor(Math.random() * max);

describe('GameBoard', () => {
  describe('instantiation', () => {
    const emptyBoard = new GameBoard();
    const [randomX, randomY] = [randomIntInRange(10), randomIntInRange(10)];
    const randomRow = emptyBoard.board[randomX];

    test('has required properties', () => {
      const properties = ['board', 'shipMap', 'shotRegistry'];
      properties.forEach((property) =>
        expect(emptyBoard).toHaveProperty(property)
      );
    });

    test('has expected type', () => {
      expect(emptyBoard.board).toBeInstanceOf(Array);
      expect(randomRow).toBeInstanceOf(Array);
      expect(emptyBoard.shipMap).toBeInstanceOf(Object);
      expect(emptyBoard.shotRegistry).toBeInstanceOf(Set);
    });

    test('has expected size', () => {
      expect(emptyBoard.board).toHaveLength(10);
      expect(randomRow).toHaveLength(10);
    });

    test('has required methods', () => {
      expect(typeof emptyBoard.placeShip).toBe('function');
      expect(typeof emptyBoard.receiveAttack).toBe('function');
      expect(typeof emptyBoard.hasShips).toBe('function');
    });

    test('new board is empty', () => {
      expect(randomRow).toEqual(new Array(10).fill(null));
      expect(emptyBoard.board[randomX][randomY]).toBe(null);
      expect(Object.entries(emptyBoard.shipMap)).toHaveLength(0);
      expect(emptyBoard.shotRegistry.size).toBe(0);
    });
  });

  describe('.placeShip', () => {
    const testingBoard = new GameBoard();
    const carrier = { horizontal: true, length: 5, row: 2, col: 3 };
    const destroyer = { horizontal: true, length: 3, row: 9, col: 7 };
    const battleship = { horizontal: false, length: 4, row: 4, col: 2 };
    const submarine = { horizontal: false, length: 3, row: 2, col: 0 };
    const doubles = {
      carrier: {
        horizontal: carrier.horizontal,
        length: carrier.length,
        hits: 0,
        code: `${carrier.row}${carrier.col}`,
      },
      destroyer: {
        horizontal: destroyer.horizontal,
        length: destroyer.length,
        hits: 0,
        code: `${destroyer.row}${destroyer.col}`,
      },
      battleship: {
        code: `${battleship.row}${battleship.col}`,
        horizontal: battleship.horizontal,
        hits: 0,
        length: battleship.length,
      },
      submarine: {
        hits: 0,
        length: submarine.length,
        horizontal: submarine.horizontal,
        code: `${submarine.row}${submarine.col}`,
      },
    };

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
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
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
        expect.objectContaining(doubles.destroyer),
        expect.objectContaining(doubles.destroyer),
        expect.objectContaining(doubles.destroyer),
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
        expect.objectContaining(doubles.battleship),
        expect.objectContaining(doubles.battleship),
        expect.objectContaining(doubles.battleship),
        expect.objectContaining(doubles.battleship),
        null,
        null,
      ]);

      const battleshipRow = testingBoard.board[battleship.row];
      expect(battleshipRow).toEqual([
        expect.objectContaining(doubles.submarine),
        null,
        expect.objectContaining(doubles.battleship),
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
        expect.objectContaining(doubles.submarine),
        expect.objectContaining(doubles.submarine),
        expect.objectContaining(doubles.submarine),
        null,
        null,
        null,
        null,
        null,
      ]);

      const submarineRow = testingBoard.board[submarine.row];
      expect(submarineRow).toEqual([
        expect.objectContaining(doubles.submarine),
        null,
        null,
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        expect.objectContaining(doubles.carrier),
        null,
        null,
      ]);
    });

    describe('collisions', () => {
      const presetBoard = new GameBoard();
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
    const fullBoard = new GameBoard();
    const ships = [
      { horizontal: true, length: 5, row: 2, col: 3 }, // (C)arrier
      { horizontal: true, length: 3, row: 9, col: 7 }, // (D)estroyer
      { horizontal: false, length: 4, row: 4, col: 2 }, // (B)attleship
      { horizontal: false, length: 3, row: 2, col: 0 }, // (S)ubmarine
      { horizontal: true, length: 2, row: 6, col: 4 }, // (P)atrolBoat
    ];
    ships.forEach((shipData) => fullBoard.placeShip(shipData));
    const expectedRegistry = new Set([
      '00',
      '09',
      '33',
      '41',
      '63',
      '85',
      '20',
      '24',
      '42',
      '64',
      '99',
      '23',
      '30',
      '97',
      '40',
      '10',
      '11',
      '21',
      '31',
      '50',
      '51',
      '65',
      '66',
      '53',
      '54',
      '55',
      '56',
      '73',
      '74',
      '75',
      '76',
      '98',
      '96',
      '86',
      '87',
      '88',
      '89',
    ]);
    /* fullBoard state:
        _ _ _ _ _ _ _ _ _ _
        _ _ _ _ _ _ _ _ _ _
        S _ _ C C C C C _ _
        S _ _ _ _ _ _ _ _ _
        S _ B _ _ _ _ _ _ _
        _ _ B _ _ _ _ _ _ _
        _ _ B _ P P _ _ _ _
        _ _ B _ _ _ _ _ _ _
        _ _ _ _ _ _ _ _ _ _
        _ _ _ _ _ _ _ D D D
      */
    test('registers missed shots', () => {
      const misses = [
        [0, 0],
        [0, 9],
        [3, 3],
        [4, 1],
        [6, 3],
        [8, 5],
      ];
      misses.forEach(([row, col]) => fullBoard.receiveAttack({ row, col }));
      expect(fullBoard.shotRegistry.isSubsetOf(expectedRegistry)).toBe(true);
    });

    test('registers hits', () => {
      const hits = [
        [2, 0], // Submarine 1st hit
        [2, 4], // Carrier 1st hit
        [4, 2], // Battleship
        [6, 4], // PatrolBoat 1st hit
        [9, 9], // Destroyer 1st hit
      ];
      hits.forEach(([row, col]) => {
        fullBoard.receiveAttack({ row, col });
        const ship = fullBoard.board[row][col];
        expect(ship.hits).toBe(1);
      });
      expect(fullBoard.shotRegistry.isSubsetOf(expectedRegistry)).toBe(true);
      const moreHits = [
        [2, 3], // Carrier 2nd hit
        [3, 0], // Submarine 2nd hit
        [9, 7], // Destroyer 2nd hit
      ];
      moreHits.forEach(([row, col]) => {
        fullBoard.receiveAttack({ row, col });
      });
      expect(fullBoard.shotRegistry.isSubsetOf(expectedRegistry)).toBe(true);
      expect(fullBoard.board[2][0].hits).toBe(2); // Submarine
      expect(fullBoard.board[9][9].hits).toBe(2); // Destroyer
      expect(fullBoard.board[2][4].hits).toBe(2); // Carrier
    });

    test('ignores repeated shots', () => {
      const sizeBeforeDuplicates = fullBoard.shotRegistry.size;
      const repeats = [
        [0, 0], // miss
        [3, 0], // Submarine 2nd hit
        [6, 4], // PatrolBoat 1st hit
        [8, 5], // miss
        [9, 7], // Destroyer 2nd hit
      ];
      repeats.forEach(([row, col]) => fullBoard.receiveAttack({ row, col }));
      expect(fullBoard.board[2][0].hits).toBe(2); // Submarine
      expect(fullBoard.board[9][9].hits).toBe(2); // Destroyer
      expect(fullBoard.board[2][4].hits).toBe(2); // Carrier
      expect(fullBoard.shotRegistry.size).toBe(sizeBeforeDuplicates);
    });

    test('registers cells around sunken ships (QOL)', () => {
      const lastHits = [
        [4, 0], // Submarine down
        [6, 5], // PatrolBoat down
        [9, 8], // Destroyer down
      ];
      const sunkenShips = [
        fullBoard.board[2][0],
        fullBoard.board[6][4],
        fullBoard.board[9][7],
      ];
      lastHits.forEach(([row, col]) => fullBoard.receiveAttack({ row, col }));
      sunkenShips.forEach((ship) => expect(ship.isSunk()).toBe(true));
      expect(fullBoard.shotRegistry.isSubsetOf(expectedRegistry)).toBe(true);
      expect(fullBoard.shotRegistry.size).toBe(expectedRegistry.size);
    });
  });

  describe('.hasShips', () => {
    describe('fresh, clean board', () => {
      const fresh = new GameBoard();

      test('has no ships', () => {
        expect(fresh.hasShips()).toBe(false);
      });
    });

    describe('full board', () => {
      const fullBoard = new GameBoard();
      const ships = [
        { horizontal: true, length: 5, row: 2, col: 3 }, // Carrier
        { horizontal: true, length: 3, row: 9, col: 7 }, // Destroyer
        { horizontal: false, length: 4, row: 4, col: 2 }, // Battleship
        { horizontal: false, length: 3, row: 2, col: 0 }, // Submarine
        { horizontal: true, length: 2, row: 6, col: 4 }, // PatrolBoat
      ];
      ships.forEach((shipData) => fullBoard.placeShip(shipData)); // same layout as in previous scenarios

      test('first round/all ships are untouched)', () => {
        expect(fullBoard.hasShips()).toBe(true);
      });

      test('some, but not all ships are sunk', () => {
        const hits = [
          [2, 3],
          [2, 4],
          [2, 5],
          [2, 6],
          [2, 7], // Carrier
          [2, 0],
          [3, 0],
          [4, 0], // Submarine
          [4, 2],
          [5, 2],
          [6, 2],
          [7, 2], // Battleship
          [9, 7],
          [9, 8],
          [9, 9], // Destroyer
        ];
        hits.forEach(([row, col]) => fullBoard.receiveAttack({ row, col }));
        expect(fullBoard.hasShips()).toBe(true);
      });

      test('all ships are sunk', () => {
        fullBoard.receiveAttack({ row: 6, col: 4 });
        fullBoard.receiveAttack({ row: 6, col: 5 }); // sinking the last ship (PatrolBoat)
        expect(fullBoard.hasShips()).toBe(false);
      });
    });
  });
});
