<?php
    $f = fopen("stages.txt", "r");
    $result = "";
    $dummy = 0;
    while(!feof($f)){
        $line = fgets($f);
        $dummy++;
        $result.=$dummy.",";
    }
    echo $result;
    fclose($f);
?>