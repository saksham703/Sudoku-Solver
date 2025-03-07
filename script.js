// Add multiple configurations for the Sudoku board
const sudokuConfigurations = [
    [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ],
    [
      [null, null, null, 2, 6, null, 7, null, 1],
      [6, 8, null, null, 7, null, null, 9, null],
      [1, 9, null, null, null, 4, 5, null, null],
      [8, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, 6, null, 2, 9, null, null],
      [null, 5, null, null, null, 3, null, 2, 8],
      [null, null, 9, 3, null, null, null, 7, 4],
      [null, 4, null, null, 5, null, null, 3, 6],
      [7, null, 3, null, 1, 8, null, null, null],
    ],
    [
        [1, null, null, null, 2, 7, null, null, 6],
        [null, 3, null, 6, null, null, 4, null, null],
        [7, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, 1, 8, null, 3],
        [null, 8, 4, 3, null, 9, 6, 1, null],
        [6, null, 3, 7, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, 5],
        [null, null, 5, null, null, 4, null, 6, null],
        [8, null, null, 1, 7, null, null, null, 9],
    ]
    
  ];
  


// To store the original board state
let initialBoard = sudokuConfigurations[0];
let board = JSON.parse(JSON.stringify(initialBoard));

// Function to reset the current board to its initial state
function resetBoard() {
    board = JSON.parse(JSON.stringify(initialBoard));  // Reset the board to its original state
    renderBoard();  // Re-render the board with the original state
}

// Function to reset the board with a random configuration (New Game button)
function resetBoardToNewGame() {
    const randomIndex = Math.floor(Math.random() * sudokuConfigurations.length);
    initialBoard = sudokuConfigurations[randomIndex];
    board = JSON.parse(JSON.stringify(initialBoard));
    renderBoard();  // Re-render the board with the new configuration
}

// Function to render the Sudoku board
function renderBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = ''; // Clear the current board

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = board[i][j] || '';  // Display the value or empty if null
            input.disabled = initialBoard[i][j] !== null;  // Disable input for pre-filled cells
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                board[i][j] = value ? parseInt(value, 10) : null;
            });
            boardElement.appendChild(input);
        }
    }
}

// Function to check if the Sudoku board is valid
function isValid(board) {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = board[i][j];
            if (value !== null) {
                const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                if (rows[i].has(value) || cols[j].has(value) || boxes[boxIndex].has(value)) {
                    return false;
                }
                rows[i].add(value);
                cols[j].add(value);
                boxes[boxIndex].add(value);
            }
        }
    }
    return true;
}

// Selectors for Modal
const modal = document.getElementById('modal-popup');
const modalMessage = document.getElementById('modal-message');
const closeModalSudoku = document.getElementById('close-modal-sudoku');

// Function to show modal with a message
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Close modal on clicking the close button
closeModalSudoku.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Updated checkValidity function with modal
function checkValidity() {
    if (isValid(board)) {
        const allFilled = board.every(row => row.every(cell => cell !== null));
        if (allFilled) {
            showModal('Sudoku Solved');
        } else {
            showModal('Sudoku is valid. You are on the right track.');
        }
    } else {
        showModal('Sudoku is not valid. Duplicate values found');
    }
}

// Updated solveBoard function with modal
function solveBoard() {
    if (!isValid(board)) {
        showModal('Invalid board configuration. Please correct it first.');
        return;
    }

    if (solveSudoku(board)) {
        renderBoard();
        showModal('Sudoku Solved!');
    } else {
        showModal('No solution exists.');
    }
}

// Function to check if the board is valid
function isValid(board) {
    const isUnique = (arr) => {
        const nums = arr.filter((num) => num !== null);
        return nums.length === new Set(nums).size;
    };

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        const row = board[i];
        const col = board.map((row) => row[i]);
        if (!isUnique(row) || !isUnique(col)) {
            return false;
        }
    }

    // Check 3x3 subgrids
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            const subgrid = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    subgrid.push(board[row + i][col + j]);
                }
            }
            if (!isUnique(subgrid)) {
                return false;
            }
        }
    }

    return true;
}

// Function to solve the Sudoku board
function solveSudoku(board) {
    const findEmpty = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === null) {
                    return [i, j];
                }
            }
        }
        return null;
    };

    const isValidPlacement = (row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
            const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
            const boxCol = Math.floor(col / 3) * 3 + (i % 3);
            if (board[boxRow][boxCol] === num) {
                return false;
            }
        }
        return true;
    };

    const solve = () => {
        const empty = findEmpty();
        if (!empty) return true;

        const [row, col] = empty;
        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(row, col, num)) {
                board[row][col] = num;
                if (solve()) return true;
                board[row][col] = null;
            }
        }
        return false;
    };

    return solve();
}



// Event listeners for buttons
document.getElementById('reset-btn').addEventListener('click', resetBoard); // Reset button functionality
document.getElementById('check-btn').addEventListener('click', checkValidity);
document.getElementById('solve-btn').addEventListener('click', solveBoard);

// Event listener for New Game button
document.getElementById('new-game-btn').addEventListener('click', resetBoardToNewGame); // New Game button functionality

// Initial render of the board
renderBoard();


const themeToggle = document.getElementById('theme-toggle');

// Check if the user has a saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode | 🌞';  // Light mode button text
} else {
    document.body.classList.add('light-mode');
    themeToggle.textContent = 'Dark Mode | 🌙';  // Dark mode button text     s
}

// Toggle between light and dark mode
themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.replace('light-mode', 'dark-mode');
        themeToggle.textContent = 'Light Mode | 🌞';  // Update button text to dark mode icon
        localStorage.setItem('theme', 'dark');  // Save user preference
    } else {
        document.body.classList.replace('dark-mode', 'light-mode');
        themeToggle.textContent = 'Dark Mode | 🌙';  // Update button text to light mode icon
        localStorage.setItem('theme', 'light');  // Save user preference
    }
});

// const connectIcon = document.getElementById('connect-icon');
// const socialLinks = document.getElementById('social-links');

// connectIcon.addEventListener('click', () => {
//     // Toggle the visibility of the social media links
//     document.querySelector('.connect-container').classList.toggle('show-social');
// });


// DOM Elements
const connectIcon = document.getElementById('connect-icon');
const socialModal = document.getElementById('social-modal');
const closeModal = document.getElementById('close-modal');

// Show Modal
connectIcon.addEventListener('click', () => {
    socialModal.classList.remove('hidden');
});

// Hide Modal
closeModal.addEventListener('click', () => {
    socialModal.classList.add('hidden');
});

// Close Modal when clicking outside the content
socialModal.addEventListener('click', (event) => {
    if (event.target === socialModal) {
        socialModal.classList.add('hidden');
    }
});


