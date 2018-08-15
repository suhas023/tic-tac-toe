var origBoard;
var won = false;
var huPlayer = "";
var aiPlayer = "";
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];

const replay = document.querySelector(".replay");
const cells = document.querySelectorAll('.cell');
const startMenu = document.querySelector('.startgame');

document.querySelector(".x").addEventListener("click", ()=> {
	huPlayer = "X";
	aiPlayer = "O";
	startMenu.style.display = "none";
	startGame();
});

document.querySelector(".o").addEventListener("click", ()=> {
	huPlayer = "O";
	aiPlayer = "X"
	startMenu.style.display = "none";
	startGame();
});


replay.addEventListener("click", () => {
	startGame();
	document.querySelector(".endgame").style.display = "none";
}
);

function startGame() {
	won = false;
	origBoard = Array.from(Array(9).keys());

	for(var i = 0; i < cells.length; i++)
	{
		cells[i].innerText = "";
		cells[i].addEventListener("click", turnClick, false);
	}
	if(aiPlayer === "X")
		turn( bestSpot(), "X");
}


function turnClick(square)
{
	if(typeof origBoard[square.target.id] == 'number')
	{
		turn(square.target.id, huPlayer);
		removeEvents();
		if(!checkWin(origBoard, huPlayer) && !checkTie()) {
			setTimeout(function(){console.log(bestSpot());turn(bestSpot(), aiPlayer);
				if(!won) setTimeout(addEvents,300);}, 1000);
		}
	}
	console.log(square.target.id);
}

function turn(squareId, player) {
	console.log(squareId, player);
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	document.getElementById(squareId).style.color = (player === "X" ? "#c80a46":"#4682b4" );
	let gameWon = checkWin(origBoard, player);
	if(gameWon) {
		won = true;
		gameOver(gameWon);
	}
}



function checkWin(board, player)
{
	let plays = board.reduce((a,e,i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for(let [index,win] of winCombos.entries())
	{
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon)
{
	for(let index of winCombos[gameWon.index])
	{
		document.getElementById(index).style.color = "#ffd700";

	}

	for(var i = 0; i < cells.length; i++)
	{
		cells[i].removeEventListener("click", turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Loose");
}


function declareWinner(who)
{
	document.querySelector(".endgame").style.display = "flex";
	document.querySelector(".endgame .text").innerText = who;
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
	if(emptySquares().length == 0){
		for(var i = 0; i < cells.length; i++)
		{
			cells[i].removeEventListener("click", turnClick, false);

		}
		declareWinner("Tie Game!");
		return true;

	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if(availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];
	for(var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}


function removeEvents () {
	for(var i = 0; i < cells.length; i++)
		{
			cells[i].removeEventListener("click", turnClick, false);
		}
}


function addEvents () {
	for(var i = 0; i < cells.length; i++)
	{
		cells[i].addEventListener("click", turnClick, false);

	}
}












































































