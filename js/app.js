document.addEventListener('DOMContentLoaded', () => {
	const startBtn = document.querySelector('#start-btn');
	const scoreToDisplay = document.querySelector('.score-display');
	const linesDisplay = document.querySelector('.lines-display');
	const grid = document.querySelector('.grid');
	let squares = Array.from(grid.querySelectorAll('div'));
	const displayNextSquares = document.querySelectorAll('.next-grid div');
	const gridWidth = 10; // 10 squares
	const heightOfGrid = 20; // 20 squares
	let currentIndex = 0;
	const lastIndex = 199;
	let currentPosition = 4;
	let timerId = null;
	let score = 0;
	let lines = 0;

	// assign functions to keyCodes
	function controlEvents (event) {
		switch (event.keyCode) {
			case 37:
				moveLeft();
				break;
			case 38:
				rotateShape();
				break;
			case 39:
				moveRight();
				break;
			case 40:
				moveDown();
				break;
		}
	}

	document.addEventListener('keyup', controlEvents);

	// Tetrominoes
	const lTetromino = [
		[ 1, gridWidth + 1, gridWidth * 2 + 1, 2 ],
		[ gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2 ],
		[ 1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 ],
		[ gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2 ],
	];

	const zTetromino = [
		[ 0, gridWidth, gridWidth + 1, gridWidth * 2 + 1 ],
		[ gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1 ],
		[ 0, gridWidth, gridWidth + 1, gridWidth * 2 + 1 ],
		[ gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1 ],
	];

	const tTetromino = [
		[ 1, gridWidth, gridWidth + 1, gridWidth + 2 ],
		[ 1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1 ],
		[ gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1 ],
		[ 1, gridWidth, gridWidth + 1, gridWidth * 2 + 1 ],
	];
	const squareTetromino = [
		[ 0, 1, gridWidth, gridWidth + 1 ],
		[ 0, 1, gridWidth, gridWidth + 1 ],
		[ 0, 1, gridWidth, gridWidth + 1 ],
		[ 0, 1, gridWidth, gridWidth + 1 ],
	];

	const straightTetromino = [
		[ 1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1 ],
		[ gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3 ],
		[ 1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1 ],
		[ gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3 ],
	];

	const theTetrominoes = [ lTetromino, tTetromino, zTetromino, squareTetromino, straightTetromino ];

	// select tetris tetrominoes randomly
	let randomSelection = Math.floor(Math.random() * theTetrominoes.length);
	let currentRotationIndex = 0;
	let currentRotation = theTetrominoes[randomSelection][currentRotationIndex];

	// draw the shape
	function drawShape () {
		currentRotation.map((item) => squares[currentPosition + item].classList.add('block'));
	}

	// undraw the shape
	function undrawShape () {
		currentRotation.map((item) => squares[currentPosition + item].classList.remove('block'));
	}

	// move down shape
	function moveDown () {
		undrawShape();
		currentPosition += gridWidth;
		drawShape();
		freeze();
	}

	// currentRotation's item that contains 'block2' className (if the shape hasn't moved at all)
	const cointainsBlockTwo = currentRotation.some((index) => {
		squares[currentPosition + index].classList.contains('block2');
	});

	// move tetromino to right
	function moveRight () {
		undrawShape();
		const isAtRightEdge = currentRotation.some((index) => (currentPosition + index) % gridWidth === gridWidth - 1);
		if (!isAtRightEdge) currentPosition += 1;
		if (cointainsBlockTwo) currentPosition -= 1;
		drawShape();
	}

	// move tetromino to left
	function moveLeft () {
		undrawShape();
		const isAtLeftEdge = currentRotation.some((index) => (currentPosition + index) % gridWidth === 0);
		if (!isAtLeftEdge) currentPosition -= 1;
		if (cointainsBlockTwo) currentPosition += 1;
		drawShape();
	}

	// rotate tetromino
	function rotateShape () {
		undrawShape();
		currentRotationIndex++;
		if (currentRotationIndex === currentRotation.length) currentRotationIndex = 0;
		currentRotation = theTetrominoes[randomSelection][currentRotationIndex];
		drawShape();
	}

	// show next tetromino in displayNextSquares
	const displayNextWidth = 4;
	const displayNextIndex = 0;
	let nextRandomShapeIndex = 0;

	// this time, all 4 shapes is not needed. Simply display the tetromino
	const smallTetrominoes = [
		[ 1, displayNextWidth + 1, displayNextWidth * 2 + 1, 2 ], // lTetromino
		[ 0, displayNextWidth, displayNextWidth + 1, displayNextWidth * 2 + 1 ], // zTetromino
		[ 1, displayNextWidth, displayNextWidth + 1, displayNextWidth + 2 ], // tTetromino
		[ 0, 1, displayNextWidth, displayNextWidth + 1 ], // squareTetromino
		[ 1, displayNextWidth + 1, displayNextWidth * 2 + 1, displayNextWidth * 3 + 1 ], // straightTetromino
	];

	function displaySmallTetrominoes () {
		displayNextSquares.forEach((square) => {
			square.classList.remove('block');
		});
		// we'll also be selecting the smallTetrominoes' random. So, what's happening is each time the displaySmallTetrominoes function is evoked, we're removing any classNames from div's first by selecting next random tetromino
		smallTetrominoes[nextRandomShapeIndex].forEach((index) => {
			displayNextSquares[displayNextIndex + index].classList.add('block');
		});
	}

	function freeze () {
		// a lot will be happening in the freeze function. We need to freeze the tetromino if any or some of it's squares enter in square/s that contains className 'block3', the bottom of our grid essentially, OR if the nest square/s enter in the square/s with className 'block2'. If any of the above happens, tell the current tetromino to freeze the squares.
		if (
			currentRotation.some(
				(indexOfCurrentShape) =>
					squares[currentPosition + indexOfCurrentShape + gridWidth].classList.contains('block3') ||
					squares[currentPosition + indexOfCurrentShape + gridWidth].classList.contains('block2'),
			)
		) {
			currentRotation.forEach((index) => squares[index + currentPosition].classList.add('block2'));

			randomSelection = nextRandomShapeIndex;
			nextRandomShapeIndex = Math.floor(Math.random() * theTetrominoes.length);
			currentRotation = theTetrominoes[randomSelection][currentRotationIndex];
			currentPosition = 4;
			drawShape();
			displaySmallTetrominoes();
			gameOver();
			addScore();
		}
	}

	// game start
	startBtn.addEventListener('click', () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		} else {
			drawShape();
			timerId = setInterval(moveDown, 1000);
			nextRandomShapeIndex = Math.floor(Math.random() * theTetrominoes.length);
			displaySmallTetrominoes();
		}
	});

	// game over
	function gameOver () {
		if (currentRotation.some((indexItem) => squares[currentPosition + indexItem].classList.contains('block2'))) {
			scoreToDisplay.textContent = 'The End';
			clearInterval(timerId);
		}
	}

	// add score to display
	function addScore () {
		for (let currentIndex = 0; currentIndex < lastIndex; currentIndex += gridWidth) {
			const row = [
				currentIndex,
				currentIndex + 1,
				currentIndex + 2,
				currentIndex + 3,
				currentIndex + 4,
				currentIndex + 5,
				currentIndex + 6,
				currentIndex + 7,
				currentIndex + 8,
				currentIndex + 9,
			];

			if (row.every((indextItem) => squares[indextItem].classList.contains('block2'))) {
				score += 10;
				lines += 1;
				scoreToDisplay.textContent = score;
				linesDisplay.textContent = lines;
				row.forEach((indexItem) => {
					squares[indexItem].classList.remove('block2') || squares[indexItem].classList.remove('block');
				});
				// splice squares array
				const squaresRemoved = squares.splice(currentIndex, gridWidth);
				squares = squaresRemoved.concat(squares);
				squares.forEach((cell) => grid.appendChild(cell));
			}
		}
	}
});
