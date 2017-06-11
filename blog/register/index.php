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
    <title>Register</title>
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
                <li><a href="../login/index.php">Login</a></li>
                <li class="active"><a href="">Register</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container">
    <div class="row">
        <div class="col-sm-4 col-sm-offset-4">
            <?php
            if(isset($_POST['register'])) {
                if(empty($_POST['firstname']) || empty($_POST['lastname']) || empty($_POST['email']) || empty($_POST['password'])) {
                    echo 'Registration Failed';
                }
                else {
                    $token = generateToken();
                    $database->query('INSERT INTO `blog-users` (firstname, lastname, email, password, token, url) VALUES (?, ?, ?, SHA(?), ?, SHA(?))');
                    try {
                        $database->execute([$_POST['firstname'], $_POST['lastname'], $_POST['email'], $_POST['password'], $token, $_POST['email']]);
                        echo 'Registration Successful';
                        setcookie('token', $token, 0, '/');
                    } catch (PDOException $e) {
                        echo 'Registration Failed';
                    }
                }
            }
            ?>
            <form method="post" action="">
                <label>First Name</label>
                <input type="text" name="firstname" style="width:100%;"><br><br>
                <label>Last Name</label>
                <input type="text" name="lastname" style="width:100%;"><br><br>
                <label>Email</label>
                <input type="text" name="email" style="width:100%;"><br><br>
                <label>Password</label>
                <input type="password" name="password" style="width:100%;"><br><br>
                <input type="submit" name="register" class="btn btn-primary" style="background-color:#000000;" value="Register">
            </form>
        </div>
    </div>
</div>
</body>
</html>