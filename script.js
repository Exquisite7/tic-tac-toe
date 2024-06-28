const Player = (name, marker) => {
    return { name, marker };
  };

const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if(board[index] === "") {
            board[index] = marker; 
            return true;
        }
        return false;
    };
    
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateBoard, resetBoard };
})();

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const getCurrentPlayer = () => currentPlayer;
  
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6] 
      ];
  
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return currentPlayer;
        }
      }
  
      if (board.every(cell => cell !== "")) {
        return "tie";
      }
  
      return null;
    };
  
    return { switchPlayer, getCurrentPlayer, checkWinner };
  })();
  
  // Display Controller Module
  const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const messageDiv = document.getElementById("message");
    const restartButton = document.getElementById("restart");
  
    const renderBoard = () => {
      gameboardDiv.innerHTML = "";
      const board = Gameboard.getBoard();
  
      board.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", () => handleCellClick(index));
        gameboardDiv.appendChild(cellDiv);
      });
    };
  
    const handleCellClick = (index) => {
      const currentPlayer = GameController.getCurrentPlayer();
      if (Gameboard.updateBoard(index, currentPlayer.marker)) {
        renderBoard();
        const winner = GameController.checkWinner();
        if (winner) {
          displayMessage(winner === "tie" ? "It's a tie!" : `${winner.name} wins!`);
        } else {
          GameController.switchPlayer();
          displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
        }
      }
    };
  
    const displayMessage = (message) => {
      messageDiv.textContent = message;
    };
  
    restartButton.addEventListener("click", () => {
      Gameboard.resetBoard();
      renderBoard();
      displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
    });
  
    return { renderBoard, displayMessage };
  })();
  
  // Initialize Game
  document.addEventListener("DOMContentLoaded", () => {
    DisplayController.renderBoard();
    DisplayController.displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
  });