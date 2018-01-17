<?php

$fn= 'board.txt';

$str = file_get_contents('board.txt');
$arr = unserialize($str);
$i = 1;
foreach($arr as $key => $value) {
	$key = substr($key, 0, 15);
        $len = strlen($key);
        $key = $key . str_repeat("\t", 30 -  $len);
	    echo $i. "\t" . $key . "\t" . $value."\r\n";
            $i = $i + 1;
}

?>  
