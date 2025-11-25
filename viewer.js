import { delay } from './utils.js';

export default class BattleshipsViewer {
  constructor() {
    // fixed elements
    this.infoMain = document.getElementById('game-info');
    this.content = document.getElementById('content');
    this.splash = document.querySelector('.splash');
    [this.columnL, this.columnR] = document.querySelectorAll('.column');
    [this.infoL, this.infoR] = document.querySelectorAll('h3');
    // varying elements
    this.clearVaryingElements();
  }

  // ===== STATIC METHODS =====
  static createAuxBoard() {
    const board = document.createElement('div');
    board.classList.add('board-aux-h');
    for (let n = 0; n < 6 * 9; n += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell-aux');
      if (n === 14) cell.id = 'counter-v';
      else if (n === 34) cell.id = 'counter-h';
      board.appendChild(cell);
    }
    return board;
  }

  static createMainBoard() {
    const board = document.createElement('div');
    const letters = document.createElement('div');
    const numbers = document.createElement('div');
    const cells = document.createElement('div');

    board.classList.add('board');
    letters.classList.add('letters');
    numbers.classList.add('numbers');
    cells.classList.add('cells');
    [letters, numbers, cells].forEach((element) => board.appendChild(element));

    for (let i = 0; i < 10; i += 1) {
      const letter = document.createElement('div');
      letter.classList.add('ltr');
      letter.textContent = String.fromCharCode('A'.charCodeAt() + i);
      letters.appendChild(letter);

      const number = document.createElement('div');
      number.classList.add('num');
      number.textContent = i + 1;
      numbers.appendChild(number);

      for (let j = 0; j < 10; j += 1) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cells.appendChild(cell);
      }
    }
    return board;
  }

  static createControls() {
    const controls = document.createElement('div');
    const btnLabels = ['Rotate', 'Undo', 'Done'];

    controls.classList.add('controls');
    btnLabels.forEach((label) => {
      const button = document.createElement('button');
      button.textContent = label;
      controls.appendChild(button);
    });
    return controls;
  }
  // ===== END OF STATIC METHODS =====

  // ===== TEARDOWN STUFF =====
  clearVaryingElements() {
    this.startButtonL = null;
    this.startButtonR = null;
    this.auxBoard = null;
    this.counterH = null;
    this.counterV = null;
    this.controls = null;
    this.mainBoardL = null;
    this.mainBoardR = null;
    this.endButton = null;
    this.availableShips = [];
  }

  eraseContent() {
    this.infoMain.textContent = '';
    this.infoMain.style.color = 'inherit';
    this.infoL.textContent = '';
    this.infoR.textContent = '';
    while (this.infoL.nextElementSibling)
      this.infoL.nextElementSibling.remove();
    while (this.infoR.nextElementSibling)
      this.infoR.nextElementSibling.remove();
    this.endButton?.remove();
    this.clearVaryingElements();
  }
  // ===== END OF TEARDOWN STUFF =====

  // ===== SPLASH SCREEN VIEW =====
  async showSplashScreen(ms = 400) {
    await delay(ms);
    this.splash.classList.remove('hidden');
  }

  async hideSplashScreen(ms = 400) {
    await delay(ms);
    this.splash.classList.add('hidden');
  }
  // ===== END OF SPLASH SCREEN VIEW =====

  // ===== START GAME VIEW =====
  drawSetupScreen() {
    const button = document.createElement('button');
    button.textContent = 'START';
    button.classList.add('button-large');
    // left column
    this.infoL.textContent = 'Single player (vs A.I.)';
    this.columnL.appendChild(button);
    this.startButtonL = button;
    // right column
    const buttonClone = button.cloneNode(true);
    this.infoR.textContent = 'Two players (hot seat)';
    this.columnR.appendChild(buttonClone);
    this.startButtonR = buttonClone;
  }
  // ===== END OF START GAME VIEW =====

  // ===== PLACEMENT PHASE VIEW =====
  drawPlacementScreen() {
    this.infoMain.textContent =
      'Place your ships by dragging them onto the board!';
    // left column
    this.infoL.textContent = 'Available ships';
    const boardAux = BattleshipsViewer.createAuxBoard();
    const controls = BattleshipsViewer.createControls();
    this.columnL.appendChild(boardAux);
    this.columnL.appendChild(controls);
    this.auxBoard = boardAux;
    this.controls = [...controls.children];
    this.counterH = document.getElementById('counter-h');
    this.counterV = document.getElementById('counter-v');
    // right column
    this.infoR.textContent = 'Your board';
    const boardMain = BattleshipsViewer.createMainBoard();
    this.columnR.appendChild(boardMain);
    this.mainBoardR = [...boardMain.children][boardMain.children.length - 1];
    this.highlightRightBoard();
  }

  eraseAvailableShips() {
    while (this.availableShips.length) {
      const ship = this.availableShips.pop();
      ship.remove();
    }
  }

  drawAvailableShips(player) {
    const { placedShips } = player.myBoard;
    const currentOrientation = this.auxBoard.className.slice(-1);
    const availableShips = {
      carrier: placedShips.filter((ship) => ship.length === 5).length === 0,
      battleship: placedShips.filter((ship) => ship.length === 4).length === 0,
      destroyer: placedShips.filter((ship) => ship.length === 3).length !== 2,
      patrolBoat: placedShips.filter((ship) => ship.length === 2).length === 0,
    };
    Object.entries(availableShips).forEach(([shipName, isAvailable]) => {
      if (isAvailable) {
        const ship = document.createElement('div');
        ship.classList.add('ship', `${shipName}-${currentOrientation}`);
        ship.draggable = true;
        this.auxBoard.appendChild(ship);
        this.availableShips.push(ship);
      }
    });
  }

  drawPlacedShips(player) {
    const { board } = player.myBoard;
    [...this.mainBoardR.children].forEach((cell) => {
      const [row, col] = [cell.dataset.row, cell.dataset.col].map(Number);
      if (board[row][col] !== null) cell.classList.add('ship');
      else cell.classList.remove('ship');
    });
  }

  drawCounter(player) {
    const orientation = this.auxBoard.className.slice(-1);
    const { placedShips } = player.myBoard;
    const needed = placedShips.filter((ship) => ship.length === 3).length === 0;
    this.counterH.textContent = '';
    this.counterV.textContent = '';
    if (needed) {
      if (orientation === 'h') this.counterH.textContent = 'x2';
      else this.counterV.textContent = 'x2';
    }
  }

  drawControls(player) {
    const [undo, done] = this.controls.slice(1, 3);
    undo.disabled = player.myBoard.placedShips.length === 0;
    done.disabled = this.availableShips.length !== 0;
  }

  resetAuxBoard() {
    this.auxBoard.className = 'board-aux-h';
  }

  flipAuxBoard() {
    const currentClass = this.auxBoard.className;
    const currentOrientation = currentClass.slice(-1);
    const newOrientation = currentOrientation === 'h' ? 'v' : 'h';
    this.auxBoard.className = currentClass.slice(0, -1) + newOrientation;
  }

  updatePlacementScreen(player) {
    this.eraseAvailableShips();
    this.drawAvailableShips(player);
    this.drawPlacedShips(player);
    this.drawCounter(player);
    this.drawControls(player);
  }
  // ===== END OF PLACEMENT PHASE VIEW =====

  // ===== MAIN GAME VIEW =====
  highlightLeftBoard() {
    this.mainBoardL?.classList.add('in-focus');
    this.mainBoardR?.classList.remove('in-focus');
  }

  highlightRightBoard() {
    this.mainBoardL?.classList.remove('in-focus');
    this.mainBoardR?.classList.add('in-focus');
  }

  drawMainScreen() {
    const board = BattleshipsViewer.createMainBoard();
    const boardClone = board.cloneNode(true);
    // left column
    this.infoL.textContent = 'Your board';
    this.columnL.appendChild(board);
    this.mainBoardL = [...board.children][board.children.length - 1];
    // right column
    this.infoR.textContent = 'Enemy board';
    this.columnR.appendChild(boardClone);
    this.mainBoardR = [...boardClone.children][boardClone.children.length - 1];
  }

  updateInfo(player) {
    const isAi = player.constructor.name.startsWith('Cpu');
    this.infoMain.textContent = `Current player: ${isAi ? 'CPU' : 'You'}`;
    if (isAi) {
      const spinner = document.createElement('span');
      spinner.classList.add('spinner');
      this.infoMain.appendChild(spinner);
    }
  }

  updateBoards(player, enemy) {
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        const code = `${row}${col}`;
        const selector = `[data-row='${row}'][data-col='${col}']`;
        const playerCell = this.mainBoardL.querySelector(selector);
        const enemyCell = this.mainBoardR.querySelector(selector);
        playerCell.classList.remove('ship', 'hit', 'miss');
        enemyCell.classList.remove('ship', 'hit', 'miss');
        // player board - show everything
        const myCellHasShip = player.myBoard.board[row][col] !== null;
        const myCellWasAttacked = player.myBoard.shotRegistry.has(code);
        if (myCellWasAttacked) {
          const classToAdd = myCellHasShip ? 'hit' : 'miss';
          playerCell.classList.add(classToAdd);
        } else if (myCellHasShip) playerCell.classList.add('ship');
        // enemy board - show only registered shots
        const enemyCellHasShip = enemy.myBoard.board[row][col] !== null;
        const enemyCellWasAttacked = enemy.myBoard.shotRegistry.has(code);
        if (enemyCellWasAttacked) {
          const classToAdd = enemyCellHasShip ? 'hit' : 'miss';
          enemyCell.classList.add(classToAdd);
        }
      }
    }
  }

  updateMainScreen(player, enemy) {
    this.updateInfo(player);
    this.updateBoards(player, enemy);
  }
  // ===== END OF MAIN GAME VIEW =====

  // ===== GAME OVER VIEW =====
  announceGameOver(player) {
    const name = player.constructor.name.startsWith('Cpu') ? 'CPU' : 'You';
    this.infoMain.style.color = 'red';
    this.infoMain.textContent = `Game over. ${name} win!`;

    const replayButton = document.createElement('button');
    replayButton.textContent = 'Play again';
    replayButton.classList.add('replay');
    this.content.insertAdjacentElement('afterend', replayButton);
    this.endButton = replayButton;
  }
  // ===== END OF GAME OVER VIEW =====
}
