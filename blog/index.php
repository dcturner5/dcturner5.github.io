<?php
require 'classes/Database.php';
require 'classes/Post.php';

$database = new Database();

$database->query('SELECT * FROM `blog-posts`');
$rows = $database->fetchAll();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Blog</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>
<nav class="navbar navbar-inverse" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="">Blog</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="">Home</a></li>
                <li><a href="create/index.php">Create</a></li>
                <li><a href="login/index.php">Login</a></li>
                <li><a href="register/index.php">Register</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">
    <div class="row">
        <div class="col-sm-6 col-sm-offset-3">
        <?php
        foreach($rows as $row) {
            $post = new Post($row['id'], $row['title'], $row['body'], $row['date'], $row['url'], $row['users_id']);
            echo '<a style="font-size: 18pt; font-weight: bold;" href="view/index.php?url=' . $post->url . '">' . $post->title . '</a>';
            foreach($post->tags as $tag) {
                echo ' <span class="label label-danger">' . $tag->name . '</span>';
            }
            echo '<br>';
            echo substr($post->body, 0, 250);
            if(strlen($post->body) >= 249) echo '...';
            echo '<br><br>';
        }
        ?>
        </div>
    </div>
</div>
</body>
</html>
