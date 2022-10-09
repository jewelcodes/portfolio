<?php

/* epic portfolio website
   jewel, 2022 */

error_reporting(0);

if(!$_FILES["file"] || !$_FILES["file"]["size"]) {
    echo("no");
    return;
}

$extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);

do {
    $newFilePath = "../res/posts/postdata/" . uniqid("", TRUE) . "." . $extension;
} while(file_exists($newFilePath));

$fileName = pathinfo($newFilePath, PATHINFO_FILENAME) . "." . $extension;

if(move_uploaded_file($_FILES["file"]["tmp_name"], $newFilePath)) {
    echo("ok ");
    echo("/res/posts/postdata/" . $fileName);
} else {
    echo("no");
}

?>

