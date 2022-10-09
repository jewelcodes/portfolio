<?php

/* epic portfolio website
   jewel, 2022 */

error_reporting(0);

// this returns "ok" if it worked and "no" if it didn't
// it expects POST data: postTitle and postBody

// first come up with an index for the new post

$f = file_get_contents("../res/posts/posts.json");

$postData = json_decode($f);
$newId = sizeof($postData->posts);

$postData->posts = array_pad($postData->posts, ($newId+1)*(-1), null);
$postData->posts[0]->id = $newId;
$postData->posts[0]->time = time();
$postData->posts[0]->title = $_POST["postTitle"];

$newData = json_encode($postData);

// write the actual post
file_put_contents("../res/posts/$newId.md", $_POST["postBody"], LOCK_EX);

file_put_contents("../res/posts/posts.json", $newData, LOCK_EX);
echo("ok");

?>