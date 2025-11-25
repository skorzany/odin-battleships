import Player from './player.js';
import CpuPlayer from './cpuPlayer.js';
import { delay } from './utils.js';

export default class BattleshipsGame {
  constructor(viewer) {
    this.viewer = viewer;
    this.currentPlayer = null;
    this.otherPlayer = null;
  }

  // ===== GAME STATE MANIPULATION =====
  swapPlayers() {
    [this.currentPlayer, this.otherPlayer] = [
      this.otherPlayer,
      this.currentPlayer,
    ];
  }

  setupSinglePlayer() {
    this.gameMode = 'single';
    this.currentPlayer = new Player();
    this.otherPlayer = new CpuPlayer();
  }

  setupMultiPlayer() {
    this.gameMode = 'multi';
    this.currentPlayer = new Player();
    this.otherPlayer = new Player();
  }

  startSetupPhase() {
    this.viewer.drawSetupScreen();
    this.addStartListeners();
  }

  endSetupPhase() {
    this.removeStartListeners();
    this.viewer.eraseContent();
  }

  startPlacementPhase() {
    this.viewer.drawPlacementScreen();
    this.addFixedPlacementListeners();
  }

  updatePlacementPhase() {
    this.viewer.updatePlacementScreen(this.currentPlayer);
    this.addVaryingPlacementListeners();
  }

  endPlacementPhase() {
    this.removeVaryingPlacementListeners();
    this.removeFixedPlacementListeners();
    this.viewer.eraseContent();
  }

  startMainPhase() {
    this.viewer.drawMainScreen();
    this.viewer.highlightRightBoard();
    this.viewer.updateMainScreen(this.currentPlayer, this.otherPlayer);
    this.addMainListeners();
  }

  async updateMainPhase() {
    this.swapPlayers();
    this.removeMainListeners();
    if (this.currentPlayer.constructor.name.startsWith('Cpu'))
      await this.runAiPhase();
    else {
      if (this.gameMode === 'multi') {
        await this.viewer.showSplashScreen();
        this.addSplashListeners();
      }
      this.viewer.highlightRightBoard();
      this.viewer.updateMainScreen(this.currentPlayer, this.otherPlayer);
      this.addMainListeners();
    }
  }

  async runAiPhase(followup = false) {
    this.viewer.highlightLeftBoard();
    if (!followup) this.viewer.updateInfo(this.currentPlayer);
    const shipHit = CpuPlayer.sendAttack(this.otherPlayer);
    await delay(1250); // 'thinking'...
    this.viewer.updateBoards(this.otherPlayer, this.currentPlayer);
    if (shipHit) {
      if (this.otherPlayer.myBoard.hasShips()) await this.runAiPhase(true);
      else this.endMainPhase();
    } else await this.updateMainPhase();
  }

  endMainPhase() {
    this.removeMainListeners();
    this.viewer.announceGameOver(this.currentPlayer);
    this.addReplayListeners();
  }
  // ===== END OF GAME STATE MANIPULATION =====

  // ===== EVENT LISTENERS =====
  removeStartListeners() {
    this.viewer.startButtonL.removeEventListener(
      'click',
      this._setupButtonLHandler
    );
    this.viewer.startButtonR.removeEventListener(
      'click',
      this._setupButtonRHandler
    );
    this._setupButtonLHandler = null;
    this._setupButtonRHandler = null;
  }

  addStartListeners() {
    this.viewer.startButtonL.addEventListener(
      'click',
      (this._setupButtonLHandler = () => {
        this.setupSinglePlayer();
        this.endSetupPhase();
        this.startPlacementPhase();
        this.updatePlacementPhase();
      })
    );
    this.viewer.startButtonR.addEventListener(
      'click',
      (this._setupButtonRHandler = () => {
        this.setupMultiPlayer();
        this.endSetupPhase();
        this.startPlacementPhase();
        this.updatePlacementPhase();
      })
    );
  }

  removeFixedPlacementListeners() {
    // controls
    const [rotate, undo, done] = this.viewer.controls;
    rotate.removeEventListener('click', this._rotateHandler);
    undo.removeEventListener('click', this._undoHandler);
    done.removeEventListener('click', this._doneHandler);
    this._rotateHandler = null;
    this._undoHandler = null;
    this._doneHandler = null;
    // drop zone
    this.viewer.mainBoardR.removeEventListener('click', this._dragoverHandler);
    this.viewer.mainBoardR.removeEventListener('click', this._dropHandler);
    this._dragoverHandler = null;
    this._dropHandler = null;
  }

  addFixedPlacementListeners() {
    // controls
    const [rotate, undo, done] = this.viewer.controls;
    rotate.addEventListener(
      'click',
      (this._rotateHandler = () => {
        this.viewer.flipAuxBoard();
        this.updatePlacementPhase();
      })
    );
    undo.addEventListener(
      'click',
      (this._undoHandler = () => {
        this.currentPlayer.myBoard.undoLastShip();
        this.updatePlacementPhase();
      })
    );
    done.addEventListener(
      'click',
      (this._doneHandler = async () => {
        if (this.gameMode === 'single') {
          this.otherPlayer.placeShips();
          this.endPlacementPhase();
          this.startMainPhase();
        } else {
          this.swapPlayers();
          await this.viewer.showSplashScreen();
          this.addSplashListeners();
          if (!this.currentPlayer.myBoard.hasShips()) {
            this.viewer.resetAuxBoard();
            this.updatePlacementPhase();
          } else {
            this.endPlacementPhase();
            this.startMainPhase();
          }
        }
      })
    );
    // drop zone
    this.viewer.mainBoardR.addEventListener(
      'dragover',
      (this._dragoverHandler = (e) => e.preventDefault())
    );
    this.viewer.mainBoardR.addEventListener(
      'drop',
      (this._dropHandler = (e) => {
        e.preventDefault();
        const draggedShip = document.getElementById('dragged-ship');
        const shipData = e.dataTransfer.getData('ship').split(';');
        const [offset, length] = [shipData[0], shipData[1]].map(Number);
        const horizontal = shipData[2] === 'true';
        let [row, col] = Object.values(e.target.dataset).map(Number);
        if (horizontal) col -= offset;
        else row -= offset;
        if (
          this.currentPlayer.myBoard.placeShip({ row, col, length, horizontal })
        ) {
          draggedShip.removeEventListener('dragstart', this._dragstartHandler);
          draggedShip.removeEventListener('dragend', this._dragendHandler);
          draggedShip.remove();
          this.updatePlacementPhase();
        }
      })
    );
  }

  removeVaryingPlacementListeners() {
    this.viewer.availableShips.forEach((ship) => {
      ship.removeEventListener('dragstart', this._dragstartHandler);
      ship.removeEventListener('dragend', this._dragendHandler);
    });
    this._dragstartHandler = null;
    this._dragendHandler = null;
  }

  addVaryingPlacementListeners() {
    this.viewer.availableShips.forEach((ship) => {
      ship.addEventListener(
        'dragstart',
        (this._dragstartHandler = (e) => {
          ship.id = 'dragged-ship';
          e.dataTransfer.effectAllowed = 'move';
          const rect = ship.getBoundingClientRect();
          const length = Math.floor(
            Math.max(rect.width, rect.height) /
              Math.min(rect.width, rect.height)
          );
          const cellSize = Math.max(rect.width, rect.height) / length;
          const horizontal = rect.height < rect.width;
          const offset = horizontal
            ? Math.floor((e.clientX - rect.left) / cellSize, 1)
            : Math.floor((e.clientY - rect.top) / cellSize, 1);
          const data = [offset, length, horizontal];
          e.dataTransfer.setData('ship', data.map(String).join(';')); // offset;length;horizontal
        })
      );
      ship.addEventListener(
        'dragend',
        (this._dragendHandler = () => ship.removeAttribute('id'))
      );
    });
  }

  addSplashListeners() {
    this.viewer.splash.addEventListener(
      'click',
      async () => {
        await this.viewer.hideSplashScreen();
      },
      { once: true }
    );
  }

  removeMainListeners() {
    this.viewer.mainBoardR.removeEventListener('click', this._mainClickHandler);
    this._mainClickHandler = null;
  }

  addMainListeners() {
    this.viewer.mainBoardR.addEventListener(
      'click',
      (this._mainClickHandler = async (e) => {
        const element = e.target;
        if (element.classList.contains('cell')) {
          const [row, col] = [element.dataset.row, element.dataset.col].map(
            Number
          );
          const enemyBoard = this.otherPlayer.myBoard;
          const shipHit = enemyBoard.receiveAttack({ row, col });
          if (shipHit !== null) {
            this.viewer.updateMainScreen(this.currentPlayer, this.otherPlayer);
            if (shipHit === false) await this.updateMainPhase();
            else if (!enemyBoard.hasShips()) this.endMainPhase();
          }
        }
      })
    );
  }

  addReplayListeners() {
    this.viewer.endButton.addEventListener(
      'click',
      () => {
        this.viewer.eraseContent();
        this.startSetupPhase();
      },
      { once: true }
    );
  }
  // ===== END OF EVENT LISTENERS =====
}
