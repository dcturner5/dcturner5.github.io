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

function getUsername() {
    if(isset($_GET['u'])) {
        return $_GET['u'];
    }
    else {
        return null;
    }
}

function getProfile($conn) {
    $username = getUsername();
    if($username) {
        $sql = 'SELECT username, upvotes, downvotes FROM `users` WHERE username = ?';
        $stmt = $conn->prepare($sql);
        if ($stmt->execute(array($username))) {
            while ($row = $stmt->fetch()) {
                return $row;
            }
            $row['username'] = 'User Not Found';
            return $row;
        }
    }
    else {
        $token = getToken();
        $sql = 'SELECT username, upvotes, downvotes FROM `users` WHERE token = ?';
        $stmt = $conn->prepare($sql);
        if ($stmt->execute(array($token))) {
            while ($row = $stmt->fetch()) {
                return $row;
            }
        }
    }
};

$client = getProfile($dbh);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="header">
    <a href="../index.php">Home</a>
    <a href="../profile/index.php">Profile</a>
    <a href="../search/index.php">Battle</a>
    <a href="../login/index.php">Login</a>
</div>
<div class="content">
    <span style="color: #a4b2b1; font-size: 24pt;"><?php echo ucfirst($client['username']); ?></span><br>
    <?php
        if($client['username'] != 'User Not Found') {
            echo '<span style="color: #a4b2b1; font-size: 18pt;">Score: ' . ($client['upvotes'] - $client['downvotes']) . '</span>';
        }
    ?>
</div>
</body>
</html>
