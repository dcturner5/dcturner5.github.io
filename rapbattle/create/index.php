<?php
require_once('../connect.php');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Creating...</title>
    <script src="../js/ServerSocket.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="header">
    <a href="../index.php">Home</a>
    <a href="../profile/index.php">Profile</a>
    <a href="../search/index.php">Battle</a>
    <a href="../login/index.php">Login</a>
</div>
<script>
    var socket = new ServerSocket("<?php echo $ip; ?>", <?php echo $port;?>);
    socket.init(function() {
        socket.connect();
        socket.receive('init', function() {
            var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            socket.send('init_client', {token: token, login: true});
        });
        socket.receive('kick_client', function() {
            location.href = "../index.php";
        });
        socket.receive('redirect_client', function(data) {
            location.href = data.url;
        });
        socket.receive('init_client', function() {
            var verseLength = 4;//prompt("Verse Length? Default is 4.");
            socket.send('create_battle', {verseLength: verseLength, battleLength: 0});
        });
    });
</script>
</body>
</html>