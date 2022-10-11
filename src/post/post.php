<?php

/* epic portfolio website
   jewel, 2022 */

error_reporting(0);

class post {
    public $id;
    public $time;
    public $title;
};

// this returns "ok" if it worked and "no" if it didn't
// it expects POST data: postTitle and postBody

if(!$_POST["postTitle"] || !$_POST["postBody"]) {
    echo("no");
    return;
}

// first come up with an index for the new post

$f = file_get_contents("../res/posts/posts.json");

$postData = json_decode($f);
$newId = sizeof($postData->posts);

$postData->posts = array_pad($postData->posts, ($newId+1)*(-1), null);
$newPost = new post();
$newPost->id = $newId;
$newPost->time = time();
$newPost->title = $_POST["postTitle"];
$postData->posts[0] = $newPost;

$newData = json_encode($postData);

// write the actual post
file_put_contents("../res/posts/$newId.md", $_POST["postBody"], LOCK_EX);

file_put_contents("../res/posts/posts.json", $newData, LOCK_EX);
echo("ok");

?>