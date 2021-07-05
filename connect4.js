/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const playerTurn = document.getElementById('playerTurn'); // Displays Player Turn below Board

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  board.length = 0;
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    board.push(row);
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  const htmlBoard = document.getElementById('board')
  htmlBoard.innerHTML = '';
  // Creates a row at the top of the table with special properties; adds event listener for top row referring to handleClick below; 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creates cells for top row each with a unique ID number corresponding to the column; 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Adds body rows to table corresponding to Height and Width; Sets each cell to a specific ID (height#-width#)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${HEIGHT - 1 - y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
  playerTurn.innerHTML = '';
  const playerTurnMsg = document.createElement('span');
  const playerTurnToken = document.createElement('div');
  playerTurnMsg.innerText = `Player ${currPlayer}'s Turn`
  playerTurn.classList.add('player1Msg');
  playerTurnToken.classList.add('player1Token');
  playerTurn.append(playerTurnMsg);
  playerTurn.append(playerTurnToken);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = 0; i < HEIGHT; i++) {
    if (board[i][x] === null) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const cell = document.getElementById(`${y}-${x}`)
  const gamePiece = document.createElement('div')
  gamePiece.classList.add('piece')
  gamePiece.classList.add(`p${currPlayer}`)
  cell.append(gamePiece)
  dropDown(cell, gamePiece)
}

// Set Up Position and Start setInterval for dropDown
const dropDown = (position, piece) => {
  let yPos = position.offsetTop;
  piece.style.position = 'absolute';
  piece.style.top = `${-yPos + 150}px`;
  // This was the closest I could find to the top row
  piece.style.left = '5px';
  let interval = setInterval(() => dropDownMvt(piece, interval), 12)
}
// Downward Movement of Piece
const dropDownMvt = (piece, interval) => {
  let yPos = piece.offsetTop
  if (yPos < 10) {
    piece.style.top = `${yPos + 30}px`
  } else {
    piece.style.position = 'relative';
    piece.style.top = 'unset';
    piece.style.left = 'unset';
    clearInterval(interval);
  }
}

/** endGame: announce game end */
function endGame(msg) {
  lockTable();
  gameOverMsg();
  alert(msg)
}

function lockTable() {
  const top = document.getElementById('column-top')
  top.removeEventListener("click", handleClick);
  top.setAttribute('id', 'gameovertop');
}

function gameOverMsg() {
  const gameOverMsg = document.createElement('span');
  playerTurn.innerHTML = '';
  if (!checkForTie()) {
    gameOverMsg.innerText = `Player ${currPlayer} wins!`;
    if (currPlayer === 1) {
      gameOverMsg.style.color = 'red';
    } else gameOverMsg.style.color = 'yellow';
  } else {
    gameOverMsg.innerText = 'TIE GAME!';
  }
  playerTurn.setAttribute('class', 'gameovermsg');
  playerTurn.append(gameOverMsg);
  const playAgain = document.createElement('div');
  playAgain.setAttribute('id', 'playAgain');
  playAgain.innerText = 'Click to Play Again';
  playAgain.addEventListener('click', restartGame)
  playerTurn.append(playAgain);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    const winningPiece = document.getElementById(`${y}-${x}`).querySelector('div')
    if (currPlayer === 1) {
      winningPiece.classList.add('winningPieceP1');
    }
    else {
      winningPiece.classList.add('winningPieceP2');
    }
    return endGame(`Player ${currPlayer} wins!`);
  }


  if (checkForTie()) {
    return endGame('TIE GAME!')
  }

  // switch players
  switchPlayers();
}

function switchPlayers() {
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  playerTurn.innerHTML = '';
  const playerTurnMsg = document.createElement('span');
  const playerTurnToken = document.createElement('div');

  playerTurnMsg.innerText = `Player ${currPlayer}'s Turn`

  if (currPlayer === 1) {
    playerTurn.classList.remove(...playerTurn.classList);
    playerTurn.classList.add('player1Msg');
    playerTurn.classList.remove('player2Msg');
    playerTurnToken.classList.add('player1Token');
    playerTurnToken.classList.remove('player2Token');
  } else {
    playerTurn.classList.remove(...playerTurn.classList);
    playerTurn.classList.add('player2Msg');
    playerTurn.classList.remove('player1Msg');
    playerTurnToken.classList.add('player2Token');
    playerTurnToken.classList.remove('player1Token');
  }
  playerTurn.append(playerTurnMsg);
  playerTurn.append(playerTurnToken);
}


// checkForTie: check if every cell on board has a number and end game if board is filled
function checkForTie() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x] === null) {
        return false;
      }
    }
  }
  return true;
}



/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Winning Parameters
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // Four Consecutive Values of X
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // Four Consecutive Values of Y in Array
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // Diagonal Winning Values in Array

      // Conditional For Winning Combinations Array
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Reset Game
function restartGame() {
  makeBoard();
  makeHtmlBoard();
  playerTurn.removeAttribute('class');
  playerTurn.innerHTML = '';
}

makeBoard();
makeHtmlBoard();


