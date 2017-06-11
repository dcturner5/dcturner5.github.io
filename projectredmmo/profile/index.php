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

function getInventory($conn) {
    $empty = false;
    $token = getToken();
    $sql = 'SELECT p.name, p.price, p.image, p.id FROM `users` u LEFT JOIN `inventory` i ON u.id = i.users_id LEFT JOIN `products` p ON i.products_id = p.id WHERE u.token = ? ORDER BY p.name';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        while ($row = $stmt->fetch()) {
            if($row['id'] != null) {
                echo '<li class="product">
                         <div class="product-img product-cat">
                            <img class="product-img" src="../' . $row['image'] . '"/>
                         </div>
                         <div class="product-detail product-cat">
                             <span class="product-name">' . $row['name'] . '</span><br>
                         </div>
                         <div class="product-rate product-cat">
                               <form method="post" action="">
                                    <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                    <input class="select" type="submit" name="submit" value=" "/>
                                </form>
                         </div>
                     </li>';
            }
            else {
                echo '<li class="product">
                        <div class="product-detail product-cat">
                            <span>Your inventory is empty...</span>
                        </div>
                      </li><br>';
            }
        }
    }
    return !$empty;
}

function updateSprite($conn, $pid) {
    $token = getToken();
    $sql = 'UPDATE `users` u LEFT JOIN `inventory` i ON u.id = i.users_id LEFT JOIN `products` p ON i.products_id = p.id SET u.sprite = p.content WHERE u.token = ? AND i.products_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute(array($token, $pid));
}

function getRequests($conn) {
    $token = getToken();
    $sql = 'SELECT uu.id, uu.username, uu.sprite FROM `users` u LEFT JOIN `factions_users` fu ON u.id = fu.users_id AND fu.rank != "member" LEFT JOIN `factions_requests` fr ON fu.factions_id = fr.factions_id LEFT JOIN `users` uu ON fr.users_id = uu.id WHERE u.token = ?';
    $stmt = $conn->prepare($sql);
    if($stmt->execute(array($token))) {
        $requests = '<span class="red" style="font-size: 24pt">Requests</span>';
        while ($row = $stmt->fetch()) {
            if($row['id'] != null) {
                $username = $row['username'];
                $sprite = $row['sprite'];
                $requests .= '<div class="client-list">
                                    <img width="64" height="96" src="../res/character/' . substr($sprite, 0, -4) . 'pre.png">
                                    <div>
                                        <span>' . $username .  '</span>
                                        <form method="post" action="">
                                            <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                            <input class="btn-black" type="submit" name="accept" value="ACCEPT"/>
                                        </form>
                                    </div>
                                </div>';
            }
        }
        echo $requests;
    }
}

function getMembers($conn) {
    $token = getToken();
    $sql = 'SELECT uu.id, uu.username, uu.sprite, fu.users_id, fu.rank AS fu_rank, fuu.rank AS fuu_rank FROM `users` u LEFT JOIN `factions_users` fu ON u.id = fu.users_id LEFT JOIN `factions_users` fuu ON fu.factions_id = fuu.factions_id LEFT JOIN `users` uu ON fuu.users_id = uu.id WHERE u.token = ? ORDER BY fuu.rank';
    $stmt = $conn->prepare($sql);
    if($stmt->execute(array($token))) {
        $members = '<span class="red" style="font-size: 24pt">Members</span>';
        while ($row = $stmt->fetch()) {
            if($row['id'] != null) {
                $color = 'black';
                if($row['id'] == $row['users_id']) $color = 'red';
                $username = $row['username'];
                $sprite = $row['sprite'];
                $fu_rank = $row['fu_rank'];
                $fuu_rank = $row['fuu_rank'];
                $members .= '<div class="client-list">
                                <img width="64" height="96" src="../res/character/' . substr($sprite, 0, -4) . 'pre.png">
                                <div>
                                    <span class="' . $color . '">' . $username .  '</span>&nbsp;<span class="' . $color . '">(' . ucfirst($fuu_rank) . ')</span><br>';
                if($fu_rank == 'boss' && $fuu_rank == 'member') $members .= '<form style="display:inline;" method="post" action="">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="promote" value="PROMOTE"/>
                                                    </form>';
                if($fu_rank == 'boss' && $fuu_rank == 'capo') $members .= '<form style="display:inline;" method="post" action="">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="demote" value="DEMOTE"/>
                                                    </form>';
                if(($fu_rank == 'boss' && $fuu_rank != 'boss') || ($fu_rank == 'capo' && $fuu_rank == 'member')) $members .= '<form style="display:inline;" method="post" action="">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="kick" value="KICK"/>
                                                    </form>';
                $members .= '<br></div></div>';
            }
        }
        echo $members;
    }
}

function getRelations($conn) {
    $token = getToken();
    $sql = 'SELECT fr.id, f.name, f.image, fu.rank, fr.id, fr.relation FROM `users` u LEFT JOIN `factions_users` fu ON u.id = fu.users_id LEFT JOIN `factions_relations` fr ON fu.factions_id = fr.factions_id LEFT JOIN `factions` f ON fr.relations_id = f.id WHERE u.token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        $relations = '<span class="red" style="font-size: 24pt">Relations</span>';
        while ($row = $stmt->fetch()) {
            if($row['id'] != null) {
                $name = $row['name'];
                $image = $row['image'];
                $rank = $row['rank'];
                $relation = $row['relation'];
                $relations .= '<div class="client-list">
                                <img width="64" height="96" src="../' . $image . '">
                                <div>
                                    <span>' . $name . '</span>&nbsp;<span>(' . ucfirst($relation) . ')</span><br>';
                if ($rank == 'boss') $relations .= '<form method="post" action="" style="display: inline-block;">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="ally" value=" ALLY "/>
                                                    </form>
                                                    <form method="post" action="" style="display: inline-block;">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="neutral" value="NEUTRAL"/>
                                                    </form>
                                                    <form method="post" action="" style="display: inline-block;">
                                                        <input type="hidden" name="id" value="' . $row['id'] . '"/>
                                                        <input class="btn-black" type="submit" name="enemy" value="ENEMY "/>
                                                    </form>';
                $relations .= '</div></div>';
            }
        }
        echo $relations;
    }
}

function updateRelation($conn, $id, $relation) {
    $sql = 'UPDATE `factions_relations` SET relation = ? WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->execute(array($relation, $id));
}

function acceptRequest($conn, $id) {
    deleteRequest($conn, $id);
    kickMember($conn, $id);
    $token = getToken();
    $sql = 'INSERT INTO `factions_users` (factions_id, users_id) (SELECT fu.factions_id, ? FROM `users` u LEFT JOIN `factions_users` fu ON u.id = fu.users_id AND fu.rank != "member" WHERE u.token = ?)';
    $stmt = $conn->prepare($sql);
    $stmt->execute(array($id, $token));
}

function deleteRequest($conn, $id) {
    $sql = 'DELETE FROM `factions_requests` WHERE users_id = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($id))) {
    }
}

function kickMember($conn, $id) {
    $sql = 'DELETE FROM `factions_users` WHERE users_id = ? AND rank != "boss"';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($id))) {
    }
}

function promoteMember($conn, $id) {
    $sql = 'UPDATE `factions_users` SET rank = "capo" WHERE users_id = ? AND rank = "member"';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($id))) {
    }
}

function demoteMember($conn, $id) {
    $sql = 'UPDATE `factions_users` SET rank = "member" WHERE users_id = ? AND rank = "capo"';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($id))) {
    }
}

function getMemberCount($conn, $id) {
    $sql = 'SELECT * FROM `factions_users` WHERE factions_id = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($id))) {
        $count = 0;
        while ($row = $stmt->fetch()) {
            if($row['id'] != null) $count++;
        }
        return $count;
    }
}

function getAccountProfile($conn) {
    $token = getToken();
    $sql = 'SELECT username, sprite, money, rank FROM `users` WHERE token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        while ($row = $stmt->fetch()) {
            $username = $row['username'];
            $sprite = $row['sprite'];
            $money = $row['money'];
            $rank = ucfirst($row['rank']);
            echo '<div class="client-list">
                        <img width="64" height="96" src="../res/character/' . substr($sprite, 0, -4) . 'pre.png">
                        <div>
                            <span>Username: ' . $username .  '</span>&nbsp;&nbsp;&nbsp;<span>Rank: ' . $rank . '</span><br>
                            <span>Balance: $' . $money .  '</span>
                        </div>
                    </div>';
        }
    }
}

function getAccountName($conn) {
    $token = getToken();
    $sql = 'SELECT username FROM `users` WHERE token = ?';
    $stmt = $conn->prepare($sql);
    if ($stmt->execute(array($token))) {
        while ($row = $stmt->fetch()) {
            $username = ucfirst($row['username']);
            echo '<a href="">'.$username.'\'s Profile</a>';
        }
    }
}
if(isset($_POST['accept'])) {
    $id = $_POST['id'];
    acceptRequest($dbh, $id);
}
if(isset($_POST['kick'])) {
    $id = $_POST['id'];
    kickMember($dbh, $id);
}
if(isset($_POST['promote'])) {
    $id = $_POST['id'];
    promoteMember($dbh, $id);
}
if(isset($_POST['demote'])) {
    $id = $_POST['id'];
    demoteMember($dbh, $id);
}
if(isset($_POST['ally'])) {
    $id = $_POST['id'];
    updateRelation($dbh, $id, 'ally');
}
if(isset($_POST['neutral'])) {
    $id = $_POST['id'];
    updateRelation($dbh, $id, 'neutral');
}
if(isset($_POST['enemy'])) {
    $id = $_POST['id'];
    updateRelation($dbh, $id, 'enemy');
}
if(isset($_POST['submit'])) {
    $pid = $_POST['id'];
    updateSprite($dbh, $pid);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="theme-color" content="#c80000">
    <meta charset="UTF-8">
    <title>Profile</title>
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
    <ul class="products">
        <div>
            <li class="product" style="font-weight: bold; margin-bottom: 0; background-color: #c80000;">
                <span style="font-size: 32pt;">Account</span>
            </li><br>
            <li class="product">
                <?php
                getAccountProfile($dbh);
                ?>
            </li>
        </div>
        <div>
            <li class="product" style="font-weight: bold; margin-bottom: 0; background-color: #c80000;">
                <span style="font-size: 32pt;">Faction</span>
            </li><br>
            <li class="product" style="height: 640px; overflow-y: scroll">
                <?php
                getMembers($dbh);
                ?>
            </li>
            <li class="product" style="height: 640px; overflow-y: scroll">
                <?php
                getRequests($dbh);
                ?>
            </li>
            <li id="relations" class="product" style="height: 640px; overflow-y: scroll">
                <?php
                getRelations($dbh);
                ?>
            </li>
        </div>
        <div>
            <li class="product" style="font-weight: bold; margin-bottom: 0; background-color: #c80000;">
                <span style="font-size: 32pt;">Inventory</span>
            </li><br>
            <?php
            getInventory($dbh);
            ?>
        </div>
    </ul>
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
