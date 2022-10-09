<?php

/* epic portfolio website
   jewel, 2022 */

error_reporting(0);

// file uploader for self-hosting images for the blog mainly
// file names server-side are MD5 hash + a unique ID and original local file
// names are ignored, except for the extension
// like post.php, it returns "ok" on success and "no" otherwise
// on success, it returns the path of the file too
//
//  "ok /res/posts/postdata/example.png"
//

if(!$_FILES["file"] || !$_FILES["file"]["size"]) {
    echo("no");
    return;
}

$extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
$newFilePath = "../res/posts/postdata/" . md5_file($_FILES["file"]["tmp_name"]) . uniqid() . "." . $extension;
$fileName = pathinfo($newFilePath, PATHINFO_FILENAME) . "." . $extension;

if(move_uploaded_file($_FILES["file"]["tmp_name"], $newFilePath)) {
    echo("ok ");
    echo("/res/posts/postdata/" . $fileName);
} else {
    echo("no");
}

?>
