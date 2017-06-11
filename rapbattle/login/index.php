<?php
require('../connect.php');

function login($conn) {
    setcookie('token', "", 0, "/");
    $username = $_POST['username'];
    $password = $_POST['password'];
    $sql = 'SELECT * FROM users WHERE username = ? AND password = SHA(?)';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($username, $password))) {
        $accountExists = false;
        while ($row = $stmt->fetch()) {
            $accountExists = true;
            $token = generateToken();
            $sql = 'UPDATE users SET token = ? WHERE username = ?';
            $stmt1 = $conn->prepare($sql);
            if ($stmt1->execute(array($token, $username))) {
                setcookie('token', $token, 0, "/");
                header('location:../index.php');
            }
        }
        if (!$accountExists) {
            echo '<form class="account" action="" method="post" style="text-align: center; display: inline-block">
                    <span>Incorrect Password</span><br>
                    <input name="username" maxlength="16" placeholder="Username"/><br>
                    <input type="password" name="password" maxlength="40" placeholder="Password"/><br>
                    <input class="submit" type="submit" name="submit" value="Log In" style="width: 100%;"/><br>
                    </form>';
        }
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
    <title>Login</title>
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
            login($dbh);
        }
        else {
            echo '<form class="account" action="" method="post" style="text-align: center; display: inline-block">
                    <input name="username" maxlength="16" placeholder="Username"/><br>
                    <input type="password" name="password" maxlength="40" placeholder="Password"/><br>
                    <input class="submit" type="submit" name="submit" value="Log In" style="width: 100%;"/><br>
                    </form>';
        }
        ?>
        <br>
        <a href="../register/index.php">Register</a>
    </div>
</body>
</html>
