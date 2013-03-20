<?php
$imgName = $_POST["image"];
$imgAlt = $_POST["alt"];
$myFile = "test.json";
$fileWrite = fopen($myFile, "w") or die("can't open file");
$fileArray = json_decode($myFile);
echo $fileArray;