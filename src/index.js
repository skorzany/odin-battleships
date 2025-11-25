import BattleshipsGame from './battleships.js';
import BattleshipsViewer from './viewer.js';

const viewer = new BattleshipsViewer();
const game = new BattleshipsGame(viewer);

game.startSetupPhase();
