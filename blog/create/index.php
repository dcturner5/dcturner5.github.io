<?php
require '../classes/Database.php';

$database = new Database();

function generateToken() {
    $date = date(DATE_RFC2822);
    $rand = rand();
    return sha1($date.$rand);
}

function getToken() {
    if (isset($_COOKIE['token'])) {
        return $_COOKIE['token'];
    }
    else {
        header('location: ../login/index.php');
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Create</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>
<nav class="navbar navbar-inverse" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="../index.php">Blog</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li><a href="../index.php">Home</a></li>
                <li class="active"><a href="">Create</a></li>
                <li><a href="../login/index.php">Login</a></li>
                <li><a href="../register/index.php">Register</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">
    <div class="row">
        <div class="col-sm-4 col-sm-offset-4">
            <?php
            if(isset($_POST['submit'])) {
                $database->query('SELECT id FROM `blog-users` WHERE token = ?');
                $id = $database->fetch([getToken()])['id'];
                if(empty($_POST['title']) || empty($_POST['body'])) {
                    echo 'Post Failed';
                }
                else {
                    $database->query('INSERT INTO `blog-posts` (users_id, title, body, url) VALUES (?, ?, ?, SHA(NOW()))');
                    $database->execute([$id, $_POST['title'], $_POST['body']]);
                    $users_id = $database->lastInsertId();
                    if(isset($_POST['tag'])) {
                        foreach ($_POST['tag'] as $value) {
                            $database->query('INSERT INTO `blog-posts_tags` (posts_id, tags_id) VALUES (?, ?)');
                            $database->execute([$users_id, $value]);
                        }
                    }
                    echo 'Post Added';
                }
            }
            ?>
            <form method="post" action="">
                <label>Post Title</label><br>
                <input type="text" name="title" style="width: 100%"><br><br>
                <label>Post Body</label><br>
                <textarea name="body" style="width: 100%; height: 100px"></textarea><br><br>
                <div>
                    <label>Post Tags</label><br>
                    <?php
                    $database->query('SELECT * FROM `blog-tags`');
                    $rows = $database->fetchAll();
                    echo '<div class="btn-group" data-toggle="buttons">';
                    foreach($rows as $row) {
                        echo '<label class="btn btn-danger"><input type="checkbox" name="tag[]" value="' . $row['id'] .'"> '. $row['name'] . '</label>&nbsp;';
                    }
                    echo '</div>';
                    ?>
                </div><br>
                <input type="submit" name="submit" class="btn btn-primary" style="background-color:#000000;" value="Submit"/>
            </form>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</body>
</html>
