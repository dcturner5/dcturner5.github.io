<?php
require_once('../connect.php');

function getToken() {
    if (isset($_COOKIE['token'])) {
        return $_COOKIE['token'];
    }
    else {
        header('location:../login/index.php');
    }
}

function retireOrder($conn) {
    $token = getToken();
    $sql = 'UPDATE `users` u LEFT JOIN `orders` o ON u.id = o.users_id AND o.status = "new" SET o.status = "old" WHERE u.token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {

    }
}

function createNewOrder($conn) {
    $token = getToken();
    $sql = 'INSERT INTO `orders` (users_id, status) (SELECT u.id, "new" FROM `users` u WHERE u.token = ?)';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {

    }
}

function addToInventory($conn) {
    $token = getToken();
    $sql = 'INSERT INTO `inventory` (users_id, products_id) (SELECT u.id, p.id FROM `users` u LEFT JOIN `orders` o ON u.id = o.users_id AND o.status = "new" LEFT JOIN `orders_products` op ON o.id = op.orders_id LEFT JOIN `products` p ON op.products_id = p.id WHERE u.token = ?)';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {

    }
}

function updateBalance($conn, $amount) {
    $token = getToken();
    $sql = 'UPDATE `users` SET money = ? WHERE token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($amount, $token))) {
        echo '<form class="account"><span>Items added to your inventory<br><br>Balance: $'.$amount.'</span></form>';
    }
}

function checkout($conn) {
    $token = getToken();
    $sql = 'SELECT u.money, p.price FROM `users` u LEFT JOIN `orders` o ON u.id = o.users_id AND o.status = "new" LEFT JOIN `orders_products` op ON o.id = op.orders_id LEFT JOIN `products` p ON op.products_id = p.id WHERE u.token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        $cost = 0;
        $money = 0;
        while ($row = $stmt->fetch()) {
            $money = $row['money'];
            $cost += $row['price'];
        }
        if($cost <= $money) {
            addToInventory($conn);
            retireOrder($conn);
            createNewOrder($conn);
            $balance = $money - $cost;
            updateBalance($conn, $balance);
        }
        else {
            echo '<form class="account"><span>Not enough money...</span></form>';
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="theme-color" content="#c80000">
    <meta charset="UTF-8">
    <title>Checkout</title>
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
            checkout($dbh);
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
                if (elements[i].classList.contains('show')) elements[i].classList.remove('show');
            }
        }
    };
</script>
</body>
</html>