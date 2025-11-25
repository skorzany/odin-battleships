import GameBoard from '../gameboard';

const randomIntInRange = (max) => Math.floor(Math.random() * max);

describe('GameBoard', () => {
  let testBoard;
  describe('instantiation', () => {
    let [randomN, randomRow] = [];
    beforeAll(() => {
      testBoard = new GameBoard();
    });
    beforeEach(() => {
      randomN = randomIntInRange(10);
      randomRow = testBoard.board[randomN];
    });
    test('has required properties', () => {
      const properties = ['board', 'placedShips', 'shotRegistry'];
      properties.forEach((property) => {
        expect(testBoard).toHaveProperty(property);
      });
    });

    test('has required methods', () => {
      expect(testBoard).toHaveProperty('placeShip', expect.any(Function));
      expect(testBoard).toHaveProperty('undoLastShip', expect.any(Function));
      expect(testBoard).toHaveProperty('receiveAttack', expect.any(Function));
      expect(testBoard).toHaveProperty('hasShips', expect.any(Function));
    });

    test('has expected type', () => {
      expect(testBoard.board).toBeInstanceOf(Array);
      expect(randomRow).toBeInstanceOf(Array);
      expect(testBoard.placedShips).toBeInstanceOf(Array);
      expect(testBoard.shotRegistry).toBeInstanceOf(Set);
    });

    test('has expected size', () => {
      expect(testBoard.board).toHaveLength(10);
      expect(randomRow).toHaveLength(10);
    });

    test('new board is empty', () => {
      expect(randomRow.every((cell) => cell === null));
      expect(testBoard.placedShips).toHaveLength(0);
      expect(testBoard.shotRegistry.size).toBe(0);
    });
  });
  describe('public interface', () => {
    const ships = {
      carrier: { horizontal: true, length: 5, row: 2, col: 3 },
      destroyer: { horizontal: true, length: 3, row: 9, col: 7 },
      submarine: { horizontal: false, length: 3, row: 2, col: 0 },
      battleship: { horizontal: false, length: 4, row: 4, col: 2 },
      patrolBoat: { horizontal: true, length: 2, row: 6, col: 4 },
    };
    const areaCodes = {
      carrier: [
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
      ],
      destroyer: ['86', '87', '88', '89', '96', '97', '98', '99'],
      submarine: ['10', '11', '20', '21', '30', '31', '40', '41', '50', '51'],
      battleship: [
        '31',
        '32',
        '33',
        '41',
        '42',
        '43',
        '51',
        '52',
        '53',
        '61',
        '62',
        '63',
        '71',
        '72',
        '73',
        '81',
        '82',
        '83',
      ],
      patrolBoat: [
        '53',
        '54',
        '55',
        '56',
        '63',
        '64',
        '65',
        '66',
        '73',
        '74',
        '75',
        '76',
      ],
    };
    const doubles = {
      carrier: {
        length: ships.carrier.length,
        hits: 0,
        areaCodes: areaCodes.carrier,
      },
      destroyer: {
        length: ships.destroyer.length,
        hits: 0,
        areaCodes: areaCodes.destroyer,
      },
      submarine: {
        length: ships.submarine.length,
        hits: 0,
        areaCodes: areaCodes.submarine,
      },
      battleship: {
        length: ships.battleship.length,
        hits: 0,
        areaCodes: areaCodes.battleship,
      },
      patrolBoat: {
        length: ships.patrolBoat.length,
        hits: 0,
        areaCodes: areaCodes.patrolBoat,
      },
    };
    describe('.placeShip()', () => {
      describe('valid placements', () => {
        beforeEach(() => {
          testBoard = new GameBoard();
        });
        test('places horizontal ships', () => {
          const horizontalShips = [
            ships.carrier,
            ships.patrolBoat,
            ships.destroyer,
          ];
          horizontalShips.forEach((ship) => {
            const wasPlaced = testBoard.placeShip(ship);
            expect(wasPlaced).toBe(true);
          });
          const destroyerColumn = [];
          testBoard.board.forEach((row) =>
            destroyerColumn.push(row[ships.destroyer.col])
          );
          //   expected board state:
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ C C C C C _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ P P _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ D D D
          expect(testBoard.placedShips).toHaveLength(3);
          expect(testBoard.board[ships.carrier.row]).toEqual([
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
          expect(testBoard.board[ships.patrolBoat.row]).toEqual([
            null,
            null,
            null,
            null,
            expect.objectContaining(doubles.patrolBoat),
            expect.objectContaining(doubles.patrolBoat),
            null,
            null,
            null,
            null,
          ]);
          expect(testBoard.board[ships.destroyer.row]).toEqual([
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
          expect(destroyerColumn).toEqual([
            null,
            null,
            expect.objectContaining(doubles.carrier),
            null,
            null,
            null,
            null,
            null,
            null,
            expect.objectContaining(doubles.destroyer),
          ]);
        });

        test('places vertical ships', () => {
          const verticalShips = [ships.submarine, ships.battleship];
          verticalShips.forEach((ship) => {
            const wasPlaced = testBoard.placeShip(ship);
            expect(wasPlaced).toBe(true);
          });
          //   expected board state:
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   S _ _ _ _ _ _ _ _ _
          //   S _ _ _ _ _ _ _ _ _
          //   S _ B _ _ _ _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          expect(testBoard.placedShips).toHaveLength(2);
          expect(testBoard.board[ships.submarine.row]).toEqual([
            expect.objectContaining(doubles.submarine),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ]);
          expect(testBoard.board[ships.battleship.row]).toEqual([
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
        });

        test('places both horizontal and vertical ships', () => {
          Object.values(ships).forEach((ship) => {
            const wasPlaced = testBoard.placeShip(ship);
            expect(wasPlaced).toBe(true);
          });
          const patrolBoatColumn = [];
          testBoard.board.forEach((row) =>
            patrolBoatColumn.push(row[ships.patrolBoat.col])
          );
          //   expected board state:
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   S _ _ C C C C C _ _
          //   S _ _ _ _ _ _ _ _ _
          //   S _ B _ _ _ _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ B _ P P _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ D D D
          expect(testBoard.placedShips).toHaveLength(5);
          expect(testBoard.board[ships.submarine.row]).toEqual([
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
          expect(testBoard.board[ships.patrolBoat.row]).toEqual([
            null,
            null,
            expect.objectContaining(doubles.battleship),
            null,
            expect.objectContaining(doubles.patrolBoat),
            expect.objectContaining(doubles.patrolBoat),
            null,
            null,
            null,
            null,
          ]);
          expect(patrolBoatColumn).toEqual([
            null,
            null,
            expect.objectContaining(doubles.carrier),
            null,
            null,
            null,
            expect.objectContaining(doubles.patrolBoat),
            null,
            null,
            null,
          ]);
        });
      });
      describe('collisions', () => {
        let expectedBoardState;
        beforeAll(() => {
          testBoard = new GameBoard();
          [
            ships.carrier,
            ships.submarine,
            ships.destroyer,
            ships.battleship,
          ].forEach((ship) => testBoard.placeShip(ship));
          expectedBoardState = testBoard.board;
        });
        //   expected board state:
        //   _ _ _ _ _ _ _ _ _ _
        //   _ _ _ _ _ _ _ _ _ _
        //   S _ _ C C C C C _ _
        //   S _ _ _ _ _ _ _ _ _
        //   S _ B _ _ _ _ _ _ _
        //   _ _ B _ _ _ _ _ _ _
        //   _ _ B _ _ _ _ _ _ _
        //   _ _ B _ _ _ _ _ _ _
        //   _ _ _ _ _ _ _ _ _ _
        //   _ _ _ _ _ _ _ D D D
        describe('areas out of bounds', () => {
          test('handles negative row/col index', () => {
            const negativeRow = {
              horizontal: true,
              length: 2,
              row: -1,
              col: 0,
            };
            const negativeCol = {
              horizontal: false,
              length: 3,
              row: 0,
              col: -2,
            };
            const wasPlaced1 = testBoard.placeShip(negativeRow);
            const wasPlaced2 = testBoard.placeShip(negativeCol);
            expect(wasPlaced1).toBe(false);
            expect(wasPlaced2).toBe(false);
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });

          test('handles horizontal out-of-bounds', () => {
            const oobHorizontal = {
              // would stick out of board's right edge
              horizontal: true,
              length: 2,
              row: 0,
              col: 9,
            };
            const wasPlaced = testBoard.placeShip(oobHorizontal);
            expect(wasPlaced).toBe(false);
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });

          test('handles vertical out-of-bounds', () => {
            const oobVertical = {
              // would stick out of board's bottom edge
              horizontal: false,
              length: 2,
              row: 9,
              col: 0,
            };
            const wasPlaced = testBoard.placeShip(oobVertical);
            expect(wasPlaced).toBe(false);
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });
        });
        describe('areas already occupied/unavailable', () => {
          test('handles horizontal overlaps', () => {
            const horizontalOverlaps = [
              [2, 2], // would overlap the carrier from the left side
              [2, 7], // would overlap the carrier from the right side
              [2, 0], // would overlap the submarine from top-right
              [7, 1], // would overlap the battleship from bottom-left
              [9, 7], // would be entirely on top of the destroyer
            ];
            horizontalOverlaps.forEach(([row, col]) => {
              const wasPlaced = testBoard.placeShip({
                row,
                col,
                length: 2,
                horizontal: true,
              });
              expect(wasPlaced).toBe(false);
            });
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });

          test('handles vertical overlaps', () => {
            const verticalOverlaps = [
              [1, 3], // would overlap the carrier from the top-left
              [2, 7], // would overlap the carrier from the bottom-right
              [3, 2], // would overlap the battleship from the top
              [7, 2], // would overlap the battleship from the bottom
              [2, 0], // would be entirely on top of the submarine
            ];
            verticalOverlaps.forEach(([row, col]) => {
              const wasPlaced = testBoard.placeShip({
                row,
                col,
                length: 2,
                horizontal: false,
              });
              expect(wasPlaced).toBe(false);
            });
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });

          test('handles gap violations', () => {
            const horizontalGaps = [
              [8, 8], // would be directly above the destroyer
              [9, 5], // would be directly to the left of the destroyer
              [2, 8], // would be directly to the right of the carrier
              [3, 4], // would be directly under the carrier
              [8, 3], // would touch the bottom-right corner of the battleship
              [1, 1], // would touch top-right corner of the submarine & top-left corner of the carrier
            ];
            const verticalGaps = [
              [0, 0], // would be directly above the submarine
              [8, 2], // would be directly under the battleship
              [5, 3], // would be right next to the battleship
              [3, 1], // would be squeezed between the submarine and the battleship
              [7, 6], // would touch the top-left corner of the destroyer
              [0, 8], // would touch the top-right corner of the carrier
            ];
            horizontalGaps.forEach(([row, col]) => {
              const wasPlaced = testBoard.placeShip({
                row,
                col,
                length: 2,
                horizontal: true,
              });
              expect(wasPlaced).toBe(false);
            });
            verticalGaps.forEach(([row, col]) => {
              const wasPlaced = testBoard.placeShip({
                row,
                col,
                length: 2,
                horizontal: false,
              });
              expect(wasPlaced).toBe(false);
            });
            expect(testBoard.placedShips).toHaveLength(4);
            expect(testBoard.board).toEqual(expectedBoardState);
          });
        });
      });
    });
    describe('.undoLastShip()', () => {
      describe('empty board/single ship', () => {
        beforeEach(() => {
          testBoard = new GameBoard();
        });
        test('handles empty board', () => {
          const spy = jest.spyOn(testBoard.placedShips, 'pop');
          testBoard.undoLastShip();
          expect(spy).not.toHaveBeenCalled();
          spy.mockRestore();
        });

        test('handles one random ship', () => {
          const emptyBoard = [];
          for (let i = 0; i < 10; i += 1) {
            const emptyRow = new Array(10).fill(null);
            emptyBoard.push(emptyRow);
          }
          const randomShip =
            Object.values(ships)[
              Math.floor(Math.random() * Object.values(ships).length)
            ];
          testBoard.placeShip(randomShip);
          const spy = jest.spyOn(testBoard.placedShips, 'pop');
          testBoard.undoLastShip();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(testBoard.placedShips).toHaveLength(0);
          expect(testBoard.board).toEqual(emptyBoard);
          spy.mockRestore();
        });
      });
      describe('full board', () => {
        beforeAll(() => {
          testBoard = new GameBoard();
        });
        beforeEach(() => {
          //   expected board state:
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   S _ _ C C C C C _ _
          //   S _ _ _ _ _ _ _ _ _
          //   S _ B _ _ _ _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ B _ P P _ _ _ _
          //   _ _ B _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ _ _ _
          //   _ _ _ _ _ _ _ D D D
          testBoard.board = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              doubles.submarine,
              null,
              null,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              doubles.patrolBoat,
              doubles.patrolBoat,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              doubles.destroyer,
              doubles.destroyer,
              doubles.destroyer,
            ],
          ];
        });
        test('one ship removed', () => {
          const placementOrder = [
            doubles.carrier,
            doubles.battleship,
            doubles.patrolBoat,
            doubles.destroyer,
            doubles.submarine,
          ];
          testBoard.placedShips = placementOrder;
          testBoard.undoLastShip();
          expect(testBoard.placedShips).toEqual([
            doubles.carrier,
            doubles.battleship,
            doubles.patrolBoat,
            doubles.destroyer,
          ]);
          expect(testBoard.board).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              null,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              null,
              null,
            ],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              doubles.patrolBoat,
              doubles.patrolBoat,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              doubles.destroyer,
              doubles.destroyer,
              doubles.destroyer,
            ],
          ]);
        });

        test('two ships removed', () => {
          const placementOrder = [
            doubles.battleship,
            doubles.submarine,
            doubles.carrier,
            doubles.patrolBoat,
            doubles.destroyer,
          ];
          testBoard.placedShips = placementOrder;
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          expect(testBoard.placedShips).toEqual([
            doubles.battleship,
            doubles.submarine,
            doubles.carrier,
          ]);
          expect(testBoard.board).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              doubles.submarine,
              null,
              null,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              doubles.carrier,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              null,
              null,
              doubles.battleship,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
          ]);
        });

        test('three ships removed', () => {
          const placementOrder = [
            doubles.submarine,
            doubles.destroyer,
            doubles.patrolBoat,
            doubles.battleship,
            doubles.carrier,
          ];
          testBoard.placedShips = placementOrder;
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          expect(testBoard.placedShips).toEqual([
            doubles.submarine,
            doubles.destroyer,
          ]);
          expect(testBoard.board).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              doubles.submarine,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [
              doubles.submarine,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              doubles.destroyer,
              doubles.destroyer,
              doubles.destroyer,
            ],
          ]);
        });

        test('four ships removed', () => {
          const placementOrder = [
            doubles.destroyer,
            doubles.patrolBoat,
            doubles.carrier,
            doubles.submarine,
            doubles.battleship,
          ];
          testBoard.placedShips = placementOrder;
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          testBoard.undoLastShip();
          expect(testBoard.placedShips).toEqual([doubles.destroyer]);
          expect(testBoard.board).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              doubles.destroyer,
              doubles.destroyer,
              doubles.destroyer,
            ],
          ]);
        });
      });
    });
    describe('.receiveAttack()', () => {
      let expectedRegistry;
      beforeAll(() => {
        testBoard = new GameBoard();
        Object.values(ships).forEach((ship) => testBoard.placeShip(ship));
      });
      beforeEach(() => {
        testBoard.shotRegistry.clear();
        testBoard.placedShips.forEach((ship) => {
          ship.hits = 0;
        });
      });
      //   expected board state:
      //   _ _ _ _ _ _ _ _ _ _
      //   _ _ _ _ _ _ _ _ _ _
      //   S _ _ C C C C C _ _
      //   S _ _ _ _ _ _ _ _ _
      //   S _ B _ _ _ _ _ _ _
      //   _ _ B _ _ _ _ _ _ _
      //   _ _ B _ P P _ _ _ _
      //   _ _ B _ _ _ _ _ _ _
      //   _ _ _ _ _ _ _ _ _ _
      //   _ _ _ _ _ _ _ D D D
      test('registers missed shots', () => {
        const misses = [
          [0, 0],
          [0, 9],
          [3, 3],
          [4, 1],
          [6, 3],
          [8, 5],
        ];
        expectedRegistry = new Set(['00', '09', '33', '41', '63', '85']);
        misses.forEach(([row, col]) => {
          const hit = testBoard.receiveAttack({ row, col });
          expect(hit).toBe(false);
        });
        expect(testBoard.shotRegistry).toEqual(expectedRegistry);
      });

      test('registers hits', () => {
        const hits = [
          [2, 0], // Submarine
          [2, 4], // Carrier
          [4, 2], // Battleship
          [6, 4], // PatrolBoat
          [9, 9], // Destroyer
        ];
        const followupHits = [
          [2, 3], // Carrier 2nd hit
          [3, 0], // Submarine 2nd hit
          [9, 7], // Destroyer 2nd hit
        ];
        expectedRegistry = new Set([
          '20',
          '23',
          '24',
          '30',
          '42',
          '64',
          '97',
          '99',
        ]);
        hits.forEach(([row, col]) => {
          const hit = testBoard.receiveAttack({ row, col });
          expect(hit).toBe(true);
        });
        expect(testBoard.shotRegistry.isSubsetOf(expectedRegistry)).toBe(true);
        followupHits.forEach(([row, col]) =>
          testBoard.receiveAttack({ row, col })
        );
        expect(testBoard.shotRegistry).toEqual(expectedRegistry);
      });

      test('ignores repeated attacks', () => {
        const attacks = [
          [0, 0], // miss
          [0, 9], // miss
          [2, 4], // carrier
          [6, 4], // patrolBoat
          [9, 9], // destroyer
        ];
        expectedRegistry = new Set(['00', '09', '24', '64', '99']);
        // first round of attacks
        attacks.forEach(([row, col]) => testBoard.receiveAttack({ row, col }));
        // now we repeat them all
        const registrySpy = jest.spyOn(testBoard.shotRegistry, 'add');
        attacks.forEach(([row, col]) => {
          const hit = testBoard.receiveAttack({ row, col });
          expect(registrySpy).not.toHaveBeenCalledWith(expect.any(String));
          expect(hit).toBeNull();
        });
        expect(testBoard.shotRegistry).toEqual(expectedRegistry);
        registrySpy.mockRestore();
      });

      test('registers ship area after sinking (QOL)', () => {
        const fatalHits = [
          [4, 0], // Submarine down
          [6, 5], // PatrolBoat down
          [9, 8], // Destroyer down
        ];
        expectedRegistry = new Set([
          '10',
          '11',
          '20',
          '21',
          '30',
          '31',
          '40',
          '41',
          '50',
          '51',
          '53',
          '54',
          '55',
          '56',
          '63',
          '64',
          '65',
          '66',
          '73',
          '74',
          '75',
          '76',
          '86',
          '87',
          '88',
          '89',
          '96',
          '97',
          '98',
          '99',
        ]);
        fatalHits.forEach(([row, col]) => {
          const dyingShip = testBoard.board[row][col];
          dyingShip.hits = dyingShip.length - 1; // pretend the ships are barely alive...
          testBoard.receiveAttack({ row, col }); // ...and deal them the final blow
        });
        expect(testBoard.shotRegistry).toEqual(expectedRegistry);
      });
    });
    describe('.hasShips()', () => {
      describe('clean, empty board', () => {
        test('empty board has no ships', () => {
          testBoard = new GameBoard();
          expect(testBoard.hasShips()).toBe(false);
        });
      });
      describe('full board', () => {
        beforeAll(() => {
          testBoard = new GameBoard();
          Object.values(ships).forEach((ship) => testBoard.placeShip(ship));
        });
        beforeEach(() =>
          testBoard.placedShips.forEach((ship) => {
            ship.hits = 0;
          })
        );
        test('first round/all ships at full health', () => {
          expect(testBoard.hasShips()).toBe(true);
        });

        test('some (but not all) ships are sunk', () => {
          const allButOneShips = testBoard.placedShips.slice(
            0,
            testBoard.placedShips.length - 1
          );
          allButOneShips.forEach((ship) => {
            ship.hits = ship.length;
          });
          expect(testBoard.hasShips()).toBe(true);
        });

        test('all ships are sunk', () => {
          const lastShip =
            testBoard.placedShips[testBoard.placedShips.length - 1];
          testBoard.placedShips.forEach((ship) => {
            ship.hits = ship !== lastShip ? ship.length : ship.length - 1;
          });
          lastShip.hit();
          expect(testBoard.hasShips()).toBe(false);
        });
      });
    });
  });
});
