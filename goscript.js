

/* use for implementation
<div id="godiv">
	<canvas id="goCanvas" onmousedown="place(event)"></canvas><br><br>
	<input type="submit" onClick="passTurn()" value="Pass" style="margin:auto;display:block"/>
	<script src="goscript.js" async></script>
</div>*/

const size = 13, scale = Math.min(window.innerWidth / size - 1, 50), dotdist = 3;


const canvas = document.getElementById("goCanvas");
const g = canvas.getContext("2d");

const playerButton = document.getElementById("playerButton");

//will hold mouse position continuously
var mousePos;

var moveMade = false;

player = 0;
//0 == black
//1 == white


var boardSize = scale * size;

//resize canvas
canvas.setAttribute('width', boardSize);
canvas.setAttribute('height', boardSize);

//init empty board;
var board = [];
for(var i = 0; i < size; i++){
	board[i] = [];
	for(var j = 0; j < size; j++){
		board[i][j] = 0;
	}
}
//HUOM! board[size] == turn
board[size] = 0;

//get board
//update();
draw();

/*//keep updating every 5 seconds
setInterval(function(){
	update();
}, 5000);


//function definitions:


function update(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200){
			if(!moveMade){
				//if got board, use it
				if(xhttp.responseText)
					board = JSON.parse(xhttp.responseText);
				else//else set black's turn
					board[size] = 0;
				draw();
			}else
				moveMade = false;
		}
	};
	xhttp.open("GET", "?getGoBoard=true", true);
	xhttp.send();
}//update
*/

function passTurn(){
	if(board[size] != player)
		return;
	//change turn
	board[size] = 1 - board[size];
	
	//ONLY FOR LOCAL PLAY
	player = 1 - player;
	
	draw();
	
	/*
	//send new board
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("goBoard="+JSON.stringify(board));
	*/
}




//keep mouse pos in mousePos
canvas.addEventListener('mousemove', function(evt){
	mousePos = getMousePos(canvas, evt);
 }, false);

//make the pos a pair
function getMousePos(canvas, evt){
	var rect = canvas.getBoundingClientRect();
	return{
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}


function place(e){
	
	//x and y in board coordinates
	var x = mousePos.x / scale | 0;
	var y = mousePos.y / scale | 0;
	
	//if not turn or spot occupied, return
	if(board[size] != player || board[x][y] != 0)
		return;
	
	//place stone
	board[x][y] = player + 1;
	
	moveMade = true;
	
	//check if some need to be removed
	var chain = [];
	
	//recursively check if a chain has liberties
	function check(x, y, fromx, fromy){
		//if starting new chain, init it
		if(fromx == -1)
			chain = [];
		//if liberty, return true
		if(board[x][y] == 0)
			return true;
		//if not of same color, return false
		if(fromx != -1 && board[x][y] != board[fromx][fromy])
			return false;
		
		//checks if this one has been check already
		for(var i = 0; i < chain.length; i++){
			if(size * x + y == chain[i])
				return false;
		}
		
		//adds this to the chain
		chain.push(size * x + y);
		
		//checks adjacent: if any has a liberty, this has a liberty:
		//first liberty returns the function all the way up the stack
		if(x > 0){
			if(check(x-1, y, x, y))
				return true;
		}
		if(y > 0){
			if(check(x, y-1, x, y))
				return true;
		}
		if(x < size - 1){
			if(check(x+1, y, x, y))
				return true;
		}
		if(y < size - 1){
			if(check(x, y+1, x, y))
				return true;
		}
		
		//if none returned true and this is the starter stone, remove chain
		if(fromx == -1){
			for(var i = 0; i < chain.length; i++){
				board[(chain[i] / size) | 0][chain[i] % size] = 0;
			}
		}
		
		return false;
	}
	
	//start from each adjacent if not same color
	if(x > 0)
		if(board[x-1][y] == 2 - player)
			check(x-1, y, -1, -1);
	if(y > 0)
		if(board[x][y-1] == 2 - player)
			check(x, y-1, -1, -1);
	if(x < size - 1)
		if(board[x+1][y] == 2 - player)
			check(x+1, y, -1, -1);
	if(y < size - 1)
		if(board[x][y+1] == 2 - player)
			check(x, y+1, -1, -1);
	
	//change turn
	board[size] = 1 - board[size];
	
	
	//ONLY FOR LOCAL PLAY
	player = 1 - player;
	
	draw();
	
	/*
	//send new board
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("goBoard="+JSON.stringify(board));
	*/
}//place

//draw the board
function draw(){
	//BG
	g.fillStyle="#9e662e";
	g.fillRect(0, 0, boardSize, boardSize);
	
	//lines
	g.strokeStyle="black";
	g.lineWidth = 1;
	
	g.beginPath();
	for(var i = 0; i < size; i++){
		g.moveTo(i * scale + scale/2, scale/2);
		g.lineTo(i * scale + scale/2, boardSize - scale/2);
		g.moveTo(scale/2, i * scale + scale/2);
		g.lineTo(boardSize - scale/2, i * scale + scale/2);
	}
	g.stroke();
	
	if(board[size] != -1){
		//edges: indicate turn
		g.beginPath();
		var a = 3;
		var b = size * scale - a;
		g.moveTo(a, a);
		g.lineTo(a, b);
		g.lineTo(b, b);
		g.lineTo(b, a);
		g.lineTo(a, a);
		
		
		// Custom favicons for turn indication
		if(board[size] == 0){
			g.strokeStyle = 'black';
			//document.querySelector("link[rel='shortcut icon']").href = "/img/blackfavicon.ico";

		}else{
			g.strokeStyle = 'white';
			//document.querySelector("link[rel='shortcut icon']").href = "/img/whitefavicon.ico";
		}
		
		g.lineWidth = 3;
		g.stroke();
	}
		
	
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			
			//draw stone
			if(board[i][j] != 0){
				g.beginPath();
				g.arc(scale/2 + i * scale, scale/2 + j * scale, scale/2 - 2, 0, 2 * Math.PI);
				
				if(board[i][j] == 1)
					g.fillStyle = 'black';
				else
					g.fillStyle = 'white';
				
				
				g.fill();
				g.lineWidth = 0.5;
				g.strokeStyle = 'black';
				g.stroke();
			}else if((i == dotdist || i == size-dotdist - 1 || i == (size - 1) / 2) &&
					(j == dotdist || j == size-dotdist - 1 || j == (size - 1) / 2)){
				//draw marker dot
				g.beginPath();
				g.arc(scale/2 + i * scale, scale/2 + j * scale, scale/12, 0, 2 * Math.PI);
				
				g.fillStyle = 'black';
				
				g.fill();
			}
		}
	}
}//draw
	
	
	
	