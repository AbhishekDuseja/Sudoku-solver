const sudokuContainer = document.getElementById('sudoku-container');
let focusedCell = null;

// Function to create Sudoku grid
function createSudokuGrid() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('input', handleCellInput);
            cell.addEventListener('keydown', handleCellNavigation);
            sudokuContainer.appendChild(cell);
        }
    }
}

// Function to handle cell input
function handleCellInput(event) {
    const value = event.target.value;
    if (value !== '' && isNaN(parseInt(value))) {
        event.target.value = '';
    }
}

// Function to handle cell navigation using arrow keys
function handleCellNavigation(event) {
    const key = event.key;
    const currentCell = event.target;
    const currentRow = parseInt(currentCell.dataset.row);
    const currentCol = parseInt(currentCell.dataset.col);
    
    let nextRow = currentRow;
    let nextCol = currentCol;

    if (key === 'ArrowUp' && currentRow > 0) {
        nextRow--;
    } else if (key === 'ArrowDown' && currentRow < 8) {
        nextRow++;
    } else if (key === 'ArrowLeft' && currentCol > 0) {
        nextCol--;
    } else if (key === 'ArrowRight' && currentCol < 8) {
        nextCol++;
    }

    const nextCell = document.querySelector(`.cell[data-row="${nextRow}"][data-col="${nextCol}"]`);
    if (nextCell) {
        nextCell.focus();
        focusedCell = nextCell;
    }
}

// Function to get Sudoku board from UI
function getSudokuBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
            row.push(parseInt(cell.value) || 0);
        }
        board.push(row);
    }
    return board;
}

// Function to display solved Sudoku board
function displaySolvedSudoku(solvedBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
            cell.value = solvedBoard[i][j];
        }
    }
}

// Function to check if a number can be placed at a given position
function isSafe(board, row, col, num) {
    // Check if the number is already present in the current row or column
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }

    // Check if the number is already present in the current 3x3 subgrid
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
}

// Backtracking function to solve Sudoku
function solveSudokuUtil(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudokuUtil(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Wrapper function to solve Sudoku
function solveSudoku() {
    const sudokuBoard = getSudokuBoard();
    if (solveSudokuUtil(sudokuBoard)) {
        displaySolvedSudoku(sudokuBoard);
    } else {
        alert("No solution exists!");
    }
}

createSudokuGrid();
