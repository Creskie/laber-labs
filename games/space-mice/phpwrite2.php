<?php

$fn= 'board.txt';
#$b = array (
#	'Team' => 150,
#	'Wenhao' => 50, 
#	'Qian' => 60, 
#	'Other' => 0,
#        'Test' => 120);
#

$name = $_POST["name"];
$score = $_POST["score"];

$str = file_get_contents('board.txt');
$arr = unserialize($str);
arsort($arr);
if($score == ""){
	# if score is null, return lowest socre in leaderboard
	echo end($arr);
} else {
	$score = (int)$score;
	# Else update leaderboard Score
	if (!array_key_exists($name, $arr)) {
		# if player name does not exists, delete the lowest score
		# in the leaderboard and update new player name and score
		array_pop($arr);
		$arr[$name] = $score;
		arsort($arr);
	} else {
		# if user exists, update the score only if 
		# the score to be submitted is higher than the score
		# submitted previously 
		if ($score > $arr[$name]) {
			$arr[$name] = $score;
			arsort($arr);
		}
	}

	# Write the results to file
	$string = serialize($arr);
	$fh = fopen($fn, 'w');
	fwrite($fh, $string);
	fclose($fh);
}	



?>  
