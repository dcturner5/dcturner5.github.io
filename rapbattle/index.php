<?php
require_once('connect.php');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
    <script src="js/ServerSocket.js"></script>
    <link rel="stylesheet" href="css/style.css?">
</head>
<body>
<div class="header">
    <a href="">Home</a>
    <a href="profile/index.php">Profile</a>
    <a href="search/index.php">Battle</a>
    <a href="login/index.php">Login</a>
</div>
<div class="content">
    <h3>Live Battles</h3>
    <div id="battle-list">
    </div>
</div>
<script>
    var socket = new ServerSocket("<?php echo $ip; ?>", <?php echo $port;?>);
    socket.init(function() {
        socket.connect();
        socket.receive('init', function () {
            var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            socket.send('init_client', {token: token, login: false});
        });
        socket.receive('kick_client', function () {

        });
        socket.receive('redirect_client', function (data) {
            location.href = data.url;
        });
        socket.receive('init_client', function () {
            socket.send('list_battle');
            setInterval(function() {socket.send('list_battle')}, 5000);
        });
        socket.receive('list_battle', function(data) {
            document.getElementById("battle-list").innerHTML = "";
            for(var i = 0; i < data.battles.length; i++) {
                var battle = data.battles[i];
                document.getElementById("battle-list").innerHTML +=
                    "<a class='list' href=view/index.php?t=" + battle.token + ">" +
                        "<span>" +
                            /*"<span class='rank'>" + (i + 1) + ". </span>" +*/
                                battle.host.toUpperCase() + " VS " + battle.opponent.toUpperCase() +
                        "</span>" +
                    "</a><br>";
            }
        });
    });
</script>
</body>
</html>

