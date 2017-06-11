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
    <title>Login</title>
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
                <li><a href="../create/index.php">Create</a></li>
                <li class="active"><a href="">Login</a></li>
                <li><a href="../register/index.php">Register</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">
    <div class="row">
        <div class="col-sm-4 col-sm-offset-4">
            <?php
            if(isset($_POST['login'])) {
                $database->query('SELECT * FROM `blog-users` WHERE email = ? AND password = SHA(?) LIMIT 1');
                $rows = $database->fetchAll([$_POST['email'], $_POST['password']]);
                if(count($rows) > 0) {
                    echo 'Login Successful';
                    $token = generateToken();
                    setcookie('token', $token, 0, '/');
                    $database->query('UPDATE `blog-users` SET token = ? WHERE email = ?');
                    $database->execute([$token, $_POST['email']]);
                }
                else {
                    echo 'Login Failed';
                }
            }
            ?>
            <form method="post" action="">
                <label>Email</label><br>
                <input type="text" name="email" style="width:100%;"><br><br>
                <label>Password</label><br>
                <input type="password" name="password" style="width:100%;"><br><br>
                <input type="submit" name="login" class="btn btn-primary" style="background-color:#000000;" value="Login">
            </form>
        </div>
    </div>
</div>
</body>
</html>
