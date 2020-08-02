document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(grid.querySelectorAll('div'));
	const displayNextSquares = document.querySelectorAll('.next-grid div');
	const gridWidth = 10; // 10 squares
	const heightOfGrid = 20; // 20 squares
	let currentPosition = 4;
	let timerId = null;

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
		// freeze();
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

	drawShape();
});
