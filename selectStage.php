<?php
    $which = $_REQUEST['which'];
    $f = fopen("stages.txt", "r");
    $dummy = 0;
    while(!feof($f)){
        $line = fgets($f);
        if($which == $dummy){
            echo $line;
        }
        $dummy++;
    }
    fclose($f);
?>