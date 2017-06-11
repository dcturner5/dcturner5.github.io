<?php
require_once('../connect.php');

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
    <title>Status</title>
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
    <a href="../">Home</a>
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
    <form class="account">
        <?php
            if($_GET['s'] == 'ban') {
                echo 'You have been banned by an admin...<br>Congrats!';
            }
            if($_GET['s'] == 'kick') {
                echo 'You have been kicked by an admin...<br>Come back later!';
            }
        ?>
    </form>
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
                if (elements[i].classList.contains('show')) elements[i].classList.remove('show');
            }
        }
    };
</script>
</body>
</html>
