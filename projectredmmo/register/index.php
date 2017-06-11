<?php
require_once('../connect.php');

function generateToken() {
    $date = date(DATE_RFC2822);
    $rand = rand();
    return sha1($date.$rand);
}

function register($conn) {
    $username = preg_replace('/[^a-zA-Z0-9]+/', '', $_POST['username']);
    $password = sha1($_POST['password']);
    echo $username;
    $continue = true;
    $form = '<form class="account" action="" method="post">
                <span>Missing Required Fields.</span><br><br>';
    if(!isset($username) || trim($username) == '') {
        $form .='<input class="required" name="username" maxlength="16" placeholder="Username"/><br><br>';
        $continue = false;
    }
    else {
        $form .= '<input name="username" maxlength="16" placeholder="Username" value="'.$username.'"/><br><br>';
    }
    if(!isset($password) || trim($password) == '') {
        $form .= '<input class="required" type="password" name="password" maxlength="45" placeholder="Password"/><br><br>';
        $continue = false;
    }
    else {
        $form .= '<input type="password" name="password" maxlength="45" placeholder="Password" value="'.$password.'"/><br><br>';
    }
    $form .= '<input class="btn-black" type="submit" name="submit" value="Register"/>
              </form>';

    if($continue) {
        $token = generateToken();
        $sql = 'INSERT INTO `users` (username, password, token) VALUES (?, ?, ?)';
        $stmt = $conn->prepare($sql);
        try {
            if ($stmt->execute(array($username, $password, $token))) {
                setcookie('token', $token, 0, "/");
                $sql = 'INSERT INTO `orders` (users_id, status) (SELECT u.id, "new" FROM users u WHERE u.token = ?)';
                $stmt1 = $conn->prepare($sql);
                if ($stmt1->execute(array($token))) {
                    echo '<form class="account" action="" method="post">
                        <span>Registration Successful.</span><br><br>
                        <input name="username" maxlength="16" placeholder="Username"/><br><br>
                        <input type="password" name="password" maxlength="45" placeholder="Password"/><br><br>
                        <input class="btn-black" type="submit" name="submit" value="Register"/>
                      </form>';
                }
            }
        }
        catch (PDOException $e) {
            echo '<form class="account" action="" method="post">
                    <span>Username or Email Already Registered. Try Again.</span><br><br>
                    <input name="username" maxlength="16" placeholder="Username"/><br><br>
                    <input type="password" name="password" maxlength="45" placeholder="Password"/><br><br>
                    <input class="btn-black" type="submit" name="submit" value="Register"/>
                  </form>';
        }
    }
    else {
        echo $form;
    }
}

function getAccountName($conn) {
    $token = null;
    if (isset($_COOKIE['token'])) {
        $token = $_COOKIE['token'];
    }
    else {
        return;
    }
    $sql = 'SELECT username FROM `users` WHERE token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        while ($row = $stmt->fetch()) {
            $username = ucfirst($row['username']);
            echo '<a href="../profile/index.php">'.$username.'\'s Profile</a>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="theme-color" content="#c80000">
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body onscroll="toggleHeader()">
<div class="header">
    <img class="logo" src="../res/logo.png"/>
    <div class="dropdown-btn" onclick="toggleDropdown()">
        <div id="mainDropdown" class="dropdown-content">
            <a href="../index.php">Home</a>
            <?php
            getAccountName($dbh);
            ?>
            <a href="../factions/index.php">Factions</a>
            <a href="../login/index.php">Login</a>
            <a href="../shop/index.php">Shop</a>
            <a href="../cart/index.php">Cart</a>
        </div>
    </div>
</div>

<div class="min-header">
    <a href="../index.php">Home</a>
    <?php
    getAccountName($dbh);
    ?>
    <a href="../factions/index.php">Factions</a>
    <a href="../login/index.php">Login</a>
    <a href="../shop/index.php">Shop</a>
    <a href="../cart/index.php">Cart</a>
    <img class="top" src="../res/button/top.png" onclick="scrollToTop()"/>
</div>

<div class="content">
    <?php
        if(isset($_POST['submit'])) {
            register($dbh);
        }
        else {
            echo '<form class="account" action="" method="post">
                    <input name="username" maxlength="16" placeholder="Username"/><br><br>
                    <input type="password" name="password" maxlength="45" placeholder="Password"/><br><br>
                    <input class="btn-black" type="submit" name="submit" value="Register"/>
                  </form>';
        }
    ?>

</div>

<script>
    function scrollToTop() {
        window.scrollTo(0,0);
    }

    function toggleHeader() {
        var header = document.getElementsByClassName("header")[0];
        var minHeader = document.getElementsByClassName("min-header")[0];
        var scroll = window.scrollY;
        if(scroll > header.clientHeight) {
            header.style.display = "none";
            minHeader.style.display = "block";
        }
        else {
            header.style.display = "block";
            minHeader.style.display = "none";
        }
    }

    function toggleDropdown() {
        document.getElementById("mainDropdown").classList.toggle("show");
    }
    window.onclick = function(e) {
        if(!e.target.matches('.dropdown-btn')) {
            var elements = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains("show")) elements[i].classList.remove("show");
            }
        }
    };
</script>
</body>
</html>