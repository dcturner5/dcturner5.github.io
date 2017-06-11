<?php
require('../connect.php');
function register($conn) {
    $username = preg_replace('/[^a-zA-Z0-9]+/', '', $_POST['username']);
    $password = $_POST['password'];
    $continue = true;
    $form = '<form class="account" action="" method="post" style="text-align: center; display: inline-block">';
    if(!isset($username) || trim($username) == '') {
        $form .= '<input class="required" name="username" maxlength="16" placeholder="Username"/><br>';
        $continue = false;
    }
    else {
        $form .= '<input name="username" maxlength="16" placeholder="Username" value="'.$username.'"/><br>';
    }
    if(!isset($password) || trim($password) == '') {
        $form .= '<input class="required" type="password" name="password" maxlength="128" placeholder="Password"/><br>';
        $continue = false;
    }
    else {
        $form .= '<input type="password" name="password" maxlength="128" placeholder="Password" value=""/><br>';
    }
    $form .= '<input class="submit" type="submit" name="submit" value="Register" style="width: 100%"/>
                </form>';
    if($continue) {
        $token = generateToken();
        $sql = 'INSERT INTO users (username, password, token) VALUES (?, SHA(?), ?)';
        $stmt = $conn->prepare($sql);
        try {
            if ($stmt->execute(array($username, $password, $token))) {
                setcookie('token', $token, 0, "/");
                header('location:../index.php');
            }
        }
        catch (PDOException $e) {
            echo '<form class="account" action="" method="post" style="text-align: center; display: inline-block">
                    <span>Username Taken</span><br>
                    <input name="username" maxlength="16" placeholder="Username"/><br>
                    <input type="password" name="password" maxlength="128" placeholder="Password"/><br>
                    <input class="submit" type="submit" name="submit" value="Register" style="width: 100%"/>
                    </form>';
        }
    }
    else {
        echo $form;
    }
}
function generateToken() {
    $date = date(DATE_RFC2822);
    $rand = rand();
    return sha1($date.$rand);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link rel="stylesheet" href="../css/style.css?">
</head>
<body>
    <div class="header">
        <a href="../index.php">Home</a>
        <a href="../profile/index.php">Profile</a>
        <a href="../search/index.php">Battle</a>
        <a href="../login/index.php">Login</a>
    </div>
    <div class="content">
        <?php
        if(isset($_POST['submit'])) {
            register($dbh);
        }
        else {
            echo '<form class="account" action="" method="post" style="text-align: center; display: inline-block">
                    <input name="username" maxlength="16" placeholder="Username"/><br>
                    <input type="password" name="password" maxlength="40" placeholder="Password"/><br>
                    <input class="submit" type="submit" name="submit" value="Register" style="width: 100%;"/><br>
                    </form>';
        }
        ?>
    </div>
</body>
</html>