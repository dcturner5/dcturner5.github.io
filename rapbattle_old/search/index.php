<?php
require_once('../connect.php');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Searching...</title>
    <script src="../js/ServerSocket.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="header">
    <a href="../index.php">Home</a>
    <a href="../profile/index.php">Profile</a>
    <a href="../create/index.php">Create</a>
    <a href="../search/index.php">Search</a>
    <a href="../login/index.php">Login</a>
</div>
<div class="wait">
    SEARCHING FOR OPPONENT
</div>
<script>
    var socket = new ServerSocket('http://'+location.host+'/', 8001);
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
            socket.send('search_battle');
            setTimeout(function() {socket.send('search_battle')}, 5000);
        });
    });
</script>
</body>
</html>