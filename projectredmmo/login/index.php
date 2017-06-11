<?php
require_once('../connect.php');

function login($conn) {
    setcookie('token', "", 0, "/");
    $username = $_POST['username'];
    $password = sha1($_POST['password']);
    $sql = 'SELECT * FROM `users` WHERE username = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($username))) {
        $accountExists = false;
        while ($row = $stmt->fetch()) {
            $accountExists = true;
            if($row['password'] == $password) {
                $token = generateToken();
                $sql = 'UPDATE `users` SET token = ? WHERE username = ?';
                $stmt1 = $conn->prepare($sql);
                if ($stmt1->execute(array($token, $username))) {
                    setcookie('token', $token, 0, "/");
                    echo '<form class="account" action="" method="post">
                            <span>Login Successful</span><br><br>
                            <input name="username" maxlength="20" placeholder="Username"/><br><br>
                            <input type="password" name="password" maxlength="20" placeholder="Password"/><br><br>
                            <input class="btn-black" type="submit" name="submit" value="Log In"/><br><br>
                            <a href="../register/index.php">Register</a>
                            </form>';
                }
            }
            else {
                echo '<form class="account" action="" method="post">
                            <span>Incorrect Username or Password</span><br><br>
                            <input name="username" maxlength="20" placeholder="Username"/><br><br>
                            <input type="password" name="password" maxlength="20" placeholder="Password"/><br><br>
                            <input class="btn-black" type="submit" name="submit" value="Log In"/><br><br>
                            <a href="../register/index.php">Register</a>
                            </form>';
            }
        }
        if(!$accountExists) {
            echo '<form class="account" action="" method="post">
                    <span>Incorrect Username or Password</span><br><br>
                    <input name="username" maxlength="20" placeholder="Username"/><br><br>
                    <input type="password" name="password" maxlength="20" placeholder="Password"/><br><br>
                    <input class="btn-black" type="submit" name="submit" value="Log In"/><br><br>
                    <a href="../register/index.php">Register</a>
                    </form>';
        }
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

function generateToken() {
    $date = date(DATE_RFC2822);
    $rand = rand();
    return sha1($date.$rand);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="theme-color" content="#c80000">
    <title>Login</title>
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
            login($dbh);
        }
        else {
            echo '<form class="account" action="" method="post">
                    <input name="username" maxlength="20" placeholder="Username"/><br><br>
                    <input type="password" name="password" maxlength="20" placeholder="Password"/><br><br>
                    <input class="btn-black" type="submit" name="submit" value="Log In"/><br><br>
                    <a href="../register/index.php">Register</a>
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