<?php
	if(isset($_GET['getGoBoard'])){
		
		if(file_exists("goboard.txt")){
			$board = fopen("goboard.txt", "r");
			echo fread($board, filesize("goboard.txt"));
			fclose($board);
		}

	}else if(isset($_POST['goBoard'])){
		
		$board = fopen("goboard.txt", "w");
		fwrite($board, $_POST['goBoard']);
		fclose($board);
		
	}

?>

<head>
	<title>Go online</title>
</head>

<body>

<div id="godiv">
	<canvas id="goCanvas" onmousedown="place(event)"></canvas><br><br>
	<input type="submit" onClick="passTurn()" value="Pass" style="margin:auto;display:block"/>
	<input id="playerButton" type="submit" onClick="changePlayer()" value="Play as white" style="margin:auto;display:block"/>
	<script src="goscript.js" async></script>
</div>

</body>